import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import path from "path";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "configs/Firebase";

let client;
function getClient() {
    if (!client) {
        client = new textToSpeech.TextToSpeechClient({
            keyFilename: path.join(process.cwd(), "secrets/google-tts.json"),
        });
    }
    return client;
}

const CHIRP3_HD_VOICES = new Set([
    "Achernar", "Achird", "Algenib", "Algieba", "Alnilam",
    "Aoede", "Autonoe", "Callirrhoe", "Charon", "Despina",
    "Enceladus", "Erinome", "Fenrir", "Gacrux", "Iapetus",
    "Kore", "Laomedeia", "Leda", "Orus", "Pulcherrima",
    "Puck", "Rasalgethi", "Sadachbia", "Sadaltager", "Schedar",
    "Sulafat", "Umbriel", "Vindemiatrix", "Zephyr", "Zubenelgenubi",
]);

function buildVoiceName(voice, languageCode) {
    if (CHIRP3_HD_VOICES.has(voice)) {
        return `${languageCode}-Chirp3-HD-${voice}`;
    }
    return voice;
}

export async function POST(req) {
    try {
        const { text, id, gender, voice } = await req.json();

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
        }
        const sanitizedId = id.replace(/[^a-zA-Z0-9_-]/g, '');
        if (!sanitizedId || sanitizedId.length > 100) {
            return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
        }

        const languageCode = 'en-US';
        const fullVoiceName = buildVoiceName(voice, languageCode);
        const storageRef = ref(storage, `aishortvideofiles/${sanitizedId}.mp3`);

        const request = {
            input: { text: text },
            voice: { languageCode, name: fullVoiceName, ssmlGender: gender },
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