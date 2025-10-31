"use client"
import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Caption from './Caption';

function Captions({ onCaptionChange, captions }) {
    const [activeCaption, setActiveCaption] = useState(false);
    const [selectedCaption, setSelectedCaption] = useState("YOUTUBER");
    const handleCaptionChange = (caption) => {
        console.log(caption)
        setSelectedCaption(caption);
        setActiveCaption(true);
        onCaptionChange(caption);
    }

    useEffect(() => {
        handleCaptionChange("YOUTUBER");
    }, []);

    return (
        <div className="">
            <h2 className='font-bold text-xl text-primary'>Captions</h2>
            <p className='text-gray-500'>Select the caption style for your video</p>

            <div className='w-full grid grid-cols-5 gap-2 mt-4'>
                {captions.map((caption, index) => (
                    <Caption selectedCaption={selectedCaption} activeCaptionProp={selectedCaption == caption.name} key={index} captionName={caption.name} onCaptionChange={() => handleCaptionChange(caption.name)} classesCaption={`${caption.classes}`} />
                ))}
            </div>
        </div>
    )
}

export default Captions