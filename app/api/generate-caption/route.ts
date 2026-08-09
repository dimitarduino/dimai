import { verifyInternalOrClerkAuth } from "@/lib/internal-auth";
import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

const client = new AssemblyAI({
  apiKey: process.env.ASSEBLY_APIKEY ?? "",
});


export async function POST(req) {
    try {
        const userId = await verifyInternalOrClerkAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { audioUrl } = await req.json();
        const config = {
            audio_url: audioUrl
        }
        const transcript = await client.transcripts.transcribe(config)

        return NextResponse.json({ result: transcript.words });
    } catch (error) {
        console.error("Error generating captions:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}