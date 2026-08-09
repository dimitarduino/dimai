import axios, { type AxiosResponse } from "axios";

import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { tryEnqueueScheduledSocialPublish } from "@/lib/enqueue-scheduled-social";
import { generateSocialPublishMetadataFromScript } from "@/lib/generate-social-publish-metadata";
import { INTERNAL_AUTH_HEADER } from "@/lib/internal-auth";
import { resolveShortsBackgroundMusic } from "@/lib/shorts-background-music";
import { resolveCaptionStyle } from "@/lib/shorts-caption-styles";
import {
  buildSeriesScriptPrompt,
  SHORTS_SERIES_PART_COUNT,
  seriesPartTitle,
  type SeriesScheduleConfig,
} from "@/lib/shorts-series";
import type { VideoScript, VideoScriptItem } from "@/types/videos";

const INTERNAL_SECRET =
  process.env.INTERNAL_API_SECRET ?? "dev-internal-secret-do-not-use-in-prod";

/** Headers sent with every internal server-to-server API call. */
const internalHeaders = {
  [INTERNAL_AUTH_HEADER]: INTERNAL_SECRET,
};

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

function singleScriptPrompt(formData: Record<string, unknown>): string {
  return `Write a script to generate 60 seconds video on topic: "${String(formData.topic ?? "")}" along with AI image prompt in ${String(formData.style ?? "")} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, ${String(formData.comment ?? "")}. Give me JSON only. Each imagePrompt must be family-friendly and SFW (no violence, gore, nudity, or scary horror). Result should be in this style: [{imagePrompt: '', contentText: ''}]`;
}

export type GenerateShortVideoPartOptions = {
  jobId: string;
  formData: Record<string, unknown>;
  email: string;
  clerkUserId: string;
  /** 0-based; omit for single-video mode */
  partIndex?: number;
  totalParts?: number;
  seriesSchedule?: SeriesScheduleConfig;
  scheduledAtIso?: string;
  seriesGroupId?: string;
  onProgress?: (step: string, subPercent: number) => Promise<void>;
};

export async function generateShortVideoPart(
  options: GenerateShortVideoPartOptions,
): Promise<number> {
  const {
    jobId,
    formData,
    email,
    clerkUserId,
    partIndex,
    totalParts = 1,
    seriesSchedule,
    scheduledAtIso,
    seriesGroupId,
    onProgress,
  } = options;

  const report = async (step: string, subPercent: number) => {
    if (onProgress) await onProgress(step, subPercent);
  };

  const isSeries =
    typeof partIndex === "number" && totalParts > 1;
  const part = isSeries ? partIndex : 0;
  const idSuffix = isSeries ? `-part-${part}` : "";

  const prompt = isSeries
    ? buildSeriesScriptPrompt(formData, part, totalParts)
    : singleScriptPrompt(formData);

  const baseUrl = getBaseUrl();

  await report("generating_script", 5);

  const scriptRes: AxiosResponse<{ result: VideoScript }> = await axios.post(
    `${baseUrl}/api/get-video-script`,
    { prompt },
    { headers: internalHeaders },
  );

  console.log(scriptRes.data);
  const videoScript = scriptRes.data.result as VideoScript;

  await report("generating_audio", 25);

  let script = "";
  videoScript.forEach((item: VideoScriptItem) => {
    script += item.contentText + " ";
  });

  const audioRes: AxiosResponse<{ result: string }> = await axios.post(
    `${baseUrl}/api/generate-audio`,
    {
      id: `audio-${jobId}${idSuffix}`,
      text: script,
      gender: formData.gender,
      voice: formData.voice,
    },
    { headers: internalHeaders },
  );
  const audioFileUrl = audioRes.data.result as string;

  await report("generating_captions", 45);

  const captionRes = await axios.post(`${baseUrl}/api/generate-caption`, {
    audioUrl: audioFileUrl,
  }, { headers: internalHeaders });
  const captions = captionRes.data.result as string[];

  await report("generating_images", 60);

  const images: string[] = [];
  for (const item of videoScript) {
    const imageRes: AxiosResponse<{ result: string }> = await axios.post(
      `${baseUrl}/api/generate-image`,
      { prompt: item.imagePrompt },
      { headers: internalHeaders },
    );
    images.push(imageRes.data.result as string);
  }

  const captionStyle = resolveCaptionStyle(String(formData.caption ?? "YOUTUBER"));
  const finalCaptionStyle = {
    ...captionStyle,
    transition: String(formData.captionTransition ?? "Scale (Zoom)"),
  };

  const bgMusic = resolveShortsBackgroundMusic(
    String(formData.backgroundMusicId ?? "none"),
  );

  await report("saving", 85);

  const inserted = await db
    .insert(VideoData)
    .values({
      script: videoScript,
      audio: audioFileUrl,
      captionStyle: finalCaptionStyle,
      captions,
      images,
      createdBy: email,
      backgroundMusic: bgMusic.url || null,
      ...(isSeries && seriesGroupId
        ? {
            seriesGroupId,
            seriesPartIndex: part,
            seriesPartTotal: totalParts,
          }
        : {}),
    })
    .returning({ id: VideoData.id });

  const videoId = inserted[0]!.id;

  const topic = String(formData.topic ?? "Short");
  let socialSchedule: Record<string, unknown> | undefined =
    seriesSchedule && scheduledAtIso
      ? {
          postYouTube: seriesSchedule.postYouTube,
          postTiktok: seriesSchedule.postTiktok,
          scheduledAt: scheduledAtIso,
          title: seriesPartTitle(topic, part, totalParts),
          description: `Part ${part + 1} of ${totalParts} in the "${topic}" series.`,
        }
      : (formData.socialSchedule as Record<string, unknown> | undefined);

  if (socialSchedule && clerkUserId) {
    try {
      const meta = await generateSocialPublishMetadataFromScript(videoScript);
      socialSchedule = {
        ...socialSchedule,
        title: meta.title || String(socialSchedule.title ?? ""),
        description: meta.description || String(socialSchedule.description ?? ""),
        youtubeTags: meta.youtubeTags,
        youtubeCategoryId: meta.youtubeCategoryId,
      };
    } catch (e) {
      console.warn("[series] Social metadata generation failed:", e);
    }

    await tryEnqueueScheduledSocialPublish({
      formData: { ...formData, socialSchedule },
      videoId,
      sourceJobId: isSeries ? `${jobId}-part-${part}` : jobId,
      clerkUserId,
    });
  }

  return videoId;
}

export function isSeriesFormData(formData: Record<string, unknown>): boolean {
  return formData.formatMode === "series";
}

export function parseSeriesSchedule(
  formData: Record<string, unknown>,
): SeriesScheduleConfig | undefined {
  const raw = formData.seriesSchedule;
  if (!raw || typeof raw !== "object") return undefined;
  return raw as SeriesScheduleConfig;
}

export { SHORTS_SERIES_PART_COUNT };
