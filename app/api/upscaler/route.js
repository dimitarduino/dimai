import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req) {
  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const { imageUrl } = await req.json();
    const input = {
      image: imageUrl,
      scale: 4,
      face_enhance: false
    };

    const output = await replicate.run("nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa", { input });

    const resp = await axios.get(output, { responseType: 'arraybuffer' });
    const base64 = `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`;

    const storageRef = ref(storage, `upscaled/${Date.now()}.png`);

    await uploadString(storageRef, base64, 'data_url');

    const downloadUrl = await getDownloadURL(storageRef);
    return NextResponse.json({ result: downloadUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}