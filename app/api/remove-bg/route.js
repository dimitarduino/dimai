import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req) {
  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const { imageUrl } = await req.json();
    const input = { image: imageUrl };

    // bria/remove-background
    const output = await replicate.run("men1scus/birefnet:f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7", {input})
    const resp = await axios.get(output, { responseType: 'arraybuffer' });
    const base64 = `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`;
    const storageRef = ref(storage, `background-removed/${Date.now()}.png`);
    
    await uploadString(storageRef, base64, 'data_url');

    const downloadUrl = await getDownloadURL(storageRef);
    return NextResponse.json({ result: downloadUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}