import { NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { storage } from "configs/Firebase";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { InferenceClient } from "@huggingface/inference";


export async function POST(req) {
    try {
        const { prompt } = await req.json();

        const client = new InferenceClient(process.env.HUGFACE_API_TOKEN);

        const image = await client.textToImage({
            model: "black-forest-labs/FLUX.1-dev",
            inputs: prompt,
            parameters: {
                num_inference_steps: 25,
                width: 1080,
                height: 1920,
            },
        });

        const filename = `hugface_images/${Date.now()}.png`;
        const storageRef = ref(storage, filename);

        // Upload the blob
        const snapshot = await uploadBytes(storageRef, image, {
            contentType: 'image/png',
        });

        // Get the download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}