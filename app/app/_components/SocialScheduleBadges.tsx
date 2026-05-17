"use client";

import type { VideoSocialUploadStatus } from "@/lib/social-schedule-types";
import {
  socialStatusBadges,
  type SocialStatusBadge,
} from "@/lib/social-upload-status-label";
import { cn } from "@/lib/utils";

function Badge({ badge }: { badge: SocialStatusBadge }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight",
        badge.tone === "success" &&
          "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
        badge.tone === "pending" &&
          "bg-amber-500/15 text-amber-900 dark:text-amber-200",
        badge.tone === "failed" && "bg-destructive/15 text-destructive",
      )}
    >
      {badge.label}
    </span>
  );
}

type Props = {
  status: VideoSocialUploadStatus;
  className?: string;
};

export default function SocialScheduleBadges({ status, className }: Props) {
  const badges = socialStatusBadges(status);
  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {badges.map((badge) => (
        <Badge key={`${badge.platform}-${badge.label}`} badge={badge} />
      ))}
    </div>
  );
}
