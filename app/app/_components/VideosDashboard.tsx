"use client";

import React, { useState } from "react";
import Image from "next/image";
import PlayerDialog from "./PlayerDialog";
import type { InferSelectModel } from "drizzle-orm";
import type { VideoData } from "@/configs/schema";

type VideoRecord = InferSelectModel<typeof VideoData>;

export type VideosDashboardProps = {
  videoList: VideoRecord[];
};

function firstPosterSrc(video: VideoRecord): string | null {
  const first = video.images?.[0];
  return typeof first === "string" && first.trim().length > 0 ? first : null;
}

function VideosDashboard({ videoList }: VideosDashboardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoId, setVideoId] = useState<number | undefined>();
  const [openedVideo, setOpenedVideo] = useState<VideoRecord | undefined>();

  const setOpenVideo = (id: number) => {
    const videoOpened = videoList.find((video) => video.id === id);
    setOpenedVideo(videoOpened);
    setOpenDialog(true);
    setVideoId(id);
  };

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
      {[...videoList]
        .sort((a, b) => b.id - a.id)
        .map((video, index) => {
          const poster = firstPosterSrc(video);
          return (
            <div
              role="button"
              tabIndex={0}
              key={video.id ?? index}
              onClick={() => setOpenVideo(video.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenVideo(video.id);
                }
              }}
              className="overflow-hidden rounded-xl"
            >
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
        })}

      <PlayerDialog
        setOpenDialogPlayer={setOpenDialog}
        playVideo={!!openDialog}
        videoId={videoId}
        downloadUrlProp={openedVideo ? openedVideo.downloadUrl : false}
      />
    </div>
  );
}

export default VideosDashboard;
