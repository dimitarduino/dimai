"use client";

import { useState, useContext, useCallback, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import SelectMode from "../_components/SelectMode";
import PromptInput from "../_components/PromptInput";
import PromptImage from "../_components/PromptImage";
import GeneratedVideos from "../_components/GeneratedVideos";
import { AmphoraIcon, BoxIcon, DollarSign, ImageMinus, LaughIcon, RectangleEllipsis, SearchCheck, SmileIcon, Swords, ToyBrick, UploadCloud, X } from "lucide-react";
import { iskoristPoeni, proveriPoeni } from "lib/utils";
import { UserDetailContext } from "app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";

import Image from "next/image";
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
import { ClientPageRoot } from "next/dist/client/components/client-page";
import { toast } from "sonner";
import SelectComponent from "../_components/SelectComponent";
import { duration } from "drizzle-orm/gel-core";
import { calcGeneratorDuration } from "framer-motion";
import { db } from "configs/db";
import { ImageVideo, VideoData } from "configs/schema";
import { eq } from "drizzle-orm";
import { createLanguageService } from "typescript";
import GeneratedImages from "../_components/GeneratedImages";

export default function ImageToVideo() {
    const [progressVideos, setProgressVideos] = useState(localStorage.pretvoreniVidea ? JSON.parse(localStorage.pretvoreniVidea) : []);

    const [file, setFile] = useState(null);

    const [videos, setVideos] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);


    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    // const [modifiedImage, setModifiedImage] = useState("https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/image-video%2F1762682178912.mp4?alt=media&token=e6928068-2fef-492d-b931-885276cdad76");
    const [modifiedImage, setModifiedImage] = useState();
    const [resolutions, setResolutions] = useState(["standard"
        , "pro"]);

    const [durations, setDurations] = useState([5, 10]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        resolution: "standard",
        duration: 5,
        prompt: "",
        negative_prompt: ""
    });
    const [openedResult, setOpenedResult] = useState(false);
    const [uploadedImage, setUploadedImage] = useState();
    const [currentJobId, setCurrentJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [progress, setProgress] = useState({ step: '', percentage: 0 });
    const { user } = useUser();
    const [userLocal, setUserLocal] = useState(user?.primaryEmailAddress?.emailAddress);

    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const deleteFromLocalStorageJobId = (jobid) => {
        let currentJobIdArr = getLocalStorageJobIds();
        currentJobIdArr = currentJobIdArr.filter(id => id !== jobid);
        localStorage.setItem('pretvoreniVidea', JSON.stringify(currentJobIdArr));
    }

    const getLocalStorageJobIds = () => {
        let currentJobIdArr = !!localStorage.getItem('pretvoreniVidea') ? JSON.parse(localStorage.getItem('pretvoreniVidea')) : [];
        return currentJobIdArr;
    }

    useEffect(() => {
        if (user) {
            setUserLocal(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);


    useEffect(() => {
        if (userLocal) {
            getVideos();
        }
    }, [userLocal]);

    useEffect(() => {
    }, [videos]);

    // useEffect(() => {

    //     async function citajDb() {
    //         const videoDb = await db.select().from(ImageVideo).where(eq(ImageVideo.id, 6));
    //         console.log(videoDb);
    //     }

    //     citajDb();

    // }, []);

    useEffect(() => {
        const currentJobIds = getLocalStorageJobIds();

        currentJobIds.forEach((currentJobId) => {

            if (!currentJobId) return;

            const intervalId = setInterval(async () => {
                try {
                    const res = await axios.get(`/api/video-job-status?jobId=${currentJobId}`);
                    const job = res.data;

                    const currentJobIdArr = getLocalStorageJobIds();
                    setProgressVideos(currentJobIdArr);

                    if (job.status === 'completed') {
                        clearInterval(intervalId);
                        if (typeof window !== 'undefined') {
                            deleteFromLocalStorageJobId(currentJobId);

                            // .then(async (res) => {
                            //     setLoading(false);

                            // const slednoPoeni = await iskoristPoeni({
                            //     momentalnoKrediti: userDetail.credits,
                            //     kolkuMinus: 12,
                            //     email: user.primaryEmailAddress.emailAddress
                            // });

                            // setUserDetail(prev => ({
                            //     ...prev,
                            //     "credits": slednoPoeni
                            // }));
                            console.log(job);
                            if (!!job.result) {
                                const videoDb = await db.select().from(ImageVideo).where(eq(ImageVideo.id, job.result.videoId));
                                console.log(videoDb);
                                if (videoDb.length == 1) {
                                    if (currentJobId == job.jobId) {
                                        setLoading(false);
                                        setOpenedResult(true);
                                        setModifiedImage(videoDb[0].video);

                                    }
                                } else {
                                    console.log(videoDb);
                                }
                                // citajVideoDb();
                            }
                            // }).catch(err => {
                            //     alert(err.message);
                            //     setLoading(false);
                        }
                    } else if (job.status === 'failed') {

                        toast.error(job.error || 'Video generation failed');
                        setLoading(false);
                        clearInterval(intervalId);
                        if (typeof window !== 'undefined') {
                            deleteFromLocalStorageJobId(currentJobId);
                        }
                    }
                } catch (error) {
                    deleteFromLocalStorageJobId(currentJobId);
                    console.error('Error checking job status:', error);
                }

                const newJobs = getLocalStorageJobIds();

                if (newJobs.length != progressVideos.length) {
                    console.log(newJobs)
                    console.log(progressVideos);

                    setProgressVideos(newJobs);
                    getVideos();
                }
            }, 5000);

            return () => clearInterval(intervalId);
        })
    }, [currentJobId]);

    const getVideos = async () => {
        if (!userLocal) {
            console.log('getVideos: userLocal is not set yet');
            return;
        }

        // try {
        const res = await db.select().from(ImageVideo).where(eq(ImageVideo.createdBy, userLocal));

        // console.log(res);
        setVideos(res);
        // } catch (error) {
        //     console.error('Error fetching videos:', error);
        // }
    }

    const naPromenaInput = (ime, vrednost) => {
        setFormData(prev => ({
            ...prev,
            [ime]: vrednost
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
            userId: user.id,
            email: user.primaryEmailAddress.emailAddress
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

        if (!proveriPoeni(userDetail.credits, 5)) {
            toast("Insufficient credits! Please recharge to generate a video.");
            return;
        }

        setDownloadUrl(null);
        setModifiedImage(null);
        setSelectedImage("");

        setUploading(true);
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
        accept: 'image/*',
        multiple: false,
    });

    const handleRecreate = (prompt, negative_prompt, resolution, duration, image) => {
        console.log(prompt, negative_prompt, resolution, duration)
        setFormData({
            ...formData,
            prompt,
            negative_prompt,
            resolution,
            duration
        });

        console.log(image);
        setSelectedImage(image);

        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                const promptInput = document.querySelector('input[name="prompt"]');
                if (promptInput) promptInput.focus();
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
                        <div className="flex flex-col">
                            <Image src={uploadedImage} alt="Uploaded" width={300} height={300} className="rounded-lg w-full max-w-sm" />
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

                <span className="opacity-30 text-white relative pt-4 text-sm">Or choose an existing image:</span>

                <GeneratedImages imagesList={videos} selectedImage={selectedImage} onClickImage={(image) => { setSelectedImage(image); setFile(null); setUploadedImage(null) }} />
                <div className="pt-4"></div>

                <SelectComponent defaultValue={`standard`} optionsAvailable={resolutions} className="w-full" onUserSelect={naPromenaInput} placeholder="Mode" name="resolution" description="Select the mode for your video" title="Mode | Quality" />
                <span className="opacity-30 text-white relative top-[-10px] text-sm">*Standard: 720p, Pro: 1080p</span>

                <div className="d-flex flex-column">
                    <p className='text-gray-500 dark:text-neutral-200'>Prompt:<span className="text-red-600 text-sm">(*)</span></p>
                    <Input type="text" placeholder="Prompt..." name="prompt" className={`mt-2`} value={formData.prompt} onChange={(event) => naPromenaInput("prompt", event.target.value)} />
                </div>

                <div className="d-flex flex-column">
                    <p className='text-gray-500 dark:text-neutral-200'>Negative Prompt</p>
                    <Input type="text" placeholder="Negative Prompt..." name="negative_prompt" className={`mt-2`} value={formData.negative_prompt} onChange={(event) => naPromenaInput("negative_prompt", event.target.value)} />
                </div>

                <SelectComponent defaultValue={5} optionsAvailable={durations} className="w-full" onUserSelect={naPromenaInput} placeholder="Aspect Ratio" name="duration" description="Select duration" title="Select duration (in seconds)" />

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
                        <DollarSign className='font-bold text-white' alt='Dollar' size={10} />
                    </div>
                    <span>
                        12 credits per video
                    </span>
                </div>

                <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                    <DialogContent className="w-full [&>button]:hidden max-w-lg sm:max-w-md flex flex-col">
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
                        <GeneratedVideos videoList={videos} onClickVideo={(prompt, negative_prompt, mode, duration, image) => handleRecreate(prompt, negative_prompt, mode, duration, image)} />
                    )
                }
            </div>


        </div>
    );
}