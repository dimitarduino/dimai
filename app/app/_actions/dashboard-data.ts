"use server";

import { isClerkAPIResponseError } from "@clerk/shared/error";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, inArray, isNull, lt } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/configs/db";
import {
  Users,
  VideoData,
  ImageVideo,
  VideoGenerationJobs,
  editedImages,
  upscaledImages,
  removedbgImages,
  expandedImages,
  EmojiGenerationImages,
  DubbingVideos,
  SwapFacesImages,
  ScheduledSocialPosts,
  SocialOAuthConnections,
} from "@/configs/schema";
import {
  generateSocialPublishMetadataFromScript,
  type SocialPublishMetadata,
} from "@/lib/generate-social-publish-metadata";
import { uploadYoutubeVideoFromUrl } from "@/lib/youtube-resumable-upload";
import { parseYoutubeTagsFromUserInput } from "@/lib/youtube-tags";
import { inngest } from "@/lib/inngest";
import type { SocialScheduleSavePayload } from "@/lib/social-schedule-types";
import {
  YOUTUBE_DEFAULT_CATEGORY_ID,
  YOUTUBE_UPLOAD_CATEGORIES,
} from "@/lib/youtube-upload-categories";

const DEFAULT_PAGE = 40;
const MAX_PAGE = 80;

/** `currentUser()` calls Clerk's backend `getUser`; that can throw `ClerkAPIResponseError` without a useful React overlay message. */
async function safeCurrentUser(): Promise<Awaited<ReturnType<typeof currentUser>>> {
  try {
    return await currentUser();
  } catch (e: unknown) {
    if (isClerkAPIResponseError(e)) {
      const apiDetail = e.errors
        .map((err) => err.longMessage ?? err.message)
        .filter(Boolean)
        .join("; ");
      const msg =
        apiDetail || e.message || `Clerk API error (HTTP ${String(e.status)})`;
      console.error(
        "[dashboard-data] currentUser failed:",
        msg,
        e.clerkTraceId ? `trace=${e.clerkTraceId}` : "",
      );
      return null;
    }
    throw e;
  }
}

async function ownerEmailOrThrow(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await safeCurrentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error(
      "Your session is active but the server could not load your Clerk profile. Try signing out and signing in again, or verify CLERK_SECRET_KEY matches your Clerk instance.",
    );
  }
  return email;
}

export async function ensureClerkUserRegistered(): Promise<void> {
  const user = await safeCurrentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return;

  const existing = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .limit(1);

  if (existing[0]) return;

  await db.insert(Users).values({
    ime: user.fullName || email,
    email,
    slika: user.imageUrl ?? undefined,
    credits: 20,
  });
}

export async function fetchMyUserDetail() {
  const user = await safeCurrentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  const res = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .limit(1);

  return res[0] ?? null;
}

