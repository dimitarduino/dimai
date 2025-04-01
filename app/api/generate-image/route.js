import { NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { storage } from "configs/Firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export async function POST(req) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_APIKEY
    });

    const { prompt } = await req.json();

    const input = {
      prompt: prompt,
      num_outputs: 1,
      width: 1024,
      height: 1280
    };
    const output = await replicate.run("bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe", { input });

    const local = `./${new Date().getTime()}.png`;

    // Save the output file (this is hypothetical, depending on how your 'output' data is structured)
    // await writeFile(local, output[0]);
    // Get the image as a buffer (this replaces the local file reading process)
    const resp = await axios.get(output[0], { responseType: 'arraybuffer' });
    const base64 = Buffer.from(resp.data).toString('base64');

    // Fix base64 format by adding the proper prefix
    const base64Full = `data:image/png;base64,${base64}`;

    // Upload the base64 string to Firebase Storage
    const storageRef = ref(storage, `aishortvideofiles/${new Date().getTime()}.png`);

    await uploadString(storageRef, base64Full, 'data_url');

    // Retrieve the download URL of the uploaded image
    const downloadUrl = await getDownloadURL(storageRef);
    // Return the URL as the response
    return NextResponse.json({ result: downloadUrl });
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}