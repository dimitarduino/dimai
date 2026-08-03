import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from '@/configs/db';
import { VideoGenerationJobs } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const job = await db
      .select()
      .from(VideoGenerationJobs)
      .where(eq(VideoGenerationJobs.jobId, jobId))
      .limit(1);

    if (!job || job.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job[0]);
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json({ error: 'Failed to fetch job status' }, { status: 500 });
  }
}

