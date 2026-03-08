import textToSpeech from "@google-cloud/text-to-speech";
import { chatSession } from "configs/AiModel";
import { NextResponse } from "next/server";
import util from 'util'
import fs from 'fs'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "configs/Firebase";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: process.env.ASSEBLY_APIKEY
})


export async function POST(req) {
    const { audioUrl } = await req.json();
    const config = {
        audio_url: audioUrl
    }
    const transcript = await client.transcripts.transcribe(config)

    return NextResponse.json({ result: transcript.words });
}