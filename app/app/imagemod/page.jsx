"use client";

import { useState, useContext, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import SelectMode from "../_components/SelectMode";
import PromptInput from "../_components/PromptInput";
import PromptImage from "../_components/PromptImage";
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

export default function ImageToImage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [modifiedImage, setModifiedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        style: "3D"
    });
    const [openedResult, setOpenedResult] = useState(false);
    const [uploadedImage, setUploadedImage] = useState();
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);


    const naPromenaInput = (ime, vrednost) => {
        setFormData(prev => ({
            ...prev,
            [ime]: vrednost
        }));
    }

    const generateImageFromStyle = async (imageUrl) => {
        setLoading(true);

        const data = await axios.post("/api/imagemod", {
            imageUrl: imageUrl,
            prompt: formData.text,
            style: formData.style

        }).then(async (res) => {
            setLoading(false);

            const slednoPoeni = await iskoristPoeni({
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
                setOpenedResult(true);
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

        setDownloadUrl(null);
        setModifiedImage(null)

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
                // console.log(url)
                setDownloadUrl(url);
                setUploading(false);

                await generateImageFromStyle(url);
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

    const options = ["3D", "Emoji", "Video game", "Pixels", "Clay", "Toy"];

    const promeniInput = id => {
        naPromenaInput("style", options[id]);
    }

    return (
        <div className="w-full flex">
            <div className="flex bg-white dark:bg-zinc-900 py-12 rounded-xl shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Transform Images into Unique Styles with AI</h1>
                <h2>
                    Convert your images into emojis, 3D models, pixel art, clay figures, video game characters, and toy designs with AI. Upload an image and watch it transform instantly.
                </h2>

                <h2 className='font-bold text-xl text-primary mt-4 mb-2'>{`Select an Image Style:`}</h2>
                <div className="grid grid-cols-6 gap-x-6">
                    <div onClick={() => promeniInput(0)} className={`style-item cursor-pointer flex text-primary flex-col hover:bg-green-50 dark:hover:bg-zinc-700 rounded-md border border-1 border-gray-100 dark:border-zinc-800 py-5 px-2 items-center ${formData?.style == options[0] ? `bg-primary text-white hover:bg-primary` : ``}`}>
                        <BoxIcon size={33} className="" />
                        <span className="font-bold mt-1 text-center text-sm">3D Character</span>
                    </div>
                    <div onClick={() => promeniInput(1)} className={`style-item cursor-pointer flex text-primary flex-col hover:bg-green-50 dark:hover:bg-zinc-700 rounded-md border border-1 border-gray-100 dark:border-zinc-800 py-5 px-2 items-center ${formData?.style == options[1] ? `bg-primary text-white hover:bg-primary` : ``}`}>
                        <SmileIcon size={33} className="" />
                        <span className="font-bold mt-1 text-center text-sm">Emoji</span>
                    </div>
                    <div onClick={() => promeniInput(2)} className={`style-item cursor-pointer flex text-primary flex-col hover:bg-green-50 dark:hover:bg-zinc-700 rounded-md border border-1 border-gray-100 dark:border-zinc-800 py-5 px-2 items-center ${formData?.style == options[2] ? `bg-primary text-white hover:bg-primary` : ``}`}>
                        <Swords size={33} className="" />
                        <span className="font-bold mt-1 text-center text-sm">Video Game</span>
                    </div>
                    <div onClick={() => promeniInput(3)} className={`style-item cursor-pointer flex text-primary flex-col hover:bg-green-50 dark:hover:bg-zinc-700 rounded-md border border-1 border-gray-100 dark:border-zinc-800 py-5 px-2 items-center ${formData?.style == options[3] ? `bg-primary text-white hover:bg-primary` : ``}`}>
                        <RectangleEllipsis size={33} className="" />
                        <span className="font-bold mt-1 text-center text-sm">Pixels</span>
                    </div>
                    <div onClick={() => promeniInput(4)} className={`style-item cursor-pointer flex text-primary flex-col hover:bg-green-50 dark:hover:bg-zinc-700 rounded-md border border-1 border-gray-100 dark:border-zinc-800 py-5 px-2 items-center ${formData?.style == options[4] ? `bg-primary text-white hover:bg-primary` : ``}`}>
                        <AmphoraIcon size={33} className="" />
                        <span className="font-bold mt-1 text-center text-sm">Clay</span>
                    </div>
                    <div onClick={() => promeniInput(5)} className={`style-item cursor-pointer flex text-primary flex-col hover:bg-green-50 dark:hover:bg-zinc-700 rounded-md border border-1 border-gray-100 dark:border-zinc-800 py-5 px-2 items-center ${formData?.style == options[5] ? `bg-primary text-white hover:bg-primary` : ``}`}>
                        <ToyBrick size={33} className="" />
                        <span className="font-bold mt-1 text-center text-sm">Toy</span>
                    </div>
                </div>


                <h2 className='font-bold text-xl text-primary mt-4 mb-0 pb-0'>{`Upload your image`}</h2>
                <p className='text-gray-500'>{`Upload an image to transform it with AI-powered effects`}</p>
                <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl bg-gray-100 dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:bg-zinc-950" {...getRootProps()}>
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

                <PromptInput onUserSelect={naPromenaInput} title={`Caption:`} />

                <Button className={`py-6 cursor-pointer dark:text-white`} onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Generate image"}
                </Button>

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
                        5 credits per image
                    </span>
                </div>


                <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                    <DialogContent className="w-full [&>button]:hidden max-w-7xl sm:max-w-4xl flex flex-col">
                        <DialogHeader>
                            <DialogTitle className={`font-bold text-3xl text-primary`}>Your result!</DialogTitle>
                            <DialogDescription className={`text-md`}>
                                Your image has been transformed! ✨ Enjoy your new stylized version with stunning details and AI-powered precision.
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
        </div>
    );
}