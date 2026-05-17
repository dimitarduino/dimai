"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
  Youtube,
} from "lucide-react";

import {
  getSeriesSocialScheduleOverview,
  type SeriesPartScheduleRow,
} from "@/app/app/_actions/dashboard-data";
import { Button } from "@/ui/button";
import { publishPagePath } from "@/lib/social-oauth-state";
import { cn } from "@/lib/utils";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

function formatScheduledAt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type PlatformState = "off" | "scheduled" | "pending" | "failed";

function youtubeState(row: SeriesPartScheduleRow): PlatformState {
  if (!row.postYoutube) return "off";
  if (row.youtubeVideoId) return "scheduled";
  if (row.status === "failed" && row.lastError?.toLowerCase().includes("youtube")) {
    return "failed";
  }
  if (row.postYoutube) return "pending";
  return "off";
}

function tiktokState(row: SeriesPartScheduleRow): PlatformState {
  if (!row.postTiktok) return "off";
  if (row.tiktokPublishId) return "scheduled";
  if (row.status === "failed" && row.lastError?.toLowerCase().includes("tiktok")) {
    return "failed";
  }
  if (row.status === "failed" && row.postTiktok && !row.tiktokPublishId) {
    return "failed";
  }
  if (row.postTiktok) return "pending";
  return "off";
}

function PlatformBadge({
  platform,
  state,
}: {
  platform: "youtube" | "tiktok";
  state: PlatformState;
}) {
  if (state === "off") return null;

  const label =
    state === "scheduled"
      ? platform === "youtube"
        ? "Scheduled on YouTube"
        : "Queued on TikTok"
      : state === "failed"
        ? platform === "youtube"
          ? "YouTube failed"
          : "TikTok failed"
        : platform === "youtube"
          ? "YouTube pending"
          : "TikTok queued";

  const Icon = platform === "youtube" ? Youtube : TikTokIcon;
  const iconClass =
    platform === "youtube" ? "size-3.5 text-red-500" : "size-3.5";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        state === "scheduled" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        state === "pending" && "bg-amber-500/15 text-amber-800 dark:text-amber-300",
        state === "failed" && "bg-destructive/15 text-destructive",
      )}
    >
      {state === "scheduled" ? (
        <CheckCircle2 className="size-3 shrink-0" />
      ) : state === "failed" ? (
        <AlertCircle className="size-3 shrink-0" />
      ) : (
        <Clock className="size-3 shrink-0" />
      )}
      <Icon className={iconClass} />
      {label}
    </span>
  );
}

function SeriesScheduleContent() {
  const params = useParams();
  const seriesGroupId = String(params.seriesGroupId ?? "");
  const [rows, setRows] = useState<SeriesPartScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seriesGroupId) {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const data = await getSeriesSocialScheduleOverview(seriesGroupId);
        setRows(data);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [seriesGroupId]);

  const partTotal = rows[0]?.partTotal ?? rows.length;

  return (
    <div className="md:px-20 max-w-3xl mx-auto py-8 sm:py-12">
      <Button variant="ghost" asChild className="mb-6 -ml-2 gap-2 text-muted-foreground">
        <Link href="/app/shorts">
          <ArrowLeft className="size-4" />
          Back to shorts
        </Link>
      </Button>

      <div className="mb-8 flex items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Layers className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Series publish schedule
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {partTotal}-part series — each part is scheduled on the platforms you chose.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading schedule…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            No series found or nothing was scheduled for social publish.
          </p>
          <Button variant="outline" asChild>
            <Link href="/app/shorts">Go to shorts</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const yt = youtubeState(row);
            const tk = tiktokState(row);
            return (
              <li
                key={row.videoId}
                className="rounded-xl border border-border/80 bg-card p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      Part {row.partIndex + 1} of {row.partTotal}
                    </p>
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {row.title}
                    </p>
                    {row.description ? (
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {row.description}
                      </p>
                    ) : null}
                  </div>
                  <Button type="button" size="sm" variant="outline" asChild>
                    <Link href={publishPagePath(row.videoId)}>Manage</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4 shrink-0 text-primary" />
                  {formatScheduledAt(row.scheduledAt)}
                </div>

                <div className="flex flex-wrap gap-2">
                  <PlatformBadge platform="youtube" state={yt} />
                  <PlatformBadge platform="tiktok" state={tk} />
                </div>

                {row.lastError && (yt === "failed" || tk === "failed") ? (
                  <p className="text-xs text-destructive">{row.lastError}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function SeriesSchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="md:px-20 max-w-3xl mx-auto py-12 text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <SeriesScheduleContent />
    </Suspense>
  );
}
