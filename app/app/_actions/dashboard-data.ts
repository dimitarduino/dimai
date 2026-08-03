"use server";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, asc, desc, eq, inArray, isNull, lt, sql } from "drizzle-orm";
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
import { finalizeYoutubeScheduledUploadInternal } from "@/lib/finalize-youtube-scheduled-upload";
import {
  groupVideosForLibrary,
  hydrateSeriesLibraryParts,
  libraryCursorFromItems,
  type ShortsLibraryItem,
} from "@/lib/shorts-library";
import { inngest } from "@/lib/inngest";
import type {
  SocialScheduleSavePayload,
  VideoSocialUploadStatus,
} from "@/lib/social-schedule-types";
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

/** Shorts grid: one card per video or per multi-part series. */
export async function listMyShortsLibrary(options?: {
  limit?: number;
  cursor?: number;
}): Promise<{ items: ShortsLibraryItem[]; nextCursor?: number }> {
  const email = await ownerEmailOrThrow();
  const limit = Math.min(Math.max(options?.limit ?? DEFAULT_PAGE, 1), MAX_PAGE);
  const overfetch = limit * 8 + 5;

  const conditions = [eq(VideoData.createdBy, email)];
  if (options?.cursor != null) {
    conditions.push(lt(VideoData.id, options.cursor));
  }

  const rows = await db
    .select()
    .from(VideoData)
    .where(and(...conditions))
    .orderBy(desc(VideoData.id))
    .limit(overfetch + 1);

  let grouped = groupVideosForLibrary(rows);
  grouped = await hydrateSeriesLibraryParts(grouped, async (seriesGroupIds) => {
    if (seriesGroupIds.length === 0) return [];
    return db
      .select()
      .from(VideoData)
      .where(
        and(
          eq(VideoData.createdBy, email),
          inArray(VideoData.seriesGroupId, seriesGroupIds),
        ),
      )
      .orderBy(asc(VideoData.seriesPartIndex));
  });
  const items = grouped.slice(0, limit);
  const hasMoreGrouped = grouped.length > limit;
  const hasMoreRows = rows.length > overfetch;
  const nextCursor =
    hasMoreGrouped || hasMoreRows ? libraryCursorFromItems(items) : undefined;

  return { items, nextCursor };
}

export async function getVideoSeriesParts(seriesGroupId: string) {
  const email = await ownerEmailOrThrow();

  const rows = await db
    .select()
    .from(VideoData)
    .where(
      and(
        eq(VideoData.createdBy, email),
        eq(VideoData.seriesGroupId, seriesGroupId),
      ),
    )
    .orderBy(asc(VideoData.seriesPartIndex));

  return rows;
}

export async function deleteMyShortVideo(
  videoId: number,
): Promise<{ ok: boolean; error?: string }> {
  const email = await ownerEmailOrThrow();
  const { userId } = await auth();

  const owned = await db
    .select({ id: VideoData.id })
    .from(VideoData)
    .where(and(eq(VideoData.id, videoId), eq(VideoData.createdBy, email)))
    .limit(1);

  if (!owned[0]) {
    return { ok: false, error: "Video not found." };
  }

  if (userId) {
    await db
      .delete(ScheduledSocialPosts)
      .where(
        and(
          eq(ScheduledSocialPosts.videoId, videoId),
          eq(ScheduledSocialPosts.clerkUserId, userId),
        ),
      );
  }

  await db
    .delete(VideoData)
    .where(and(eq(VideoData.id, videoId), eq(VideoData.createdBy, email)));

  return { ok: true };
}

export async function deleteMyShortSeries(
  seriesGroupId: string,
): Promise<{ ok: boolean; error?: string; deletedCount?: number }> {
  const email = await ownerEmailOrThrow();
  const { userId } = await auth();

  const parts = await db
    .select({ id: VideoData.id })
    .from(VideoData)
    .where(
      and(
        eq(VideoData.createdBy, email),
        eq(VideoData.seriesGroupId, seriesGroupId),
      ),
    );

  if (parts.length === 0) {
    return { ok: false, error: "Series not found." };
  }

  const videoIds = parts.map((p) => p.id);

  if (userId && videoIds.length > 0) {
    await db
      .delete(ScheduledSocialPosts)
      .where(
        and(
          eq(ScheduledSocialPosts.clerkUserId, userId),
          inArray(ScheduledSocialPosts.videoId, videoIds),
        ),
      );
  }

  await db
    .delete(VideoData)
    .where(
      and(
        eq(VideoData.createdBy, email),
        eq(VideoData.seriesGroupId, seriesGroupId),
      ),
    );

  return { ok: true, deletedCount: videoIds.length };
}

