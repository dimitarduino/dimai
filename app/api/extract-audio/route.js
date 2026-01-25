import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import Replicate from "replicate";
import axios from "axios";
import path from 'path'
import { storage } from "configs/Firebase";
import ffmpeg from 'fluent-ffmpeg';


import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";
import fs from 'fs'

// Validate URL to prevent SSRF attacks
function isValidUrl(url) {
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return false;
        }
        // Block private/internal IPs and localhost
        const hostname = parsed.hostname.toLowerCase();
        if (hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            hostname === '0.0.0.0' ||
            hostname.startsWith('192.168.') || 
            hostname.startsWith('10.') ||
            hostname.startsWith('172.16.') || 
            hostname.startsWith('172.17.') ||
            hostname.startsWith('172.18.') ||
            hostname.startsWith('172.19.') ||
            hostname.startsWith('172.20.') ||
            hostname.startsWith('172.21.') ||
            hostname.startsWith('172.22.') ||
            hostname.startsWith('172.23.') ||
            hostname.startsWith('172.24.') ||
            hostname.startsWith('172.25.') ||
            hostname.startsWith('172.26.') ||
            hostname.startsWith('172.27.') ||
            hostname.startsWith('172.28.') ||
            hostname.startsWith('172.29.') ||
            hostname.startsWith('172.30.') ||
            hostname.startsWith('172.31.') ||
            hostname === '169.254.169.254' ||  // AWS metadata
            hostname === '[::1]' ||  // IPv6 localhost
            hostname.endsWith('.local') ||
            hostname.endsWith('.internal')) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export async function POST(req) {
    try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
        const { videoUrl } = await req.json();
        if (!videoUrl) {
            return NextResponse.json({ error: "No video file provided" }, { status: 400 });
        }
        
        // Validate URL to prevent SSRF
        if (!isValidUrl(videoUrl)) {
            return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
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