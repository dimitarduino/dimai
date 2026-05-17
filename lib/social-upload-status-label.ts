import type { VideoSocialUploadStatus } from "@/lib/social-schedule-types";

export function formatSocialScheduleTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export type SocialStatusBadge = {
  platform: "youtube" | "tiktok";
  label: string;
  tone: "success" | "pending" | "failed";
};

export function socialStatusBadges(
  status: VideoSocialUploadStatus,
): SocialStatusBadge[] {
  const badges: SocialStatusBadge[] = [];
  const when = formatSocialScheduleTime(status.scheduledAt);
  const whenSuffix = when ? ` · ${when}` : "";

  if (status.postYoutube) {
    if (status.youtubeUploaded) {
      badges.push({
        platform: "youtube",
        label: `Scheduled on YouTube${whenSuffix}`,
        tone: "success",
      });
    } else if (status.status === "failed") {
      badges.push({
        platform: "youtube",
        label: `YouTube failed${whenSuffix}`,
        tone: "failed",
      });
    } else {
      badges.push({
        platform: "youtube",
        label: `YouTube pending${whenSuffix}`,
        tone: "pending",
      });
    }
  }

  if (status.postTiktok) {
    if (status.tiktokUploaded) {
      badges.push({
        platform: "tiktok",
        label: `Queued on TikTok${whenSuffix}`,
        tone: "success",
      });
    } else if (status.status === "failed") {
      badges.push({
        platform: "tiktok",
        label: `TikTok failed${whenSuffix}`,
        tone: "failed",
      });
    } else {
      badges.push({
        platform: "tiktok",
        label: `TikTok scheduled${whenSuffix}`,
        tone: "pending",
      });
    }
  }

  return badges;
}

export function hasSocialSchedule(status: VideoSocialUploadStatus): boolean {
  return status.postYoutube || status.postTiktok;
}
