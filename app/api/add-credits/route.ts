import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "configs/db";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, credits } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!credits || credits <= 0) {
      return NextResponse.json(
        { error: "Valid credits amount is required" },
        { status: 400 }
      );
    }

    // Fetch the user by email
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update credits - add to existing credits
    const updatedUser = await db
      .update(Users)
      .set({
        credits: user[0].credits + credits
      })
      .where(eq(Users.email, email))
      .returning();

    return NextResponse.json({
      success: true,
      message: `Added ${credits} credits successfully`,
      user: {
        email: updatedUser[0].email,
        credits: updatedUser[0].credits
      }
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    return NextResponse.json(
      { error: "Failed to add credits" },
      { status: 500 }
    );
  }
}
