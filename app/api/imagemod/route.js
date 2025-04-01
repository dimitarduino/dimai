import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req) {
    try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
        const { 
            imageUrl,
            prompt,
            style
        } = await req.json();
        const output = await replicate.run(
            "fofr/face-to-many:a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf",
            {
                input: {
                    image: imageUrl,
                    style: style,
                    prompt: prompt,
                    lora_scale: 1,
                    negative_prompt: "",
                    prompt_strength: 4.5,
                    denoising_strength: 0.55,
                    instant_id_strength: 0.8,
                    control_depth_strength: 0.8
                }
            }
        );

        const resp = await axios.get(output[0], { responseType: 'arraybuffer' });
      
        const base64 = `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`;
        // console.log(base64);
        const storageRef = ref(storage, `modified_imgs/${Date.now()}.png`);

        await uploadString(storageRef, base64, 'data_url');

        const downloadUrl = await getDownloadURL(storageRef);
     
        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}