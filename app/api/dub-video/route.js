// import { NextResponse } from "next/server";
// import { storage } from "@/configs/Firebase"; // Firebase client SDK
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import axios from "axios";
// // import ffmpeg from "fluent-ffmpeg";
// import fs from "fs";
// import path from "path";
// // import ffmpeg from '@ffmpeg-installer/ffmpeg';
// // process.env.FFMPEG_PATH = ffmpeg.path;

// // Temporary storage directory
// const TEMP_DIR = "/tmp";

// // Validate URL to prevent SSRF attacks
// function isValidUrl(url) {
//     try {
//         const parsed = new URL(url);
//         // Only allow http and https protocols
//         if (!['http:', 'https:'].includes(parsed.protocol)) {
//             return false;
//         }
//         // Block private/internal IPs and localhost
//         const hostname = parsed.hostname.toLowerCase();
//         if (hostname === 'localhost' || 
//             hostname === '127.0.0.1' || 
//             hostname === '0.0.0.0' ||
//             hostname.startsWith('192.168.') || 
//             hostname.startsWith('10.') ||
//             hostname.startsWith('172.16.') || 
//             hostname.startsWith('172.17.') ||
//             hostname.startsWith('172.18.') ||
//             hostname.startsWith('172.19.') ||
//             hostname.startsWith('172.20.') ||
//             hostname.startsWith('172.21.') ||
//             hostname.startsWith('172.22.') ||
//             hostname.startsWith('172.23.') ||
//             hostname.startsWith('172.24.') ||
//             hostname.startsWith('172.25.') ||
//             hostname.startsWith('172.26.') ||
//             hostname.startsWith('172.27.') ||
//             hostname.startsWith('172.28.') ||
//             hostname.startsWith('172.29.') ||
//             hostname.startsWith('172.30.') ||
//             hostname.startsWith('172.31.') ||
//             hostname === '169.254.169.254' ||  // AWS metadata
//             hostname === '[::1]' ||  // IPv6 localhost
//             hostname.endsWith('.local') ||
//             hostname.endsWith('.internal')) {
//             return false;
//         }
//         return true;
//     } catch {
//         return false;
//     }
// }

// export async function POST(req) {
//     try {
//         const { videoUrl, dubbedAudioUrl } = await req.json();

//         if (!videoUrl || !dubbedAudioUrl) {
//             return NextResponse.json({ error: "Missing video or audio URL" }, { status: 400 });
//         }
        
//         // Validate URLs to prevent SSRF
//         if (!isValidUrl(videoUrl) || !isValidUrl(dubbedAudioUrl)) {
//             return NextResponse.json({ error: "Invalid video or audio URL" }, { status: 400 });
//         }

//         const videoPath = path.join(TEMP_DIR, "video.mp4");
//         const audioPath = path.join(TEMP_DIR, "dubbed-audio.mp3");
//         const outputPath = path.join(TEMP_DIR, `dubbed-video-${Date.now()}.mp4`);

//         const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
//         fs.writeFileSync(videoPath, videoResponse.data);

//         const audioResponse = await axios.get(dubbedAudioUrl, { responseType: "arraybuffer" });
//         fs.writeFileSync(audioPath, audioResponse.data);

//         await new Promise((resolve, reject) => {
//             ffmpeg(videoPath)
//                 .input(audioPath)
//                 .outputOptions("-map 0:v:0") // Select only the video stream from input 0
//                 .outputOptions("-map 1:a:0") // Select only the audio stream from input 1
//                 .outputOptions("-c:v copy") // Copy the video stream without re-encoding
//                 .outputOptions("-c:a aac") // Encode the audio to AAC format
//                 .outputOptions("-shortest") // Ensure the output video ends when the shortest stream ends
//                 .output(outputPath)
//                 .on("end", resolve)
//                 .on("error", reject)
//                 .run();
//         });

//         const fileRef = ref(storage, `dubbed_videos/${Date.now()}.mp4`);
//         const fileBuffer = fs.readFileSync(outputPath);
//         await uploadBytes(fileRef, fileBuffer);
//         const finalVideoUrl = await getDownloadURL(fileRef);

//         fs.unlinkSync(videoPath);
//         fs.unlinkSync(audioPath);
//         fs.unlinkSync(outputPath);

//         return NextResponse.json({ "result": finalVideoUrl });
//     } catch (error) {
//         console.error("Error processing video:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }