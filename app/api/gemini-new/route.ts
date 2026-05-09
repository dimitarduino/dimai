import { chatSession } from "configs/Gemini2-5";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        const result = await chatSession.sendMessage(prompt);

        return NextResponse.json({"result": result.response.text()})
    } catch (err) {
        return NextResponse.json({ "error": err });
    }
}