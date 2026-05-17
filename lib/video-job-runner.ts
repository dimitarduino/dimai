/**
 * In local dev, Inngest events are often queued without a dev server running,
 * which leaves jobs stuck on "Starting…". Production can use Inngest steps.
 */
export function useInngestForVideoJobs(): boolean {
  if (process.env.VIDEO_JOB_USE_INNGEST === "true") return true;
  if (process.env.VIDEO_JOB_USE_INNGEST === "false") return false;

  const hasInngest = Boolean(process.env.INNGEST_EVENT_KEY);
  if (!hasInngest) return false;

  return process.env.VERCEL_ENV === "production";
}
