import { NextResponse } from "next/server";
import { db } from "configs/db";
import { ChatConversations } from "configs/schema";
import { eq, desc } from "drizzle-orm";

// GET - Fetch all conversations for a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const conversations = await db
      .select()
      .from(ChatConversations)
      .where(eq(ChatConversations.createdBy, email))
      .orderBy(desc(ChatConversations.createdAt));

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST - Create a new conversation or update existing one
export async function POST(req) {
  try {
    const { conversationId, title, model, messages, email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Generate title from first user message if not provided
    const conversationTitle = title || 
      (messages.find(m => m.role === 'user')?.content?.substring(0, 50) || 'New Chat');

    if (conversationId) {
      // Update existing conversation
      // Get existing conversation first to preserve model if not provided
      const existing = await db
        .select()
        .from(ChatConversations)
        .where(eq(ChatConversations.id, conversationId))
        .limit(1);

      const updated = await db
        .update(ChatConversations)
        .set({
          title: conversationTitle,
          model: model || existing[0]?.model || 'openai/gpt-5-nano',
          messages: messages,
          updatedAt: now,
        })
        .where(eq(ChatConversations.id, conversationId))
        .returning();

      return NextResponse.json({ conversation: updated[0] });
    } else {
      // Create new conversation
      const newConversation = await db
        .insert(ChatConversations)
        .values({
          title: conversationTitle,
          model: model || 'openai/gpt-5-nano',
          messages: messages,
          createdBy: email,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return NextResponse.json({ conversation: newConversation[0] });
    }
  } catch (error) {
    console.error("Error saving conversation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save conversation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a conversation
export async function DELETE(req) {
  try {
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

    // Verify the conversation belongs to the user before deleting
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

    if (conversation[0].createdBy !== email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await db
      .delete(ChatConversations)
      .where(eq(ChatConversations.id, parseInt(conversationId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

