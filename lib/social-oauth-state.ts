import { createHmac, timingSafeEqual } from "node:crypto";

function oauthStateSecret(): string {
  const s =
    process.env.SOCIAL_OAUTH_STATE_SECRET ?? process.env.CLERK_SECRET_KEY ?? "";
  if (!s) {
    throw new Error(
      "Set SOCIAL_OAUTH_STATE_SECRET or CLERK_SECRET_KEY for OAuth state signing.",
    );
  }
  return s;
}

const ALLOWED_OAUTH_RETURN_PATHS = new Set(["/app/shorts", "/app/shorts/create"]);

const PUBLISH_PATH_RE = /^\/app\/shorts\/publish\/\d+$/;

function sanitizeReturnPath(input: string | undefined): string {
  if (!input) return "/app/shorts";
  if (ALLOWED_OAUTH_RETURN_PATHS.has(input)) return input;
  if (PUBLISH_PATH_RE.test(input)) return input;
  return "/app/shorts";
}

export function publishPagePath(videoId: number): string {
  return `/app/shorts/publish/${videoId}`;
}

export type SocialOAuthProvider = "youtube" | "tiktok";

export function encodeOAuthState(payload: {
  clerkUserId: string;
  provider: SocialOAuthProvider;
  /** Where to send the browser after OAuth (allowlisted). */
  returnPath?: string;
  /** TikTok PKCE code_verifier (stored in signed state for callback). */
  codeVerifier?: string;
}): string {
  const returnPath = sanitizeReturnPath(payload.returnPath);
  const body = JSON.stringify({
    clerkUserId: payload.clerkUserId,
    provider: payload.provider,
    returnPath,
    ...(payload.codeVerifier ? { codeVerifier: payload.codeVerifier } : {}),
    t: Date.now(),
  });
  const sig = createHmac("sha256", oauthStateSecret())
    .update(body)
    .digest("hex");
  return Buffer.from(`${body}|${sig}`, "utf8").toString("base64url");
}

export function decodeOAuthState(token: string): {
  clerkUserId: string;
  provider: SocialOAuthProvider;
  returnPath: string;
  codeVerifier?: string;
} {
  const raw = Buffer.from(token, "base64url").toString("utf8");
  const idx = raw.lastIndexOf("|");
  if (idx === -1) throw new Error("Invalid OAuth state");
  const body = raw.slice(0, idx);
  const sig = raw.slice(idx + 1);
  const expected = createHmac("sha256", oauthStateSecret())
    .update(body)
    .digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("Invalid OAuth state signature");
  }
  const p = JSON.parse(body) as {
    clerkUserId?: string;
    provider?: string;
    returnPath?: string;
    codeVerifier?: string;
    t?: number;
  };
  if (typeof p.clerkUserId !== "string") throw new Error("Invalid OAuth state payload");
  if (p.provider !== "youtube" && p.provider !== "tiktok") {
    throw new Error("Invalid OAuth provider");
  }
  if (typeof p.t !== "number" || Date.now() - p.t > 15 * 60 * 1000) {
    throw new Error("OAuth state expired");
  }
  const returnPath = sanitizeReturnPath(
    typeof p.returnPath === "string" ? p.returnPath : undefined,
  );
  return {
    clerkUserId: p.clerkUserId,
    provider: p.provider,
    returnPath,
    ...(typeof p.codeVerifier === "string" && p.codeVerifier.length >= 43
      ? { codeVerifier: p.codeVerifier }
      : {}),
  };
}
