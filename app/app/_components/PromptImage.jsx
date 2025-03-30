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
import { Input } from '@/ui/input';

function PromptImage({ onUserSelect, handleFileChange, title, description, name, accept="image/*" }) {
    const options = ["3D", "Emoji", "Video Game", "Pixels", "Clay", "Toy"];
    const [selectedOption, setSelectedOption] = useState();
    return (
        <div className='w-full'>
            <h2 className='font-bold text-xl text-primary'>{title}</h2>
            <p className='text-gray-500'>{description}</p>
           
                <Input type="file" accept={accept} onChange={(ev) => {
                setSelectedOption(ev.target.value);
                handleFileChange(ev);
                onUserSelect(name, ev.target.value)
            }} />

        </div>
    )
}

export default PromptImage
