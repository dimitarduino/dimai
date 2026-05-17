import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/configs/db";
import {
  ScheduledSocialPosts,
  SocialOAuthConnections,
  VideoData,
} from "@/configs/schema";
import { uploadYoutubeVideoFromUrl } from "@/lib/youtube-resumable-upload";
import { parseYoutubeTagsFromUserInput } from "@/lib/youtube-tags";

/** Background job: upload to YouTube after MP4 exists (no Clerk session). */
export async function finalizeYoutubeScheduledUploadInternal(
  videoId: number,
  clerkUserId: string,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!clerkUserId) {
    return { ok: true, skipped: true };
  }

  const videoRows = await db
    .select({ downloadUrl: VideoData.downloadUrl })
    .from(VideoData)
    .where(eq(VideoData.id, videoId))
    .limit(1);

  const downloadUrl = videoRows[0]?.downloadUrl?.trim();
  if (!downloadUrl) {
    return { ok: true, skipped: true };
  }

  const pending = await db
    .select()
    .from(ScheduledSocialPosts)
    .where(
      and(
        eq(ScheduledSocialPosts.videoId, videoId),
        eq(ScheduledSocialPosts.clerkUserId, clerkUserId),
        eq(ScheduledSocialPosts.postYoutube, true),
        eq(ScheduledSocialPosts.status, "scheduled"),
        isNull(ScheduledSocialPosts.youtubeVideoId),
      ),
    )
    .limit(1);

  const row = pending[0];
  if (!row) {
    return { ok: true, skipped: true };
  }

  const publishAt = new Date(row.scheduledAt);
  if (Number.isNaN(publishAt.getTime())) {
    const now = new Date().toISOString();
    await db
      .update(ScheduledSocialPosts)
      .set({
        status: "failed",
        lastError: "Invalid scheduled time.",
        updatedAt: now,
      })
      .where(eq(ScheduledSocialPosts.id, row.id));
    return { ok: false, error: "Invalid scheduled time." };
  }

  const minLeadMs = 15 * 60 * 1000;
  if (publishAt.getTime() < Date.now() + minLeadMs) {
    const msg =
      "YouTube needs the go-live time to be at least about 15 minutes after upload.";
    const now = new Date().toISOString();
    await db
      .update(ScheduledSocialPosts)
      .set({
        status: "failed",
        lastError: msg,
        updatedAt: now,
      })
      .where(eq(ScheduledSocialPosts.id, row.id));
    return { ok: false, error: msg };
  }

  const [conn] = await db
    .select()
    .from(SocialOAuthConnections)
    .where(
      and(
        eq(SocialOAuthConnections.clerkUserId, clerkUserId),
        eq(SocialOAuthConnections.provider, "youtube"),
      ),
    )
    .limit(1);

  if (!conn) {
    const now = new Date().toISOString();
    await db
      .update(ScheduledSocialPosts)
      .set({
        status: "failed",
        lastError: "YouTube is not connected.",
        updatedAt: now,
      })
      .where(eq(ScheduledSocialPosts.id, row.id));
    return { ok: false, error: "YouTube is not connected." };
  }

  try {
    const up = await uploadYoutubeVideoFromUrl({
      accessToken: conn.accessToken,
      refreshToken: conn.refreshToken,
      publishAt: publishAt.toISOString(),
      categoryId: row.youtubeCategoryId ?? "22",
      tags: parseYoutubeTagsFromUserInput(row.youtubeTags ?? ""),
      onAccessTokenRefresh: async (next) => {
        await db
          .update(SocialOAuthConnections)
          .set({
            accessToken: next.accessToken,
            expiresAt: next.expiresAtIso,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(SocialOAuthConnections.id, conn.id));
      },
      videoUrl: downloadUrl,
      title: row.title,
      description: row.description,
    });

    const now = new Date().toISOString();
    if (!row.postTiktok) {
      await db
        .update(ScheduledSocialPosts)
        .set({
          youtubeVideoId: up.youtubeVideoId,
          status: "completed",
          lastError: null,
          updatedAt: now,
        })
        .where(eq(ScheduledSocialPosts.id, row.id));
    } else {
      await db
        .update(ScheduledSocialPosts)
        .set({
          youtubeVideoId: up.youtubeVideoId,
          updatedAt: now,
        })
        .where(eq(ScheduledSocialPosts.id, row.id));
    }
    return { ok: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const now = new Date().toISOString();
    await db
      .update(ScheduledSocialPosts)
      .set({
        status: "failed",
        lastError: `YouTube: ${message}`.slice(0, 2000),
        updatedAt: now,
      })
      .where(eq(ScheduledSocialPosts.id, row.id));
    return { ok: false, error: message };
  }
}
