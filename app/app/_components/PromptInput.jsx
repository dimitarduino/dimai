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

function PromptInput({ onUserSelect, title, description, name }) {
    const options = ["3D", "Emoji", "Video Game", "Pixels", "Clay", "Toy"];
    const [selectedOption, setSelectedOption] = useState();
    return (
        <div className='w-full'>
            <h2 className='font-bold text-xl text-primary mb-2'>{title}</h2>
            <p className='text-gray-500'>{description}</p>
           
                <Input className={`py-6`} placeholder={title} type="text" onChange={(e) => {
                setSelectedOption(e.target.value);
                onUserSelect("text", e.target.value)
            }} />

        </div>
    )
}

export default PromptInput
