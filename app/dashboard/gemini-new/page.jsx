"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "configs/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";

export default function UpscaleImage() {
    const [prompt, setPrompt] = useState(``);
    const [uploading, setUploading] = useState(false);
    const [responseText, setResponseText] = useState();

    const handleGenerate = async () => {
        setUploading(true);
        const data = await axios.post("/api/gemini-new", {
            prompt: prompt + " - but give me the result in html code and tags, only tags in <body>, using just <img> and <p> tags clean html of request. remove ```html and bottom text please."
        }).then(res => {
            setUploading(false);

            setResponseText(res.data.result);
        })
    }

    const onChangeInput = (val) => {
        setPrompt(val);
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <Input onChange={(e) => onChangeInput(e.target.value)} type="text" />
            <Button onClick={handleGenerate} disabled={uploading}>
                {uploading ? "Generating..." : "Generate"}
            </Button>
            <div className="grid grid-cols-2 w-full gap-24 mt-24">
            <div dangerouslySetInnerHTML={{ __html: responseText }} />
            </div>
        </div>
    );
}