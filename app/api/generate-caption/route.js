import textToSpeech from "@google-cloud/text-to-speech";
import { chatSession } from "configs/AiModel";
import { NextResponse } from "next/server";
import util from 'util'
import fs from 'fs'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "configs/Firebase";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: "8cb3cda3f75641108649914992e4bd5a"
})


export async function POST(req) {
    const { audioUrl } = await req.json();
    const config = {
        audio_url: audioUrl
    }
    const transcript = await client.transcripts.transcribe(config)
    // console.log(transcript.text)

    return NextResponse.json({ result: transcript.words });
}