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
    const [text, setText] = useState(null);
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

    const zemiFajlImeFirebase = (url) => {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname; 
        const encodedFilePath = path.split("/o/")[1];
        const decodedFilePath = decodeURIComponent(encodedFilePath);
        const fileName = decodedFilePath.split("/").pop()
        return fileName;

    }

    const handleDownload = async (imageUrl) => {
        try {
            const response = await axios.get(imageUrl, { responseType: "blob" });

            // Create an object URL for the blob
            const url = window.URL.createObjectURL(response.data);

            // Create a link element
            const a = document.createElement("a");
            a.href = url;

            console.log(zemiFajlImeFirebase(modifiedImage));
            a.download = zemiFajlImeFirebase(modifiedImage);
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Revoke the object URL to free up resources
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const generateImage = async () => {
        setUploading(true);

        const data = await axios.post("/api/generateimage-hug", {
            prompt: text
        }).then(res => {
            setOpenedResult(true);
            setLoading(false);

            const slednoPoeni = iskoristPoeni({
                momentalnoKrediti: userDetail.credits,
                kolkuMinus: 2,
                email: user.primaryEmailAddress.emailAddress
            });
            setUserDetail(prev => ({
                ...prev,
                "credits": slednoPoeni
            }));

            if (!!res.data.result) {
                setModifiedImage(res.data.result);
                setUploading(false);
                setLoading(false)
            }
        })
    }

    const handleUpload = async () => {
        if (text.trim() == '') return alert("Please select a file first!");

        if (!proveriPoeni(userDetail.credits, 3)) {
            toast("Insufficient credits! Please recharge to generate a video.");
            return;
        }

        setModifiedImage(null)
        setUploading(true);
        await generateImage();
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
            <h1 className="font-bold text-3xl text-primary">HuggingFace AI Test</h1>
            <h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos numquam veritatis doloremque!
            </h2>

            <div className="flex flex-col gap-4">
                <Input value={text} onChange={(e) => { setText(e.target.value) }} placeholder={`Enter your text`} />
            </div>

            <Button className={`py-6 cursor-pointer dark:text-white`} onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Generate an image"}
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
                    1 credit per translation
                </span>
            </div>

            <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full [&>button]:hidden max-w-7xl sm:max-w-xl flex flex-col">
                    <DialogHeader>
                        <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
                        <DialogDescription className={`text-md`}>
                            Your image has been successfully generated! ✨ Experience a seamless and realistic transformation powered by AI.
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