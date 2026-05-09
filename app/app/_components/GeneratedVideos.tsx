"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";
import { ImageVideo } from "@/configs/schema";
import { toast } from "sonner";
import { deleteMyImageVideo } from "@/app/app/_actions/dashboard-data";
import type { InferSelectModel } from "drizzle-orm";
import { NextImageFillWithLoading } from "./NextImageFillWithLoading";
import { shouldUnoptimizeImageSrc } from "@/lib/next-image-src";
import { SIZES_IMAGE_VIDEO_GRID_POSTER } from "@/lib/image-preview-sizes";

export type GeneratedVideosProps = {
  videoList: InferSelectModel<typeof ImageVideo>[];
  setVideoList: React.Dispatch<React.SetStateAction<InferSelectModel<typeof ImageVideo>[]>>;
  onClickVideo: (
    prompt: string | null | undefined,
    negative_prompt: string | null | undefined,
    mode: string | null | undefined,
    duration: number | null | undefined,
    image: InferSelectModel<typeof ImageVideo>["image"],
  ) => void;
};

function posterFromImage(image: InferSelectModel<typeof ImageVideo>["image"]) {
  return typeof image === "string" ? image : "";
}

function GeneratedVideos({ videoList, setVideoList, onClickVideo }: GeneratedVideosProps) {
  const [modifiedImage, setModifiedImage] = useState<string | undefined>();
  const [openedResult, setOpenedResult] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const dialogVideoRef = useRef<HTMLVideoElement | null>(null);

  const sortedVideoList = [...videoList].sort((a, b) => b.id - a.id);

  const handleDownload = async (videoUrl: string) => {
    try {
      const response = await axios.get(videoUrl, { responseType: "blob" });
      const blob = response.data;

      const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const supportsDownload = "download" in document.createElement("a");

      if (isIOS && isSafari) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const newWindow = window.open(dataUrl, "_blank");
          if (!newWindow) {
            window.location.href = dataUrl;
          }
        };
        reader.onerror = () => {
          window.open(videoUrl);
        };
        reader.readAsDataURL(blob);
        return;
      }

      if (supportsDownload) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filename = (videoUrl && videoUrl.split("/").pop()?.split("?")[0]) || "downloaded-video.mp4";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        return;
      }

      const url = window.URL.createObjectURL(blob);
      window.open(url);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      window.open(videoUrl);
      console.error("Video download error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    console.log(id);
    try {
      await deleteMyImageVideo(id);
      toast.success("Video deleted successfully");
      setVideoList((prev) => prev.filter((video) => video.id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  const handleOpenVideo = (index: number) => {
    setCurrentVideoIndex(index);
    const videoUrl = sortedVideoList[index]?.video;
    setModifiedImage(videoUrl);
    setOpenedResult(true);
    setIsVideoLoading(true);
  };

  const handlePreviousVideo = useCallback(() => {
    if (currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      setModifiedImage(sortedVideoList[newIndex]?.video);
      setIsVideoLoading(true);
    }
  }, [currentVideoIndex, sortedVideoList]);

  const handleNextVideo = useCallback(() => {
    if (currentVideoIndex < sortedVideoList.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      setModifiedImage(sortedVideoList[newIndex]?.video);
      setIsVideoLoading(true);
    }
  }, [currentVideoIndex, sortedVideoList]);

  const handleVideoLoaded = () => {
    setIsVideoLoading(false);
  };

  const handleVideoCanPlay = () => {
    setIsVideoLoading(false);
  };

  useEffect(() => {
    if (!openedResult || !modifiedImage) return;
    const video = dialogVideoRef.current;
    if (!video) return;
    setIsVideoLoading(true);
    video.preload = "auto";
    video.load();
    void video.play().catch(() => {});
  }, [openedResult, modifiedImage]);

  useEffect(() => {
    if (!openedResult) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePreviousVideo();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpenedResult(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openedResult, handlePreviousVideo, handleNextVideo]);

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl-grid-cols-6 gap-6">
      {sortedVideoList.map((video, index) => {
        const poster = posterFromImage(video.image);
        return (
          <div className="overflow-hidden relative flex w-full flex-col h-full rounded-xl select-none" key={index}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  className="absolute top-1 z-10 right-2 w-6 h-6 bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  <Trash2 size={4} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your video and remove your data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    className={`text-white cursor-pointer bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700`}
                    onClick={() => void handleDelete(video.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div
              role="button"
              tabIndex={0}
              onClick={() => handleOpenVideo(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenVideo(index);
                }
              }}
              className="hover:scale-110 overflow-hidden w-full h-full flex transition-all cursor-pointer select-none rounded-xl bg-black"
            >
              {poster ? (
                <div className="relative w-full aspect-12/16 h-full bg-neutral-900">
                  <NextImageFillWithLoading
                    className="absolute inset-0"
                    src={poster}
                    alt=""
                    sizes={SIZES_IMAGE_VIDEO_GRID_POSTER}
                    quality={55}
                    imageClassName="object-cover select-none pointer-events-none"
                    draggable={false}
                    unoptimized={shouldUnoptimizeImageSrc(poster)}
                  />
                </div>
              ) : (
                <div className="w-full aspect-12/16 min-h-[8rem] bg-neutral-900" aria-hidden />
              )}
            </div>

            <Button
              type="button"
              onClick={() => {
                setModifiedImage(video.video);
                onClickVideo(video.prompt, video.negative_prompt, video.mode, video.duration, video.image);
              }}
              className="w-full py-2 bg-primary pointer cursor-pointer text-white z-10"
            >
              Recreate
            </Button>
          </div>
        );
      })}

      <Dialog
        open={!!openedResult}
        onOpenChange={(open) => {
          setOpenedResult(open);
          if (!open) {
            setModifiedImage(undefined);
            setCurrentVideoIndex(-1);
            setIsVideoLoading(false);
            dialogVideoRef.current?.pause();
          }
        }}
      >
        <DialogContent className="w-full [&>button]:hidden max-w-lg sm:max-w-md flex flex-col z-230">
          <DialogHeader>
            <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
            <DialogDescription className={`text-md`}>
              {currentVideoIndex >= 0 && (
                <span>
                  Video {currentVideoIndex + 1} of {sortedVideoList.length}
                </span>
              )}
            </DialogDescription>

            <DialogClose asChild>
              <button
                type="button"
                className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer z-10"
              >
                <X size={24} />
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="grid py-4 grid-cols-1 w-full gap-12 relative">
            {openedResult && modifiedImage && currentVideoIndex >= 0 && (
              <div className="flex flex-col relative">
                {currentVideoIndex > 0 && (
                  <Button
                    type="button"
                    onClick={handlePreviousVideo}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-10 w-10"
                    disabled={isVideoLoading}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                )}
                {currentVideoIndex < sortedVideoList.length - 1 && (
                  <Button
                    type="button"
                    onClick={handleNextVideo}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-10 w-10"
                    disabled={isVideoLoading}
                  >
                    <ChevronRight size={20} />
                  </Button>
                )}

                <div className="relative rounded-md overflow-hidden bg-black">
                  {isVideoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                      <Loader2 className="animate-spin text-white" size={32} />
                    </div>
                  )}
                  <video
                    ref={dialogVideoRef}
                    key={modifiedImage}
                    controls
                    className="rounded-md max-h-80 sm:max-h-128 w-full"
                    onLoadedData={handleVideoLoaded}
                    onLoadedMetadata={handleVideoCanPlay}
                    onCanPlay={handleVideoCanPlay}
                    onCanPlayThrough={handleVideoCanPlay}
                    preload="none"
                    playsInline
                  >
                    <source src={modifiedImage} type="video/mp4" />
                  </video>
                </div>
                <a
                  role="button"
                  tabIndex={0}
                  onClick={() => void handleDownload(modifiedImage)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") void handleDownload(modifiedImage);
                  }}
                  download
                  href={modifiedImage}
                  className={`mt-5 bg-primary text-white rounded-md flex items-center justify-center py-2 cursor-pointer dark:text-white text-white`}
                >
                  Download video
                </a>
              </div>
            )}
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GeneratedVideos;
