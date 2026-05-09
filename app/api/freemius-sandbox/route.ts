import { NextResponse } from "next/server";
import { freemius } from "lib/reemius";

export async function GET(req) {
  try {
    // Only allow sandbox in development or when explicitly enabled
    const isSandboxEnabled = 
      process.env.NODE_ENV === 'development' || 
      process.env.NEXT_PUBLIC_FREEMIUS_SANDBOX_ENABLED === 'true';

    if (!isSandboxEnabled) {
      return NextResponse.json(
        { error: "Sandbox mode is disabled in production" },
        { status: 403 }
      );
    }

    // Get sandbox parameters from Freemius SDK
    // getSandboxParams() returns an object with { token, ctx } directly
    const sandboxParams = await freemius.checkout.getSandboxParams();

    console.log('Sandbox params retrieved:', JSON.stringify(sandboxParams, null, 2));

    // Return the sandbox params directly (contains token and ctx)
    return NextResponse.json(sandboxParams);
  } catch (error) {
    console.error("Error getting sandbox params:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get sandbox parameters" },
      { status: 500 }
    );
  }
}
