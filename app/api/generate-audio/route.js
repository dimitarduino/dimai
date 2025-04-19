import textToSpeech from "@google-cloud/text-to-speech";
import { chatSession } from "configs/AiModel";
import { NextResponse } from "next/server";
import util from 'util'
import fs from 'fs'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "configs/Firebase";

const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.TEXT_TO_SPEECH_APIKEY
});


export async function POST(req) {
    const { text, id, gender, voice } = await req.json();
    const storageRef = ref(storage, 'aishortvideofiles/' + id + ".mp3");

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