import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req) {
    try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
        const { 
            swapImageUrl,
            imageUrl
        } = await req.json();

        const output = await replicate.run(
            "cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111",
            {
                input: {
                    swap_image: swapImageUrl,
                    input_image: imageUrl
                }
            }
        );

        const resp = await axios.get(output, { responseType: 'arraybuffer' });
      
        const base64 = `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`;
        // console.log(base64);
        const storageRef = ref(storage, `modified_imgs/${Date.now()}.png`);

        await uploadString(storageRef, base64, 'data_url');

        const downloadUrl = await getDownloadURL(storageRef);
     
        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        // console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}