export type SeriesPartScheduleRow = {
  videoId: number;
  partIndex: number;
  partTotal: number;
  title: string;
  description: string | null;
  scheduledAt: string | null;
  postYoutube: boolean;
  postTiktok: boolean;
  status: string;
  youtubeVideoId: string | null;
  tiktokPublishId: string | null;
  lastError: string | null;
};

export async function getSeriesSocialScheduleOverview(
  seriesGroupId: string,
): Promise<SeriesPartScheduleRow[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const email = await ownerEmailOrThrow();
  const videos = await db
    .select()
    .from(VideoData)
    .where(
      and(
        eq(VideoData.createdBy, email),
        eq(VideoData.seriesGroupId, seriesGroupId),
      ),
    )
    .orderBy(asc(VideoData.seriesPartIndex));

  if (videos.length === 0) return [];

  const videoIds = videos.map((v) => v.id);
  const posts =
    videoIds.length > 0
      ? await db
          .select()
          .from(ScheduledSocialPosts)
          .where(
            and(
              eq(ScheduledSocialPosts.clerkUserId, userId),
              inArray(ScheduledSocialPosts.videoId, videoIds),
            ),
          )
      : [];

  const postByVideoId = new Map(posts.map((p) => [p.videoId, p]));

  return videos.map((v) => {
    const post = postByVideoId.get(v.id);
    const partIndex = v.seriesPartIndex ?? 0;
    const partTotal = v.seriesPartTotal ?? videos.length;
    let title = post?.title?.trim() || `Part ${partIndex + 1}`;
    if (!post?.title) {
      try {
        const s = v.script as unknown;
        if (Array.isArray(s) && s.length > 0) {
          const first = s[0] as { contentText?: string };
          if (typeof first?.contentText === "string" && first.contentText.trim()) {
            title = first.contentText.trim().slice(0, 80);
          }
        }
      } catch {
        /* ignore */
      }
    }

    return {
      videoId: v.id,
      partIndex,
      partTotal,
      title,
      description: post?.description?.trim() || null,
      scheduledAt: post?.scheduledAt ?? null,
      postYoutube: Boolean(post?.postYoutube),
      postTiktok: Boolean(post?.postTiktok),
      status: post?.status ?? "none",
      youtubeVideoId: post?.youtubeVideoId ?? null,
      tiktokPublishId: post?.tiktokPublishId ?? null,
      lastError: post?.lastError ?? null,
    };
  });
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
    .orderBy(desc(editedImages.id))
    .limit(200);
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

  // Atomic deduction: single UPDATE that checks balance in the WHERE clause.
  // Prevents race conditions where two concurrent requests both pass a balance check.
  const result = await db
    .update(Users)
    .set({ credits: sql`"credits" - ${kolkuMinus}` as unknown as number })
    .where(
      and(
        eq(Users.email, email),
        sql`"credits" >= ${kolkuMinus}` as unknown as ReturnType<typeof eq>,
      ),
    )
    .returning({ credits: Users.credits });

  if (!result[0]) {
    throw new Error("Insufficient credits");
  }

  return Number(result[0].credits);
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
  if (!video?.downloadUrl?.trim()) {
    return { ok: true, skipped: true };
  }

  return finalizeYoutubeScheduledUploadInternal(videoId, userId);
}

const PLAYER_DIALOG_SOURCE_PREFIX = "player-dialog-";

function playerDialogSourceJobId(videoId: number) {
  return `${PLAYER_DIALOG_SOURCE_PREFIX}${videoId}`;
}

const EMPTY_SOCIAL_STATUS: VideoSocialUploadStatus = {
  youtubeUploaded: false,
  tiktokUploaded: false,
  postYoutube: false,
  postTiktok: false,
  scheduledAt: null,
  status: null,
  title: null,
  description: null,
  youtubeTags: null,
  youtubeCategoryId: null,
  lastError: null,
};

