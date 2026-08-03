import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "configs/db";
import { ChatConversations } from "configs/schema";
import { eq } from "drizzle-orm";

// GET - Fetch a specific conversation by ID
export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("id");
    const email = searchParams.get("email");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const conversation = await db
      .select()
      .from(ChatConversations)
      .where(eq(ChatConversations.id, parseInt(conversationId)));

    if (!conversation[0]) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify the conversation belongs to the user
    if (conversation[0].createdBy !== email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ conversation: conversation[0] });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

