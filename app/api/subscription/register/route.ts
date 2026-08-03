import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { freemius } from "lib/reemius";
import { db } from "configs/db";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      // TODO: Implement actual Freemius license verification when SDK supports it.
      // For now, require auth at minimum so anonymous users cannot activate subscriptions.
      // const license = await freemius.api.licenses.retrieve({ licenseKey });
      console.log("Registering license key for authenticated user:", userId);
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
      { error: "Failed to register subscription" },
      { status: 500 }
    );
  }
}
