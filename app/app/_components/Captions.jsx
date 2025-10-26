"use client"
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Caption from './Caption';

function Captions({ onCaptionChange }) {
    const [activeCaption, setActiveCaption] = useState(false);
    const [selectedCaption, setSelectedCaption] = useState("Youtuber");
    const handleCaptionChange = (caption) => {
        setSelectedCaption(caption);
        setActiveCaption(true);
        onCaptionChange(caption);

        console.log('promenvam', caption);
    }

    const captions = [{
        name: "YOUTUBER",
        classesCaption: "text-yellow-500 pointer font-extrabold drop-shadow-lg"
    }, {
        name: "Superme",
        classesCaption: "text-black dark:text-white pointer font-bold italic drop-shadow-lg"
    }, {
        name: "NEON",
        classesCaption: "text-green-500 pointer font-extrabold drop-shadow-lg"
    }, {
        name: "GLITCH",
        classesCaption: "text-pink-500 pointer font-extrabold drop-shadow-lg"
    }, {
        name: "FIRE",
        classesCaption: "text-red-500 pointer font-extrabold drop-shadow-lg"
    }]

    return (
        <div className="">
            <h2 className='font-bold text-xl text-primary'>Captions</h2>
            <p className='text-gray-500'>Select the caption style for your video</p>

            <div className='w-full grid grid-cols-5 gap-2 mt-4'>
                {captions.map((caption, index) => (
                    <Caption selectedCaption={selectedCaption} activeCaptionProp={selectedCaption == caption.name} key={index} captionName={caption.name} onCaptionChange={() => handleCaptionChange(caption.name)} classesCaption={`${caption.classesCaption}`} />
                ))}
            </div>
        </div>
    )
}

export default Captions