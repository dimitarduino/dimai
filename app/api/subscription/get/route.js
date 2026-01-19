import { NextResponse } from "next/server";
import { freemius } from "lib/reemius";
import { db } from "configs/db";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { email } = await req.json();

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

    // Try to get subscription from Freemius by email
    let freemiusSubscription = null;
    let currentPlan = null;
    
    try {
      // Use the correct Freemius SDK method to get subscriptions by email
      const subscriptions = await freemius.purchase.retrieveSubscriptionsByEmail(email);
      
      if (subscriptions && subscriptions.length > 0) {
        // Get the most recent/active subscription
        freemiusSubscription = subscriptions.find(sub => 
          sub.status === 'active' || sub.status === 'trialing'
        ) || subscriptions[0];
        
        if (freemiusSubscription) {
          // Get plan details
          if (freemiusSubscription.plan_id) {
            try {
              const plan = await freemius.api.plans.retrieve({ 
                id: freemiusSubscription.plan_id 
              });
              
              currentPlan = {
                id: plan.id || freemiusSubscription.plan_id,
                name: plan.name || `Plan ${freemiusSubscription.plan_id}`,
                price: plan.pricing?.amount || plan.price || freemiusSubscription.gross,
                billing_cycle: freemiusSubscription.billing_cycle || plan.billing_cycle,
                status: freemiusSubscription.status,
                expires_at: freemiusSubscription.expires_at || freemiusSubscription.next_payment,
                license_key: freemiusSubscription.license_key,
                subscription_id: freemiusSubscription.id,
              };
            } catch (planError) {
              console.log("Could not fetch plan details:", planError);
              // Use subscription data even if plan fetch fails
              currentPlan = {
                id: freemiusSubscription.plan_id,
                name: `Plan ${freemiusSubscription.plan_id}`,
                price: freemiusSubscription.gross || freemiusSubscription.price,
                billing_cycle: freemiusSubscription.billing_cycle,
                status: freemiusSubscription.status,
                expires_at: freemiusSubscription.expires_at || freemiusSubscription.next_payment,
                license_key: freemiusSubscription.license_key,
                subscription_id: freemiusSubscription.id,
              };
            }
          }
        }
      }
    } catch (error) {
      console.log("Could not fetch Freemius subscription:", error);
      console.log("Error details:", error.message, error.stack);
      // Continue without Freemius data
    }

    return NextResponse.json({
      success: true,
      user: {
        email: user[0].email,
        name: user[0].ime,
        credits: user[0].credits,
        subscription: user[0].pretplata,
      },
      subscription: freemiusSubscription,
      currentPlan: currentPlan,
    });
  } catch (error) {
    console.error("Error getting subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get subscription" },
      { status: 500 }
    );
  }
}
