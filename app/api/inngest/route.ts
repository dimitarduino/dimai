import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { scheduledSocialPublish } from '@/lib/scheduled-social-publish';
import { generateVideoJob } from '@/lib/video-generation-job';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateVideoJob,
    scheduledSocialPublish,
  ],
});
