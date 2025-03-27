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

export default function UpscaleImage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [modifiedImage, setModifiedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState([]);


    const naPromenaInput = (ime, vrednost) => {
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

    const generateImageFromStyle = async (imageUrl) => {
        setLoading(true);
        console.log(formData);
        console.log(imageUrl);
        // console.log(imageUrl);
        const data = await axios.post("/api/imagemod", {
            imageUrl: imageUrl,
            prompt: formData.text,
            style: formData.style

        }).then(res => {
            setLoading(false);
            // console.log(res);
            if (!!res.data.result) {
                setModifiedImage(res.data.result);
            }
        })
    }

    const handleDownload = async (imageUrl) => {
        console.log(imageUrl);
        try {
            const response = await axios.get(imageUrl, { responseType: "blob" });

            // Create an object URL for the blob
            const url = window.URL.createObjectURL(response.data);

            // Create a link element
            const a = document.createElement("a");
            a.href = url;
            a.download = "downloaded-image.jpg"; // Set the filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Revoke the object URL to free up resources
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first!");
        setDownloadUrl(null);
        setModifiedImage(null)
        console.log(formData);
        generateImageFromStyle();
        setUploading(true);
        const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
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
                console.log(url)
                setDownloadUrl(url);
                setUploading(false);

                await generateImageFromStyle(url);
            }
        );
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <SelectMode className="w-full" onUserSelect={naPromenaInput} />

            <PromptImage name={`image`} handleFileChange={handleFileChange} onUserSelect={naPromenaInput} title={`Upload your image`} description={`Image`} />
            <PromptInput onUserSelect={naPromenaInput} title={`Caption`} description={`caption`} />
           
            <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
            </Button>
            <div className="grid grid-cols-2 w-full gap-24 mt-24">
                {
                    !!downloadUrl && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">Before:</span>
                            <img className="w-full max-h-[400px] object-cover rounded-md" src={downloadUrl} alt="" />
                        </div>
                    )
                }
                {
                    modifiedImage && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">After:</span>
                            <img className="w-full bg-gray-50 max-h-[400px] object-cover rounded-md" src={modifiedImage} alt="" />

                            <Button className={`py-6 mt-5`} onClick={() => handleDownload(modifiedImage)}>Download Image</Button>
                        </div>
                    )
                }
                {
                    (loading && downloadUrl) && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">After:</span>
                            <div className="w-full h-[400px] object-cover bg-blue-50 rounded-md h-[400px] flex items-center text-primary font-bold text-2xl justify-center">loading...</div>
                        </div>
                    )
                }

            </div>
        </div>
    );
}