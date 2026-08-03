import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { renderShortVideoToMp4Url } from "@/lib/export-short-video-server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { inputProps } = await req.json();
    if (!inputProps) {
      return NextResponse.json({ error: "Missing inputProps" }, { status: 400 });
    }

    const result = await renderShortVideoToMp4Url(inputProps);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
