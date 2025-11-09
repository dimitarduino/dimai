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

function GeneratedImages({ imagesList, onClickImage, selectedImage }) {
    const [modifiedImage, setModifiedImage] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [videoId, setVideoId] = useState();
    const [openedVideo, setOpenedVideo] = useState(false);
    const [openedResult, setOpenedResult] = useState(false);
    const [durationFrame, setDurationFrame] = useState(0);
    const [activeImage, setActiveImage] = useState(selectedImage);

    return (
        <ScrollArea className="max-h-36 overflow-auto">
            <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-8 xl:grid-cols-12 gap-1">
                {[...new Map(imagesList.map(v => [v.image, v])).values()]
                    .sort((a, b) => b.id - a.id)
                    .map((video, index) => (
                        <div
                            onClick={() => { setActiveImage(video.image); onClickImage(video.image); }}
                            className={`overflow-hidden flex w-full h-full rounded-xl ${(activeImage == video.image || selectedImage == video.image) ? "border-2 border-primary" : ""}`}
                            key={video.id ?? index}
                        >
                            <div className="hover:scale-110 overflow-hidden w-full h-full flex transition-all cursor-pointer">
                                <Image
                                    src={video.image}
                                    alt={video.caption ?? ""}
                                    className="w-full aspect-9/16 min-h-12 object-cover"
                                    width={100}
                                    height={300}
                                    layout="responsive"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                    ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default GeneratedImages