import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { inngest } from '@/lib/inngest';
import { db } from '@/configs/db';
import { VideoGenerationJobs } from '@/configs/schema';
import { useInngestForVideoJobs } from '@/lib/video-job-runner';
import { runVideoGenerationJob } from '@/lib/run-video-generation-job';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Helper function to process job directly when Inngest is not available
async function processJobDirectly(jobId: string) {
  try {
    await runVideoGenerationJob(jobId);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in processJobDirectly:', error);
    await db
      .update(VideoGenerationJobs)
      .set({
        status: 'failed',
        error: message,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(VideoGenerationJobs.jobId, jobId));
    throw error;
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { formData, userId: clientUserId, email } = await req.json();

    if (!formData || !clientUserId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create job ID
    const jobId = uuidv4();

    // Save job to database (include email in formData for processing)
    const job = await db.insert(VideoGenerationJobs).values({
      jobId,
      userId,
      status: 'pending',
      progress: { step: 'initializing', percentage: 0 },
      formData: {
        ...formData,
        email, // Include email in formData for processing
        userId, // Include userId for reference
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning({ jobId: VideoGenerationJobs.jobId });

    // Local dev: direct API processing. Production: Inngest (one step per series part).
    if (useInngestForVideoJobs()) {
      try {
        await inngest.send({
          name: "video/generate",
          data: { jobId, formData, userId, email },
        });
      } catch (inngestError) {
        console.warn("Inngest send failed, falling back to direct processing:", inngestError);
        processJobDirectly(jobId).catch((err) => {
          console.error("Error processing job directly:", err);
        });
      }
    } else {
      processJobDirectly(jobId).catch((err) => {
        console.error("Error processing job directly:", err);
      });
    }

    return NextResponse.json({ jobId });
  } catch (error) {
    console.error('Error starting video generation job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
