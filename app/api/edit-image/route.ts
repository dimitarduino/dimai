import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { coerceReplicateFetchUrl } from "@/lib/replicate-fetch-url";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req: NextRequest) {
    try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_APIKEY });
        const {
            imageUrl,
            prompt
        } = await req.json();

        if (!imageUrl || !prompt) {
            return NextResponse.json(
                { error: "Image URL and prompt are required" },
                { status: 400 }
            );
        }

        const output = await replicate.run(
            "reve/edit-fast",
            {
                input: {
                    image: imageUrl,
                    prompt: prompt
                }
            }
        );

        console.log(output);

        const resp = await axios.get(coerceReplicateFetchUrl(output), {
          responseType: "arraybuffer",
        });

        const base64 = `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`;
        const storageRef = ref(storage, `edited_images/${Date.now()}.png`);

        await uploadString(storageRef, base64, 'data_url');

        const downloadUrl = await getDownloadURL(storageRef);

        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        console.error('Edit image error:', error);
        return NextResponse.json({ error: error.message || 'Failed to edit image' }, { status: 500 });
    }
}

