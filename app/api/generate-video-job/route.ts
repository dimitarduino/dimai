import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest';
import { db } from '@/configs/db';
import { VideoGenerationJobs } from '@/configs/schema';
import { useInngestForVideoJobs } from '@/lib/video-job-runner';
import { v4 as uuidv4 } from 'uuid';

// Helper function to process job directly when Inngest is not available
async function processJobDirectly(jobId) {
  try {
    // Use absolute URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/process-video-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(response);
      throw new Error(`Failed to process job: ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    console.error('Error in processJobDirectly:', error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const { formData, userId, email } = await req.json();

    if (!formData || !userId || !email) {
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
