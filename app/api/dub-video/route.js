import { NextResponse } from "next/server";
import { storage } from "@/configs/Firebase"; // Firebase client SDK
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
// import ffmpeg from '@ffmpeg-installer/ffmpeg';
// process.env.FFMPEG_PATH = ffmpeg.path;

// Temporary storage directory
const TEMP_DIR = "/tmp";

export async function POST(req) {
    try {
        const { videoUrl, dubbedAudioUrl } = await req.json();

        if (!videoUrl || !dubbedAudioUrl) {
            return NextResponse.json({ error: "Missing video or audio URL" }, { status: 400 });
        }

        const videoPath = path.join(TEMP_DIR, "video.mp4");
        const audioPath = path.join(TEMP_DIR, "dubbed-audio.mp3");
        const outputPath = path.join(TEMP_DIR, `dubbed-video-${Date.now()}.mp4`);

        const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, videoResponse.data);

        const audioResponse = await axios.get(dubbedAudioUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(audioPath, audioResponse.data);

        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .input(audioPath)
                .outputOptions("-map 0:v:0") // Select only the video stream from input 0
                .outputOptions("-map 1:a:0") // Select only the audio stream from input 1
                .outputOptions("-c:v copy") // Copy the video stream without re-encoding
                .outputOptions("-c:a aac") // Encode the audio to AAC format
                .outputOptions("-shortest") // Ensure the output video ends when the shortest stream ends
                .output(outputPath)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        const fileRef = ref(storage, `dubbed_videos/${Date.now()}.mp4`);
        const fileBuffer = fs.readFileSync(outputPath);
        await uploadBytes(fileRef, fileBuffer);
        const finalVideoUrl = await getDownloadURL(fileRef);

        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
        fs.unlinkSync(outputPath);

        return NextResponse.json({ "result": finalVideoUrl });
    } catch (error) {
        console.error("Error processing video:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}