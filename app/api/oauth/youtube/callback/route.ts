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
      `${base}/app/shorts/create?oauth=youtube&error=${encodeURIComponent(message)}`,
    );
  const redirectOk = () =>
    NextResponse.redirect(`${base}/app/shorts/create?oauth=youtube&ok=1`);

  if (err) {
    return redirectError(err);
  }
  if (!code || !state) {
    return redirectError("missing_code_or_state");
  }

  let clerkUserId: string;
  try {
    const p = decodeOAuthState(state);
    if (p.provider !== "youtube") {
      return redirectError("wrong_provider");
    }
    clerkUserId = p.clerkUserId;
  } catch {
    return redirectError("bad_state");
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID ?? "";
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "";
  if (!clientId || !clientSecret) {
    return redirectError("server_missing_google_oauth");
  }

  const redirectUri = `${base}/api/oauth/youtube/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const t = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!tokenRes.ok || !t.access_token) {
    return redirectError(t.error_description || t.error || "token_exchange_failed");
  }

  let accountLabel = "YouTube";
  let providerUserId: string | null = null;
  try {
    const ch = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      { headers: { Authorization: `Bearer ${t.access_token}` } },
    );
    const chJson = (await ch.json()) as {
      items?: Array<{ id?: string; snippet?: { title?: string } }>;
    };
    const item = chJson.items?.[0];
    if (item?.snippet?.title) {
      accountLabel = item.snippet.title;
    }
    if (item?.id) {
      providerUserId = item.id;
    }
  } catch {
    /* keep defaults */
  }

  const now = new Date().toISOString();
  const expiresAt = t.expires_in
    ? new Date(Date.now() + t.expires_in * 1000).toISOString()
    : null;

  const existing = await db
    .select({ id: SocialOAuthConnections.id })
    .from(SocialOAuthConnections)
    .where(
      and(
        eq(SocialOAuthConnections.clerkUserId, clerkUserId),
        eq(SocialOAuthConnections.provider, "youtube"),
      ),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(SocialOAuthConnections)
      .set({
        accessToken: t.access_token,
        refreshToken: t.refresh_token ?? null,
        expiresAt,
        accountLabel,
        providerUserId,
        updatedAt: now,
      })
      .where(eq(SocialOAuthConnections.id, existing[0].id));
  } else {
    await db.insert(SocialOAuthConnections).values({
      clerkUserId,
      provider: "youtube",
      accessToken: t.access_token,
      refreshToken: t.refresh_token ?? null,
      expiresAt,
      accountLabel,
      providerUserId,
      createdAt: now,
      updatedAt: now,
    });
  }

  return redirectOk();
}
