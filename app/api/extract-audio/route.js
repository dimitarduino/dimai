import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { execFile } from "child_process";
import path from 'path';
import fs from 'fs';
import { storage } from "configs/Firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

export async function POST(req) {
    let tempVideoPath, tempAudioPath;
    try {
        const { videoUrl } = await req.json();
        if (!videoUrl) {
            return NextResponse.json({ error: "No video file provided" }, { status: 400 });
        }

        const id = uuidv4();
        tempVideoPath = path.join("/tmp", `${id}.mp4`);
        const audioFileName = `${id}.mp3`;
        tempAudioPath = path.join("/tmp", audioFileName);

        const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(tempVideoPath, Buffer.from(response.data));

        await new Promise((resolve, reject) => {
            execFile("ffmpeg", [
                "-i", tempVideoPath,
                "-vn",
                "-acodec", "libmp3lame",
                "-y",
                tempAudioPath,
            ], (error, stdout, stderr) => {
                if (error) {
                    console.error("ffmpeg stderr:", stderr);
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });

        const audioRef = ref(storage, `audio_files/${audioFileName}`);
        const audioBuffer = fs.readFileSync(tempAudioPath);
        await uploadBytes(audioRef, audioBuffer);
        const audioUrl = await getDownloadURL(audioRef);

        return NextResponse.json({ audioUrl });
    } catch (error) {
        console.error("Error extracting audio:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        [tempVideoPath, tempAudioPath].forEach(p => {
            try { if (p) fs.unlinkSync(p); } catch {}
        });
    }
}