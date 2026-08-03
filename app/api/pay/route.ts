import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { freemius } from "lib/reemius";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const product = await freemius.api.product.retrieve();

        return NextResponse.json({ result: product });
    } catch (error) {
        console.error("Error retrieving product:", error);
        return NextResponse.json({ error: "Failed to retrieve product info" }, { status: 500 });
    }
}