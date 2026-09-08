"use client";

import React, { useContext, useEffect, useState } from "react";
import { Player } from "@remotion/player";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/ui/button";
import { VideoData } from "@/configs/schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  getVideoDataByIdForOwner,
  setVideoDownloadUrlForOwner,
} from "@/app/app/_actions/dashboard-data";
import { X, Share2 } from "lucide-react";
import { toast } from "sonner";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import CustomLoading from "./CustomLoading";
import { publishPagePath } from "@/lib/social-oauth-state";
import type { InferSelectModel } from "drizzle-orm";

export type VideoDataRecord = InferSelectModel<typeof VideoData>;

export type PlayerDialogProps = {
  playVideo?: unknown;
  setOpenDialogPlayer?: React.Dispatch<React.SetStateAction<boolean>> | false;
  videoId?: number | null;
  downloadUrlProp?: string | boolean;
};

function PlayerDialog({
  playVideo,
  setOpenDialogPlayer = false,
  videoId,
  downloadUrlProp = false,
}: PlayerDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState<VideoDataRecord | undefined>();
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | false>(false);
  const [durationFrame, setDurationFrame] = useState(1200);
  const { user, isLoaded } = useUser() ?? { user: null, isLoaded: false };
  const userCtx = useContext(UserDetailContext);
  const userDetail = userCtx?.userDetail;
  const setUserDetail = userCtx?.setUserDetail;
  const router = useRouter();

  async function getVideoData() {
    if (videoId == null) return;
    const id = videoId;
    try {
      const result = await getVideoDataByIdForOwner(id);
      setVideoData(result ?? undefined);
      if (!result) {
        toast.error("Could not load video data for preview/export.");
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Could not load video data.";
      console.error("getVideoDataByIdForOwner failed:", e);
      toast.error(message);
    }
  }

  useEffect(() => {
    if (typeof downloadUrlProp === "string" && downloadUrlProp) {
      setDownloadUrl(downloadUrlProp);
    }
  }, [downloadUrlProp, videoId]);

  useEffect(() => {
    const url = videoData?.downloadUrl?.trim();
    if (url) setDownloadUrl(url);
  }, [videoData?.downloadUrl]);

  useEffect(() => {
    setOpenDialog(!!playVideo);
    if (setOpenDialogPlayer !== false) {
      setOpenDialogPlayer(!!playVideo);
    }
    if (videoId != null) void getVideoData();
  }, [playVideo, durationFrame, videoId]);

  useEffect(() => {
    if (setOpenDialogPlayer !== false) {
      setOpenDialogPlayer(openDialog);
    }
  }, [openDialog]);

  const exportVideo = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      toast("Sign in to export.");
      return;
    }
    if (videoId == null) {
      toast.error("Missing video id — cannot export.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post<{ result?: string }>("/api/export-video", {
        videoId,
        email,
      });
      setLoading(false);
      if (res.data.result) {
        setDownloadUrl(res.data.result);
        // Server already persists downloadUrl via exportShortVideoById;
        // best-effort sync if Clerk server profile works.
        try {
          await setVideoDownloadUrlForOwner(videoId, res.data.result);
        } catch (e) {
          console.warn("setVideoDownloadUrlForOwner skipped:", e);
        }
        toast.success("Video exported. You can upload to social media next.");
      }
    } catch (err: unknown) {
      setLoading(false);
      const raw = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      let message = "Export failed";
      if (typeof raw === "string" && raw.trim()) {
        message = raw;
      } else if (raw && typeof raw === "object") {
        try {
          message = JSON.stringify(raw);
        } catch {
          message = "Export failed";
        }
      } else if (err instanceof Error && err.message) {
        message = err.message;
      }
      console.error("Export MP4 error:", err);
      toast.error(message);
    }
  };

  if (!isLoaded) return null;

  const hasExported =
    typeof downloadUrl === "string" && downloadUrl.trim().length > 0;

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="z-150 max-h-[92vh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto sm:w-full [&>button]:hidden">
        <DialogHeader className="flex flex-col items-center justify-center gap-2">
          <DialogTitle className="font-bold text-2xl text-primary sm:text-3xl">
            Your video is ready!
          </DialogTitle>
          <Player
            component={RemotionVideo}
            durationInFrames={Math.round(durationFrame)}
            compositionWidth={360}
            compositionHeight={640}
            fps={30}
            acknowledgeRemotionLicense={true}
            controls={true}
            inputProps={{
              videoData: { ...videoData },
              setDurationInFrame: (frameValue: number) =>
                setDurationFrame(frameValue + 20),
            }}
          />

          {videoId != null && !hasExported ? (
            <p className="mt-4 w-full rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-left text-xs text-muted-foreground sm:text-sm">
              To upload to <span className="font-medium text-foreground">YouTube</span> or{" "}
              <span className="font-medium text-foreground">TikTok</span>, export the video
              first. After the MP4 is ready, use{" "}
              <span className="font-medium text-foreground">Upload to social media</span> on
              the next screen.
            </p>
          ) : null}

          <div className="mt-4 flex w-full max-w-md flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  router.replace("/app/shorts");
                  setOpenDialog(false);
                }}
                className="py-6 cursor-pointer"
                variant="ghost"
              >
                Cancel
              </Button>
              {hasExported ? (
                <a
                  href={downloadUrl as string}
                  download="video.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full py-6 cursor-pointer text-white dark:text-white">
                    Download
                  </Button>
                </a>
              ) : (
                <Button
                  type="button"
                  onClick={() => void exportVideo()}
                  className="py-6 cursor-pointer text-white dark:text-white"
                >
                  Export MP4 (free)
                </Button>
              )}
            </div>

            {videoId != null && hasExported ? (
              <Button
                type="button"
                size="lg"
                className="w-full gap-2 py-6 text-sm font-semibold uppercase tracking-wide"
                asChild
              >
                <Link
                  href={publishPagePath(videoId)}
                  onClick={() => setOpenDialog(false)}
                >
                  <Share2 className="size-4" />
                  Upload to social media
                </Link>
              </Button>
            ) : null}
          </div>

          <DialogDescription asChild>
            <div>
              <CustomLoading
                title="Rendering your video..."
                loading={loading}
              />
            </div>
          </DialogDescription>

          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-5 top-5 cursor-pointer text-gray-500 transition duration-200 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </DialogClose>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialog;
