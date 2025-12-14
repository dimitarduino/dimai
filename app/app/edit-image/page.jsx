"use client";

import { useCallback, useContext, useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DollarSign, UploadCloud, X, Trash2, RotateCw } from "lucide-react";
import Image from "next/image";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import CustomLoading from "../_components/CustomLoading";
import { iskoristPoeni, proveriPoeni } from "lib/utils";
import { UserDetailContext } from "app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import { db } from "configs/db";
import { editedImages } from "configs/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import GeneratedImages from "../_components/GeneratedImages";

export default function EditImage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState();
    const [editedUrl, setEditedUrl] = useState();
    const [editing, setEditing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState();
    const [loading, setLoading] = useState(false);
    const [openedResult, setOpenedResult] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const { user } = useUser();
    const [userLocal, setUserLocal] = useState(user?.primaryEmailAddress?.emailAddress);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const promptTextareaRef = useRef(null);

    useEffect(() => {
        if (user) {
            setUserLocal(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);

    useEffect(() => {
        if (userLocal) {
            getImages();
        }
    }, [userLocal]);

    const getImages = async () => {
        if (!userLocal) {
            console.log('getImages: userLocal is not set yet');
            return;
        }

        try {
            const res = await db.select().from(editedImages).where(eq(editedImages.createdBy, userLocal));
            setImages(res);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    const handleDelete = async (id) => {
        try {
            await db.delete(editedImages).where(eq(editedImages.id, id));
            toast.success("Image deleted successfully");
            setImages(images.filter((img) => img.id !== id));
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        }
    }

    const handleRetry = (img) => {
        // Fill form with the same details
        setSelectedImage(img.image);
        setPrompt(img.prompt || "");
        setFile(null);
        setUploadedImage(null);
        setEditedUrl(null);
        setOpenedResult(false);
        
        // Scroll to the form area
        setTimeout(() => {
            const formElement = document.querySelector('textarea[name="prompt"]');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                formElement.focus();
            }
        }, 100);
        
        toast.success("Form filled with previous details. You can edit the prompt and retry!");
    }

    const editImage = async (imageUrl) => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }

        setEditing(true);
        setLoading(true);

        try {
            const res = await axios.post("/api/edit-image", {
                imageUrl,
                prompt: prompt.trim()
            });

            if (res.data.error) {
                toast.error(res.data.error);
                setEditing(false);
                setLoading(false);
                return;
            }

            const slednoPoeni = await iskoristPoeni({
                momentalnoKrediti: userDetail.credits,
                kolkuMinus: 5,
                email: user.primaryEmailAddress.emailAddress
            });

            setUserDetail(prev => ({
                ...prev,
                "credits": slednoPoeni
            }));

            setEditing(false);
            if (!!res.data.result) {
                setEditedUrl(res.data.result);
                setOpenedResult(true);
                setUploading(false);
                setLoading(false);

                const result = await db.insert(editedImages).values({
                    image: imageUrl,
                    prompt: prompt.trim(),
                    finalImage: res.data.result,
                    createdBy: user.primaryEmailAddress.emailAddress,
                    createdAt: new Date().toISOString()
                }).returning({ id: editedImages.id });

                // Refresh images list
                await getImages();
            }
        } catch (error) {
            console.error('Edit image error:', error);
            toast.error(error.response?.data?.error || 'Failed to edit image');
            setEditing(false);
            setLoading(false);
        }
    }

    const handleDownload = async (imageUrl) => {
        try {
            const response = await axios.get(imageUrl, { responseType: "blob" });

            const url = window.URL.createObjectURL(response.data);

            const a = document.createElement("a");
            a.href = url;
            a.download = "edited-image.jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first!");
            return;
        }

        if (!prompt.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }

        if (!proveriPoeni(userDetail.credits, 5)) {
            toast.error("Insufficient credits! Please recharge to edit images.");
            return;
        }

        setLoading(true);
        setDownloadUrl(null);
        setOpenedResult(false);
        setEditedUrl(null);
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
                setLoading(false);
                toast.error("Upload failed");
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);

                setDownloadUrl(url);
                setUploading(false);

                await editImage(url);
            }
        );
    };

    const handleGenerateFromSelected = async () => {
        if (!selectedImage) {
            toast.error("Please select an image first!");
            return;
        }

        if (!prompt.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }

        if (!proveriPoeni(userDetail.credits, 5)) {
            toast.error("Insufficient credits! Please recharge to edit images.");
            return;
        }

        setLoading(true);
        setDownloadUrl(selectedImage);
        setOpenedResult(false);
        setEditedUrl(null);
        setFile(null);
        setUploadedImage(null);

        await editImage(selectedImage);
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedImage("");
        setFile(file);
        setUploadedImage(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    });

    return (
        <div className="w-full flex flex-col">
            <div className="flex bg-white dark:bg-zinc-900 py-12 rounded-xl shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Edit Your Images with AI</h1>
                <h2>
                    Transform your images with AI-powered editing. Upload an image and describe how you want it edited using natural language prompts.
                </h2>

                <h2 className='font-bold text-xl text-primary mt-4 mb-0 pb-0'>{`Upload your image`}</h2>
                <p className='text-gray-500'>{`Upload an image to edit it with AI-powered effects`}</p>
                <div className="flex flex-col items-center justify-center w-full p-6 pb-2 border-2 border-dashed rounded-xl bg-gray-100 dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:bg-zinc-950" {...getRootProps()}>
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

                <span className="opacity-30 text-black dark:text-white relative pt-4 text-sm">Or choose an existing image:</span>

                <div className="w-full max-w-full overflow-hidden">
                    <GeneratedImages 
                        imagesList={images.map(img => ({ image: img.image, id: img.id }))} 
                        selectedImage={selectedImage} 
                        onClickImage={(image) => { 
                            setSelectedImage(image); 
                            setFile(null); 
                            setUploadedImage(null);
                        }} 
                    />
                </div>
                <div className="pt-4"></div>

                <div className="d-flex flex-column">
                    <p className='text-gray-500 dark:text-neutral-200'>Edit Prompt:<span className="text-red-600 text-sm">(*)</span></p>
                    <Textarea 
                        ref={promptTextareaRef}
                        placeholder="Describe how you want to edit the image (e.g., 'make it sunset', 'add snow', 'change to black and white')..." 
                        name="prompt" 
                        className={`mt-2 min-h-[80px] resize-none overflow-hidden`} 
                        value={prompt} 
                        onChange={(event) => {
                            setPrompt(event.target.value);
                            // Auto-resize textarea
                            const textarea = event.target;
                            textarea.style.height = 'auto';
                            textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
                        }}
                        rows={3}
                    />
                </div>

                {
                    selectedImage ? (
                        <Button 
                            className={`py-6 cursor-pointer dark:text-white`} 
                            onClick={handleGenerateFromSelected} 
                            disabled={uploading || loading || !prompt.trim()}
                        >
                            {loading ? "Editing..." : "Edit image"}
                        </Button>
                    ) : (
                        <Button 
                            className={`py-6 text-md dark:text-white cursor-pointer`} 
                            onClick={handleUpload} 
                            disabled={!file || loading || !prompt.trim()}
                        >
                            {loading ? "Please wait..." : "Edit image"}
                        </Button>
                    )
                }

                {editedUrl && (
                    <Button 
                        className={`py-2 border-bottom border-2 border-primary text-md border-none hover:bg-neutral-100 dark:hover:bg-neutral-700 bg-transparent text-primary cursor-pointer`} 
                        onClick={() => setOpenedResult(true)}
                    >
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

            <CustomLoading title="Editing your image..." loading={loading} />

            <Dialog className='flex w-full' open={(!!openedResult)} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full z-150 [&>button]:hidden max-w-2xl sm:max-w-2xl flex flex-col">
                    <DialogHeader>
                        <DialogTitle className={`font-bold text-3xl text-primary`}>
                            {(editing && !editedUrl) ? `Editing your image...` : `Your result!`}
                        </DialogTitle>
                        <DialogDescription className={`text-md`}>
                            {(editing && !editedUrl) ? "" : `Your image has been successfully edited! ✨`}
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
                            editedUrl && (
                                <div className="flex flex-col items-center">
                                    <Image 
                                        src={editedUrl} 
                                        alt="Edited image" 
                                        width={600} 
                                        height={600} 
                                        className="w-full max-w-lg h-auto object-contain rounded-lg"
                                    />
                                    <Button 
                                        className={`py-6 mt-5 cursor-pointer dark:text-white`} 
                                        onClick={() => handleDownload(editedUrl)}
                                    >
                                        Download Image
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex bg-white dark:bg-zinc-900 py-12 rounded-xl w-full shadow-sm px-10 mt-4 flex-col max-w-4xl mx-auto space-y-4 p-4">
                <h1 className="font-bold text-3xl text-primary">Your Edited Images</h1>

                {
                    images.length == 0 ? (
                        <h3>You don't have any edited images</h3>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((img, index) => (
                                    <div 
                                        key={img.id || index}
                                        className="overflow-hidden relative flex w-full flex-col h-full rounded-xl"
                                    >
                                        <div className="absolute top-1 z-10 right-2 flex gap-1">
                                            <Button 
                                                className="w-6 h-6 bg-primary text-white hover:bg-primary/90 cursor-pointer p-0"
                                                onClick={() => handleRetry(img)}
                                                title="Retry with same image and prompt"
                                            >
                                                <RotateCw size={14} />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className="w-6 h-6 bg-red-500 text-white hover:bg-red-600 cursor-pointer p-0">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your
                                                            edited image and remove it from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            className={`text-white cursor-pointer bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700`} 
                                                            onClick={() => handleDelete(img.id)}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        <div className="hover:scale-110 overflow-hidden w-full h-full flex transition-all cursor-pointer">
                                            <Image
                                                src={img.finalImage}
                                                alt={img.prompt || "Edited image"}
                                                className="w-full aspect-square object-cover"
                                                width={300}
                                                height={300}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate" title={img.prompt}>
                                            {img.prompt || "No prompt"}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

