import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";

import { db } from "@/configs/db";
import { Users, VideoGenerationJobs } from "@/configs/schema";
import { exportShortVideoById } from "@/lib/export-short-video-server";
import { finalizeYoutubeScheduledUploadInternal } from "@/lib/finalize-youtube-scheduled-upload";
import {
  generateShortVideoPart,
  isSeriesFormData,
  parseSeriesSchedule,
  SHORTS_SERIES_PART_COUNT,
} from "@/lib/generate-short-video-part";
import {
  computeSeriesPublishTimes,
  shortsCreditsRequired,
} from "@/lib/shorts-series";

export type VideoJobProgress = {
  step?: string;
  percentage?: number;
  part?: number;
  totalParts?: number;
  detail?: string;
  seriesGroupId?: string;
  videoIds?: number[];
  /** Parts finished (0..totalParts). */
  completedParts?: number;
};

export type VideoJobResult = {
  videoId?: number;
  videoIds?: number[];
  seriesGroupId?: string;
  formatMode?: "single" | "series";
};

function parseProgress(raw: unknown): VideoJobProgress {
  if (!raw || typeof raw !== "object") return {};
  return raw as VideoJobProgress;
}

async function updateJobProgress(
  jobId: string,
  progress: VideoJobProgress,
): Promise<void> {
  await db
    .update(VideoGenerationJobs)
    .set({
      progress,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(VideoGenerationJobs.jobId, jobId));
}

export async function claimVideoGenerationJob(jobId: string): Promise<{
  claimed: boolean;
  job: typeof VideoGenerationJobs.$inferSelect;
}> {
  const now = new Date().toISOString();
  const claimed = await db
    .update(VideoGenerationJobs)
    .set({
      status: "processing",
      updatedAt: now,
      progress: {
        step: "generating",
        percentage: 1,
      },
    })
    .where(
      and(
        eq(VideoGenerationJobs.jobId, jobId),
        eq(VideoGenerationJobs.status, "pending"),
      ),
    )
    .returning();

  if (claimed[0]) {
    return { claimed: true, job: claimed[0] };
  }

  const existing = await db
    .select()
    .from(VideoGenerationJobs)
    .where(eq(VideoGenerationJobs.jobId, jobId))
    .limit(1);

  const job = existing[0];
  if (!job) {
    throw new Error("Job not found");
  }
  return { claimed: false, job };
}

export async function loadVideoJobContext(jobId: string) {
  const rows = await db
    .select()
    .from(VideoGenerationJobs)
    .where(eq(VideoGenerationJobs.jobId, jobId))
    .limit(1);

  const jobData = rows[0];
  if (!jobData) {
    throw new Error("Job not found");
  }

  const formData = jobData.formData as Record<string, unknown>;
  const progress = parseProgress(jobData.progress);
  const series = isSeriesFormData(formData);
  const seriesSchedule = parseSeriesSchedule(formData);
  const publishTimes =
    series && seriesSchedule
      ? computeSeriesPublishTimes(seriesSchedule)
      : [];
  const totalParts = series ? SHORTS_SERIES_PART_COUNT : 1;
  const startPart = Math.min(
    Math.max(0, progress.completedParts ?? 0),
    totalParts,
  );

  let seriesGroupId = progress.seriesGroupId;
  if (series && !seriesGroupId) {
    seriesGroupId = randomUUID();
    await updateJobProgress(jobId, { ...progress, seriesGroupId });
  }

  return {
    jobData,
    formData,
    progress,
    email: String(formData.email ?? jobData.userId ?? ""),
    clerkUserId: String(formData.userId ?? jobData.userId ?? ""),
    series,
    seriesSchedule,
    publishTimes,
    totalParts,
    startPart,
    seriesGroupId,
    videoIds: [...(progress.videoIds ?? [])],
  };
}

/** Generate, export, and schedule one part (series or single). */
export async function runVideoGenerationPart(
  jobId: string,
  partIndex: number,
): Promise<{ videoId: number; videoIds: number[]; seriesGroupId?: string }> {
  const ctx = await loadVideoJobContext(jobId);
  const {
    formData,
    email,
    clerkUserId,
    series,
    seriesSchedule,
    publishTimes,
    totalParts,
    seriesGroupId,
  } = ctx;

  if (partIndex < 0 || partIndex >= totalParts) {
    throw new Error(`Invalid part index ${partIndex}`);
  }

  const pctBase = Math.floor((partIndex / totalParts) * 100);
  const pctSpan = Math.floor(100 / totalParts);
  const partStep = series ? `series_part_${partIndex + 1}` : "generating";

  await updateJobProgress(jobId, {
    ...ctx.progress,
    step: partStep,
    percentage: pctBase + Math.floor(pctSpan * 0.05),
    part: partIndex + 1,
    totalParts,
    seriesGroupId,
    completedParts: partIndex,
    videoIds: ctx.videoIds,
  });

  const videoId = await generateShortVideoPart({
    jobId,
    formData,
    email,
    clerkUserId,
    partIndex: series ? partIndex : undefined,
    totalParts: series ? SHORTS_SERIES_PART_COUNT : 1,
    seriesSchedule: series ? seriesSchedule : undefined,
    scheduledAtIso: publishTimes[partIndex],
    seriesGroupId,
    onProgress: async (subStep, subPct) => {
      const overall = pctBase + Math.floor((pctSpan * subPct) / 100);
      await updateJobProgress(jobId, {
        step: series ? `series_part_${partIndex + 1}` : subStep,
        percentage: Math.min(99, overall),
        part: series ? partIndex + 1 : undefined,
        totalParts: series ? totalParts : undefined,
        detail: subStep,
        seriesGroupId,
        completedParts: partIndex,
        videoIds: ctx.videoIds,
      });
    },
  });

  const videoIds = [...ctx.videoIds, videoId];

  const exportStep = series
    ? `series_part_${partIndex + 1}_exporting`
    : "exporting";

  await updateJobProgress(jobId, {
    step: exportStep,
    percentage: pctBase + Math.floor(pctSpan * 0.92),
    part: series ? partIndex + 1 : undefined,
    totalParts: series ? totalParts : undefined,
    seriesGroupId,
    completedParts: partIndex,
    videoIds,
  });

  await exportShortVideoById(videoId);

  if (clerkUserId) {
    await finalizeYoutubeScheduledUploadInternal(videoId, clerkUserId);
  }

  await updateJobProgress(jobId, {
    step: series ? `series_part_${partIndex + 1}_done` : "exporting",
    percentage: pctBase + pctSpan,
    part: series ? partIndex + 1 : undefined,
    totalParts: series ? totalParts : undefined,
    seriesGroupId,
    completedParts: partIndex + 1,
    videoIds,
  });

  return { videoId, videoIds, seriesGroupId };
}

export async function finalizeVideoGenerationJob(
  jobId: string,
): Promise<VideoJobResult> {
  const ctx = await loadVideoJobContext(jobId);
  const { formData, email, series, seriesGroupId } = ctx;
  const videoIds = ctx.videoIds;

  if (videoIds.length < ctx.totalParts) {
    throw new Error(
      `Series incomplete: ${videoIds.length}/${ctx.totalParts} parts generated`,
    );
  }

  const creditsCost = shortsCreditsRequired(series ? "series" : "single");

  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .limit(1);

  const u = user[0];
  if (u) {
    await db
      .update(Users)
      .set({
        credits: Math.max(0, (u.credits ?? 0) - creditsCost),
      })
      .where(eq(Users.email, email));
  }

  const result: VideoJobResult = series
    ? { videoIds, seriesGroupId, formatMode: "series" }
    : { videoId: videoIds[0] };

  await updateJobProgress(jobId, {
    step: "completed",
    percentage: 100,
    part: undefined,
    totalParts: undefined,
    seriesGroupId,
    completedParts: ctx.totalParts,
    videoIds,
  });

  await db
    .update(VideoGenerationJobs)
    .set({
      status: "completed",
      result,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(VideoGenerationJobs.jobId, jobId));

  return result;
}

/** Run all remaining parts in one invocation (local / single-request fallback). */
export async function runVideoGenerationJob(jobId: string): Promise<VideoJobResult> {
  const { claimed, job } = await claimVideoGenerationJob(jobId);

  if (!claimed) {
    if (job.status === "completed" && job.result) {
      return job.result as VideoJobResult;
    }
    if (job.status === "failed") {
      throw new Error(job.error ?? "Job failed");
    }
    if (job.status !== "processing") {
      throw new Error(`Cannot process job in status: ${job.status}`);
    }
    // Resume a stuck in-progress job (e.g. server restarted mid-series).
  }

  const ctx = await loadVideoJobContext(jobId);

  for (let part = ctx.startPart; part < ctx.totalParts; part++) {
    await runVideoGenerationPart(jobId, part);
  }

  return finalizeVideoGenerationJob(jobId);
}
