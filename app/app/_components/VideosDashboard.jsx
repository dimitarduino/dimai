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
    const [openedVideo, setOpenedVideo] = useState(false);
    const [durationFrame, setDurationFrame] = useState(0);

    const setOpenVideo = (id) => {
        console.log('kje otvorim video', id)
        const videoOpened = videoList.find((video) => video.id === id);
        console.log('videoOpened', videoOpened) 
        setOpenedVideo(videoOpened);
        setOpenDialog(Date.now());
        setVideoId(id);
        console.log('openDialog', openDialog)
        console.log('videoId', id)
    }

    return (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl-grid-cols-6 gap-6">
            {videoList
                .sort((a, b) => b.id - a.id)
                .map((video, index) => (
                    <div onClick={() => setOpenVideo(video.id)}  className='overflow-hidden rounded-xl' key={index}>
                        <div className='hover:scale-110 overflow-hidden transition-all cursor-pointer'>
                            <Thumbnail
                                className="rounded-xl w-full"
                                component={RemotionVideo}
                                compositionWidth={200}
                                compositionHeight={320}
                                fps={30}
                                frameToDisplay={30}
                                durationInFrames={120}
                                inputProps={{
                                    videoData: {
                                        ...video
                                    },
                                    setDurationInFrame: (v) => setDurationFrame(v)
                                }}
                            />
                        </div>
                    </div>
                ))}

            <PlayerDialog setOpenDialogPlayer={setOpenDialog} playVideo={!!openDialog} videoId={videoId} downloadUrlProp={openedVideo ? openedVideo.downloadUrl : false} />
        </div>
    )
}

export default VideosDashboard