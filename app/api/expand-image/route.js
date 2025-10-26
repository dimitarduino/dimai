import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req) {
    try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

        const { imageUrl, aspectRatio } = await req.json();
        const input = { image: imageUrl, aspect_ratio: aspectRatio };

        // bria/remove-background
        const output = await replicate.run("bria/expand-image", { input })
        const resp = await axios.get(output, { responseType: 'arraybuffer' });
        const base64 = `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`;
        const storageRef = ref(storage, `expand-images/${Date.now()}.png`);

        await uploadString(storageRef, base64, 'data_url');

        const downloadUrl = await getDownloadURL(storageRef);
        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}