import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getTikTokOAuthRedirectUri } from "@/lib/app-base-url";
import { encodeOAuthState } from "@/lib/social-oauth-state";
import {
  generateTikTokCodeVerifier,
  tiktokCodeChallengeFromVerifier,
} from "@/lib/tiktok-oauth-pkce";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  if (!clientKey) {
    return NextResponse.json(
      { error: "TikTok OAuth is not configured (TIKTOK_CLIENT_KEY)." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const returnTo =
    searchParams.get("returnTo") ??
    searchParams.get("returnPath") ??
    undefined;

  const redirectUri = getTikTokOAuthRedirectUri(req);
  const codeVerifier = generateTikTokCodeVerifier();
  const codeChallenge = tiktokCodeChallengeFromVerifier(codeVerifier);
  const state = encodeOAuthState({
    clerkUserId: userId,
    provider: "tiktok",
    returnPath: returnTo ?? undefined,
    codeVerifier,
  });
  const scope = ["user.info.basic", "video.upload"].join(",");

  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("scope", scope);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("disable_auto_auth", "1");

  return NextResponse.redirect(url.toString());
}
