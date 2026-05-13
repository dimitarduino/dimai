import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/configs/db";
import { SocialOAuthConnections } from "@/configs/schema";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      provider: SocialOAuthConnections.provider,
      accountLabel: SocialOAuthConnections.accountLabel,
    })
    .from(SocialOAuthConnections)
    .where(eq(SocialOAuthConnections.clerkUserId, userId));

  const youtube = rows.find((r) => r.provider === "youtube");
  const tiktok = rows.find((r) => r.provider === "tiktok");

  return NextResponse.json({
    youtube: Boolean(youtube),
    tiktok: Boolean(tiktok),
    labels: {
      youtube: youtube?.accountLabel ?? null,
      tiktok: tiktok?.accountLabel ?? null,
    },
  });
}
