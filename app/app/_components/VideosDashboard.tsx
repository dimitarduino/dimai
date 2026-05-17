"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Layers } from "lucide-react";

import {
  deleteMyShortSeries,
  deleteMyShortVideo,
} from "@/app/app/_actions/dashboard-data";
import DeleteShortConfirm from "@/app/app/_components/DeleteShortConfirm";
import PlayerDialog from "./PlayerDialog";
import SeriesShortsDialog from "./SeriesShortsDialog";
import type { ShortsLibraryItem } from "@/lib/shorts-library";
import { firstPosterFromVideo } from "@/lib/shorts-library";
import { cn } from "@/lib/utils";

export type VideosDashboardProps = {
  libraryItems: ShortsLibraryItem[];
  onItemDeleted?: () => void;
};

function SeriesStack({ count }: { count: number }) {
  if (count <= 1) return null;
  return (
    <>
      <div
        className="absolute inset-0 translate-x-1.5 -translate-y-1.5 rounded-xl border border-border/50 bg-muted/80"
        aria-hidden
      />
      <div
        className="absolute inset-0 translate-x-0.5 -translate-y-0.5 rounded-xl border border-border/40 bg-muted/60"
        aria-hidden
      />
    </>
  );
}

function VideosDashboard({ libraryItems, onItemDeleted }: VideosDashboardProps) {
  const [openSingle, setOpenSingle] = useState(false);
  const [singleVideoId, setSingleVideoId] = useState<number | undefined>();
  const [singleDownloadUrl, setSingleDownloadUrl] = useState<string | false>(
    false,
  );

  const [seriesOpen, setSeriesOpen] = useState(false);
  const [activeSeries, setActiveSeries] = useState<{
    seriesGroupId: string;
    title: string;
    partTotal: number;
  } | null>(null);

  const openSingleVideo = (id: number, downloadUrl: string) => {
    setSingleVideoId(id);
    setSingleDownloadUrl(downloadUrl);
    setOpenSingle(true);
  };

  const openSeries = (item: Extract<ShortsLibraryItem, { kind: "series" }>) => {
    setActiveSeries({
      seriesGroupId: item.seriesGroupId,
      title: item.title,
      partTotal: item.partTotal,
    });
    setSeriesOpen(true);
  };

  const refresh = () => onItemDeleted?.();

  return (
    <>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
        {libraryItems.map((item) => {
          if (item.kind === "single") {
            const poster = firstPosterFromVideo(item.video);
            return (
              <div
                key={`single-${item.video.id}`}
                role="button"
                tabIndex={0}
                onClick={() =>
                  openSingleVideo(item.video.id, item.video.downloadUrl ?? "")
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openSingleVideo(item.video.id, item.video.downloadUrl ?? "");
                  }
                }}
                className="overflow-hidden rounded-xl relative"
              >
                <DeleteShortConfirm
                  title="Delete this short?"
                  description="This permanently removes the video and any scheduled YouTube or TikTok posts for it. This cannot be undone."
                  successMessage="Short deleted"
                  onConfirm={() => deleteMyShortVideo(item.video.id)}
                  onSuccess={refresh}
                />
                <div className="hover:scale-110 overflow-hidden transition-all cursor-pointer">
                  <div className="relative aspect-[5/8] w-full rounded-xl bg-neutral-200 dark:bg-neutral-800">
                    {poster ? (
                      <Image
                        src={poster}
                        alt="Video thumbnail"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        quality={55}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground px-2 text-center">
                        No preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          const lead = item.parts[item.parts.length - 1] ?? item.parts[0];
          const poster = lead ? firstPosterFromVideo(lead) : null;
          const partCount = item.parts.length;

          return (
            <div
              key={`series-${item.seriesGroupId}`}
              role="button"
              tabIndex={0}
              onClick={() => openSeries(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openSeries(item);
                }
              }}
              className="overflow-hidden rounded-xl relative"
            >
              <DeleteShortConfirm
                title="Delete entire series?"
                description={`This permanently removes all ${partCount} part(s) and their scheduled social posts. This cannot be undone.`}
                successMessage="Series deleted"
                onConfirm={() => deleteMyShortSeries(item.seriesGroupId)}
                onSuccess={() => {
                  if (activeSeries?.seriesGroupId === item.seriesGroupId) {
                    setSeriesOpen(false);
                    setActiveSeries(null);
                  }
                  refresh();
                }}
              />
              <div className="hover:scale-110 overflow-hidden transition-all cursor-pointer">
                <div className="relative aspect-[5/8] w-full">
                  <SeriesStack count={item.partTotal} />
                  <div
                    className={cn(
                      "relative h-full w-full rounded-xl bg-neutral-200 dark:bg-neutral-800",
                      "ring-2 ring-primary/30",
                    )}
                  >
                    {poster ? (
                      <Image
                        src={poster}
                        alt={item.title}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        quality={55}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground px-2 text-center rounded-xl">
                        No preview
                      </div>
                    )}
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
                      <Layers className="size-3" />
                      {item.parts.length < item.partTotal
                        ? `${item.parts.length}/${item.partTotal} parts`
                        : `${item.partTotal} parts`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PlayerDialog
        setOpenDialogPlayer={setOpenSingle}
        playVideo={openSingle}
        videoId={singleVideoId}
        downloadUrlProp={singleDownloadUrl}
      />

      <SeriesShortsDialog
        open={seriesOpen}
        onOpenChange={setSeriesOpen}
        seriesGroupId={activeSeries?.seriesGroupId ?? null}
        fallbackTitle={activeSeries?.title}
        partTotal={activeSeries?.partTotal}
        onLibraryChange={refresh}
      />
    </>
  );
}

export default VideosDashboard;
