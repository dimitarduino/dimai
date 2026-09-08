import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import {
  exportShortVideoById,
  renderShortVideoToMp4Url,
} from "@/lib/export-short-video-server";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    try {
      return JSON.stringify(error);
    } catch {
      return "Export failed";
    }
  }
  return "Export failed";
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const videoId =
      typeof body.videoId === "number"
        ? body.videoId
        : typeof body.videoId === "string" && body.videoId.trim()
          ? Number(body.videoId)
          : null;
    const email =
      typeof body.email === "string" && body.email.trim()
        ? body.email.trim()
        : null;
    const inputProps = body.inputProps;

    if (videoId != null && Number.isFinite(videoId)) {
      if (!email) {
        return NextResponse.json(
          { error: "Missing email for export ownership check" },
          { status: 400 },
        );
      }

      const rows = await db
        .select({ id: VideoData.id })
        .from(VideoData)
        .where(and(eq(VideoData.id, videoId), eq(VideoData.createdBy, email)))
        .limit(1);

      if (!rows[0]) {
        return NextResponse.json(
          { error: "Video not found or not owned by this account" },
          { status: 404 },
        );
      }

      const result = await exportShortVideoById(videoId);
      return NextResponse.json({ result });
    }

    if (!inputProps) {
      return NextResponse.json(
        { error: "Missing videoId or inputProps" },
        { status: 400 },
      );
    }

    const result = await renderShortVideoToMp4Url(inputProps);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("Export video error:", error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
