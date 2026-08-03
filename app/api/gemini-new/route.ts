import { chatSession } from "configs/Gemini2-5";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { prompt } = await req.json();

        const result = await chatSession.sendMessage(prompt);

        return NextResponse.json({"result": result.response.text()})
    } catch (err) {
        console.error("Gemini API error:", err);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}