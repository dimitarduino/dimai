"use client";

import { useCallback, useContext, useState, useEffect, useRef, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DollarSign, UploadCloud, X, Trash2, RotateCw } from "lucide-react";
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
import { NextImageFillWithLoading } from "../_components/NextImageFillWithLoading";
import { proveriPoeni } from "lib/utils";
import {
    deductUserCredits,
    deleteMyEditedImage,
    insertEditedImage,
    listMyEditedImageSourcePairs,
    listMyEditedImages,
} from "@/app/app/_actions/dashboard-data";
import { UserDetails, useUserDetail } from "@/app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import GeneratedImages from "../_components/GeneratedImages";
import { InferSelectModel } from "drizzle-orm";
import { editedImages } from "@/configs/schema";
import { shouldUnoptimizeImageSrc } from "@/lib/next-image-src";
import { SIZES_FULL_PREVIEW, SIZES_GRID_THUMB } from "@/lib/image-preview-sizes";

// In-memory image cache (persists for this component's lifetime)
const imageCache = new Map();

function useImageCache(url) {
    const [blobUrl, setBlobUrl] = useState(url);
    useEffect(() => {
        let revoked = false;
        // Only cache if not already cached and it's a remote URL (not data:/blob:/)
        async function fetchAndCache() {
            if (!url || imageCache.has(url) || url.startsWith("blob:") || url.startsWith("data:")) {
                setBlobUrl(imageCache.get(url) || url);
                return;
            }
            try {
                const resp = await fetch(url, { cache: 'force-cache' });
                const blob = await resp.blob();
                const localBlobUrl = URL.createObjectURL(blob);
                imageCache.set(url, localBlobUrl);
                if (!revoked) setBlobUrl(localBlobUrl);
            } catch (e) {
                setBlobUrl(url); // fallback
            }
        }
        fetchAndCache();
        return () => {
            revoked = true;
        };
    }, [url]);
    return blobUrl;
}

interface SourceImage {
    image: string;
    id: number;
}

