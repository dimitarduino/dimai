import { NextResponse } from "next/server";
import { coerceReplicateFetchUrl } from "@/lib/replicate-fetch-url";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req) {
    try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

        const { imageUrl, prompt, negative_prompt, duration, resolution } = await req.json();
        const input = { 
            mode: resolution,
            start_image: imageUrl,
            prompt: prompt,
            negative_prompt: negative_prompt,
            duration: duration
         };

        // bria/remove-background
        const output = await replicate.run("kwaivgi/kling-v2.1", { input })
        const resp = await axios.get(coerceReplicateFetchUrl(output), {
          responseType: "arraybuffer",
        });

        const base64 = `data:video/mp4;base64,${Buffer.from(resp.data).toString('base64')}`;

        
        // const base64 = `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`;

        // console.log(resp);
        const storageRef = ref(storage, `image-video/${Date.now()}.mp4`);

        await uploadString(storageRef, base64, 'data_url');

        const downloadUrl = await getDownloadURL(storageRef);
        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}