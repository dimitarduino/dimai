import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/configs/db";
import { VideoGenerationJobs } from "@/configs/schema";
import { runVideoGenerationJob } from "@/lib/run-video-generation-job";

/** Allow full 5-part series in one request when not using Inngest. */
export const maxDuration = 300;

export async function POST(req: Request) {
  let jobId: string | undefined;
  try {
    const body = await req.json();
    jobId = body.jobId;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = await db
      .select()
      .from(VideoGenerationJobs)
      .where(eq(VideoGenerationJobs.jobId, jobId))
      .limit(1);

    if (!job[0]) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const jobData = job[0];

    if (jobData.status !== "pending" && jobData.status !== "processing") {
      return NextResponse.json({ error: "Job already processed" }, { status: 400 });
    }

    const result = await runVideoGenerationJob(jobId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing job:", error);

    if (jobId) {
      await db
        .update(VideoGenerationJobs)
        .set({
          status: "failed",
          error: message,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
