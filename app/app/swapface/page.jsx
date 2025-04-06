"use client";

import { useCallback, useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import SelectMode from "../_components/SelectMode";
import PromptInput from "../_components/PromptInput";
import { useDropzone } from "react-dropzone";
import { DollarSign, SmileIcon, UploadCloud, UploadCloudIcon, X } from "lucide-react";
import PromptImage from "../_components/PromptImage";
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
import Image from "next/image";
import CustomLoading from "../_components/CustomLoading";
import { iskoristPoeni, proveriPoeni } from "lib/utils";
import { UserDetailContext } from "app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function UpscaleImage() {
    const [file, setFile] = useState(null);
    const [swap, setSwap] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [swapUrl, setSwapUrl] = useState(null);
    const [modifiedImage, setModifiedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState();
    const [swapImage, setSwapImage] = useState();
    const [formData, setFormData] = useState([]);
    const [openedResult, setOpenedResult] = useState(false);
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const naPromenaInput = (ime, vrednost) => {
        setFormData(prev => ({
            ...prev,
            [ime]: vrednost
        }));
    }

    const generateImageFromStyle = async (imageUrl, swapImageUrl) => {
        setLoading(true);

        const data = await axios.post("/api/faceswap", {
            swapImageUrl: swapImageUrl,
            imageUrl: imageUrl

        }).then(res => {
            setOpenedResult(true);
            setLoading(false);

            const slednoPoeni = iskoristPoeni({
                momentalnoKrediti: userDetail.credits,
                kolkuMinus: 5,
                email: user.primaryEmailAddress.emailAddress
            });
            setUserDetail(prev => ({
                ...prev,
                "credits": slednoPoeni
            }));

            if (!!res.data.result) {
                setModifiedImage(res.data.result);
            }
        })
    }

    const handleDownload = async (imageUrl) => {
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

    const uploadSwapImage = async (imageUrl) => {
        if (!file) return alert("Please select a file first!");
        if (!swap) return alert("Please select a file first!");
        // setDownloadUrl(null);
        // setModifiedImage(null)
        // console.log(formData);
        // generateImageFromStyle();
        setUploading(true);
        const storageRef = ref(storage, `uploads/${swap.name}-${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, swap);

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
                // console.log(url)
                setSwapUrl(url);
                setUploading(false);

                await generateImageFromStyle(imageUrl, url);
            }
        );
    }

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first!");
        if (!swap) return alert("Please select a file first!");

        if (!proveriPoeni(userDetail.credits, 5)) {
            toast("Insufficient credits! Please recharge to generate a video.");
            return;
        }
        // setDownloadUrl(null);
        // setSwapUrl(null);
        setModifiedImage(null)
        // console.log(formData);
        // generateImageFromStyle();
        setUploading(true);
        const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
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

                await uploadSwapImage(url);
            }
        );
    };


    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setFile(file);
        naPromenaInput("image", file);
        setUploadedImage(URL.createObjectURL(file));
    }, []);

    const onDropSwap = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setSwap(file);
        naPromenaInput("swap", file);
        setSwapImage(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    });

    const { getRootProps: getSwapRootProps, getInputProps: getSwapInputProps, isDragActive: isSwapDragActive } = useDropzone({
        onDrop: onDropSwap,
        accept: 'image/*',
        multiple: false,
    });


    return (
        <div className="flex dark:bg-zinc-900 bg-white py-12 rounded-xl shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
            <h1 className="font-bold text-3xl text-primary">Swap Faces Instantly with AI</h1>
            <h2>
                Transform your images with seamless AI-powered face swapping. Upload your photo and let AI create a natural, high-quality swap in just seconds.
            </h2>


            <div className="grid grid-cols-2 gap-12">
                <div className="flex flex-col gap-2">
                    <h2 className='font-bold border-top border-neutral-200 border-t-1 pt-4 text-xl text-primary'>{`Upload your image`}</h2>
                    <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl bg-gray-100 dark:bg-zinc-950 cursor-pointer hover:border-gray-400" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {uploadedImage ? (
                            <div className="flex flex-col">
                                <Image src={uploadedImage} alt="Uploaded" width={300} height={300} className="rounded-lg w-full max-w-sm" />
                                <div className="flex text-primary mt-4 gap-x-2 items-center justify-center font-bold">
                                    <UploadCloudIcon size={22} />
                                    <span>Or choose another image...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full flex-col items-center text-center text-gray-500 py-12 dark:text-gray-300">
                                <UploadCloudIcon size={48} className="mb-2" />
                                {isDragActive ? (
                                    <p>Drop the image here...</p>
                                ) : (
                                    <p>Drag & drop an image here, or click to select</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className='font-bold border-top border-neutral-200 border-t-1 pt-4 text-xl text-primary'>{`Upload Swap Image`}</h2>
                    <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl bg-gray-100 dark:bg-zinc-950 cursor-pointer hover:border-gray-400" {...getSwapRootProps()}>
                        <input {...getSwapInputProps()} />
                        {swapImage ? (
                            <div className="flex flex-col">
                                <Image src={swapImage} alt="Uploaded" width={300} height={300} className="rounded-lg w-full max-w-sm" />
                                <div className="flex text-primary mt-4 gap-x-2 items-center justify-center font-bold">
                                    <SmileIcon size={22} />
                                    <span>Or choose another image...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full flex-col items-center text-center text-gray-500 py-12 dark:text-gray-300">
                                <SmileIcon size={48} className="mb-2" />
                                {isSwapDragActive ? (
                                    <p>Drop the image here...</p>
                                ) : (
                                    <p>Drag & drop an image here, or click to select</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <Button className={`py-6 cursor-pointer dark:text-white`} onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Swap face"}
            </Button>

            {modifiedImage && (
                <Button className={`py-2 border-bottom dark:hover:bg-neutral-800 border-2 border-primary text-md border-none hover:bg-neutral-100 h bg-transparent text-primary cursor-pointer`} onClick={() => setOpenedResult(true)}>
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

            <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full [&>button]:hidden max-w-7xl sm:max-w-4xl flex flex-col">
                    <DialogHeader>
                        <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
                        <DialogDescription className={`text-md`}>
                            Your face swap is complete! ✨ Experience a seamless and realistic transformation powered by AI.
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
                                    <img className="w-full max-h-[400px] object-cover rounded-md" src={downloadUrl} alt="" />
                                </div>
                            )
                        }
                        {
                            modifiedImage && (
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl text-primary text-center mb-4">Result:</span>
                                    <img className="w-full bg-gray-50 max-h-[400px] object-cover rounded-md" src={modifiedImage} alt="" />

                                    <Button className={`py-6 mt-5 cursor-pointer dark:text-white`} onClick={() => handleDownload(modifiedImage)}>Download Image</Button>
                                </div>
                            )
                        }
                    </div>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CustomLoading title="Generating your image..." loading={loading} />
        </div>
    );
}