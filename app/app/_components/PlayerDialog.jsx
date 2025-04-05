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
import { proveriPoeni } from 'lib/utils'
import { DollarSign, X } from 'lucide-react'
import { toast } from 'sonner'
import { UserDetailContext } from 'app/_context/UserDetailContext'


function PlayerDialog({ playVideo, videoId }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [videoData, setVideoData] = useState();
    const [durationFrame, setDurationFrame] = useState(1200);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();

    useEffect(() => {
        setOpenDialog(!!playVideo)
        videoId && getVideoData();
        // console.log('rpomena')
        // console.log(durationFrame);
    }, [playVideo, durationFrame]);

    const getVideoData = async (id) => {
        const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));
        setVideoData(result[0]);
        // console.log(result)
    }

    const exportVideo = async () => {
        if (!proveriPoeni(userDetail.credits, 100)) {
            toast("Insufficient credits! Please recharge to generate a video.");
            return;
        }
        const res = await axios.post("/api/export-video", {
            inputProps: videoData
        }).then(async (res) => {
            // console.log(res);
        })
    }


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
                            ...videoData,
                            setDurationInFrame: (frameValue) => setDurationFrame(frameValue)
                        }}
                    />

                    <div className="grid mt-6 grid-cols-2 gap-12">
                        <Button onClick={() => { router.replace("/app/shorts"); setOpenDialog(false) }} className={`py-6 cursor-pointer`} variant={`ghost`}>Cancel</Button>
                        <Button onClick={() => exportVideo()} className={`py-6 cursor-pointer`}>Export (100 credits)</Button>
                    </div>
                    <DialogDescription>
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
