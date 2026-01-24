import { inngest } from './inngest';
import axios from 'axios';
import { db } from '@/configs/db';
import { VideoGenerationJobs, VideoData, Users } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export const generateVideoJob = inngest.createFunction(
  { id: 'generate-video', retries: 1 },
  { event: 'video/generate' },
  async ({ event, step }) => {
    const { jobId, formData, userId, email } = event.data;

    try {

    // Update job status to processing
    await step.run('update-status-processing', async () => {
      await db
        .update(VideoGenerationJobs)
        .set({
          status: 'processing',
          progress: { step: 'generating_script', percentage: 10 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));
    });

    // Step 1: Generate video script
    const videoScript = await step.run('generate-script', async () => {
      await db
        .update(VideoGenerationJobs)
        .set({
          progress: { step: 'generating_script', percentage: 20 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      const prompt = `Write a script to generate 60 seconds video on topic: "${formData.topic}" along with AI image prompt in ${formData.style} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, ${formData.comment}. Give me JSON only. Result should be in this style: [{imagePrompt: '', contentText: ''}]`;

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const res = await axios.post(`${baseUrl}/api/get-video-script`, {
        prompt
      });

      return res.data.result;
    });

    console.log(videoScript);

    // Step 2: Generate audio file
    const audioFileUrl = await step.run('generate-audio', async () => {
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

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const res = await axios.post(`${baseUrl}/api/generate-audio`, {
        id,
        text: script,
        gender: formData.gender,
        voice: formData.voice
      });

      return res.data.result;
    });

    // Step 3: Generate captions
    const captions = await step.run('generate-captions', async () => {
      await db
        .update(VideoGenerationJobs)
        .set({
          progress: { step: 'generating_captions', percentage: 60 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const res = await axios.post(`${baseUrl}/api/generate-caption`, {
        audioUrl: audioFileUrl
      });

      return res.data.result;
    });

    // Step 4: Generate images
    const images = await step.run('generate-images', async () => {
      await db
        .update(VideoGenerationJobs)
        .set({
          progress: { step: 'generating_images', percentage: 80 },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(VideoGenerationJobs.jobId, jobId));

      let imageList = [];

      for (const item of videoScript) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        const res = await axios.post(`${baseUrl}/api/generate-image`, {
          prompt: item.imagePrompt
        });
        imageList.push(res.data.result);
      }

      return imageList;
    });

    // Step 5: Save video data and update credits
    const videoId = await step.run('save-video-data', async () => {
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

      const result = await db.insert(VideoData).values({
        script: videoScript,
        audio: audioFileUrl,
        captionStyle: captionStyle,
        captions: captions,
        images: images,
        createdBy: email
      }).returning({ id: VideoData.id });

      // Update user credits - fetch current credits first
      const user = await step.run('fetch-user-credits', async () => {
        const userRes = await db
          .select()
          .from(Users)
          .where(eq(Users.email, email))
          .limit(1);
        return userRes[0];
      });

      await step.run('update-user-credits', async () => {
        await db
          .update(Users)
          .set({
            credits: user.credits - 10
          })
          .where(eq(Users.email, email));
      });

      return result[0].id;
    });

      // Update job status to completed
      await step.run('complete-job', async () => {
        await db
          .update(VideoGenerationJobs)
          .set({
            status: 'completed',
            progress: { step: 'completed', percentage: 100 },
            result: { videoId },
            updatedAt: new Date().toISOString(),
          })
          .where(eq(VideoGenerationJobs.jobId, jobId));
      });

      return { videoId };
    } catch (error) {
      // Update job status to failed on error
      await step.run('mark-job-failed', async () => {
        await db
          .update(VideoGenerationJobs)
          .set({
            status: 'failed',
            error: error.message || 'Unknown error occurred',
            updatedAt: new Date().toISOString(),
          })
          .where(eq(VideoGenerationJobs.jobId, jobId));
      });

      throw error;
    }
  }
);
