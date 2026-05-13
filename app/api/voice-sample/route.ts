import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildGoogleTtsVoiceName } from "@/lib/google-tts-voice-name";
import { getShortsCuratedVoice } from "@/lib/shorts-curated-voices";

let client: TextToSpeechClient | undefined;

function getTtsKeyPath(): string {
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (fromEnv) {
    return path.isAbsolute(fromEnv) ? fromEnv : path.resolve(process.cwd(), fromEnv);
  }
  return path.join(process.cwd(), "secrets/google-tts.json");
}

function getClient(): TextToSpeechClient {
  if (!client) {
    const keyFilename = getTtsKeyPath();
    if (!fs.existsSync(keyFilename)) {
      throw new Error(`Google TTS credentials missing at ${keyFilename}`);
    }
    client = new TextToSpeechClient({ keyFilename });
  }
  return client;
}

const SAMPLE_TEXT =
  "Hi! This is how I'll sound in your short. Let's make something people can't scroll past.";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { voice?: string; gender?: string };
    const voice = typeof body.voice === "string" ? body.voice.trim() : "";

    const entry = getShortsCuratedVoice(voice);
    if (!entry) {
      return NextResponse.json({ error: "Unknown voice" }, { status: 400 });
    }

    const languageCode = "en-US";
    const fullVoiceName = buildGoogleTtsVoiceName(entry.name, languageCode);

    const [response] = await getClient().synthesizeSpeech({
      input: { text: SAMPLE_TEXT },
      voice: {
        languageCode,
        name: fullVoiceName,
        ssmlGender: entry.ssmlGender,
      },
      audioConfig: { audioEncoding: "MP3" },
    });

    const buf = response.audioContent;
    if (!buf || (typeof buf === "object" && "length" in buf && buf.length === 0)) {
      return NextResponse.json({ error: "Empty audio" }, { status: 500 });
    }

    const buffer = Buffer.isBuffer(buf) ? buf : Buffer.from(buf as Uint8Array);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Voice sample failed";
    console.error("[voice-sample]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
