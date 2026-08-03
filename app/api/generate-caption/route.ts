import { auth } from "@clerk/nextjs/server";
import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

const client = new AssemblyAI({
  apiKey: process.env.ASSEBLY_APIKEY ?? "",
});


export async function POST(req) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { audioUrl } = await req.json();
    const config = {
        audio_url: audioUrl
    }
    const transcript = await client.transcripts.transcribe(config)

    return NextResponse.json({ result: transcript.words });
}