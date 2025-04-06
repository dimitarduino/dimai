"use client";

import { useState, useCallback, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import SelectMode from "../_components/SelectMode";
import PromptInput from "../_components/PromptInput";
import { useDropzone } from 'react-dropzone';
import PromptImage from "../_components/PromptImage";
import SelectComponent from "../_components/SelectComponent";
import { CloudFog, DollarSign, UploadCloud, X } from "lucide-react";
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
import { iskoristPoeni, proveriPoeni } from "lib/utils";
import { UserDetailContext } from "app/_context/UserDetailContext";
import CustomLoading from "../_components/CustomLoading";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function DubbedVideo() {
    const [file, setFile] = useState(null);
    const [audioInput, setAudioInput] = useState();
    const [resultVideo, setResultVideo] = useState();
    const [resultText, setResultText] = useState();
    const [resultAudio, setResultAudio] = useState();
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [modifiedImage, setModifiedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        targetLanguageAudio: "Spanish"
    });
    const [openedResult, setOpenedResult] = useState(false);
    const [uploadedImage, setUploadedImage] = useState();
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const languages = ["None", "Afrikaans", "Amharic", "Armenian", "Assamese", "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian",
        "Burmese", "Cantonese", "Catalan", "Cebuano", "Central Kurdish", "Croatian", "Czech", "Danish", "Dutch",
        "Egyptian Arabic", "English", "Estonian", "Finnish", "French", "Galician", "Ganda", "Georgian", "German",
        "Greek", "Gujarati", "Halh Mongolian", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Igbo", "Indonesian",
        "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Korean", "Kyrgyz", "Lao",
        "Lithuanian", "Luo", "Macedonian", "Maithili", "Malayalam", "Maltese", "Mandarin Chinese", "Marathi",
        "Meitei", "Modern Standard Arabic", "Moroccan Arabic", "Nepali", "North Azerbaijani", "Northern Uzbek",
        "Norwegian Bokmål", "Norwegian Nynorsk", "Nyanja", "Odia", "Polish", "Portuguese", "Punjabi", "Romanian",
        "Russian", "Serbian", "Shona", "Sindhi", "Slovak", "Slovenian", "Somali", "Southern Pashto", "Spanish",
        "Standard Latvian", "Standard Malay", "Swahili", "Swedish", "Tagalog", "Tajik", "Tamil", "Telugu", "Thai",
        "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Welsh", "West Central Oromo", "Western Persian", "Yoruba", "Zulu"];

    const tipovi = ['S2ST (Speech to Speech translation)', 'T2ST (Text to Speech translation)', 'T2TT (Text to Text translation)', 'ASR (Automatic Speech Recognition)'];

    const languagesSpeak = [
        "Bengali", "Catalan", "Czech", "Danish", "Dutch", "English", "Estonian", "Finnish", "French", "German",
        "Hindi", "Indonesian", "Italian", "Japanese", "Korean", "Maltese", "Mandarin Chinese", "Modern Standard Arabic",
        "Northern Uzbek", "Polish", "Portuguese", "Romanian", "Russian", "Slovak", "Spanish", "Swahili", "Swedish",
        "Tagalog", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Welsh", "Western Persian"
    ];

    const naPromenaInput = (ime, vrednost) => {
        // console.log(ime, vrednost);
        setFormData(prev => ({
            ...prev,
            [ime]: vrednost
        }));
    }

    const handleDownload = async (videoUrl) => {
        try {
            const response = await axios.get(videoUrl, { responseType: "blob" });

            const url = window.URL.createObjectURL(response.data);

            const a = document.createElement("a");
            a.href = url;
            a.download = "downloaded-video.mp4";

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Video download error:", error);
        }
    };

    const proveriDaliETekst = () => {
        return false;
    }

    const generateDubbedVideo = async (audioUrl, videoUrl) => {
        const data = await axios.post(`/api/dub-video`, {
            videoUrl: videoUrl,
            dubbedAudioUrl: audioUrl
        }).then(res => {

            if (!!res.data.result) {
                setResultVideo(res.data.result);
                setOpenedResult(true);
                setUploading(false)
                setLoading(false);
            }
        });
    }

    const translateAudio = async (audioSource, videoUrl) => {
        const data = await axios.post("/api/speech-text", {
            audioFileUrl: audioSource,
            task: `S2ST (Speech to Speech translation)`,
            targetLanguageAudio: formData?.targetLanguageAudio
        }).then(res => {
            // console.log(res.data);
            if (!!res.data.result.audio_output) {
                setResultAudio(res.data.result.audio_output);
                generateDubbedVideo(res.data.result.audio_output, videoUrl);
            }
        })
    }

    const makeDubVideo = async (videoUrl = ``) => {
        setLoading(true);

        const data = await axios.post("/api/extract-audio", {
            videoUrl: videoUrl,
            ...formData
        }).then(async (res) => {
            const slednoPoeni = await iskoristPoeni({
                momentalnoKrediti: userDetail.credits,
                kolkuMinus: 20,
                email: user.primaryEmailAddress.emailAddress
            });

            setUserDetail(prev => ({
                ...prev,
                "credits": slednoPoeni
            }));

            if (!!res.data.audioUrl) {
                setAudioInput(res.data.audioUrl);

                translateAudio(res.data.audioUrl, videoUrl);
            }
        })
    }

    const handleUpload = async () => {
        if (!file && !proveriDaliETekst()) return alert("Please select a file first!");

        if (!proveriPoeni(userDetail.credits, 20)) {
            toast("Insufficient credits! Please recharge to generate a video.");
            return;
        }

        setDownloadUrl(null);
        setUploading(true);
        setResultAudio(null);
        setResultText(null);


        if (proveriDaliETekst() == false) {
            const storageRef = ref(storage, `videos/${Date.now()}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    setUploading(false);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setDownloadUrl(url);

                    makeDubVideo(url);
                }
            );
        } else {
            makeDubVideo();
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        setUploadedImage(null);
        const fileAttached = acceptedFiles[0];
        setFile(fileAttached);;

        setUploadedImage(URL.createObjectURL(fileAttached));

        setResultVideo(null);
        setResultAudio(null);
        setResultText(null);
        setDownloadUrl(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'video/*',
        multiple: false,
    });

    return (
        <div className="w-full flex">
            <div className="flex dark:bg-neutral-900 bg-white py-12 rounded-xl shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Bring Your Videos to Life with AI Dubbing</h1>
                <h2>
                    Effortlessly dub your videos into multiple languages with AI-powered voiceovers. Upload your video and get a natural, high-quality dubbed version in seconds.
                </h2>

                <h2 className='font-bold text-xl text-primary pb-0 mb-0'>{`Upload your video`}</h2>
                <p className='text-gray-500 pb-0 mb-0'>{`Upload your video and get a natural, high-quality dubbed version in seconds.`}</p>
                <div className="flex dark:bg-neutral-950 flex-col items-center mt-2 justify-center w-full p-6 border-2 border-dashed rounded-xl bg-gray-100 dark:bg-gray-800 cursor-pointer hover:border-gray-400" {...getRootProps()} key={file?.name}>
                    <input {...getInputProps()} key={file?.name || -1} />
                    {uploadedImage ? (
                        <div key={1} className="flex flex-col">
                            <video controls>
                                <source src={uploadedImage} type="video/mp4" />
                            </video>

                            <div className="flex text-primary mt-4 gap-x-2 items-center justify-center font-bold">
                                <UploadCloud size={22} />
                                <span>Or choose another video...</span>
                            </div>

                        </div>
                    ) : (
                        <div key={2} className="flex w-full flex-col items-center text-center text-gray-500 py-12 dark:text-gray-300">
                            <UploadCloud size={48} className="mb-2" />
                            {isDragActive ? (
                                <p>Drop the video here...</p>
                            ) : (
                                <p>Drag & drop an video here, or click to select</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="border border-3 border-primary w-full"></div>
                <SelectComponent defaultValue="Spanish" optionsAvailable={languagesSpeak} className="w-full" onUserSelect={naPromenaInput} placeholder="Choose Dubbing Language" name="targetLanguageAudio" description="Select the language for your video dubbing" title="Choose Dubbing Language" />


                <Button className={`w-full py-6 text-xl cursor-pointer dark:text-white`} onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Generate"}
                </Button>

                {resultVideo && (
                    <Button className={`py-2 border-bottom dark:hover:bg-neutral-800 border-2 border-primary text-md border-none hover:bg-neutral-100 h bg-transparent text-primary cursor-pointer`} onClick={() => setOpenedResult(true)}>
                        See your result
                    </Button>
                )}

                <div className="text-primary gap-2 font-bold flex items-center justify-center">
                    <div className="bg-primary p-1 rounded-full">
                        <DollarSign className='font-bold text-white' alt='Dollar' size={10} />
                    </div>
                    <span>
                        20 credits per video
                    </span>
                </div>

                <CustomLoading title="Generating your video..." loading={loading} />

                <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                    <DialogContent className="w-full [&>button]:hidden max-w-7xl sm:max-w-4xl flex flex-col">
                        <DialogHeader>
                            <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
                            <DialogDescription className={`text-md`}>
                                Your video has been dubbed! ✨ <br /> the seamless voiceover with accurate translations and AI-powered precision.
                            </DialogDescription>

                            <DialogClose asChild>
                                <button
                                    className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            </DialogClose>
                        </DialogHeader>
                        <div className="grid pb-2 grid-cols-1 w-full gap-12">
                            {
                                resultVideo && (
                                    <div className="flex flex-col">
                                        <video controls className="rounded-md">
                                            <source src={resultVideo} type="video/mp4" />
                                        </video>


                                        <Button className={`py-6 mt-5 cursor-pointer dark:text-white`} onClick={() => handleDownload(resultVideo)}>Download Video</Button>
                                    </div>
                                )
                            }
                        </div>
                        <DialogFooter>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}