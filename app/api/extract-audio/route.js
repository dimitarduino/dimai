import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import Replicate from "replicate";
import axios from "axios";
import path from 'path'
import { storage } from "configs/Firebase";
import ffmpeg from 'fluent-ffmpeg';


import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";
import fs from 'fs'

export async function POST(req) {
    try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
        const { videoUrl } = await req.json();
        if (!videoUrl) {
            return NextResponse.json({ error: "No video file provided" }, { status: 400 });
        }
        const tempVideoPath = path.join("/tmp", `${uuidv4()}.mp4`);
        const audioFileName = `${uuidv4()}.mp3`;
        const tempAudioPath = path.join("/tmp", audioFileName);

        const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(tempVideoPath, Buffer.from(response.data));
        await new Promise((resolve, reject) => {
            ffmpeg(tempVideoPath)
                .output(tempAudioPath)
                .noVideo()
                .audioCodec("libmp3lame")
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        const audioRef = ref(storage, `audio_files/${audioFileName}`);
        const audioBuffer = fs.readFileSync(tempAudioPath);

        await uploadBytes(audioRef, audioBuffer);

        const audioUrl = await getDownloadURL(audioRef);

        fs.unlinkSync(tempVideoPath);
        fs.unlinkSync(tempAudioPath);

        return NextResponse.json({ audioUrl });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}