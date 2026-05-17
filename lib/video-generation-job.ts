import { eq } from "drizzle-orm";

import { db } from "@/configs/db";
import { VideoGenerationJobs } from "@/configs/schema";
import { inngest } from "./inngest";
import {
  claimVideoGenerationJob,
  finalizeVideoGenerationJob,
  loadVideoJobContext,
  runVideoGenerationPart,
} from "@/lib/run-video-generation-job";

export const generateVideoJob = inngest.createFunction(
  { id: "generate-video", retries: 1 },
  { event: "video/generate" },
  async ({ event, step }) => {
    const { jobId } = event.data as { jobId: string };

    try {
      const claimResult = await step.run("claim-job", async () => {
        const { claimed, job } = await claimVideoGenerationJob(jobId);
        if (!claimed && job.status === "completed") {
          return { alreadyDone: true as const, result: job.result };
        }
        return { alreadyDone: false as const, result: null };
      });

      if (claimResult.alreadyDone) {
        return claimResult.result;
      }

      const meta = await step.run("load-job-meta", async () => {
        const ctx = await loadVideoJobContext(jobId);
        return {
          startPart: ctx.startPart,
          totalParts: ctx.totalParts,
        };
      });

      for (let part = meta.startPart; part < meta.totalParts; part++) {
        await step.run(`generate-part-${part}`, async () => {
          return runVideoGenerationPart(jobId, part);
        });
      }

      const result = await step.run("finalize-job", async () => {
        return finalizeVideoGenerationJob(jobId);
      });

      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      await step.run("mark-job-failed", async () => {
        await db
          .update(VideoGenerationJobs)
          .set({
            status: "failed",
            error: message,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(VideoGenerationJobs.jobId, jobId));
      });
      throw error;
    }
  },
);
