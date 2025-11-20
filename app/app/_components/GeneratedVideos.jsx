import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Thumbnail } from "@remotion/player"
import RemotionVideo from './RemotionVideo'
import PlayerDialog from './PlayerDialog'
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
import { Trash2, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
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
    const [loadedVideos, setLoadedVideos] = useState(new Set());
    const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const videoRefs = useRef(new Map());
    const dialogVideoRef = useRef(null);
    const touchStartPos = useRef({ x: 0, y: 0, videoId: null });
    
    // Get sorted video list (create new array to avoid mutating original)
    const sortedVideoList = [...videoList].sort((a, b) => b.id - a.id);

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

    // Intersection Observer for lazy loading videos
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '50px', // Start loading 50px before entering viewport
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const videoId = entry.target.dataset.videoId;
                    if (videoId) {
                        setLoadedVideos(prev => {
                            if (!prev.has(videoId)) {
                                return new Set([...prev, videoId]);
                            }
                            return prev;
                        });
                    }
                }
            });
        }, observerOptions);

        // Use setTimeout to ensure DOM is updated
        const timeoutId = setTimeout(() => {
            // Observe all video containers
            videoRefs.current.forEach((ref) => {
                if (ref) observer.observe(ref);
            });
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [videoList]);

    // Optimized hover handlers to reduce lag
    const handleMouseEnter = useCallback((e, videoId) => {
        const container = e.currentTarget;
        const video = container.querySelector('video');
        if (video) {
            // Mark video as loaded if not already
            if (!loadedVideos.has(videoId)) {
                setLoadedVideos(prev => new Set([...prev, videoId]));
            }
            // Ensure video is loaded before playing
            if (video.readyState < 2) {
                video.load();
                video.addEventListener('loadeddata', () => {
                    video.play().catch(() => {});
                }, { once: true });
            } else {
                video.play().catch(() => {}); // Ignore autoplay errors
            }
        }
    }, [loadedVideos]);

    const handleMouseLeave = useCallback((e) => {
        const container = e.currentTarget;
        const video = container.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }, []);

    const playVideoOnTouch = useCallback((video, videoId) => {
        if (!video) return;
        
        // Mark video as loaded if not already
        if (!loadedVideos.has(videoId)) {
            setLoadedVideos(prev => new Set([...prev, videoId]));
        }
        
        // Set video attributes for mobile playback
        video.muted = true;
        if (video.setAttribute) {
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
        }
        
        // Function to play video
        const playVideo = () => {
            video.play().catch((err) => {
                // Silently fail - some browsers block autoplay
                console.log('Video play attempt:', err.message);
            });
        };
        
        // Ensure video is loaded before playing
        if (video.readyState < 2) {
            // Load the video first
            video.load();
            // Try multiple events to catch when video is ready
            const tryPlay = () => {
                if (video.readyState >= 2) {
                    playVideo();
                }
            };
            video.addEventListener('loadeddata', tryPlay, { once: true });
            video.addEventListener('loadedmetadata', tryPlay, { once: true });
            video.addEventListener('canplay', tryPlay, { once: true });
        } else {
            // Video already has data, try to play immediately
            playVideo();
        }
    }, [loadedVideos]);

    const handleTouchStart = useCallback((e, videoId) => {
        const touch = e.touches[0];
        if (touch) {
            touchStartPos.current = {
                x: touch.clientX,
                y: touch.clientY,
                videoId: videoId
            };
        }
    }, []);

    const handleTouchMove = useCallback((e, videoId) => {
        if (!touchStartPos.current.videoId) return;
        
        const touch = e.touches[0];
        if (!touch) return;
        
        const startX = touchStartPos.current.x;
        const startY = touchStartPos.current.y;
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        // Detect horizontal swipe (left or right)
        // Horizontal movement should be greater than vertical (swipe gesture)
        if (deltaX > 30 && deltaX > deltaY) {
            const container = e.currentTarget;
            const video = container.querySelector('video');
            if (video && videoId === touchStartPos.current.videoId) {
                // Play video on horizontal swipe
                playVideoOnTouch(video, videoId);
            }
        }
    }, [playVideoOnTouch]);

    const handleTouchEnd = useCallback((e) => {
        // Reset touch position
        touchStartPos.current = { x: 0, y: 0, videoId: null };
        // Don't pause on touch end - let video continue playing
        // This allows videos to play continuously on mobile
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

    // Handle opening video dialog
    const handleOpenVideo = (index) => {
        setCurrentVideoIndex(index);
        const videoUrl = sortedVideoList[index].video;
        setModifiedImage(videoUrl);
        setOpenedResult(true);
        setIsVideoLoading(true);
        // Preload the video immediately
        setTimeout(() => {
            if (dialogVideoRef.current) {
                dialogVideoRef.current.load();
            }
        }, 0);
    }

    // Handle navigation to previous video
    const handlePreviousVideo = useCallback(() => {
        if (currentVideoIndex > 0) {
            const newIndex = currentVideoIndex - 1;
            setCurrentVideoIndex(newIndex);
            setModifiedImage(sortedVideoList[newIndex].video);
            setIsVideoLoading(true);
        }
    }, [currentVideoIndex, sortedVideoList]);

    // Handle navigation to next video
    const handleNextVideo = useCallback(() => {
        if (currentVideoIndex < sortedVideoList.length - 1) {
            const newIndex = currentVideoIndex + 1;
            setCurrentVideoIndex(newIndex);
            setModifiedImage(sortedVideoList[newIndex].video);
            setIsVideoLoading(true);
        }
    }, [currentVideoIndex, sortedVideoList]);

    // Handle video loaded
    const handleVideoLoaded = () => {
        setIsVideoLoading(false);
    }

    // Handle when video can start playing (faster than loadeddata)
    const handleVideoCanPlay = () => {
        setIsVideoLoading(false);
    }

    // Preload video when dialog opens or video changes
    useEffect(() => {
        if (openedResult && dialogVideoRef.current && modifiedImage) {
            setIsVideoLoading(true);
            const video = dialogVideoRef.current;
            // Set preload to auto for faster loading
            video.preload = 'auto';
            // Load the video
            video.load();
            // Try to play immediately if possible
            video.play().catch(() => {
                // If autoplay fails, that's okay - user can click play
            });
        }
    }, [openedResult, modifiedImage]);

    // Keyboard navigation
    useEffect(() => {
        if (!openedResult) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePreviousVideo();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNextVideo();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setOpenedResult(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openedResult, handlePreviousVideo, handleNextVideo]);

    return (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl-grid-cols-6 gap-6">
            {sortedVideoList.map((video, index) => (
                    <div className='overflow-hidden relative flex w-full flex-col h-full rounded-xl select-none' key={index}>
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

                        <div 
                            ref={(el) => {
                                if (el) {
                                    videoRefs.current.set(video.id || index, el);
                                }
                            }}
                            data-video-id={video.id || index}
                            onClick={() => handleOpenVideo(index)} 
                            onMouseEnter={(e) => handleMouseEnter(e, video.id || index)}
                            onMouseLeave={handleMouseLeave}
                            onTouchStart={(e) => {
                                handleTouchStart(e, video.id || index);
                            }}
                            onTouchMove={(e) => {
                                handleTouchMove(e, video.id || index);
                            }}
                            onTouchEnd={(e) => {
                                handleTouchEnd(e);
                            }}
                            className='hover:scale-110 overflow-hidden w-full h-full flex transition-all cursor-pointer select-none'
                        >
                            <video
                                loop
                                poster={video.image}
                                playsInline
                                webkit-playsinline="true"
                                preload={loadedVideos.has(video.id || index) ? "metadata" : "none"}
                                className="w-full aspect-12/16 object-cover h-full select-none pointer-events-auto"
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
                            {currentVideoIndex >= 0 && (
                                <span>Video {currentVideoIndex + 1} of {sortedVideoList.length}</span>
                            )}
                        </DialogDescription>

                        <DialogClose asChild>
                            <button
                                className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer z-10"
                            >
                                <X size={24} />
                            </button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid py-4 grid-cols-1 w-full gap-12 relative">
                        {
                            modifiedImage && currentVideoIndex >= 0 && (
                                <div className="flex flex-col relative">
                                    {/* Navigation Buttons */}
                                    {currentVideoIndex > 0 && (
                                        <Button
                                            onClick={handlePreviousVideo}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-10 w-10"
                                            disabled={isVideoLoading}
                                        >
                                            <ChevronLeft size={20} />
                                        </Button>
                                    )}
                                    {currentVideoIndex < sortedVideoList.length - 1 && (
                                        <Button
                                            onClick={handleNextVideo}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-10 w-10"
                                            disabled={isVideoLoading}
                                        >
                                            <ChevronRight size={20} />
                                        </Button>
                                    )}
                                    
                                    {/* Video Container */}
                                    <div className="relative rounded-md overflow-hidden bg-black">
                                        {isVideoLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                                <Loader2 className="animate-spin text-white" size={32} />
                                            </div>
                                        )}
                                        <video 
                                            ref={dialogVideoRef}
                                            controls 
                                            className="rounded-md max-h-80 sm:max-h-128 w-full"
                                            onLoadedData={handleVideoLoaded}
                                            onLoadedMetadata={handleVideoCanPlay}
                                            onCanPlay={handleVideoCanPlay}
                                            onCanPlayThrough={handleVideoCanPlay}
                                            preload="auto"
                                            playsInline
                                        >
                                            <source src={modifiedImage} type="video/mp4" />
                                        </video>
                                    </div>
                                    <a 
                                        download={modifiedImage} 
                                        href={modifiedImage} 
                                        className={`mt-5 bg-primary text-white rounded-md flex items-center justify-center py-2 cursor-pointer dark:text-white text-white`}
                                    >
                                        Download video
                                    </a>
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