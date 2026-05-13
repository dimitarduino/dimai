import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/configs/db";
import { SocialOAuthConnections } from "@/configs/schema";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { provider?: string };
  try {
    body = (await req.json()) as { provider?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const provider = body.provider;
  if (provider !== "youtube" && provider !== "tiktok") {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  await db
    .delete(SocialOAuthConnections)
    .where(
      and(
        eq(SocialOAuthConnections.clerkUserId, userId),
        eq(SocialOAuthConnections.provider, provider),
      ),
    );

  return NextResponse.json({ ok: true });
}
