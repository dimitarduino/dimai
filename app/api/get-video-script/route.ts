import { chatSession } from "configs/AiModel";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { prompt } = await req.json();
    
        console.log(prompt);
        const result = await chatSession.sendMessage(prompt);

        console.log(result);
        console.log(result.response.text());
    
        return NextResponse.json({"result": JSON.parse(result.response.text())})
    } catch (err) {
        return NextResponse.json({"error": err});
    }
}