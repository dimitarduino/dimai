import { chatSession } from "configs/AiModel";
import { NextResponse } from "next/server";
import { verifyInternalOrClerkAuth } from "@/lib/internal-auth";

export async function POST(req) {
    try {
        const userId = await verifyInternalOrClerkAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { prompt } = await req.json();
    
        console.log(prompt);
        const result = await chatSession.sendMessage(prompt);

        let text = result.response.text();
        
        // Remove markdown formatting if Gemini includes it
        if (text.startsWith("```json")) {
            text = text.substring(7);
        } else if (text.startsWith("```")) {
            text = text.substring(3);
        }
        if (text.endsWith("```")) {
            text = text.substring(0, text.length - 3);
        }
        
        text = text.trim();
        
        return NextResponse.json({"result": JSON.parse(text)})
    } catch (err) {
        console.error("Error in get-video-script:", err);
        return NextResponse.json({"error": err instanceof Error ? err.message : String(err)}, { status: 500 });
    }
}