"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import SelectMode from "../_components/SelectMode";
import PromptInput from "../_components/PromptInput";
import PromptImage from "../_components/PromptImage";
import GeneratedVideos from "../_components/GeneratedVideos";
import { DollarSign, UploadCloud, X } from "lucide-react";
import { proveriPoeni } from "lib/utils";
import { useUserDetail } from "@/app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";

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
import CustomLoading from "../_components/CustomLoading";
import { toast } from "sonner";
import SelectComponent from "../_components/SelectComponent";
import {
    listMyImageVideos,
    getBatchVideoJobStatuses,
    getMyImageVideoById,
} from "@/app/app/_actions/dashboard-data";
import GeneratedImages from "../_components/GeneratedImages";
import { NextImageFillWithLoading } from "../_components/NextImageFillWithLoading";
import { InferSelectModel } from "drizzle-orm";
import { ImageVideo } from "@/configs/schema";
import { shouldUnoptimizeImageSrc } from "@/lib/next-image-src";
import { IMAGE_VIDEO_PREVIEW_MAX_PX, SIZES_IMAGE_VIDEO_UPLOAD } from "@/lib/image-preview-sizes";

/** `VideoGenerationJobs.result` JSON when an image-video job completes. */
function parseImageVideoJobResult(result: unknown): { videoId: number } | null {
    if (result == null || typeof result !== "object") return null;
    const vid = (result as Record<string, unknown>).videoId;
    if (typeof vid === "number" && Number.isFinite(vid)) return { videoId: vid };
    if (typeof vid === "string") {
        const n = Number(vid);
        if (Number.isFinite(n)) return { videoId: n };
    }
    return null;
}

