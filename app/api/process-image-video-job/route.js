import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { VideoGenerationJobs, VideoData, Users } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { ImageVideo } from 'configs/schema';

export async function POST(req) {
    try {
        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
        }

        // Process the job directly (fallback when Inngest isn't available)
        const job = await db
            .select()
            .from(VideoGenerationJobs)
            .where(eq(VideoGenerationJobs.jobId, jobId))
            .limit(1);

        if (!job || job.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const jobData = job[0];

        if (jobData.status !== 'pending' && jobData.status !== 'processing') {
            return NextResponse.json({ error: 'Job already processed' }, { status: 400 });
        }

        // Start processing
        await db
            .update(VideoGenerationJobs)
            .set({
                status: 'processing',
                progress: { step: 'generating_video', percentage: 10 },
                updatedAt: new Date().toISOString(),
            })
            .where(eq(VideoGenerationJobs.jobId, jobId));

        try {
            const formData = jobData.formData;



            // Step 1: Generate video script
            const prompt = `Write a script to generate 60 seconds video on topic: "${formData.topic}" along with AI image prompt in ${formData.style} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, ${formData.comment}. Give me JSON only and make it safe for NSFW check. Result should be in this style: [{imagePrompt: '', contentText: ''}]`;

            await db
                .update(VideoGenerationJobs)
                .set({
                    progress: { step: 'generating_video', percentage: 20 },
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(VideoGenerationJobs.jobId, jobId));

            const data = await axios.post(`${getBaseUrl()}/api/image-video`, {
                imageUrl: formData.imageUrl,
                resolution: formData.resolution,
                duration: formData.duration,
                prompt: formData.prompt,
                negative_prompt: formData.negative_prompt

            });
            const userEmail = jobData.formData?.email || jobData.userId;



            const user = await db
                .select()
                .from(Users)
                .where(eq(Users.email, userEmail))
                .limit(1);

            if (user[0]) {
                await db
                    .update(Users)
                    .set({
                        credits: user[0].credits - 12
                    })
                    .where(eq(Users.email, jobData.userId));
            }


            const result = await db.insert(ImageVideo).values({
                // id: serial("id").primaryKey(),
                image: formData.imageUrl,
                duration: formData.duration,
                mode: formData.resolution,
                video: data.data.result,
                prompt: formData.prompt,
                negative_prompt: formData.negative_prompt,
                createdBy: userEmail
            }).returning({ id: ImageVideo.id });
            const videoId = result[0].id;


            await db
                .update(VideoGenerationJobs)
                .set({
                    status: 'completed',
                    progress: { step: 'completed', percentage: 100 },
                    result: { videoId, videoUrl: data.result },
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(VideoGenerationJobs.jobId, jobId));



            return NextResponse.json({ success: true, result: data.result });
        } catch (error) {
            console.error('Error processing job:', error);

            // Update job status to failed
            await db
                .update(VideoGenerationJobs)
                .set({
                    status: 'failed',
                    error: error.message || 'Unknown error occurred',
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(VideoGenerationJobs.jobId, jobId));

            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in process-video-job:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getBaseUrl() {
    return process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
}

