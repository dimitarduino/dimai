"use client";

import { useCallback, useContext, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { DollarSign, ImageMinus, LaughIcon, SearchCheck, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { iskoristPoeni, proveriPoeni } from "lib/utils";
import { UserDetailContext } from "app/_context/UserDetailContext";
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
import { Label } from "@/components/ui/label"
import CustomLoading from "../_components/CustomLoading";
import { toast } from "sonner";

export default function UploadImage() {
    const [file, setFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState();
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [removedUrl, setRemovedUrl] = useState(null);
    const [removing, setRemoving] = useState(false);
    const [openedResult, setOpenedResult] = useState(false);
    const [loading, setLoading] = useState();
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);


    const removeBackgroundImage = async (imageUrl) => {
        setRemoving(true);

        const data = await axios.post("/api/remove-bg", {
            imageUrl
        }).then(async (res) => {
            const slednoPoeni = await iskoristPoeni({
                momentalnoKrediti: userDetail.credits,
                kolkuMinus: 5,
                email: user.primaryEmailAddress.emailAddress
            })
            setUserDetail(prev => ({
                ...prev,
                "credits": slednoPoeni
            }));
            setRemoving(false);
            if (!!res.data.result) {
                setRemovedUrl(res.data.result);
                setOpenedResult(true);
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
            a.download = "downloaded-image.png";
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
                // setOpenedResult(true);
                setDownloadUrl(url);
                setUploading(false);

                await removeBackgroundImage(url);
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
            <div className="flex dark:bg-zinc-900 bg-white py-12 rounded-xl shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Remove Backgrounds with AI Precision</h1>
                <h2>
                    Effortlessly remove backgrounds from any image with AI-powered accuracy. Upload or generate an image and get a clean, high-quality cutout in seconds.
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
                    {loading ? "Please wait..." : "Remove background"}
                </Button>

                {true && (
                    <Button className={`py-2 border-bottom border-2 border-primary text-md border-none dark:hover:bg-neutral-800 hover:bg-neutral-100 h bg-transparent text-primary cursor-pointer`} onClick={() => setOpenedResult(true)}>
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

                <p>Our AI-powered background remover ensures clean and precise cutouts, making your images look professional in seconds. For best results, use high-quality images with clear subject-background contrast.
                </p>

                <div className="grid grid-cols-3 gap-10 items-start">
                    <p className="flex items-center dark:bg-neutral-800 flex-col items-center justify-center bg-neutral-50 rounded-md py-10 px-6 text-center  gap-x-4">
                        <SearchCheck className="text-primary mb-2" size={40} />
                        <span className="text-primary font-bold">
                            Instant & Automatic Removal
                        </span>
                    </p>
                    <p className="flex items-center dark:bg-neutral-800 flex-col items-center justify-center bg-neutral-50 rounded-md py-10 px-6 text-center  gap-x-4">
                        <LaughIcon className="text-primary mb-2" size={40} />
                        <span className="text-primary font-bold">
                            Preserve Fine Details (like hair & edges)
                        </span>
                    </p>

                    <p className="flex items-center dark:bg-neutral-800 flex-col items-center justify-center bg-neutral-50 rounded-md py-10 px-6 text-center  gap-x-4">
                        <ImageMinus className="text-primary mb-2" size={40} />
                        <span className="text-primary font-bold">
                            Download in High Resolution <br />
                        </span>
                    </p>
                </div>

                <h3 className="text-bold font-bold text-center">
                    Need a transparent PNG or a new background? Our AI has you covered! 🚀
                </h3>

            </div>

            <CustomLoading title="Removing background..." loading={loading} />

            <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full [&>button]:hidden max-w-7xl sm:max-w-4xl flex flex-col">
                    <DialogHeader>
                        <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
                        <DialogDescription className={`text-md`}>
                            Your image has been successfully processed! ✨ <br />The background is now removed, leaving you with a clean, high-quality cutout.
                        </DialogDescription>

                        <DialogClose asChild>
                            <button
                                className="text-gray-500 absolute right-5 top-5 hover:text-gray-700 transition duration-200 cursor-pointer"
                            >
                                <X size={24} />
                            </button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="grid py-4 grid-cols-2 w-full gap-12">
                        {
                            !!downloadUrl && (
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl text-center text-primary mb-4">Your image:</span>
                                    <img className="w-full max-h-[400px] object-cover rounded-md " src={downloadUrl} alt="" />
                                </div>
                            )
                        }
                        {
                            removedUrl && (
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl text-primary text-center mb-4">Removed Background:</span>
                                    <img className="w-full bg-gray-50 max-h-[400px] object-cover rounded-md" src={removedUrl} alt="" />

                                    <Button className={`py-6 mt-5 cursor-pointer dark:text-white`} onClick={() => handleDownload(removedUrl)}>Download Image</Button>
                                </div>
                            )
                        }
                        {
                            removing && (
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl text-primary text-center mb-4">Please wait...</span>
                                    <div className="w-full h-[400px] object-cover bg-green-50 rounded-md h-[400px] flex items-center text-primary font-bold text-2xl justify-center">Removing background...</div>
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