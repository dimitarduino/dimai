import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
            throw new Error(
                `Google TTS credentials file missing. Expected at ${keyFilename} (or set GOOGLE_APPLICATION_CREDENTIALS).`
            );
        }
        client = new TextToSpeechClient({ keyFilename });
    }
    return client;
}

function ttsErrorMessage(error: unknown): string {
    const e = error as {
        message?: string;
        code?: number;
        details?: string;
    };
    const msg = e?.message?.trim() ?? "";
    const looksLikeBrokenGrpcMessage =
        msg === "undefined undefined: undefined" ||
        /^undefined(\s+undefined|:)+/i.test(msg);

    if (msg && !looksLikeBrokenGrpcMessage) {
        return msg;
    }

    if (e?.code != null || e?.details) {
        const parts = [
            e.code != null ? `status ${e.code}` : null,
            e.details,
            e.message && !looksLikeBrokenGrpcMessage ? e.message : null,
        ].filter(Boolean);
        if (parts.length) return parts.join(" — ");
    }

    if (error instanceof Error && error.message?.trim() && !looksLikeBrokenGrpcMessage) {
        return error.message;
    }

    return "Google Text-to-Speech failed (enable the API, check billing, and verify the service account key path).";
}

export async function POST() {
    try {
        const tts = getClient();
        const [result] = await tts.listVoices({});

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
        console.error("[getvoices]", error);
        const message = ttsErrorMessage(error);
        const stack = error instanceof Error ? error.stack : undefined;
        return NextResponse.json(
            { error: message, ...(process.env.NODE_ENV === "development" && stack && { stack }) },
            { status: 500 }
        );
    }
}