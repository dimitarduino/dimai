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
} from "@/components/ui/alert-dialog"
import { Trash2, X } from 'lucide-react'
import axios from 'axios'
import { db } from 'configs/db'
import { ImageVideo } from 'configs/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function GeneratedVideos({ videoList, setVideoList, onClickVideo }) {
    const [modifiedImage, setModifiedImage] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [videoId, setVideoId] = useState();
    const [openedVideo, setOpenedVideo] = useState(false);
    const [openedResult, setOpenedResult] = useState(false);
    const [durationFrame, setDurationFrame] = useState(0);

    const handleDownload = async (videoUrl) => {
        try {
            const response = await axios.get(videoUrl, { responseType: "blob" });
            const blob = response.data;

            const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const supportsDownload = 'download' in document.createElement('a');

            // iOS Safari doesn't reliably support the download attribute or blob URLs for downloads,
            // so convert to a data URL and open it (or set location) as a fallback.
            if (isIOS && isSafari) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const dataUrl = reader.result;
                    const newWindow = window.open(dataUrl, '_blank');
                    if (!newWindow) {
                        // If popup blocked, navigate directly
                        window.location.href = dataUrl;
                    }
                };
                reader.onerror = () => {
                    // final fallback: try opening the original URL
                    window.open(videoUrl);
                };
                reader.readAsDataURL(blob);
                return;
            }

            // Normal desktop / modern mobile browsers: create an object URL and use anchor download
            if (supportsDownload) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const filename = (videoUrl && videoUrl.split('/').pop().split('?')[0]) || "downloaded-video.mp4";
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                // Revoke after a short delay to ensure download started
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                return;
            }

            // Fallback: open the blob URL in a new tab/window
            const url = window.URL.createObjectURL(blob);
            window.open(url);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (error) {
            // final fallback: open the original URL
            window.open(videoUrl);
            console.error("Video download error:", error);
        }
    };

    useEffect(() => {
        console.log(videoList);
    }, []);

    const handleDelete = async (id) => {
        console.log(id)
        try {
            const deleted = await db.delete(ImageVideo).where(eq(ImageVideo.id, id));
            //    console.log(deleted);
            if (deleted) {
                toast.success("Video deleted successfully");
                setVideoList(videoList.filter((video) => video.id !== id));
            } else {
                toast.error("Failed to delete video");
            }
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    }

    return (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl-grid-cols-6 gap-6">
            {videoList
                .sort((a, b) => b.id - a.id)
                .map((video, index) => (
                    <div className='overflow-hidden relative flex w-full flex-col h-full rounded-xl' key={index}>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="absolute top-1 z-10 right-2 w-6 h-6 bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                                    <Trash2 size={4} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        video and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className={`text-white cursor-pointer bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700`} onClick={() => { handleDelete(video.id) }}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <div onClick={() => { setOpenedResult(true); setModifiedImage(video.video) }} className='hover:scale-110 overflow-hidden w-full h-full flex transition-all cursor-pointer'>
                            <video
                                ref={el => {
                                    if (!video._ref) video._ref = el;
                                }}
                                loop
                                poster={video.image}
                                playsInline
                                loading="lazy"
                                className="w-full aspect-12/16 object-cover h-full"
                                onMouseEnter={e => e.currentTarget.play()}
                                onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                onTouchStart={e => e.currentTarget.play()}
                                onTouchEnd={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                muted
                            >
                                <source src={video.video} type="video/mp4" />
                            </video>
                        </div>

                        <Button onClick={() => { setModifiedImage(video.video); onClickVideo(video.prompt, video.negative_prompt, video.mode, video.duration, video.image); }} className='w-full py-2 bg-primary pointer cursor-pointer text-white z-10'>Recreate</Button>
                    </div>
                ))}

            <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full [&>button]:hidden max-w-lg sm:max-w-md flex flex-col z-230">
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
                                    <video controls className="rounded-md max-h-80 sm:max-h-128">
                                        <source src={modifiedImage} type="video/mp4" />
                                    </video>
                                    <a download={modifiedImage} href={modifiedImage} className={` mt-5 bg-primary text-white rounded-md flex items-center justify-center py-2 cursor-pointer dark:text-white text-white`}>Download video</a>
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