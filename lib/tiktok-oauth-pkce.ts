import { createHash, randomBytes } from "node:crypto";

/** RFC 7636 unreserved characters (TikTok PKCE). */
const PKCE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

/** 43–128 chars; TikTok requires PKCE for Login Kit authorize. */
export function generateTikTokCodeVerifier(length = 64): string {
  const n = Math.min(128, Math.max(43, length));
  const bytes = randomBytes(n);
  let result = "";
  for (let i = 0; i < n; i++) {
    result += PKCE_CHARS[bytes[i]! % PKCE_CHARS.length];
  }
  return result;
}

/** TikTok uses hex(SHA256(verifier)), not base64url PKCE. */
export function tiktokCodeChallengeFromVerifier(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("hex");
}