export default function ImageToVideo() {
    const [progressVideos, setProgressVideos] = useState(() => {
        if (typeof window === "undefined") return [];
        const raw = localStorage.getItem("pretvoreniVidea");
        return raw ? JSON.parse(raw) : [];
    });

    const [file, setFile] = useState<File | null>(null);

    const [videos, setVideos] = useState<InferSelectModel<typeof ImageVideo>[]>([]);
    const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    const [uploading, setUploading] = useState<boolean>(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
   const [modifiedImage, setModifiedImage] = useState<string | null>(null);
    const [resolutions, setResolutions] = useState(["standard"
        , "pro"]);

    const [durations, setDurations] = useState<number[]>([5, 10]);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        resolution: "standard",
        duration: 5,
        prompt: "",
        negative_prompt: ""
    });
    const [openedResult, setOpenedResult] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ step: string, percentage: number }>({ step: '', percentage: 0 });
    const { user, isLoaded } = useUser() ?? { user: null, isLoaded: false };
    const [userLocal, setUserLocal] = useState(user?.primaryEmailAddress?.emailAddress);

    const { userDetail, setUserDetail } = useUserDetail();
    const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const currentJobIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (currentJobId) {
            currentJobIdRef.current = currentJobId;
        }
    }, [currentJobId]);

    const deleteFromLocalStorageJobId = (jobid) => {
        let currentJobIdArr = getLocalStorageJobIds();
        currentJobIdArr = currentJobIdArr.filter(id => id !== jobid);
        localStorage.setItem('pretvoreniVidea', JSON.stringify(currentJobIdArr));
    }

    const getLocalStorageJobIds = () => {
        let currentJobIdArr = !!localStorage.getItem('pretvoreniVidea') ? JSON.parse(localStorage.getItem('pretvoreniVidea') ?? '') : [];
        return currentJobIdArr;
    }

    useEffect(() => {
        if (user) {
            setUserLocal(user?.primaryEmailAddress?.emailAddress);
        }
    }, [user]);


    const loadInitial = useCallback(async () => {
        if (!userLocal) return;
        try {
            const { items, nextCursor: next } = await listMyImageVideos({ limit: 40 });
            setVideos(items);
            setNextCursor(next);
        } catch (e) {
            console.error(e);
        }
    }, [userLocal]);

    useEffect(() => {
        void loadInitial();
    }, [userLocal, loadInitial]);

    useEffect(() => {
        if (!userLocal) return;
        let cancelled = false;
        let intervalId;

        const tick = async () => {
            if (cancelled || typeof window === "undefined") return;
            const ids = getLocalStorageJobIds();
            setProgressVideos(ids);
            if (ids.length === 0) return;
            try {
                const jobs = await getBatchVideoJobStatuses(ids);
                let terminal = false;
                for (const job of jobs) {
                    if (job.status === "failed") {
                        toast.error(job.error || "Video generation failed");
                        setLoading(false);
                        deleteFromLocalStorageJobId(job.jobId);
                        terminal = true;
                    } else if (job.status === "completed") {
                        terminal = true;
                        deleteFromLocalStorageJobId(job.jobId);
                        const completed = parseImageVideoJobResult(job.result);
                        if (completed) {
                            const row = await getMyImageVideoById(completed.videoId);
                            if (row && job.jobId === currentJobIdRef.current) {
                                setLoading(false);
                                setOpenedResult(true);
                                setModifiedImage(row.video);
                            }
                        }
                    }
                }
                const after = getLocalStorageJobIds();
                setProgressVideos(after);
                if (terminal) await loadInitial();
            } catch (error) {
                console.error("Error checking job status:", error);
            }
        };

        void tick();
        intervalId = setInterval(() => void tick(), 5000);
        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [userLocal, loadInitial]);

    const loadMore = async () => {
        if (nextCursor == null || loadingMore || !userLocal) return;
        setLoadingMore(true);
        try {
            const { items, nextCursor: next } = await listMyImageVideos({
                limit: 40,
                cursor: nextCursor,
            });
            setVideos((prev) => [...prev, ...items]);
            setNextCursor(next);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingMore(false);
        }
    };

    const naPromenaInput = (ime, vrednost) => {
        setFormData(prev => ({
            ...prev,
            [ime]: ime === 'duration' ? Number(vrednost) : vrednost
        }));
    }

    const generateImageFromStyle = async (imageUrl) => {
        console.log(imageUrl)
        if (formData.prompt == "") {
            toast("Please enter a prompt.");
            return;
        }

        setLoading(true);

        const res = await axios.post('/api/generate-video-image-job', {
            formData: {
                ...formData,
                imageUrl
            },
            userId: user?.id ?? '',
            email: user?.primaryEmailAddress?.emailAddress ?? ''
        });

        console.log(res);
        const jobId = res.data.jobId;
        setCurrentJobId(jobId);
        setJobStatus('pending');
        setProgress({ step: 'initializing', percentage: 0 });


        if (typeof window !== 'undefined') {
            let currentVideoJobId = getLocalStorageJobIds();

            currentVideoJobId.push(jobId);

            localStorage.setItem('pretvoreniVidea', JSON.stringify(currentVideoJobId));
        }

        toast.success('Video generation started!');

        // const data = await axios.post("/api/image-video", {
        //     imageUrl: imageUrl,
        //     resolution: formData.resolution,
        //     duration: formData.duration,
        //     prompt: formData.prompt,
        //     negative_prompt: formData.negative_prompt

        // }).then(async (res) => {
        //     setLoading(false);

        //     const slednoPoeni = await iskoristPoeni({
        //         momentalnoKrediti: userDetail.credits,
        //         kolkuMinus: 12,
        //         email: user.primaryEmailAddress.emailAddress
        //     });

        //     setUserDetail(prev => ({
        //         ...prev,
        //         "credits": slednoPoeni
        //     }));

        //     if (!!res.data.result) {
        //         setModifiedImage(res.data.result);
        //         setOpenedResult(true);
        //     }
        // }).catch(err => {
        //     alert(err.message);
        //     setLoading(false);
        // })
    }

    const handleDownload = async (imageUrl) => {
        try {
            const response = await axios.get(imageUrl, { responseType: "blob" });

            const url = window.URL.createObjectURL(response.data);

            const a = document.createElement("a");
            a.href = url;
            a.download = "downloaded-video.mp4";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first!");

        if (!proveriPoeni(userDetail?.credits ?? 0, 5)) {
            toast("Insufficient credits! Please recharge to generate a video.");
            return;
        }

        setDownloadUrl(null);
        setModifiedImage(null);
        setSelectedImage("");

        setUploading(true);
        if (!file) return;
        const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.error("Upload failed:", error);
                setUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setDownloadUrl(url);
                setSelectedImage("");
                setUploading(false);

                await generateImageFromStyle(url);
            }
        );
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedImage("");;
        setFile(file);
        setUploadedImage(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'image/*': []},
        multiple: false,
    });

    if (!isLoaded) return null;

    const handleRecreate = (prompt, negative_prompt, resolution, duration, image) => {
        console.log(prompt, negative_prompt, resolution, duration)
        setFormData({
            ...formData,
            prompt,
            negative_prompt,
            resolution,
            duration
        });

        // console.log(image);
        
        setSelectedImage(image);

        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                const promptInput : HTMLTextAreaElement | null = document.querySelector('textarea[name="prompt"]');
                if (promptInput) {
                    promptInput.focus();
                    // Auto-resize on focus
                    promptInput.style.height = 'auto';
                    promptInput.style.height = `${Math.min(promptInput.scrollHeight, 300)}px`;
                }
            }, 300);
        }
    }


    return (
        <div className="w-full flex flex-col">

            <div className="flex bg-white dark:bg-zinc-900 py-12 w-full rounded-xl shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Make your image into a video with AI-powered effects</h1>
                <h2>
                    Make your image into a video with AI-powered effects.
                </h2>

                <h2 className='font-bold text-xl text-primary mt-4 mb-0 pb-0'>{`Upload your image`}</h2>
                <p className='text-gray-500'>{`Upload an image to transform it with AI-powered effects`}</p>
                <div className="flex flex-col items-center justify-center w-full p-6 pb-2 border-2 border-dashed rounded-xl bg-gray-100 dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:bg-zinc-950" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {uploadedImage ? (
                        <div
                            className="flex flex-col items-center w-full mx-auto"
                            style={{ maxWidth: IMAGE_VIDEO_PREVIEW_MAX_PX }}
                        >
                            <div
                                className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                                style={{ maxHeight: `min(70dvh, ${IMAGE_VIDEO_PREVIEW_MAX_PX}px)` }}
                            >
                                <NextImageFillWithLoading
                                    className="absolute inset-0"
                                    src={uploadedImage}
                                    alt="Uploaded"
                                    sizes={SIZES_IMAGE_VIDEO_UPLOAD}
                                    quality={65}
                                    imageClassName="object-contain"
                                    unoptimized={shouldUnoptimizeImageSrc(uploadedImage)}
                                />
                            </div>
                            <div className="flex text-primary mt-4 gap-x-2 items-center justify-center font-bold">
                                <UploadCloud size={22} />
                                <span>Or choose another image...</span>
                            </div>

                        </div>
                    ) : (
                        <div className="flex w-full flex-col items-center text-center text-gray-500 py-12 dark:text-gray-300">
                            <UploadCloud size={48} className="mb-2" />
                            {isDragActive ? (
                                <p>Drop the image here...</p>
                            ) : (
                                <p>Drag & drop an image here, or click to select</p>
                            )}
                        </div>
                    )}
                </div>

                <span className="opacity-30 text-black dark:text-white relative pt-4 text-sm">Or choose an existing image:</span>

                <GeneratedImages
                    imagesList={videos}
                    selectedImage={selectedImage}
                    stripMaxWidthPx={IMAGE_VIDEO_PREVIEW_MAX_PX}
                    onClickImage={(image) => { setSelectedImage(image); setFile(null); setUploadedImage(null) }}
                />
                <div className="pt-4"></div>

                <SelectComponent defaultValue={`standard`} optionsAvailable={resolutions} className="w-full" onUserSelect={naPromenaInput} placeholder="Mode" name="resolution" description="Select the mode for your video" title="Mode | Quality" />
                <span className="opacity-30 text-black dark:text-white relative top-[-10px] text-sm">*Standard: 720p, Pro: 1080p</span>

                <div className="d-flex flex-column">
                    <p className='text-gray-500 dark:text-neutral-200'>Prompt:<span className="text-red-600 text-sm">(*)</span></p>
                    <Textarea 
                        ref={promptTextareaRef}
                        placeholder="Prompt..." 
                        name="prompt" 
                        className={`mt-2 min-h-[80px] resize-none overflow-hidden`} 
                        value={formData.prompt} 
                        onChange={(event) => {
                            naPromenaInput("prompt", event.target.value);
                            // Auto-resize textarea
                            const textarea = event.target;
                            textarea.style.height = 'auto';
                            textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
                        }}
                        rows={3}
                    />
                </div>

                <div className="d-flex flex-column">
                    <p className='text-gray-500 dark:text-neutral-200'>Negative Prompt</p>
                    <Input type="text" placeholder="Negative Prompt..." name="negative_prompt" className={`mt-2`} value={formData.negative_prompt} onChange={(event) => naPromenaInput("negative_prompt", event.target.value)} />
                </div>

                <SelectComponent value={String(formData.duration)} defaultValue={String(formData.duration)} optionsAvailable={durations.map(d => String(d))} className="w-full" onUserSelect={naPromenaInput} placeholder="Aspect Ratio" name="duration" description="Select duration" title="Select duration (in seconds)" />

                {
                    selectedImage ? (
                        <Button className={`py-6 cursor-pointer dark:text-white`} onClick={() => generateImageFromStyle(selectedImage)} disabled={uploading}>
                            {uploading ? "Uploading..." : "Generate video"}
                        </Button>
                    ) : (
                        <Button className={`py-6 cursor-pointer dark:text-white`} onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Generate video"}
                        </Button>
                    )
                }

                {modifiedImage && (
                    <Button className={`py-2 border-bottom dark:hover:bg-zinc-800 border-2 border-primary text-md border-none hover:bg-neutral-100 h bg-transparent text-primary cursor-pointer`} onClick={() => setOpenedResult(true)}>
                        See your result
                    </Button>
                )}

                <div className="text-primary gap-2 font-bold flex items-center justify-center">
                    <div className="bg-primary p-1 rounded-full">
                        <DollarSign className='font-bold text-white' size={10} aria-label="Dollar" />
                    </div>
                    <span>
                        12 credits per video
                    </span>
                </div>

                <Dialog open={(!!openedResult)} onOpenChange={setOpenedResult}>
                    <DialogContent className="w-full  z-150 [&>button]:hidden max-w-lg sm:max-w-md flex flex-col">
                        <DialogHeader>
                            <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
                            <DialogDescription className={`text-md`}>
                                Your image has been transformed! ✨
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
                            {openedResult && modifiedImage ? (
                                    <div className="flex flex-col items-center">
                                        <video
                                            key={modifiedImage}
                                            controls
                                            preload="none"
                                            playsInline
                                            className="w-full max-w-[640px] max-h-[50dvh] rounded-md object-contain"
                                        >
                                            <source src={modifiedImage} type="video/mp4" />
                                        </video>
                                        <Button className={`py-6 mt-5 cursor-pointer text-white dark:text-white`} onClick={() => handleDownload(modifiedImage)}>Download video</Button>
                                    </div>
                                ) : null}
                        </div>
                        <DialogFooter>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <CustomLoading title="Generating your video..." loading={loading} />
            </div>


            <div className="flex bg-white dark:bg-zinc-900 py-12 rounded-xl w-full shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Your Generated Videos</h1>

                {
                    progressVideos.length > 0 && (
                        <span className="text-white text-md opacity-60">{progressVideos.length} videos generating!</span>
                    )
                }

                {
                    videos.length == 0 ? (
                        <h3>You don't have any generated videos</h3>
                    ) : (
                        <GeneratedVideos setVideoList={setVideos} videoList={videos} onClickVideo={(prompt, negative_prompt, mode, duration, image) => handleRecreate(prompt, negative_prompt, mode, duration, image)} />
                    )
                }
                {nextCursor != null && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            variant="outline"
                            disabled={loadingMore}
                            onClick={() => void loadMore()}
                        >
                            {loadingMore ? "Loading…" : "Load more"}
                        </Button>
                    </div>
                )}
            </div>


        </div>
    );
}