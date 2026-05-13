import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getAppBaseUrl } from "@/lib/app-base-url";
import { encodeOAuthState } from "@/lib/social-oauth-state";

export async function GET() {
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

  const redirectUri = `${getAppBaseUrl()}/api/oauth/tiktok/callback`;
  const state = encodeOAuthState({ clerkUserId: userId, provider: "tiktok" });
  const scope = ["user.info.basic", "video.upload"].join(",");

  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("scope", scope);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("disable_auto_auth", "1");

  return NextResponse.redirect(url.toString());
}
