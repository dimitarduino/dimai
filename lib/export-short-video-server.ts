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

/** Remotion Lambda errors are plain objects; String(err) becomes "[object Object]". */
function formatRemotionRenderError(error: unknown): string {
  if (error == null) return "Unknown Remotion error";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    return error.message || error.name || "Unknown error";
  }
  if (typeof error === "object") {
    const e = error as {
      message?: unknown;
      name?: unknown;
      explanation?: unknown;
      type?: unknown;
      stack?: unknown;
      frame?: unknown;
      chunk?: unknown;
    };
    const parts: string[] = [];
    if (typeof e.name === "string" && e.name) parts.push(e.name);
    if (typeof e.type === "string" && e.type) parts.push(`(${e.type})`);
    if (typeof e.message === "string" && e.message) parts.push(e.message);
    if (typeof e.explanation === "string" && e.explanation) {
      parts.push(e.explanation);
    }
    if (e.frame != null) parts.push(`frame=${String(e.frame)}`);
    if (e.chunk != null) parts.push(`chunk=${String(e.chunk)}`);
    if (parts.length > 0) return parts.join(": ");
    try {
      return JSON.stringify(error);
    } catch {
      return "Unserializable Remotion error";
    }
  }
  return String(error);
}

export async function renderShortVideoToMp4Url(
  inputProps: ShortVideoExportInput,
): Promise<string> {
  const serveUrl = process.env.AWS_SERVE_URL ?? "";
  if (!serveUrl) {
    throw new Error("AWS_SERVE_URL is not configured");
  }

  if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY && process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = process.env.REMOTION_AWS_SECRET_ACCESS_KEY;
  }

  let functions = await getFunctions({
    region: "us-east-1",
    compatibleOnly: true,
  });

  if (!functions.length) {
    functions = await getFunctions({
      region: "us-east-1",
      compatibleOnly: false,
    });
  }

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
        progress.errors?.map(formatRemotionRenderError).filter(Boolean).join("; ") ||
        "Remotion render failed";
      console.error("Remotion render fatal error:", progress.errors);
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