function mapSocialUploadRow(
  row: {
    youtubeVideoId: string | null;
    tiktokPublishId: string | null;
    postYoutube: boolean;
    postTiktok: boolean;
    scheduledAt: string;
    status: string;
    title: string;
    description: string;
    youtubeTags: string | null;
    youtubeCategoryId: string | null;
    lastError: string | null;
  } | undefined,
): VideoSocialUploadStatus {
  if (!row) return { ...EMPTY_SOCIAL_STATUS };
  return {
    youtubeUploaded: Boolean(row.youtubeVideoId),
    tiktokUploaded: Boolean(row.tiktokPublishId),
    postYoutube: row.postYoutube,
    postTiktok: row.postTiktok,
    scheduledAt: row.scheduledAt,
    status: row.status,
    title: row.title || null,
    description: row.description || null,
    youtubeTags: row.youtubeTags ?? null,
    youtubeCategoryId: row.youtubeCategoryId ?? null,
    lastError: row.lastError ?? null,
  };
}

export async function getVideoSocialUploadStatus(
  videoId: number,
): Promise<VideoSocialUploadStatus> {
  const { userId } = await auth();
  if (!userId) return { ...EMPTY_SOCIAL_STATUS };

  const rows = await db
    .select({
      youtubeVideoId: ScheduledSocialPosts.youtubeVideoId,
      tiktokPublishId: ScheduledSocialPosts.tiktokPublishId,
      postYoutube: ScheduledSocialPosts.postYoutube,
      postTiktok: ScheduledSocialPosts.postTiktok,
      scheduledAt: ScheduledSocialPosts.scheduledAt,
      status: ScheduledSocialPosts.status,
      title: ScheduledSocialPosts.title,
      description: ScheduledSocialPosts.description,
      youtubeTags: ScheduledSocialPosts.youtubeTags,
      youtubeCategoryId: ScheduledSocialPosts.youtubeCategoryId,
      lastError: ScheduledSocialPosts.lastError,
    })
    .from(ScheduledSocialPosts)
    .where(
      and(
        eq(ScheduledSocialPosts.clerkUserId, userId),
        eq(ScheduledSocialPosts.videoId, videoId),
      ),
    )
    .orderBy(desc(ScheduledSocialPosts.updatedAt))
    .limit(1);

  return mapSocialUploadRow(rows[0]);
}

export async function getVideoSocialUploadStatuses(
  videoIds: number[],
): Promise<Record<number, VideoSocialUploadStatus>> {
  const { userId } = await auth();
  const out: Record<number, VideoSocialUploadStatus> = {};
  if (!userId || videoIds.length === 0) return out;

  const rows = await db
    .select({
      videoId: ScheduledSocialPosts.videoId,
      youtubeVideoId: ScheduledSocialPosts.youtubeVideoId,
      tiktokPublishId: ScheduledSocialPosts.tiktokPublishId,
      postYoutube: ScheduledSocialPosts.postYoutube,
      postTiktok: ScheduledSocialPosts.postTiktok,
      scheduledAt: ScheduledSocialPosts.scheduledAt,
      status: ScheduledSocialPosts.status,
      title: ScheduledSocialPosts.title,
      description: ScheduledSocialPosts.description,
      youtubeTags: ScheduledSocialPosts.youtubeTags,
      youtubeCategoryId: ScheduledSocialPosts.youtubeCategoryId,
      lastError: ScheduledSocialPosts.lastError,
    })
    .from(ScheduledSocialPosts)
    .where(
      and(
        eq(ScheduledSocialPosts.clerkUserId, userId),
        inArray(ScheduledSocialPosts.videoId, videoIds),
      ),
    )
    .orderBy(desc(ScheduledSocialPosts.updatedAt));

  for (const id of videoIds) {
    out[id] = { ...EMPTY_SOCIAL_STATUS };
  }
  const filled = new Set<number>();
  for (const row of rows) {
    if (filled.has(row.videoId)) continue;
    out[row.videoId] = mapSocialUploadRow(row);
    filled.add(row.videoId);
  }
  return out;
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

  const existingRows = await db
    .select()
    .from(ScheduledSocialPosts)
    .where(
      and(
        eq(ScheduledSocialPosts.clerkUserId, userId),
        eq(ScheduledSocialPosts.videoId, videoId),
      ),
    )
    .orderBy(desc(ScheduledSocialPosts.updatedAt))
    .limit(1);
  const existing = existingRows[0];
  const sourceJobId = existing?.sourceJobId ?? playerDialogSourceJobId(videoId);

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
