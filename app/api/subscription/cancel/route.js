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

    // Cancel subscription in Freemius
    try {
      // Get subscriptions by email
      const subscriptions = await freemius.purchase.retrieveSubscriptionsByEmail(email);
      
      if (subscriptions && subscriptions.length > 0) {
        // Find active subscription
        const activeSubscription = subscriptions.find(sub => 
          sub.status === 'active' || sub.status === 'trialing'
        );
        
        if (activeSubscription && activeSubscription.id) {
          // Cancel the subscription using the subscription ID
          await freemius.api.subscriptions.cancel({ 
            id: activeSubscription.id 
          });
          console.log("Subscription canceled in Freemius:", activeSubscription.id);
        }
      }
    } catch (error) {
      console.error("Error canceling Freemius subscription:", error);
      console.error("Error details:", error.message);
      // Continue to update database even if Freemius call fails
    }

    // Update subscription status in database
    const updatedUser = await db
      .update(Users)
      .set({
        pretplata: false
      })
      .where(eq(Users.email, email))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Subscription canceled successfully",
      user: {
        email: updatedUser[0].email,
        subscription: updatedUser[0].pretplata,
      },
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
