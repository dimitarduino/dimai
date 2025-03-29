"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import SelectMode from "../_components/SelectMode";
import PromptInput from "../_components/PromptInput";
import PromptImage from "../_components/PromptImage";
import SelectComponent from "../_components/SelectComponent";
import { CloudFog } from "lucide-react";

export default function UpscaleImage() {
    const [file, setFile] = useState(null);
    const [audioInput, setAudioInput] = useState();
    const [resultVideo, setResultVideo] = useState();
    const [resultText, setResultText] = useState();
    const [resultAudio, setResultAudio] = useState();
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [modifiedImage, setModifiedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState([]);
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
        console.log(ime, vrednost);
        setFormData(prev => ({
            ...prev,
            [ime]: vrednost
        }));
    }

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

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
        console.log(audioUrl);
        console.log(videoUrl);

        const data = await axios.post(`/api/dub-video`, {
            videoUrl: videoUrl,
            dubbedAudioUrl: audioUrl
        }).then(res => {
            console.log(res.data);
            if (!!res.data.result) {
                setResultVideo(res.data.result);
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
        }).then(res => {
            // setLoading(false);

            if (!!res.data.audioUrl) {
                setAudioInput(res.data.audioUrl);

                translateAudio(res.data.audioUrl, videoUrl);
            }
        })
    }

    const handleUpload = async () => {
        if (!file && !proveriDaliETekst()) return alert("Please select a file first!");
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
                    console.log(`Upload is ${progress}% done`);
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

    return (
        <div className="flex max-w-3xl mx-auto border border-gray-3-50 rounded-md py-10 flex-col items-center space-y-4 p-4">
            <PromptImage accept="video/*" name={`video`} handleFileChange={handleFileChange} onUserSelect={naPromenaInput} title={`Upload your video file`} description={`Video`} />



            <div className="border border-3 border-primary w-full"></div>
            <SelectComponent optionsAvailable={languagesSpeak} className="w-full" onUserSelect={naPromenaInput} placeholder="Target Language Audio" name="targetLanguageAudio" description="Target Language Audio" title="Language of your target" />


            <Button className={`w-full py-6 text-xl cursor-pointer`} onClick={handleUpload} disabled={uploading}>
                {uploading ? "Generating..." : "Generate"}
            </Button>
            <div className="grid grid-cols-2 w-full gap-24">
                {
                    !!downloadUrl && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">Uploaded audio:</span>
                            <video controls>
                                <source src={downloadUrl} type="video/mp4" />
                            </video>
                        </div>
                    )
                }
                {
                    (resultText || resultVideo) && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">Result:</span>
                            {resultVideo && (
                                <video controls>
                                    <source src={resultVideo} type="video/mp4" />
                                </video>
                            )}


                            {resultText && (
                                <p className="font-bold text-3xl">"{resultText}"</p>
                            )}

                            <Button className={`py-6 mt-5`} onClick={() => handleDownload(resultVideo)}>Download file</Button>
                        </div>
                    )
                }
                {
                    (loading && downloadUrl && !resultVideo) && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">Please wait...</span>
                            <div className="w-full h-[400px] object-cover bg-blue-50 rounded-md h-[400px] flex items-center text-primary font-bold text-2xl justify-center">loading...</div>
                        </div>
                    )
                }

            </div>
        </div>
    );
}