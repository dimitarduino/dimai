import "server-only";

import {
  getFunctions,
  getRenderProgress,
  renderMediaOnLambda,
} from "@remotion/lambda/client";
import { eq } from "drizzle-orm";

import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";

export type ShortVideoExportInput = {
  script: unknown;
  audio: string;
  captions: unknown;
  captionStyle: unknown;
  images: string[] | null;
  backgroundMusic?: string | null;
};

function durationInFramesFromCaptions(captions: unknown): number {
  const list = captions as { end?: number }[] | undefined;
  const captionsMs = list?.at(-1)?.end ?? 0;
  const bufferFrames = 10;
  return Math.round((captionsMs / 1000) * 30) + bufferFrames;
}

export async function renderShortVideoToMp4Url(
  inputProps: ShortVideoExportInput,
): Promise<string> {
  const serveUrl = process.env.AWS_SERVE_URL ?? "";
  if (!serveUrl) {
    throw new Error("AWS_SERVE_URL is not configured");
  }

  const functions = await getFunctions({
    region: "us-east-1",
    compatibleOnly: true,
  });
  const functionName = functions[0]?.functionName;
  if (!functionName) {
    throw new Error("No Remotion Lambda function available");
  }

  const durationInFrames = durationInFramesFromCaptions(inputProps.captions);

  const { renderId, bucketName } = await renderMediaOnLambda({
    region: "us-east-1",
    functionName,
    serveUrl,
    composition: "shortVideo",
    inputProps: {
      videoData: inputProps,
      durationInFrames,
    },
    codec: "h264",
    imageFormat: "jpeg",
    maxRetries: 1,
    framesPerLambda: 30,
    privacy: "public",
  });

  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName,
      region: "us-east-1",
    });
    if (progress.done && progress.outputFile) {
      return progress.outputFile;
    }
    if (progress.fatalErrorEncountered) {
      const errMsg =
        progress.errors?.map((e) => String(e)).join("; ") ||
        "Remotion render failed";
      throw new Error(errMsg);
    }
  }
}

export async function exportShortVideoById(videoId: number): Promise<string> {
  const rows = await db
    .select()
    .from(VideoData)
    .where(eq(VideoData.id, videoId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    throw new Error(`Video ${videoId} not found`);
  }

  const downloadUrl = await renderShortVideoToMp4Url({
    script: row.script,
    audio: row.audio,
    captions: row.captions,
    captionStyle: row.captionStyle,
    images: row.images,
    backgroundMusic: row.backgroundMusic,
  });

  await db
    .update(VideoData)
    .set({ downloadUrl })
    .where(eq(VideoData.id, videoId));

  return downloadUrl;
}
