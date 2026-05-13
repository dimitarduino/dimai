import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/configs/db";
import { SocialOAuthConnections } from "@/configs/schema";
import { getAppBaseUrl } from "@/lib/app-base-url";
import { decodeOAuthState } from "@/lib/social-oauth-state";

export async function GET(req: Request) {
  const base = getAppBaseUrl();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const err = searchParams.get("error");

  const redirectError = (message: string) =>
    NextResponse.redirect(
      `${base}/app/shorts/create?oauth=tiktok&error=${encodeURIComponent(message)}`,
    );
  const redirectOk = () =>
    NextResponse.redirect(`${base}/app/shorts/create?oauth=tiktok&ok=1`);

  if (err) {
    return redirectError(err);
  }
  if (!code || !state) {
    return redirectError("missing_code_or_state");
  }

  let clerkUserId: string;
  try {
    const p = decodeOAuthState(state);
    if (p.provider !== "tiktok") {
      return redirectError("wrong_provider");
    }
    clerkUserId = p.clerkUserId;
  } catch {
    return redirectError("bad_state");
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY ?? "";
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET ?? "";
  if (!clientKey || !clientSecret) {
    return redirectError("server_missing_tiktok_oauth");
  }

  const redirectUri = `${base}/api/oauth/tiktok/callback`;
  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const t = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    open_id?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenRes.ok || !t.access_token || !t.refresh_token || !t.open_id) {
    return redirectError(
      t.error_description || t.error || "token_exchange_failed",
    );
  }

  const now = new Date().toISOString();
  const expiresAt = t.expires_in
    ? new Date(Date.now() + t.expires_in * 1000).toISOString()
    : null;
  const accountLabel = `TikTok (${t.open_id.slice(0, 8)}…)`;

  const existing = await db
    .select({ id: SocialOAuthConnections.id })
    .from(SocialOAuthConnections)
    .where(
      and(
        eq(SocialOAuthConnections.clerkUserId, clerkUserId),
        eq(SocialOAuthConnections.provider, "tiktok"),
      ),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(SocialOAuthConnections)
      .set({
        accessToken: t.access_token,
        refreshToken: t.refresh_token,
        expiresAt,
        accountLabel,
        providerUserId: t.open_id,
        updatedAt: now,
      })
      .where(eq(SocialOAuthConnections.id, existing[0].id));
  } else {
    await db.insert(SocialOAuthConnections).values({
      clerkUserId,
      provider: "tiktok",
      accessToken: t.access_token,
      refreshToken: t.refresh_token,
      expiresAt,
      accountLabel,
      providerUserId: t.open_id,
      createdAt: now,
      updatedAt: now,
    });
  }

  return redirectOk();
}
