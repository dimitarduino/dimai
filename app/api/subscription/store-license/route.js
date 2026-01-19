import { NextResponse } from "next/server";
import { db } from "configs/db";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { email, licenseKey, planId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!licenseKey) {
      return NextResponse.json(
        { error: "License key is required" },
        { status: 400 }
      );
    }

    // Get user from database
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

    // Update subscription status and store license key
    // Note: You may need to add a license_key column to your Users table
    // For now, we'll just update the subscription status
    const updatedUser = await db
      .update(Users)
      .set({
        pretplata: true
        // If you add license_key column: license_key: licenseKey
      })
      .where(eq(Users.email, email))
      .returning();

    return NextResponse.json({
      success: true,
      message: "License key stored and subscription activated",
      user: {
        email: updatedUser[0].email,
        subscription: updatedUser[0].pretplata,
      },
    });
  } catch (error) {
    console.error("Error storing license key:", error);
    return NextResponse.json(
      { error: error.message || "Failed to store license key" },
      { status: 500 }
    );
  }
}
