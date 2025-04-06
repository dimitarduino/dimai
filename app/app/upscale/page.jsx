"use client";

import { useCallback, useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageComparison from '../_components/CompareImages'
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DollarSign, UploadCloud, X } from "lucide-react";
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
import { iskoristPoeni, proveriPoeni } from "lib/utils";
import { UserDetailContext } from "app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";

export default function UpscaleImage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState();
    const [upscaleUrl, setUpscaled] = useState();
    const [scaling, setScaling] = useState(false);
    const [uploadedImage, setUploadedImage] = useState();
    const [loading, setLoading] = useState();
    const [openedResult, setOpenedResult] = useState(false);
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);


    const upscaleImage = async (imageUrl) => {
        setScaling(true);
        const data = await axios.post("/api/upscaler", {
            imageUrl
        }).then(async (res) => {
            const slednoPoeni = await iskoristPoeni({
                momentalnoKrediti: userDetail.credits,
                kolkuMinus: 5,
                email: user.primaryEmailAddress.emailAddress
            });

            setUserDetail(prev => ({
                ...prev,
                "credits": slednoPoeni
            }));
            setScaling(false);
            if (!!res.data.result) {
                setUpscaled(res.data.result);
                setOpenedResult(true);
                setUploading(false)
                setLoading(false)
            }
        })
    }

    const handleDownload = async (imageUrl) => {
        try {
            const response = await axios.get(imageUrl, { responseType: "blob" });

            const url = window.URL.createObjectURL(response.data);

            const a = document.createElement("a");
            a.href = url;
            a.download = "downloaded-image.jpg";
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

        setLoading(true);
        setDownloadUrl(null);
        setOpenedResult(false);
        setUpscaled(null);
        setUploading(true);
        const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                setUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);

                setDownloadUrl(url);
                // setOpenedResult(true);
                setUploading(false);

                await upscaleImage(url);
            }
        );
    };


    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setFile(file);
        setUploadedImage(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    });


    return (
        <div className="w-full flex">

            <div className="flex bg-white dark:bg-zinc-900 py-12 rounded-xl shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Enhance Your Images with AI Upscaling</h1>
                <h2>
                    Boost the resolution and quality of your images effortlessly using AI technology. Upload an image to enhance its clarity and details for a sharper, high-resolution result in seconds.
                </h2>

                <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl bg-gray-100 dark:bg-zinc-950 cursor-pointer hover:border-gray-400" {...getRootProps()}>
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
                <Button className={`py-6 text-md dark:text-white cursor-pointer`} onClick={handleUpload} disabled={!file || loading}>
                    {loading ? "Please wait..." : "Upscale image"}
                </Button>

                {upscaleUrl && (
                    <Button className={`py-2 border-bottom border-2 border-primary text-md border-none hover:bg-neutral-100 dark:hover:bg-neutral-700 bg-transparent text-primary cursor-pointer`} onClick={() => setOpenedResult(true)}>
                        See your result
                    </Button>
                )}

                <div className="text-primary gap-2 font-bold flex items-center justify-center">
                    <div className="bg-primary p-1 rounded-full">
                        <DollarSign className='font-bold text-white' alt='Dollar' size={10} />
                    </div>
                    <span>
                        5 credits per image
                    </span>
                </div>
            </div>

            <CustomLoading title="Upscaling your image..." loading={loading} />

            <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full [&>button]:hidden max-w-2xl sm:max-w-2xl flex flex-col">
                    <DialogHeader>

                        <DialogTitle className={`font-bold text-3xl text-primary`}>{(scaling && !upscaleUrl) ? `Upscaling your image...` : `Your result!`}</DialogTitle>
                        <DialogDescription className={`text-md`}>
                            {(scaling && !upscaleUrl) ? "" : `Your image has been successfully processed! ✨`}
                            <br />
                            {(scaling && !upscaleUrl) ? `` : `The background is now removed, leaving you with a clean, high-quality cutout.`}
                        </DialogDescription>

                        <DialogClose asChild>
                            <button
                                className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer"
                            >
                                <X size={24} />
                            </button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid grid-cols-1 w-full gap-12">
                        {
                            (downloadUrl && upscaleUrl) && (
                                <div className="flex flex-col">
                                    <ImageComparison originalSrc={downloadUrl} upscaledSrc={upscaleUrl} />
                                    <Button className={`py-6 mt-5 cursor-pointer  dark:text-white`} onClick={() => handleDownload(upscaleUrl)}>Download Image</Button>

                                </div>
                            )
                        }
                    </div>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}