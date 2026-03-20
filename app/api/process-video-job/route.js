import { NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { VideoGenerationJobs, VideoData, Users } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';

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
        progress: { step: 'generating_script', percentage: 10 },
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
          progress: { step: 'generating_script', percentage: 20 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      const scriptRes = await axios.post(`${getBaseUrl()}/api/get-video-script`, { prompt });
      
      const videoScript = scriptRes.data.result;

      // Step 2: Generate audio
      await db
        .update(VideoGenerationJobs)
        .set({
          progress: { step: 'generating_audio', percentage: 40 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      let script = ``;
      const id = `audio-${jobId}`;
      videoScript.forEach(item => {
        script += item.contentText + " ";
      });

      const audioRes = await axios.post(`${getBaseUrl()}/api/generate-audio`, {
        id,
        text: script,
        gender: formData.gender,
        voice: formData.voice
      });
      const audioFileUrl = audioRes.data.result;

      // Step 3: Generate captions
      await db
        .update(VideoGenerationJobs)
        .set({
          progress: { step: 'generating_captions', percentage: 60 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      const captionRes = await axios.post(`${getBaseUrl()}/api/generate-caption`, {
        audioUrl: audioFileUrl
      });
      const captions = captionRes.data.result;

      // Step 4: Generate images
      await db
        .update(VideoGenerationJobs)
        .set({
          progress: { step: 'generating_images', percentage: 80 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      let images = [];
      for (const item of videoScript) {
        const imageRes = await axios.post(`${getBaseUrl()}/api/generate-image`, {
          prompt: item.imagePrompt + " - Make it safe for NSFW"
        });
        images.push(imageRes.data.result);
      }

      // Step 5: Save video data
      await db
        .update(VideoGenerationJobs)
        .set({
          progress: { step: 'saving', percentage: 90 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      // Get caption style
      const captionsData = [{
        name: "YOUTUBER",
        classesCaption: {
          color: '#eab308',
          cursor: 'pointer',
          fontWeight: 800,
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
        }
      }, {
        name: "Superme",
        classesCaption: {
          color: '#ffffff',
          cursor: 'pointer',
          fontWeight: 700,
          fontStyle: 'italic',
          filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
        }
      }, {
        name: "NEON",
        classesCaption: {
          color: '#22c55e',
          cursor: 'pointer',
          fontWeight: 800,
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
        }
      }, {
        name: "GLITCH",
        classesCaption: {
          color: '#ec4899', 
          cursor: 'pointer',
          fontWeight: 800,
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
        }
      }, {
        name: "FIRE",
        classesCaption: {
          color: '#ef4444',
          cursor: 'pointer',
          fontWeight: 800,
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
        }
      }];

      const captionStyle = captionsData.find(c => c.name == formData.caption)?.classesCaption || captionsData[0].classesCaption;

      // Get the user email from formData (we store it there)
      const userEmail = jobData.formData?.email || jobData.userId;
      
      const result = await db.insert(VideoData).values({
        script: videoScript,
        audio: audioFileUrl,
        captionStyle: captionStyle,
        captions: captions,
        images: images,
        createdBy: userEmail
      }).returning({ id: VideoData.id });

      const videoId = result[0].id;

      // Update user credits - use email to find user
      const user = await db
        .select()
        .from(Users)
        .where(eq(Users.email, userEmail))
        .limit(1);

        console.log(user);

      if (user[0]) {
        const updatedUSer = await db
          .update(Users)
          .set({
            credits: user[0].credits - 10
          })
          .where(eq(Users.email, userEmail));
      }

      // Update job status to completed
      await db
        .update(VideoGenerationJobs)
        .set({
          status: 'completed',
          progress: { step: 'completed', percentage: 100 },
          result: { videoId },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      return NextResponse.json({ success: true, videoId });
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

