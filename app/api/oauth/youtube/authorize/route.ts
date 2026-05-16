import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getAppBaseUrl } from "@/lib/app-base-url";
import { encodeOAuthState } from "@/lib/social-oauth-state";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "YouTube OAuth is not configured (GOOGLE_OAUTH_CLIENT_ID)." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get("returnTo") ?? undefined;

  const redirectUri = `${getAppBaseUrl()}/api/oauth/youtube/callback`;
  const state = encodeOAuthState({
    clerkUserId: userId,
    provider: "youtube",
    returnPath: returnTo ?? undefined,
  });
  const scopes = [
    "openid",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
  ].join(" ");

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);

  return NextResponse.redirect(url.toString());
}
