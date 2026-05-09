import { NextResponse } from "next/server";
import { freemius } from "lib/reemius";
import { db } from "configs/db";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { email, licenseKey } = await req.json();

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

    // Verify license key with Freemius
    try {
      // Verify the license key
      // const license = await freemius.api.licenses.retrieve({ licenseKey });
      // For now, we'll just update the database
      console.log("Registering license key:", licenseKey);
    } catch (error) {
      console.error("Error verifying license key:", error);
      return NextResponse.json(
        { error: "Invalid license key" },
        { status: 400 }
      );
    }

    // Update subscription status in database
    const updatedUser = await db
      .update(Users)
      .set({
        pretplata: true
      })
      .where(eq(Users.email, email))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Subscription registered successfully",
      user: {
        email: updatedUser[0].email,
        subscription: updatedUser[0].pretplata,
      },
    });
  } catch (error) {
    console.error("Error registering subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register subscription" },
      { status: 500 }
    );
  }
}
