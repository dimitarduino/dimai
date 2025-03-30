import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Thumbnail } from "@remotion/player"
import RemotionVideo from './RemotionVideo'
import PlayerDialog from './PlayerDialog'

function VideosDashboard({ videoList }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [videoId, setVideoId] = useState();

    const setOpenVideo = (id) => {
        setOpenDialog(Date.now());
        setVideoId(id);
    }

    return (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl-grid-cols-6 gap-6">
            {videoList.map((video, index) => (
                <div onClick={() => setOpenVideo(video.id)} key={index} className='hover:scale-110 transition-all cursor-pointer'>
                    <Thumbnail
                        className="rounded-xl w-full"
                        component={RemotionVideo}
                        compositionWidth={200}
                        compositionHeight={320}
                        fps={30}
                        frameToDisplay={30}
                        durationInFrames={120}
                        inputProps={{
                            ...video,
                            setDurationInFrame: (v) => console.log(v)
                        }}
                    />
                </div>
            ))}

            <PlayerDialog playVideo={openDialog} videoId={videoId} />
        </div>
    )
}

export default VideosDashboard