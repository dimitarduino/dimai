"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";

export default function UploadImage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [removedUrl, setRemovedUrl] = useState(null);
    const [removing, setRemoving] = useState(false);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const removeBackgroundImage = async (imageUrl) => {
        setRemoving(true);
        // console.log(imageUrl);
        const data = await axios.post("/api/remove-bg", {
            imageUrl
        }).then(res => {
            setRemoving(false);
            // console.log(res);
            if (!!res.data.result) {
                setRemovedUrl(res.data.result);
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

        // removeBackgroundImage();
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

                await removeBackgroundImage(url);
            }
        );
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!file || uploading}>
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
                    removedUrl && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">After:</span>
                            <img className="w-full bg-gray-50 max-h-[400px] object-cover rounded-md" src={removedUrl} alt="" />

                            <Button className={`py-6 mt-5`} onClick={() => handleDownload(removedUrl)}>Download Image</Button>
                        </div>
                    )
                }
                {
                    removing && (
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl text-primary mb-4">After:</span>
                            <div className="w-full h-[400px] object-cover bg-blue-50 rounded-md h-[400px] flex items-center text-primary font-bold text-2xl justify-center">Removing background...</div>
                        </div>
                    )
                }

            </div>
        </div>
    );
}