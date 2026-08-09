import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import path from "path";
import { verifyInternalOrClerkAuth } from "@/lib/internal-auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "configs/Firebase";
import { buildGoogleTtsVoiceName } from "@/lib/google-tts-voice-name";
import { resolveSsmlGenderForShortsVoice } from "@/lib/shorts-curated-voices";

let client;
function getClient() {
    if (!client) {
        if (process.env.GOOGLE_CREDENTIALS_JSON) {
            const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
            client = new textToSpeech.TextToSpeechClient({ credentials });
        } else {
            client = new textToSpeech.TextToSpeechClient({
                keyFilename: path.join(process.cwd(), "secrets/google-tts.json"),
            });
        }
    }
    return client;
}

export async function POST(req) {
    try {
        const userId = await verifyInternalOrClerkAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text, id, gender, voice } = await req.json();

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
        }
        const sanitizedId = id.replace(/[^a-zA-Z0-9_-]/g, '');
        if (!sanitizedId || sanitizedId.length > 100) {
            return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
        }

        const languageCode = 'en-US';
        const fullVoiceName = buildGoogleTtsVoiceName(voice, languageCode);
        const ssmlGender = resolveSsmlGenderForShortsVoice(voice, gender);
        const storageRef = ref(storage, `aishortvideofiles/${sanitizedId}.mp3`);

        const request = {
            input: { text: text },
            voice: { languageCode, name: fullVoiceName, ssmlGender },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await getClient().synthesizeSpeech(request);

        const audioBuffer = Buffer.from(response.audioContent, 'binary');
        await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });
        const downloadUrl = await getDownloadURL(storageRef);

        return NextResponse.json({ result: downloadUrl });
    } catch (error) {
        console.error("Error generating audio:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}