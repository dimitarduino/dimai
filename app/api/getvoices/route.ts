import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";

const client = new textToSpeech.TextToSpeechClient({
    keyFilename: "./secrets/google-tts.json"
});


export async function POST(req) {
    try {
        const [result] = await client.listVoices({});
        const voices = result.voices ?? [];

        const enUSVoices = voices.filter((voice) =>
            (voice.languageCodes ?? []).includes("en-US")
        ).map((voice) => ({
            name: voice.name,
            ssmlGender: voice.ssmlGender,
            sampleRate: voice.naturalSampleRateHertz,
        }));

        return NextResponse.json({ result: enUSVoices });
    } catch (error) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}