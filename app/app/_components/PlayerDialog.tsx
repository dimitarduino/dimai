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
import axios from "axios";
import { proveriPoeni } from "@/lib/utils";
import {
  deductUserCredits,
  getVideoDataByIdForOwner,
  setVideoDownloadUrlForOwner,
} from "@/app/app/_actions/dashboard-data";
import { X } from "lucide-react";
import { toast } from "sonner";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import CustomLoading from "./CustomLoading";
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
    const result = await getVideoDataByIdForOwner(id);
    setVideoData(result ?? undefined);
  }

  useEffect(() => {
    if (typeof downloadUrlProp === "string" && downloadUrlProp) {
      setDownloadUrl(downloadUrlProp);
    }
  }, [downloadUrlProp, videoId]);

  useEffect(() => {
    setOpenDialog(!!playVideo);
    if (setOpenDialogPlayer !== false) {
      setOpenDialogPlayer(!!playVideo);
    }
    if (videoId != null) void getVideoData();
  }, [playVideo, durationFrame]);

  useEffect(() => {
    if (setOpenDialogPlayer !== false) {
      setOpenDialogPlayer(openDialog);
    }
  }, [openDialog]);

  const exportVideo = async () => {
    if (!proveriPoeni(userDetail?.credits ?? 0, 2)) {
      toast("Insufficient credits! Please recharge to generate a video.");
      return;
    }

    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email || !userDetail || !setUserDetail) {
      toast("Sign in to export.");
      return;
    }

    setLoading(true);
    console.log(videoData);

    try {
      const res = await axios.post<{ result?: string }>("/api/export-video", {
        inputProps: videoData,
      });
      setLoading(false);
      if (res.data.result) {
        setDownloadUrl(res.data.result);
        await setVideoDownloadUrlForOwner(videoId ?? 0, res.data.result);
      }

      const slednoPoeni = await deductUserCredits(2);
      setUserDetail((prev) => (prev ? { ...prev, credits: slednoPoeni } : prev));
    } catch (err: unknown) {
      setLoading(false);
      const message =
        axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      toast.error(
        typeof message === "string" ? message : "Error enountered",
      );
    }
  };

  if (!isLoaded) return null;

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className={`[&>button]:hidden  z-150`}>
        <DialogHeader className={`flex flex-col items-center justify-center`}>
          <DialogTitle className={`font-bold text-3xl text-primary`}>Your video is ready!</DialogTitle>
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
              setDurationInFrame: (frameValue: number) => setDurationFrame(frameValue + 20),
            }}
          />

          <div className="grid mt-6 grid-cols-2 gap-12">
            <Button
              onClick={() => {
                router.replace("/app/shorts");
                setOpenDialog(false);
              }}
              className={`py-6 cursor-pointer`}
              variant={`ghost`}
            >
              Cancel
            </Button>
            {downloadUrl && typeof downloadUrl === "string" && (
              <a href={downloadUrl} download="video.mp4" target="_blank" rel="noopener noreferrer">
                <Button className={`py-6 cursor-pointer dark:text-white text-white`}>Download video</Button>
              </a>
            )}

            {!downloadUrl && (
              <Button
                type="button"
                onClick={() => void exportVideo()}
                className={`py-6 cursor-pointer text-white dark:text-white`}
              >
                Export (2 credits)
              </Button>
            )}
          </div>
          <DialogDescription asChild>
            <div className="">
              <CustomLoading title="Rendering your video..." loading={loading} />
            </div>
          </DialogDescription>

          <DialogClose asChild>
            <button
              type="button"
              className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer"
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
