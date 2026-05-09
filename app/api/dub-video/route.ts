import { NextResponse } from "next/server";
import { storage } from "@/configs/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";

const TEMP_DIR = "/tmp";

export async function POST(req) {
    let videoPath, audioPath, outputPath;
    try {
        const { videoUrl, dubbedAudioUrl } = await req.json();

        if (!videoUrl || !dubbedAudioUrl) {
            return NextResponse.json({ error: "Missing video or audio URL" }, { status: 400 });
        }

        const ts = Date.now();
        videoPath = path.join(TEMP_DIR, `video-${ts}.mp4`);
        audioPath = path.join(TEMP_DIR, `dubbed-audio-${ts}.mp3`);
        outputPath = path.join(TEMP_DIR, `dubbed-video-${ts}.mp4`);

        const [videoResponse, audioResponse] = await Promise.all([
            axios.get(videoUrl, { responseType: "arraybuffer" }),
            axios.get(dubbedAudioUrl, { responseType: "arraybuffer" }),
        ]);
        fs.writeFileSync(videoPath, videoResponse.data);
        fs.writeFileSync(audioPath, audioResponse.data);

        await new Promise((resolve, reject) => {
            execFile("ffmpeg", [
                "-i", videoPath,
                "-i", audioPath,
                "-map", "0:v:0",
                "-map", "1:a:0",
                "-c:v", "copy",
                "-c:a", "aac",
                "-shortest",
                "-y",
                outputPath,
            ], (error, stdout, stderr) => {
                if (error) {
                    console.error("ffmpeg stderr:", stderr);
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });

        const fileRef = ref(storage, `dubbed_videos/${ts}.mp4`);
        const fileBuffer = fs.readFileSync(outputPath);
        await uploadBytes(fileRef, fileBuffer);
        const finalVideoUrl = await getDownloadURL(fileRef);

        return NextResponse.json({ "result": finalVideoUrl });
    } catch (error) {
        console.error("Error processing video:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        [videoPath, audioPath, outputPath].forEach(p => {
            try { if (p) fs.unlinkSync(p); } catch {}
        });
    }
}