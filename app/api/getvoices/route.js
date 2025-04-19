import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";

const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.TEXT_TO_SPEECH_APIKEY
});


export async function POST(req) {
    const [result] = await client.listVoices({});
    const voices = result.voices;

    const enUSVoices = voices.filter((voice) =>
        voice.languageCodes.includes('en-US')
    ).map(voice => ({
        name: voice.name,
        ssmlGender: voice.ssmlGender,
        sampleRate: voice.naturalSampleRateHertz,
    }));

    return NextResponse.json({ result: enUSVoices });
}