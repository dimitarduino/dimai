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
        // console.log(ime, vrednost);
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

    const handleDownload = async (audioUrl) => {
        try {
            const response = await axios.get(audioUrl, { responseType: "blob" });

            // Create an object URL for the blob
            const url = window.URL.createObjectURL(response.data);

            // Create a link element
            const a = document.createElement("a");
            a.href = url;
            a.download = "downloaded-audio.wav"; // Default filename (change extension as needed)

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Revoke the object URL to free up resources
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const proveriDaliETekst = () => {
        return (formData?.task == tipovi[1] || formData?.task == tipovi[2])
    }

    const generateSpeech = async (audioFileUrl = ``) => {
        setLoading(true);

        const data = await axios.post("/api/speech-text", {
            audioFileUrl: audioFileUrl,
            ...formData
        }).then(res => {
            setLoading(false);
            if (!!res.data.result) {
                let audio = res.data.result.audio_output
                let text = res.data.result.text_output

                setUploading(false)
                setResultAudio(audio);
                setResultText(text);
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
            const storageRef = ref(storage, `speech/${file.name}-${Date.now()}`);
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

                    generateSpeech(url);
                }
            );
        } else {
            generateSpeech();
        }
    };

    return (
        <div className="flex max-w-3xl mx-auto border border-gray-3-50 rounded-md py-10 flex-col items-center space-y-4 p-4">
            <SelectComponent optionsAvailable={tipovi} className="w-full" onUserSelect={naPromenaInput} placeholder="Type" name="task" description="What do you want?" title="Task Name" />


            <SelectComponent optionsAvailable={languages} className="w-full" onUserSelect={naPromenaInput} placeholder="Language" name="language" description="Input language?" title="Language of your input" />


            {(proveriDaliETekst()) && (
                <PromptInput onUserSelect={naPromenaInput} title={`Prompt`} description={`Text`} />
            )}

            {(!proveriDaliETekst()) && (
                <PromptImage accept="audio/*" name={`audio`} handleFileChange={handleFileChange} onUserSelect={naPromenaInput} title={`Upload your audio file`} description={`Audio`} />
            )}

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
                            <audio controls>
                                <source src={downloadUrl} type="audio/mpeg" />
                            </audio>
                        </div>
                    )
                }
                {
                    (resultText || resultAudio) && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">Result:</span>
                            {resultAudio && (
                                <audio controls>
                                    <source src={resultAudio} type="audio/mpeg" />
                                </audio>
                            )}


                            {resultText && (
                                <p className="font-bold text-3xl">"{resultText}"</p>
                            )}

                            <Button className={`py-6 mt-5`} onClick={() => handleDownload(resultAudio)}>Download file</Button>
                        </div>
                    )
                }
                {
                    (loading && downloadUrl) && (
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