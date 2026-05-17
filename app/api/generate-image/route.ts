import { NextResponse } from "next/server";
import axios from "axios";
import Replicate from "replicate";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { storage } from "configs/Firebase";
import { runReplicateImageWithRetry } from "@/lib/generate-replicate-image";
import { isReplicateNsfwError } from "@/lib/replicate-image-prompt";

export async function POST(req) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_APIKEY,
    });

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const imageUrl = await runReplicateImageWithRetry(replicate, prompt);

    const resp = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const base64 = Buffer.from(resp.data).toString("base64");
    const base64Full = `data:image/png;base64,${base64}`;

    const storageRef = ref(storage, `aishortvideofiles/${Date.now()}.png`);
    await uploadString(storageRef, base64Full, "data_url");
    const downloadUrl = await getDownloadURL(storageRef);

    return NextResponse.json({ result: downloadUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = isReplicateNsfwError(message) ? 422 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
