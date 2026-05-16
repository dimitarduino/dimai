import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/configs/db";
import { ScheduledSocialPosts } from "@/configs/schema";
import { inngest } from "@/lib/inngest";
import {
  YOUTUBE_DEFAULT_CATEGORY_ID,
  YOUTUBE_UPLOAD_CATEGORIES,
} from "@/lib/youtube-upload-categories";

export type SocialScheduleFormPayload = {
  postYouTube?: boolean;
  postTiktok?: boolean;
  scheduledAt?: string;
  title?: string;
  description?: string;
  youtubeCategoryId?: string;
  /** Comma-separated; stored on the scheduled row for upload. */
  youtubeTags?: string;
};

export async function tryEnqueueScheduledSocialPublish(params: {
  formData: Record<string, unknown>;
  videoId: number;
  sourceJobId: string;
  clerkUserId: string;
}): Promise<void> {
  const { formData, videoId, sourceJobId, clerkUserId } = params;
  if (!clerkUserId) return;

  const schedule = formData.socialSchedule as SocialScheduleFormPayload | undefined;
  if (!schedule || typeof schedule !== "object") return;

  const postYt = Boolean(schedule.postYouTube);
  const postTk = Boolean(schedule.postTiktok);
  if (!postYt && !postTk) return;

  const scheduledAt = schedule.scheduledAt;
  if (!scheduledAt || typeof scheduledAt !== "string") return;

  const when = new Date(scheduledAt);
  if (Number.isNaN(when.getTime())) return;

  const minSchedule = new Date(Date.now() + 60_000);
  if (when.getTime() < minSchedule.getTime()) return;

  const dup = await db
    .select({ id: ScheduledSocialPosts.id })
    .from(ScheduledSocialPosts)
    .where(eq(ScheduledSocialPosts.sourceJobId, sourceJobId))
    .limit(1);
  if (dup[0]) return;

  const now = new Date().toISOString();
  const title = String(schedule.title || formData.topic || "Short").slice(0, 500);
  const description = String(schedule.description ?? "").slice(0, 2000);

  const catRaw = String(schedule.youtubeCategoryId ?? YOUTUBE_DEFAULT_CATEGORY_ID).trim();
  const youtubeCategoryId = YOUTUBE_UPLOAD_CATEGORIES.some((c) => c.id === catRaw)
    ? catRaw
    : YOUTUBE_DEFAULT_CATEGORY_ID;
  const youtubeTags = String(schedule.youtubeTags ?? "").slice(0, 2000);

  const inserted = await db
    .insert(ScheduledSocialPosts)
    .values({
      clerkUserId,
      videoId,
      sourceJobId,
      postYoutube: postYt,
      postTiktok: postTk,
      scheduledAt: when.toISOString(),
      title,
      description,
      youtubeCategoryId,
      youtubeTags,
      status: "scheduled",
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: ScheduledSocialPosts.id });

  const id = inserted[0]?.id;
  if (id == null) return;

  if (postTk) {
    try {
      await inngest.send({
        name: "social/scheduled.publish",
        data: { scheduledPostId: id },
      });
    } catch (e) {
      console.warn("[scheduled-social] Inngest send failed:", e);
    }
  }
}
