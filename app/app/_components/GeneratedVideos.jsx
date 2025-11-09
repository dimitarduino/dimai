import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Thumbnail } from "@remotion/player"
import RemotionVideo from './RemotionVideo'
import PlayerDialog from './PlayerDialog'
import { useEffect } from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { X } from 'lucide-react'

function GeneratedVideos({ videoList, onClickVideo }) {
    const [modifiedImage, setModifiedImage] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [videoId, setVideoId] = useState();
    const [openedVideo, setOpenedVideo] = useState(false);
    const [openedResult, setOpenedResult] = useState(false);
    const [durationFrame, setDurationFrame] = useState(0);

    useEffect(() => {
        console.log(videoList);
    }, []);

    return (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl-grid-cols-6 gap-6">
            {videoList
                .sort((a, b) => b.id - a.id)
                .map((video, index) => (
                    <div className='overflow-hidden flex w-full flex-col h-full rounded-xl' key={index}>
                        <div onClick={() => { setOpenedResult(true); setModifiedImage(video.video) }} className='hover:scale-110 overflow-hidden w-full h-full flex transition-all cursor-pointer'>
                            <video loop poster={video.image} autoPlay muted playsInline className="w-full aspect-12/16 object-cover h-full">
                                <source src={video.video} type="video/mp4" />
                            </video>
                        </div>

                        <Button onClick={() => { setModifiedImage(video.video); onClickVideo(video.prompt, video.negative_prompt, video.mode, video.duration, video.image); }} className='w-full py-2 bg-primary pointer cursor-pointer text-white z-10'>Recreate</Button>
                    </div>
                ))}

            <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full [&>button]:hidden max-w-lg sm:max-w-md flex flex-col">
                    <DialogHeader>
                        <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
                        <DialogDescription className={`text-md`}>
                        </DialogDescription>

                        <DialogClose asChild>
                            <button
                                className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer"
                            >
                                <X size={24} />
                            </button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid py-4 grid-cols-1 w-full gap-12">
                        {
                            modifiedImage && (
                                <div className="flex flex-col">
                                    <video controls className="rounded-md max-h-128">
                                        <source src={modifiedImage} type="video/mp4" />
                                    </video>
                                    <Button className={`py-6 mt-5 cursor-pointer dark:text-white`} onClick={() => handleDownload(modifiedImage)}>Download video</Button>
                                </div>
                            )
                        }
                    </div>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GeneratedVideos