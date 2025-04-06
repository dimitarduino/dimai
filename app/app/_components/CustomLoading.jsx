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

function CustomLoading({ loading, title='Generating your video' }) {
    return (
        <AlertDialog open={loading}>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogContent className={`border-4 border-primary py-14`}>
                <div className=" flex flex-col items-center justify-center">
                    <Image alt="Loading" src={'/loading1.gif?50'} width={70} height={70} />
                    <h2 className="text-primary text-3xl font-bold">{title}...</h2>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CustomLoading