export async function listMyVideoData(options?: {
  limit?: number;
  cursor?: number;
}) {
  const email = await ownerEmailOrThrow();
  const limit = Math.min(
    Math.max(options?.limit ?? DEFAULT_PAGE, 1),
    MAX_PAGE,
  );

  const conditions = [eq(VideoData.createdBy, email)];
  if (options?.cursor != null) {
    conditions.push(lt(VideoData.id, options.cursor));
  }

  const rows = await db
    .select()
    .from(VideoData)
    .where(and(...conditions))
    .orderBy(desc(VideoData.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1]!.id : undefined;

  return { items, nextCursor };
}

export async function insertShortVideoData(values: {
  script: unknown;
  audio: string;
  captionStyle: unknown;
  captions: unknown;
  images: unknown;
  backgroundMusic?: string | null;
}) {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(VideoData)
    .values({
      script: values.script,
      audio: values.audio,
      captionStyle: values.captionStyle,
      captions: values.captions,
      images: values.images as string[] | undefined,
      createdBy: email,
      backgroundMusic: values.backgroundMusic ?? undefined,
      downloadUrl: "",
    })
    .returning({ id: VideoData.id });

  return result[0]!;
}

export async function listMyImageVideos(options?: {
  limit?: number;
  cursor?: number;
}) {
  const email = await ownerEmailOrThrow();
  const limit = Math.min(
    Math.max(options?.limit ?? DEFAULT_PAGE, 1),
    MAX_PAGE,
  );

  const conditions = [eq(ImageVideo.createdBy, email)];
  if (options?.cursor != null) {
    conditions.push(lt(ImageVideo.id, options.cursor));
  }

  const rows = await db
    .select()
    .from(ImageVideo)
    .where(and(...conditions))
    .orderBy(desc(ImageVideo.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1]!.id : undefined;

  return { items, nextCursor };
}

export async function deleteMyImageVideo(id: number): Promise<void> {
  const email = await ownerEmailOrThrow();

  await db
    .delete(ImageVideo)
    .where(and(eq(ImageVideo.id, id), eq(ImageVideo.createdBy, email)));
}

export async function getMyImageVideoById(id: number) {
  const email = await ownerEmailOrThrow();

  const row = await db
    .select()
    .from(ImageVideo)
    .where(and(eq(ImageVideo.id, id), eq(ImageVideo.createdBy, email)))
    .limit(1);

  return row[0] ?? null;
}

export async function listMyEditedImages(options: {
  limit: number;
  offset: number;
}): Promise<InferSelectModel<typeof editedImages>[]> {
  const email = await ownerEmailOrThrow();
  const limit = Math.min(Math.max(options.limit, 1), MAX_PAGE);
  const offset = Math.max(options.offset, 0);

  return await db
    .select()
    .from(editedImages)
    .where(eq(editedImages.createdBy, email))
    .orderBy(desc(editedImages.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function listMyEditedImageSourcePairs() {
  const email = await ownerEmailOrThrow();

  return await db
    .select({
      image: editedImages.image,
      id: editedImages.id,
    })
    .from(editedImages)
    .where(eq(editedImages.createdBy, email))
    .orderBy(desc(editedImages.id));
}

export async function deleteMyEditedImage(id: number): Promise<void> {
  const email = await ownerEmailOrThrow();

  await db
    .delete(editedImages)
    .where(and(eq(editedImages.id, id), eq(editedImages.createdBy, email)));
}

export async function insertEditedImage(record: {
  image: string;
  prompt: string;
  finalImage: string;
  createdAt: string;
}) {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(editedImages)
    .values({
      ...record,
      createdBy: email,
    })
    .returning({ id: editedImages.id });

  return result[0]!;
}

export async function deductUserCredits(kolkuMinus: number): Promise<number> {
  const email = await ownerEmailOrThrow();

  if (!Number.isFinite(kolkuMinus) || kolkuMinus <= 0) {
    throw new Error("Invalid credit amount");
  }

  const existing = await db
    .select({ credits: Users.credits })
    .from(Users)
    .where(eq(Users.email, email))
    .limit(1);

  const current = Number(existing[0]?.credits ?? 0);
  if (current < kolkuMinus) {
    throw new Error("Insufficient credits");
  }

  const next = current - kolkuMinus;
  await db.update(Users).set({ credits: next }).where(eq(Users.email, email));

  return next;
}

export async function setVideoDownloadUrlForOwner(
  id: number,
  downloadUrl: string,
): Promise<void> {
  const email = await ownerEmailOrThrow();

  await db
    .update(VideoData)
    .set({ downloadUrl })
    .where(and(eq(VideoData.id, id), eq(VideoData.createdBy, email)));
}

export async function getVideoDataByIdForOwner(id: number) {
  const email = await ownerEmailOrThrow();

  const row = await db
    .select()
    .from(VideoData)
    .where(and(eq(VideoData.id, id), eq(VideoData.createdBy, email)))
    .limit(1);

  return row[0] ?? null;
}

export async function generateSocialPublishMetadataForVideo(
  videoId: number,
): Promise<
  | { ok: true; data: SocialPublishMetadata }
  | { ok: false; error?: string }
> {
  try {
    const video = await getVideoDataByIdForOwner(videoId);
    if (!video) {
      return { ok: false, error: "Video not found." };
    }
    const data = await generateSocialPublishMetadataFromScript(video.script);
    return { ok: true, data };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Could not generate metadata.";
    return { ok: false, error: message };
  }
}

/**
 * After MP4 export: if this video has a pending YouTube row, upload to YouTube as private with
 * `publishAt` (native YouTube scheduling). TikTok-only rows stay on Inngest until `scheduledAt`.
 */
export async function finalizeYoutubeScheduledUploadAfterExport(videoId: number): Promise<{
  ok: boolean;
  skipped?: boolean;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const video = await getVideoDataByIdForOwner(videoId);
  const downloadUrl = video?.downloadUrl?.trim();
  if (!downloadUrl) {
    return { ok: true, skipped: true };
  }

  const pending = await db
    .select()
    .from(ScheduledSocialPosts)
    .where(
      and(
        eq(ScheduledSocialPosts.videoId, videoId),
        eq(ScheduledSocialPosts.clerkUserId, userId),
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
      "YouTube needs the go-live time to be at least about 15 minutes after upload. Pick a later time when you generate.";
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
        eq(SocialOAuthConnections.clerkUserId, userId),
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

const PLAYER_DIALOG_SOURCE_PREFIX = "player-dialog-";

function playerDialogSourceJobId(videoId: number) {
  return `${PLAYER_DIALOG_SOURCE_PREFIX}${videoId}`;
}

export type VideoSocialUploadStatus = {
  youtubeUploaded: boolean;
  tiktokUploaded: boolean;
};

export async function getVideoSocialUploadStatus(
  videoId: number,
): Promise<VideoSocialUploadStatus> {
  const { userId } = await auth();
  if (!userId) {
    return { youtubeUploaded: false, tiktokUploaded: false };
  }

  const rows = await db
    .select({
      youtubeVideoId: ScheduledSocialPosts.youtubeVideoId,
      tiktokPublishId: ScheduledSocialPosts.tiktokPublishId,
    })
    .from(ScheduledSocialPosts)
    .where(
      and(
        eq(ScheduledSocialPosts.clerkUserId, userId),
        eq(ScheduledSocialPosts.sourceJobId, playerDialogSourceJobId(videoId)),
      ),
    )
    .orderBy(desc(ScheduledSocialPosts.updatedAt))
    .limit(1);

  const row = rows[0];
  return {
    youtubeUploaded: Boolean(row?.youtubeVideoId),
    tiktokUploaded: Boolean(row?.tiktokPublishId),
  };
}

export async function saveScheduledSocialUploadForVideo(
  videoId: number,
  payload: SocialScheduleSavePayload,
): Promise<{ ok: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const video = await getVideoDataByIdForOwner(videoId);
  if (!video) return { ok: false, error: "Video not found." };

  const postYt = payload.postYouTube;
  const postTk = payload.postTiktok;
  if (!postYt && !postTk) {
    return { ok: false, error: "Select at least one platform." };
  }

  const when = new Date(payload.scheduledAt);
  if (Number.isNaN(when.getTime()) || when.getTime() < Date.now() + 60_000) {
    return {
      ok: false,
      error: "Pick a date and time at least one minute from now.",
    };
  }

  const title = payload.title.trim().slice(0, 500) || "Short";
  const description = payload.description.trim().slice(0, 2000);
  const catRaw = String(
    payload.youtubeCategoryId ?? YOUTUBE_DEFAULT_CATEGORY_ID,
  ).trim();
  const youtubeCategoryId = YOUTUBE_UPLOAD_CATEGORIES.some((c) => c.id === catRaw)
    ? catRaw
    : YOUTUBE_DEFAULT_CATEGORY_ID;
  const youtubeTags = String(payload.youtubeTags ?? "").slice(0, 2000);

  const sourceJobId = playerDialogSourceJobId(videoId);

  const existingRows = await db
    .select()
    .from(ScheduledSocialPosts)
    .where(
      and(
        eq(ScheduledSocialPosts.clerkUserId, userId),
        eq(ScheduledSocialPosts.sourceJobId, sourceJobId),
      ),
    )
    .limit(1);
  const existing = existingRows[0];

  if (postYt && existing?.youtubeVideoId) {
    return { ok: false, error: "Video is already uploaded to YouTube." };
  }
  if (postTk && existing?.tiktokPublishId) {
    return { ok: false, error: "Video is already uploaded to TikTok." };
  }

  const now = new Date().toISOString();
  const youtubeDone = Boolean(existing?.youtubeVideoId);
  const tiktokDone = Boolean(existing?.tiktokPublishId);
  const status =
    (!postYt || youtubeDone) && (!postTk || tiktokDone) ? "completed" : "scheduled";

  let id: number | undefined;

  if (existing) {
    const updated = await db
      .update(ScheduledSocialPosts)
      .set({
        postYoutube: postYt,
        postTiktok: postTk,
        scheduledAt: when.toISOString(),
        title,
        description,
        youtubeCategoryId,
        youtubeTags,
        status,
        updatedAt: now,
      })
      .where(eq(ScheduledSocialPosts.id, existing.id))
      .returning({ id: ScheduledSocialPosts.id });
    id = updated[0]?.id;
  } else {
    const inserted = await db
      .insert(ScheduledSocialPosts)
      .values({
        clerkUserId: userId,
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
    id = inserted[0]?.id;
  }

  if (id == null) {
    return { ok: false, error: "Could not save schedule." };
  }

  if (postTk && !tiktokDone) {
    try {
      await inngest.send({
        name: "social/scheduled.publish",
        data: { scheduledPostId: id },
      });
    } catch (e) {
      console.warn("[saveScheduledSocialUploadForVideo] Inngest send failed:", e);
    }
  }

  return { ok: true };
}

export async function getBatchVideoJobStatuses(jobIds: string[]) {
  const { userId } = await auth();
  if (!userId) return [];

  const unique = [...new Set(jobIds)].filter(Boolean);
  if (unique.length === 0) return [];

  return await db
    .select()
    .from(VideoGenerationJobs)
    .where(
      and(
        eq(VideoGenerationJobs.userId, userId),
        inArray(VideoGenerationJobs.jobId, unique),
      ),
    );
}

export async function insertUpscaledImage(params: {
  image: string;
  finalImage: string;
  createdAt: string;
}): Promise<{ id: number }> {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(upscaledImages)
    .values({ ...params, createdBy: email })
    .returning({ id: upscaledImages.id });

  return result[0]!;
}

export async function insertRemovedbgImage(params: {
  image: string;
  finalImage: string;
  createdAt: string;
}): Promise<{ id: number }> {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(removedbgImages)
    .values({ ...params, createdBy: email })
    .returning({ id: removedbgImages.id });

  return result[0]!;
}

export async function insertExpandedImage(params: {
  image: string;
  finalImage: string;
  aspectRatio: string;
  createdAt: string;
}): Promise<{ id: number }> {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(expandedImages)
    .values({ ...params, createdBy: email })
    .returning({ id: expandedImages.id });

  return result[0]!;
}

export async function insertEmojiGenerationImage(params: {
  image: string;
  prompt: string;
  style: string;
  finalImage: string;
  createdAt: string;
}): Promise<{ id: number }> {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(EmojiGenerationImages)
    .values({ ...params, createdBy: email })
    .returning({ id: EmojiGenerationImages.id });

  return result[0]!;
}

export async function insertDubbingVideo(params: {
  video: string;
  finalVideo: string;
  language: string;
  createdAt: string;
}): Promise<{ id: number }> {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(DubbingVideos)
    .values({ ...params, createdBy: email })
    .returning({ id: DubbingVideos.id });

  return result[0]!;
}

export async function insertSwapFaceImage(params: {
  input_image: string;
  swap_image: string;
  finalImage: string;
  createdAt: string;
}): Promise<{ id: number }> {
  const email = await ownerEmailOrThrow();

  const result = await db
    .insert(SwapFacesImages)
    .values({ ...params, createdBy: email })
    .returning({ id: SwapFacesImages.id });

  return result[0]!;
}
