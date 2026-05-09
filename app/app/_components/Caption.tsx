"use client"
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export interface CaptionProps {
    onCaptionChange: (captionName: string) => void;
    selectedCaption: string;
    classesCaption?: string;
    captionName?: string;
    activeCaptionProp?: boolean;
}

function Caption({ onCaptionChange, selectedCaption, classesCaption = ``, captionName = ``, activeCaptionProp = false } : CaptionProps) {
    const [activeCaption, setActiveCaption] = useState<boolean>(activeCaptionProp);
    
    const handleClick = () => {
        if (onCaptionChange) {
            onCaptionChange(captionName);
        }
    };
    
    return (
        <div className={`w-full p-4 cursor-pointer px-6 border border-gray-300 rounded-md flex justify-center items-center ${(selectedCaption == captionName) ? `bg-gray-200 dark:bg-zinc-700` : `hover:bg-gray-100 dark:hover:bg-zinc-800 bg-gray-100 dark:bg-zinc-900`}`} onClick={handleClick}>
            <span className={`text-xl ${classesCaption}`}>{captionName}</span>
        </div>
    )
}

export default Caption