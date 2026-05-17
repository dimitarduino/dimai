/** Strip trailing slashes; never return empty. */
export function normalizeAppBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  return trimmed || "http://localhost:3000";
}

/**
 * Origin from the incoming request (reverse proxies, direct host).
 * Prefer this when env is missing or wrong on the server.
 */
export function requestOrigin(req: Request): string | null {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]!.trim();
    const proto = (forwardedProto?.split(",")[0] ?? "https").trim();
    return `${proto}://${host}`;
  }

  const host = req.headers.get("host");
  if (host) {
    try {
      const url = new URL(req.url);
      return `${url.protocol}//${host}`;
    } catch {
      return `https://${host}`;
    }
  }

  try {
    return new URL(req.url).origin;
  } catch {
    return null;
  }
}

/**
 * Public site URL for redirects and OAuth.
 * Order: NEXT_PUBLIC_APP_URL → request origin → VERCEL_URL → localhost.
 */
export function getAppBaseUrl(req?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) {
    return normalizeAppBaseUrl(fromEnv);
  }

  if (req) {
    const fromRequest = requestOrigin(req);
    if (fromRequest) {
      return normalizeAppBaseUrl(fromRequest);
    }
  }

  if (process.env.VERCEL_URL) {
    return normalizeAppBaseUrl(`https://${process.env.VERCEL_URL}`);
  }

  return "http://localhost:3000";
}

const TIKTOK_CALLBACK_PATH = "/api/oauth/tiktok/callback";

/**
 * Must match TikTok Developer Portal → Login Kit → Redirect URI exactly
 * (scheme, host, path; no trailing slash).
 */
export function getTikTokOAuthRedirectUri(req?: Request): string {
  const override = process.env.TIKTOK_OAUTH_REDIRECT_URI?.trim();
  if (override) {
    return override.replace(/\/+$/, "");
  }
  return `${getAppBaseUrl(req)}${TIKTOK_CALLBACK_PATH}`;
}

const YOUTUBE_CALLBACK_PATH = "/api/oauth/youtube/callback";

export function getYoutubeOAuthRedirectUri(req?: Request): string {
  const override = process.env.YOUTUBE_OAUTH_REDIRECT_URI?.trim();
  if (override) {
    return override.replace(/\/+$/, "");
  }
  return `${getAppBaseUrl(req)}${YOUTUBE_CALLBACK_PATH}`;
}
