"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";

import SocialUploadForm from "@/app/app/_components/SocialUploadForm";
import { getVideoDataByIdForOwner } from "@/app/app/_actions/dashboard-data";
import { Button } from "@/ui/button";
import { publishPagePath } from "@/lib/social-oauth-state";
import type { InferSelectModel } from "drizzle-orm";
import type { VideoData } from "@/configs/schema";

type VideoRecord = InferSelectModel<typeof VideoData>;

function titleFromVideo(v: VideoRecord | null): string {
  if (!v?.script) return "Short";
  try {
    const s = v.script as unknown;
    if (Array.isArray(s) && s.length > 0) {
      const first = s[0] as { contentText?: string };
      if (typeof first?.contentText === "string" && first.contentText.trim()) {
        return first.contentText.trim().slice(0, 120);
      }
    }
  } catch {
    /* ignore */
  }
  return "Short";
}

function PublishPageContent() {
  const params = useParams();
  const router = useRouter();
  const videoId = Number(params.videoId);
  const [video, setVideo] = useState<VideoRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(videoId) || videoId <= 0) {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const row = await getVideoDataByIdForOwner(videoId);
        setVideo(row ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [videoId]);

  if (!Number.isFinite(videoId) || videoId <= 0) {
    return (
      <div className="md:px-20 max-w-3xl mx-auto py-12">
        <p className="text-muted-foreground">Invalid video.</p>
        <Button variant="link" asChild className="px-0 mt-2">
          <Link href="/app/shorts">Back to shorts</Link>
        </Button>
      </div>
    );
  }

  const hasExported = Boolean(video?.downloadUrl?.trim());
  const oauthPath = publishPagePath(videoId);

  return (
    <div className="md:px-20 max-w-3xl mx-auto py-8 sm:py-12">
      <Button variant="ghost" asChild className="mb-6 -ml-2 gap-2 text-muted-foreground">
        <Link href="/app/shorts">
          <ArrowLeft className="size-4" />
          Back to shorts
        </Link>
      </Button>

      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Share2 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Upload to social media
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Schedule YouTube and TikTok from one place.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading video…</p>
      ) : !video ? (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            This video was not found or you do not have access.
          </p>
          <Button variant="outline" asChild>
            <Link href="/app/shorts">Go to shorts</Link>
          </Button>
        </div>
      ) : !hasExported ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
          <p className="text-sm font-medium text-foreground">Export required</p>
          <p className="text-sm text-muted-foreground">
            Export your short to MP4 first. Open the video from your library, use
            <span className="font-medium text-foreground"> Export (2 credits)</span>, then
            return here to upload to YouTube or TikTok.
          </p>
          <Button
            type="button"
            onClick={() => router.push("/app/shorts")}
          >
            Open my shorts
          </Button>
        </div>
      ) : (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading form…</p>}>
          <SocialUploadForm
            videoId={videoId}
            titleDefault={titleFromVideo(video)}
            oauthReturnPath={oauthPath}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function ShortsPublishPage() {
  return (
    <Suspense fallback={<div className="md:px-20 max-w-3xl mx-auto py-12">Loading…</div>}>
      <PublishPageContent />
    </Suspense>
  );
}
