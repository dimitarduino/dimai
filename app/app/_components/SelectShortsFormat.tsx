"use client";

import { Suspense } from "react";
import { Calendar, Film, Layers } from "lucide-react";

import ScheduleDateTimePicker from "@/app/app/_components/ScheduleDateTimePicker";
import ScheduleTimePicker from "@/app/app/_components/ScheduleTimePicker";
import SocialPlatformConnect from "@/app/app/_components/SocialPlatformConnect";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SeriesScheduleConfig, ShortsFormatMode } from "@/lib/shorts-series";
import { SHORTS_SERIES_PART_COUNT } from "@/lib/shorts-series";

type Props = {
  formatMode: ShortsFormatMode;
  onFormatModeChange: (mode: ShortsFormatMode) => void;
  seriesSchedule: SeriesScheduleConfig;
  onSeriesScheduleChange: (patch: Partial<SeriesScheduleConfig>) => void;
};

export default function SelectShortsFormat({
  formatMode,
  onFormatModeChange,
  seriesSchedule,
  onSeriesScheduleChange,
}: Props) {
  const seriesStartDate = seriesSchedule.startAt
    ? new Date(seriesSchedule.startAt)
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground">Video format</p>
        <p className="text-xs text-muted-foreground mt-1">
          Choose one short or a {SHORTS_SERIES_PART_COUNT}-part serial with automatic publish
          times.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onFormatModeChange("single")}
          className={cn(
            "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
            formatMode === "single"
              ? "border-primary bg-primary/5 ring-2 ring-primary/25"
              : "border-border hover:bg-muted/40",
          )}
        >
          <Film className="size-5 text-primary" />
          <span className="font-semibold text-sm">Single video</span>
          <span className="text-xs text-muted-foreground">
            One AI short, same as before (10 credits).
          </span>
        </button>
        <button
          type="button"
          onClick={() => onFormatModeChange("series")}
          className={cn(
            "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
            formatMode === "series"
              ? "border-primary bg-primary/5 ring-2 ring-primary/25"
              : "border-border hover:bg-muted/40",
          )}
        >
          <Layers className="size-5 text-primary" />
          <span className="font-semibold text-sm">
            {SHORTS_SERIES_PART_COUNT}-part series
          </span>
          <span className="text-xs text-muted-foreground">
            Five connected episodes, each scheduled on its own day ({SHORTS_SERIES_PART_COUNT * 10}{" "}
            credits).
          </span>
        </button>
      </div>

      {formatMode === "series" ? (
        <div className="space-y-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="size-4 text-primary" />
            Series publish schedule
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Part 1 publishes on the first date/time; each next part follows your interval (e.g.
            every day at 12:00).
          </p>

          <div className="space-y-2">
            <Label>First part — date & time</Label>
            <ScheduleDateTimePicker
              value={seriesStartDate}
              onChange={(d) => {
                if (!d) return;
                const hh = String(d.getHours()).padStart(2, "0");
                const mm = String(d.getMinutes()).padStart(2, "0");
                onSeriesScheduleChange({
                  startAt: d.toISOString(),
                  timeOfDay: `${hh}:${mm}`,
                });
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="series-interval">Repeat every</Label>
              <Select
                value={String(seriesSchedule.intervalDays)}
                onValueChange={(v) =>
                  onSeriesScheduleChange({ intervalDays: Number(v) })
                }
              >
                <SelectTrigger id="series-interval" className="w-full py-6 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every day</SelectItem>
                  <SelectItem value="2">Every 2 days</SelectItem>
                  <SelectItem value="3">Every 3 days</SelectItem>
                  <SelectItem value="7">Every week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="series-time">Same time each day</Label>
              <ScheduleTimePicker
                id="series-time"
                className="min-h-[52px] py-6"
                value={seriesSchedule.timeOfDay}
                onChange={(timeOfDay) =>
                  onSeriesScheduleChange({ timeOfDay })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="size-4 rounded border-input accent-primary"
                checked={seriesSchedule.postYouTube}
                onChange={(e) =>
                  onSeriesScheduleChange({ postYouTube: e.target.checked })
                }
              />
              Schedule YouTube for each part
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="size-4 rounded border-input accent-primary"
                checked={seriesSchedule.postTiktok}
                onChange={(e) =>
                  onSeriesScheduleChange({ postTiktok: e.target.checked })
                }
              />
              Schedule TikTok for each part
            </label>
          </div>
          {(seriesSchedule.postYouTube || seriesSchedule.postTiktok) ? (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium text-foreground">Connect accounts</p>
              <Suspense fallback={<p className="text-xs text-muted-foreground">Loading…</p>}>
                <SocialPlatformConnect
                  oauthReturnPath="/app/shorts/create"
                  showYoutube={seriesSchedule.postYouTube}
                  showTiktok={seriesSchedule.postTiktok}
                />
              </Suspense>
            </div>
          ) : null}
          <p className="text-[11px] text-muted-foreground">
            When generation finishes, each part is scheduled on the platforms you connected.
          </p>
        </div>
      ) : null}
    </div>
  );
}
