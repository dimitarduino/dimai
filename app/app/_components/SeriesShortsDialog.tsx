"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layers, Play, Share2, X } from "lucide-react";

import {
  deleteMyShortSeries,
  deleteMyShortVideo,
  getVideoSeriesParts,
  getVideoSocialUploadStatuses,
} from "@/app/app/_actions/dashboard-data";
import DeleteShortConfirm from "@/app/app/_components/DeleteShortConfirm";
import PlayerDialog from "@/app/app/_components/PlayerDialog";
import SocialScheduleBadges from "@/app/app/_components/SocialScheduleBadges";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/ui/button";
import { publishPagePath } from "@/lib/social-oauth-state";
import { seriesSchedulePagePath } from "@/lib/series-schedule-path";
import {
  firstPosterFromVideo,
  titleFromVideoRecord,
  type VideoRecord,
} from "@/lib/shorts-library";
import type { VideoSocialUploadStatus } from "@/lib/social-schedule-types";
import { hasSocialSchedule } from "@/lib/social-upload-status-label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seriesGroupId: string | null;
  fallbackTitle?: string;
  partTotal?: number;
  onLibraryChange?: () => void;
};

export default function SeriesShortsDialog({
  open,
  onOpenChange,
  seriesGroupId,
  fallbackTitle,
  partTotal,
  onLibraryChange,
}: Props) {
  const [parts, setParts] = useState<VideoRecord[]>([]);
  const [socialByVideoId, setSocialByVideoId] = useState<
    Record<number, VideoSocialUploadStatus>
  >({});
  const [loading, setLoading] = useState(false);
  const [playVideoId, setPlayVideoId] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !seriesGroupId) {
      setParts([]);
      setSocialByVideoId({});
      return;
    }
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const rows = await getVideoSeriesParts(seriesGroupId);
        if (cancelled) return;
        setParts(rows);
        if (rows.length > 0) {
          const statuses = await getVideoSocialUploadStatuses(
            rows.map((r) => r.id),
          );
          if (!cancelled) setSocialByVideoId(statuses);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, seriesGroupId]);

  const title =
    fallbackTitle ?? titleFromVideoRecord(parts[0]) ?? "Short series";
  const expectedTotal = partTotal ?? parts[0]?.seriesPartTotal ?? parts.length;
  const total = Math.max(expectedTotal, parts.length);
  const incomplete = parts.length > 0 && parts.length < expectedTotal;

  const reloadParts = async () => {
    if (!seriesGroupId) return;
    const rows = await getVideoSeriesParts(seriesGroupId);
    setParts(rows);
    if (rows.length > 0) {
      const statuses = await getVideoSocialUploadStatuses(rows.map((r) => r.id));
      setSocialByVideoId(statuses);
    } else {
      setSocialByVideoId({});
      onOpenChange(false);
      onLibraryChange?.();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto gap-0 p-0">
          <DialogHeader className="border-b border-border/60 px-5 py-4 pr-12">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="size-5" />
              </div>
              <div className="min-w-0 space-y-1 text-left">
                <DialogTitle className="text-lg leading-snug">{title}</DialogTitle>
                <p className="text-sm font-normal text-muted-foreground">
                  {incomplete
                    ? `${parts.length} of ${expectedTotal} parts ready · generation may have stopped early`
                    : `${total}-part series · tap a part to preview or publish`}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {seriesGroupId ? (
                    <Button type="button" variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                      <Link href={seriesSchedulePagePath(seriesGroupId)}>
                        View publish schedule
                      </Link>
                    </Button>
                  ) : null}
                  {seriesGroupId ? (
                    <DeleteShortConfirm
                      variant="button"
                      buttonLabel="Delete series"
                      title="Delete entire series?"
                      description={`This permanently removes all ${parts.length || total} part(s) and their scheduled social posts. This cannot be undone.`}
                      successMessage="Series deleted"
                      onConfirm={() => deleteMyShortSeries(seriesGroupId)}
                      onSuccess={() => {
                        onOpenChange(false);
                        onLibraryChange?.();
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5">
            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Loading parts…
              </p>
            ) : parts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No parts found for this series.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parts.map((part) => {
                  const poster = firstPosterFromVideo(part);
                  const partNum = (part.seriesPartIndex ?? 0) + 1;
                  const exported = Boolean(part.downloadUrl?.trim());
                  const social = socialByVideoId[part.id];
                  const scheduled = social && hasSocialSchedule(social);

                  return (
                    <div
                      key={part.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card"
                    >
                      <button
                        type="button"
                        className="relative aspect-[5/8] w-full bg-muted/40 text-left"
                        onClick={() => setPlayVideoId(part.id)}
                      >
                        {poster ? (
                          <Image
                            src={poster}
                            alt={`Part ${partNum}`}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                            No preview
                          </span>
                        )}
                        <span className="absolute left-2 top-2 rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-semibold shadow-sm">
                          Part {partNum}/{total}
                        </span>
                        {!exported ? (
                          <span className="absolute right-2 top-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
                            Exporting…
                          </span>
                        ) : null}
                      </button>
                      <div className="flex flex-col gap-2 p-3">
                        {scheduled ? (
                          <div className="space-y-1.5">
                            <SocialScheduleBadges status={social} />
                            {social.title ? (
                              <p className="text-xs font-medium text-foreground line-clamp-2">
                                {social.title}
                              </p>
                            ) : null}
                            {social.description ? (
                              <p className="text-[11px] text-muted-foreground line-clamp-3">
                                {social.description}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="w-full gap-1.5"
                          onClick={() => setPlayVideoId(part.id)}
                        >
                          <Play className="size-3.5" />
                          Play
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="w-full gap-1.5"
                          asChild
                          disabled={!exported}
                        >
                          <Link href={publishPagePath(part.id)}>
                            <Share2 className="size-3.5" />
                            {scheduled ? "Manage publish" : "Publish"}
                          </Link>
                        </Button>
                        <DeleteShortConfirm
                          variant="button"
                          buttonLabel="Delete part"
                          title={`Delete part ${partNum}?`}
                          description="This permanently removes this part and any scheduled social posts for it."
                          successMessage="Part deleted"
                          onConfirm={() => deleteMyShortVideo(part.id)}
                          onSuccess={() => {
                            void reloadParts();
                            onLibraryChange?.();
                          }}
                          triggerClassName="w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="size-5" />
          </button> */}
        </DialogContent>
      </Dialog>

      <PlayerDialog
        playVideo={playVideoId != null}
        videoId={playVideoId}
        setOpenDialogPlayer={(v) => {
          if (!v) setPlayVideoId(null);
        }}
      />
    </>
  );
}
