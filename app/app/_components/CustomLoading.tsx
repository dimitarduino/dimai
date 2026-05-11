"use client"
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
import Image from "next/image"
import React from 'react'

interface CustomLoadingProps {
    loading: boolean;
    title?: string;
}
function CustomLoading({ loading, title = 'Generating your video' } : CustomLoadingProps) {
    return (
        <AlertDialog open={loading}>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogContent className={`border-4 max-w-sm border-primary py-14 z-150`}>
                <div className=" flex flex-col items-center justify-center">
                    <Image alt="Loading" src={'/loading1.gif'} loading="eager" width={70} height={70} />
                    <span className="text-primary md:text-3xl font-bold text-center text-lg">{title}...</span>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CustomLoading
