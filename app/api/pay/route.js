import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { freemius } from "lib/reemius";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function POST(req) {
    try {
        const product = await freemius.api.product.retrieve();
        console.log(product);

        return NextResponse.json({ result: product });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 });
    }
}