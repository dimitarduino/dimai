import textToSpeech from "@google-cloud/text-to-speech";
import { chatSession } from "configs/AiModel";
import { NextResponse } from "next/server";
import util from 'util'
import fs from 'fs'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "configs/Firebase";

const client = new textToSpeech.TextToSpeechClient({
    keyFilename: "./secrets/google-tts.json",
  });

export async function POST(req) {
    const { text, id, gender, voice } = await req.json();
    
    // Sanitize id parameter to prevent path traversal
    if (!id || typeof id !== 'string') {
        return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
    }
    const sanitizedId = id.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!sanitizedId || sanitizedId.length > 100) {
        return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }
    
    const storageRef = ref(storage, `aishortvideofiles/${sanitizedId}.mp3`);

    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: gender, name: voice },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);

    const audioBuffer = Buffer.from(response.audioContent, 'binary');
    await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });
    const downloadUrl = await getDownloadURL(storageRef);

    return NextResponse.json({ result: downloadUrl });
}