export default function EditImage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [editedUrl, setEditedUrl] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openedResult, setOpenedResult] = useState(false);
    const [prompt, setPrompt] = useState<string | null>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [images, setImages] = useState<InferSelectModel<typeof editedImages>[]>([]);
    const [sourceImages, setSourceImages] = useState<SourceImage[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const IMAGES_PER_PAGE = 12;
    const { user } = useUser();
    const [userLocal, setUserLocal] = useState(user?.primaryEmailAddress?.emailAddress);
    const { userDetail, setUserDetail } = useUserDetail();
    const promptTextareaRef = useRef(null);



    // Lazy cache all resulting images (finalImage, image) after any images list update
    useEffect(() => {
        

        images.forEach((img) => {
            if (img.finalImage && !imageCache.has(img.finalImage) && !img.finalImage.startsWith("blob:")) {
                fetch(img.finalImage, { cache: "force-cache" })
                    .then(r => r.blob())
                    .then(blob => {
                        const u = URL.createObjectURL(blob);
                        imageCache.set(img.finalImage, u);
                    }).catch(() => { });
            }
            if (img.image && !imageCache.has(img.image) && !img.image.startsWith("blob:")) {
                fetch(img.image, { cache: "force-cache" })
                    .then(r => r.blob())
                    .then(blob => {
                        const u = URL.createObjectURL(blob);
                        imageCache.set(img.image, u);
                    }).catch(() => { });
            }
        });
    }, [images]);

    useEffect(() => {
        if (user) {
            setUserLocal(user?.primaryEmailAddress?.emailAddress);
        }
    }, [user]);

    useEffect(() => {
        if (userLocal) {
            getImages();
            getSourceImages();
        }
    }, [userLocal]);

    const getSourceImages = async () => {
        if (!userLocal) return;
        try {
            const res = await listMyEditedImageSourcePairs();

            setSourceImages(res);
        } catch (error) {
            console.error('Error fetching source images:', error);
        }
    }

    const getImages = async (loadMore = false) => {
        if (!userLocal) {
            console.log('getImages: userLocal is not set yet');
            return;
        }

        if (loadMore) setLoadingMore(true);

        try {
            const currentOffset = loadMore ? images.length : 0;
            const res = await listMyEditedImages({
                limit: IMAGES_PER_PAGE,
                offset: currentOffset,
            });

            const newImages = res;

            if (loadMore) {
                setImages(prev => [...prev, ...newImages]);
            } else {
                setImages(newImages);
            }

            setHasMore(newImages.length === IMAGES_PER_PAGE);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoadingMore(false);
        }
    }

    const handleDelete = async (id) => {
        try {
            // Find the image record first to get the Firebase Storage URLs
            const imageToDelete = images.find((img) => img.id === id);
            if (!imageToDelete) {
                toast.error("Image not found");
                return;
            }

            // Helper function to extract storage path from Firebase Storage URL
            const extractStoragePath = (url) => {
                try {
                    if (!url || !url.includes('firebasestorage.googleapis.com')) {
                        return null;
                    }
                    // Firebase Storage URLs format: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?alt=media&token=...
                    const match = url.match(/\/o\/(.+?)\?/);
                    if (match && match[1]) {
                        // URL decode the path (e.g., uploads%2Fimage.jpg becomes uploads/image.jpg)
                        return decodeURIComponent(match[1]);
                    }
                    return null;
                } catch (error) {
                    console.error("Error extracting storage path:", error);
                    return null;
                }
            };

            // Delete files from Firebase Storage
            const deletePromises: Promise<void>[] = [];

            // Delete the edited/final image
            if (imageToDelete.finalImage) {
                const finalImagePath = extractStoragePath(imageToDelete.finalImage);
                if (finalImagePath) {
                    const finalImageRef = ref(storage, finalImagePath);
                    deletePromises.push(
                        deleteObject(finalImageRef).catch((error: Error) => {
                            console.error("Error deleting final image from Firebase:", error);
                            // Don't fail the whole operation if one file deletion fails
                        })
                    );
                }
            }

            // Delete the original uploaded image
            if (imageToDelete.image) {
                const imagePath = extractStoragePath(imageToDelete.image);
                if (imagePath) {
                    const imageRef = ref(storage, imagePath);
                    deletePromises.push(
                        deleteObject(imageRef).catch((error) => {
                            console.error("Error deleting original image from Firebase:", error);
                            // Don't fail the whole operation if one file deletion fails
                        })
                    );
                }
            }

            // Wait for all file deletions to complete (or fail gracefully)
            await Promise.all(deletePromises);

            // Delete from database
            await deleteMyEditedImage(id);

            toast.success("Image deleted successfully");
            setImages(images.filter((img) => img.id !== id));
            setSourceImages(prev => prev.filter((img) => img.id !== id));
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
        setTimeout(() => {
            const formElement : HTMLTextAreaElement | null = document.querySelector('textarea[name="prompt"]');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                formElement?.focus();
            }
        }, 100);
        toast.success("Form filled with previous details. You can edit the prompt and retry!");
    }

    const editImage = async (imageUrl) => {
        if (!prompt?.trim()) {
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

            const slednoPoeni = await deductUserCredits(5);

            setUserDetail(prev => prev ? ({
                ...prev,
                "credits": slednoPoeni
            }) : prev);

            setEditing(false);
            if (!!res.data.result) {
                setEditedUrl(res.data.result);
                setOpenedResult(true);
                setUploading(false);
                setLoading(false);

                // Proactively cache the just-created edited image
                if (res.data.result && !imageCache.has(res.data.result)) {
                    fetch(res.data.result)
                        .then(r => r.blob())
                        .then(blob => {
                            const u = URL.createObjectURL(blob);
                            imageCache.set(res.data.result, u);
                        }).catch(() => { });
                }

                const newRecord = {
                    image: imageUrl,
                    prompt: prompt.trim(),
                    finalImage: res.data.result,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: new Date().toISOString()
                };

                const result = await insertEditedImage({
                    image: newRecord.image,
                    prompt: newRecord.prompt,
                    finalImage: newRecord.finalImage,
                    createdAt: newRecord.createdAt,
                });

                const newId = result.id;
                setImages(prev => prev ? [{ ...newRecord, id: newId, createdBy: prev[0].createdBy }, ...prev] : prev);
                setSourceImages(prev => [{ image: imageUrl, id: newId }, ...prev]);
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
            // Try to use blob if cached
            let urlToDownload = imageCache.get(imageUrl) || imageUrl;
            // If it's a blob url, fetch the cached blob
            let blob;
            if (urlToDownload.startsWith('blob:')) {
                // Get the blob from the blob URL and trigger download
                blob = await fetch(urlToDownload).then(r => r.blob());
            } else {
                // Fallback: get from server
                const response = await axios.get(imageUrl, { responseType: "blob" });
                blob = response.data;
            }
            const downloadBlobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadBlobUrl;
            a.download = "edited-image.jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadBlobUrl);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first!");
            return;
        }

        if (!prompt?.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }

        if (!proveriPoeni(userDetail?.credits ?? 0, 5)) {
            toast.error("Insufficient credits! Please recharge to edit images.");
            return;
        }

        setLoading(true);
        setDownloadUrl(null);
        setOpenedResult(false);
        setEditedUrl(null);
        setUploading(true);
        if (!file) return;
        const storageRef = ref(storage, `uploads/${file?.name}-${Date.now()}`);
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
        if (!userDetail) return;
        if (!selectedImage) {
            toast.error("Please select an image first!");
            return;
        }

        if (!prompt?.trim()) {
            toast.error("Please enter a prompt.");
            return;
        }

        if (!proveriPoeni(userDetail?.credits ?? 0, 5)) {
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
        accept: {'image/*': []},
        multiple: false,
    });

    // Cached version for the current edited image dialog
    const cachedEditedUrl = useImageCache(editedUrl);

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
                        <div className="flex flex-col items-center w-full max-w-[640px] mx-auto">
                            <div className="relative w-full aspect-square max-h-[min(70dvh,640px)] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                                <NextImageFillWithLoading
                                    className="absolute inset-0"
                                    src={uploadedImage}
                                    alt="Uploaded"
                                    sizes={SIZES_FULL_PREVIEW}
                                    quality={65}
                                    imageClassName="object-contain"
                                    unoptimized={shouldUnoptimizeImageSrc(uploadedImage)}
                                />
                            </div>
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
                        imagesList={
                            sourceImages
                                .filter((img, idx, arr) => {
                                    // Extract only the file name and extension before any dash or question mark
                                    const extractBaseFileName = (url) => {
                                        try {
                                            // Find "uploads%2F" in the URL
                                            const marker = "uploads%2F";
                                            const start = url.indexOf(marker);
                                            let segment = url;
                                            if (start !== -1) {
                                                segment = url.substring(start + marker.length);
                                            }
                                            // Ignore query string
                                            const qIndex = segment.indexOf("?");
                                            if (qIndex !== -1) segment = segment.substring(0, qIndex);
                                            // Take only up to first dash, if any (for cases like IMG_9844.jpeg-1765486139383)
                                            const dashIdx = segment.indexOf("-");
                                            if (dashIdx !== -1) {
                                                segment = segment.substring(0, dashIdx);
                                            }
                                            // Remove any directory if still present, take only file name with extension
                                            if (segment.includes("/")) {
                                                segment = segment.split("/").pop();
                                            }
                                            return segment;
                                        } catch {
                                            return url;
                                        }
                                    };
                                    const currentBaseFileName = extractBaseFileName(img.image);
                                    return (
                                        arr.findIndex(
                                            x => extractBaseFileName(x.image) === currentBaseFileName
                                        ) === idx
                                    );
                                })
                                .map(img => ({ image: img.image, id: img.id }))
                        }
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
                        value={prompt ?? ""}
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
                            disabled={uploading || loading || !prompt?.trim()}
                        >
                            {loading ? "Editing..." : "Edit image"}
                        </Button>
                    ) : (
                        <Button
                            className={`py-6 text-md dark:text-white cursor-pointer`}
                            onClick={handleUpload}
                            disabled={!file || loading || !prompt?.trim()}
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
                        <DollarSign className='font-bold text-white' size={10} aria-label="Dollar" />
                    </div>
                    <span>
                        5 credits per image
                    </span>
                </div>
            </div>

            <CustomLoading title="Editing your image..." loading={loading} />

            <Dialog open={!!openedResult} onOpenChange={setOpenedResult}>
                <DialogContent className="w-full z-150 [&>button]:hidden max-w-[640px] sm:max-w-[640px] flex flex-col">
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
                                    <div className="relative w-full max-w-[640px] aspect-square max-h-[50dvh] mx-auto">
                                        <NextImageFillWithLoading
                                            className="absolute inset-0"
                                            src={cachedEditedUrl ?? editedUrl}
                                            alt="Edited image"
                                            sizes={SIZES_FULL_PREVIEW}
                                            quality={75}
                                            imageClassName="object-contain rounded-lg"
                                            unoptimized={shouldUnoptimizeImageSrc(
                                                (cachedEditedUrl ?? editedUrl) || "",
                                            )}
                                        />
                                    </div>
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

                {images.length === 0 ? (
                    <h3>You don&apos;t have any edited images</h3>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((img, index) => {
                                return (
                                    <div
                                        key={img.id || index}
                                        className="overflow-hidden relative flex w-full flex-col h-full"
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
                                        {/* Dialog for showing the image on click */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div className="relative aspect-square w-full overflow-hidden rounded-xl hover:scale-110 transition-transform cursor-pointer">
                                                    <NextImageFillWithLoading
                                                        className="absolute inset-0"
                                                        src={img.finalImage}
                                                        alt={img.prompt || "Edited image"}
                                                        sizes={SIZES_GRID_THUMB}
                                                        quality={55}
                                                        imageClassName="object-cover"
                                                        unoptimized={shouldUnoptimizeImageSrc(img.finalImage)}
                                                    />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="flex max-w-[640px] flex-col items-center">
                                                <div className="relative w-full max-w-[640px] aspect-square max-h-[min(70dvh,640px)]">
                                                    <NextImageFillWithLoading
                                                        className="absolute inset-0"
                                                        src={img.finalImage}
                                                        alt={img.prompt || "Edited image"}
                                                        sizes={SIZES_FULL_PREVIEW}
                                                        quality={82}
                                                        imageClassName="rounded-lg object-contain"
                                                        unoptimized={shouldUnoptimizeImageSrc(img.finalImage)}
                                                    />
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-center text-base truncate whitespace-pre-wrap max-w-sm" title={img.prompt}>
                                                    {img.prompt || "No prompt"}
                                                </p>
                                                <Button
                                                    className="py-2 px-4 mt-4"
                                                    onClick={() => handleDownload(img.finalImage)}
                                                >
                                                    Download Image
                                                </Button>
                                            </DialogContent>
                                        </Dialog>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate" title={img.prompt}>
                                            {img.prompt || "No prompt"}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        {hasMore && (
                            <div className="flex justify-center items-center mt-6">
                                <Button
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => getImages(true)}
                                    disabled={loadingMore}
                                    variant="outline"
                                >
                                    {loadingMore ? "Loading..." : "Load more"}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
