"use client"
import React, { useContext, useEffect, useState } from 'react'
import { Player } from "@remotion/player"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import RemotionVideo from './RemotionVideo'
import { Button } from '@/ui/button'
import { db } from 'configs/db'
import { VideoData } from 'configs/schema'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { iskoristPoeni, namestiDownloadUrl, proveriPoeni } from 'lib/utils'
import { DollarSign, X } from 'lucide-react'
import { toast } from 'sonner'
import { UserDetailContext } from 'app/_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import CustomLoading from './CustomLoading'


function PlayerDialog({ playVideo, videoId, downloadUrlProp=false }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [videoData, setVideoData] = useState();
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(false);
    const [durationFrame, setDurationFrame] = useState(1200);
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();

    useEffect(() => {
        if (downloadUrlProp) {
            setDownloadUrl(downloadUrlProp);
        }
    }, []);

    useEffect(() => {
        setOpenDialog(!!playVideo)
        videoId && getVideoData();
    }, [playVideo, durationFrame]);

    const getVideoData = async (id) => {
        const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));
        setVideoData(result[0]);
    }

    const exportVideo = async () => {
        if (!proveriPoeni(userDetail.credits, 2)) {
            toast("Insufficient credits! Please recharge to generate a video.");
            return;
        }

        setLoading(true);
        const res = await axios.post("/api/export-video", {
            inputProps: videoData
        }).then(async (res) => {
            setLoading(false);
            console.log(res);
            if (!!res.data.result) {
                setDownloadUrl(res.data.result);
                namestiDownloadUrl({
                    id: videoId,
                    downloadUrl: res.data.result
                });
            }

            const slednoPoeni = iskoristPoeni({
                momentalnoKrediti: userDetail.credits,
                kolkuMinus: 2,
                email: user.primaryEmailAddress.emailAddress
            });
            setUserDetail(prev => ({
                ...prev,
                "credits": slednoPoeni
            }));

        })
    }
    const handleDownload = async (videoUrl) => {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "video.mp4"; // Name of the file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className={`[&>button]:hidden`}>
                <DialogHeader className={`flex flex-col items-center justify-center`}>
                    <DialogTitle className={`font-bold text-3xl text-primary`}>Your video is ready!</DialogTitle>
                    <Player
                        component={RemotionVideo}
                        durationInFrames={Math.round(durationFrame)}
                        compositionWidth={360}
                        compositionHeight={640}
                        fps={30}
                        controls={true}
                        inputProps={{
                            videoData: { ...videoData },
                            setDurationInFrame: (frameValue) => setDurationFrame(frameValue + 20)
                        }}
                    />

                    <div className="grid mt-6 grid-cols-2 gap-12">
                        <Button onClick={() => { router.replace("/app/shorts"); setOpenDialog(false) }} className={`py-6 cursor-pointer`} variant={`ghost`}>Cancel</Button>
                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download="video.mp4"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className={`py-6 cursor-pointer`}>Download video</Button>
                            </a>
                        )}

                        {!downloadUrl && (
                            <Button onClick={() => exportVideo()} className={`py-6 cursor-pointer`}>Export (2 credits)</Button>
                        )}
                    </div>
                    <DialogDescription>

                        <CustomLoading title="Rendering your video..." loading={loading} />

                    </DialogDescription>

                    <DialogClose asChild>
                        <button
                            className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                    </DialogClose>
                </DialogHeader>
            </DialogContent>
        </Dialog>


    )
}

export default PlayerDialog
