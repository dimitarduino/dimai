import type { SeriesScheduleConfig } from "@/lib/shorts-series";

export function shouldRedirectToSeriesSchedule(
  seriesSchedule: SeriesScheduleConfig,
  connections: { youtube: boolean; tiktok: boolean },
): boolean {
  const wantsYt = seriesSchedule.postYouTube;
  const wantsTk = seriesSchedule.postTiktok;
  if (!wantsYt && !wantsTk) return false;
  return (wantsYt && connections.youtube) || (wantsTk && connections.tiktok);
}
