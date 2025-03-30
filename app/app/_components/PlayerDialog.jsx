"use client"
import React, { useEffect, useState } from 'react'
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


function PlayerDialog({ playVideo, videoId }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [videoData, setVideoData] = useState();
    const [durationFrame, setDurationFrame] = useState(1200);
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
        console.log(result)
    }

    const exportVideo = async () => {
        console.log(videoData)
        const res = await axios.post("/api/export-video", {
            inputProps: videoData
        }).then(async (res) => {
            console.log(res);
        })
    }


    return (
        <Dialog open={openDialog} onOpenChange={(isOpen) => { 
            if (!isOpen) {
                console.log("Dialog closed"); 
                setOpenDialog(false); 
            }
        }}>
            <DialogContent>
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
                        <Button onClick={() => exportVideo()} className={`py-6 cursor-pointer`}>Export</Button>
                    </div>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default PlayerDialog
