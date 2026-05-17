"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Share2, Tag, Youtube } from "lucide-react";
import { toast } from "sonner";

import {
  finalizeYoutubeScheduledUploadAfterExport,
  generateSocialPublishMetadataForVideo,
  getVideoSocialUploadStatus,
  saveScheduledSocialUploadForVideo,
} from "@/app/app/_actions/dashboard-data";
import { SOCIAL_PUBLISH_TITLE_MAX } from "@/lib/generate-social-publish-metadata";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { cn } from "@/lib/utils";
import ScheduleDateTimePicker from "@/app/app/_components/ScheduleDateTimePicker";
import SocialScheduleBadges from "@/app/app/_components/SocialScheduleBadges";
import type {
  SocialScheduleSavePayload,
  VideoSocialUploadStatus,
} from "@/lib/social-schedule-types";
import { hasSocialSchedule } from "@/lib/social-upload-status-label";
import {
  YOUTUBE_DEFAULT_CATEGORY_ID,
  YOUTUBE_UPLOAD_CATEGORIES,
} from "@/lib/youtube-upload-categories";

type Props = {
  videoId: number;
  titleDefault: string;
  oauthReturnPath: string;
  disabled?: boolean;
};

function PlatformCard({
  name,
  connected,
  accountLabel,
  onConnect,
  onDisconnect,
  accentClass,
}: {
  name: string;
  connected: boolean;
  accountLabel: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  accentClass: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex flex-col gap-3 transition-colors",
        connected ? "border-primary/40 bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={cn("text-sm font-semibold", accentClass)}>{name}</p>
          {connected && accountLabel ? (
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
              {accountLabel}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">Not connected</p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
            connected
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {connected ? "Connected" : "Offline"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {!connected ? (
          <Button type="button" size="sm" className="w-full" onClick={onConnect}>
            Connect {name}
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full"
            onClick={onDisconnect}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}

export default function SocialUploadForm({
  videoId,
  titleDefault,
  oauthReturnPath,
  disabled,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [youtube, setYoutube] = useState(false);
  const [tiktok, setTiktok] = useState(false);
  const [youtubeLabel, setYoutubeLabel] = useState<string | null>(null);
  const [tiktokLabel, setTiktokLabel] = useState<string | null>(null);

  const [postYoutube, setPostYoutube] = useState(true);
  const [postTiktok, setPostTiktok] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeCategoryId, setYoutubeCategoryId] = useState(
    YOUTUBE_DEFAULT_CATEGORY_ID,
  );
  const [youtubeTagsInput, setYoutubeTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [youtubeUploaded, setYoutubeUploaded] = useState(false);
  const [tiktokUploaded, setTiktokUploaded] = useState(false);
  const [socialStatus, setSocialStatus] = useState<VideoSocialUploadStatus | null>(
    null,
  );
  const [metadataLoading, setMetadataLoading] = useState(true);

  const loadConnections = useCallback(async () => {
    try {
      const res = await axios.get<{
        youtube: boolean;
        tiktok: boolean;
        labels: { youtube: string | null; tiktok: string | null };
      }>("/api/oauth/social-connections");
      setYoutube(res.data.youtube);
      setTiktok(res.data.tiktok);
      setYoutubeLabel(res.data.labels.youtube);
      setTiktokLabel(res.data.labels.tiktok);
    } catch {
      setYoutube(false);
      setTiktok(false);
    }
  }, []);

  useEffect(() => {
    void loadConnections();
  }, [loadConnections]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setMetadataLoading(true);
      try {
        const status = await getVideoSocialUploadStatus(videoId);
        if (cancelled) return;
        setSocialStatus(status);
        setYoutubeUploaded(status.youtubeUploaded);
        setTiktokUploaded(status.tiktokUploaded);
        if (status.postYoutube) setPostYoutube(true);
        if (status.postTiktok) setPostTiktok(true);
        if (status.scheduledAt) {
          const d = new Date(status.scheduledAt);
          if (!Number.isNaN(d.getTime())) setScheduledAt(d);
        }

        const hasSavedCopy =
          Boolean(status.title?.trim()) || Boolean(status.description?.trim());

        if (hasSavedCopy) {
          if (status.title) setTitle(status.title);
          if (status.description) setDescription(status.description);
          if (status.youtubeTags) setYoutubeTagsInput(status.youtubeTags);
          if (status.youtubeCategoryId) {
            setYoutubeCategoryId(status.youtubeCategoryId);
          }
          return;
        }

        const res = await generateSocialPublishMetadataForVideo(videoId);
        if (cancelled) return;
        if (res.ok) {
          const { data } = res;
          setTitle((prev) => prev || data.title);
          setDescription((prev) => prev || data.description);
          setYoutubeTagsInput((prev) => prev || data.youtubeTags);
          setYoutubeCategoryId(data.youtubeCategoryId);
        } else if (titleDefault) {
          setTitle((prev) => prev || titleDefault.slice(0, SOCIAL_PUBLISH_TITLE_MAX));
        }
      } catch {
        if (!cancelled && titleDefault) {
          setTitle((prev) => prev || titleDefault.slice(0, SOCIAL_PUBLISH_TITLE_MAX));
        }
      } finally {
        if (!cancelled) setMetadataLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [videoId, titleDefault]);

  useEffect(() => {
    const oauth = searchParams.get("oauth");
    const ok = searchParams.get("ok");
    const err = searchParams.get("error");
    if (!oauth) return;
    if (ok === "1") {
      if (oauth === "youtube") toast.success("YouTube connected.");
      if (oauth === "tiktok") toast.success("TikTok connected.");
      void loadConnections();
    } else if (err) {
      toast.error(decodeURIComponent(err));
    }
    router.replace(oauthReturnPath);
  }, [searchParams, router, loadConnections, oauthReturnPath]);

  const disconnect = async (provider: "youtube" | "tiktok") => {
    try {
      await axios.post("/api/oauth/disconnect", { provider });
      toast.success(
        provider === "youtube" ? "YouTube disconnected." : "TikTok disconnected.",
      );
      await loadConnections();
    } catch {
      toast.error("Could not disconnect.");
    }
  };

  const oauthHref = (path: string) => {
    const q = new URLSearchParams({ returnTo: oauthReturnPath });
    return `${path}?${q.toString()}`;
  };

  const buildPayload = (): SocialScheduleSavePayload | null => {
    if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) return null;
    const when = scheduledAt;
    if (when.getTime() < Date.now() + 60_000) return null;

    const wantYt = postYoutube && !youtubeUploaded;
    const wantTk = postTiktok && !tiktokUploaded;
    if (!wantYt && !wantTk) return null;
    if (wantYt && !youtube) return null;
    if (wantTk && !tiktok) return null;

    return {
      postYouTube: wantYt && youtube,
      postTiktok: wantTk && tiktok,
      scheduledAt: when.toISOString(),
      title: (title.trim() || titleDefault).slice(0, SOCIAL_PUBLISH_TITLE_MAX),
      description: description.trim().slice(0, 2000),
      ...(wantYt
        ? {
            youtubeCategoryId,
            youtubeTags: youtubeTagsInput.trim().slice(0, 2000),
          }
        : {}),
    };
  };

  const onUpload = async () => {
    if (youtubeUploaded && tiktokUploaded) {
      toast.error("This video is already uploaded to YouTube and TikTok.");
      return;
    }
    if (youtubeUploaded && postYoutube) {
      toast.error("Video is already uploaded to YouTube.");
      return;
    }
    if (tiktokUploaded && postTiktok) {
      toast.error("Video is already uploaded to TikTok.");
      return;
    }

    const payload = buildPayload();
    if (!payload) {
      toast.error(
        "Choose a time at least one minute from now, select at least one connected platform, and fill required fields.",
      );
      return;
    }
    setUploading(true);
    try {
      const res = await saveScheduledSocialUploadForVideo(videoId, payload);
      if (!res.ok) {
        toast.error(res.error ?? "Could not start upload.");
        return;
      }
      if (payload.postYouTube) {
        const yt = await finalizeYoutubeScheduledUploadAfterExport(videoId);
        if (yt.error) {
          toast.error(yt.error);
          return;
        }
        if (yt.ok && !yt.skipped) {
          setYoutubeUploaded(true);
          setPostYoutube(false);
          toast.success(
            "YouTube: video uploaded as private and scheduled for your chosen time.",
          );
          if (!payload.postTiktok) return;
        }
      }
      if (payload.postTiktok) {
        toast.success("TikTok upload queued for your scheduled time.");
      } else if (!payload.postYouTube) {
        toast.success("Upload scheduled.");
      }
      const status = await getVideoSocialUploadStatus(videoId);
      setYoutubeUploaded(status.youtubeUploaded);
      setTiktokUploaded(status.tiktokUploaded);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={cn(
        "space-y-8",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Share2 className="size-4 text-primary" />
          Connect accounts
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformCard
            name="YouTube"
            connected={youtube}
            accountLabel={youtubeLabel}
            accentClass="text-red-600 dark:text-red-400"
            onConnect={() => {
              window.location.href = oauthHref("/api/oauth/youtube/authorize");
            }}
            onDisconnect={() => void disconnect("youtube")}
          />
          <PlatformCard
            name="TikTok"
            connected={tiktok}
            accountLabel={tiktokLabel}
            accentClass="text-foreground"
            onConnect={() => {
              window.location.href = oauthHref("/api/oauth/tiktok/authorize");
            }}
            onDisconnect={() => void disconnect("tiktok")}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar className="size-4 text-primary" />
          Schedule & platforms
        </div>

        {socialStatus && hasSocialSchedule(socialStatus) ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
            <p className="text-sm font-medium text-foreground mb-2">
              Already scheduled
            </p>
            <SocialScheduleBadges status={socialStatus} />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="size-4 rounded border-input accent-primary"
              checked={postYoutube}
              onChange={(e) => setPostYoutube(e.target.checked)}
              disabled={
                !youtube ||
                (socialStatus?.postYoutube && socialStatus.status !== "failed")
              }
            />
            <Youtube className="size-4 text-red-600" />
            YouTube (native schedule)
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="size-4 rounded border-input accent-primary"
              checked={postTiktok}
              onChange={(e) => setPostTiktok(e.target.checked)}
              disabled={
                !tiktok ||
                (socialStatus?.postTiktok && socialStatus.status !== "failed")
              }
            />
            TikTok inbox
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="social-schedule-at">Go live / TikTok time</Label>
          <ScheduleDateTimePicker
            id="social-schedule-at"
            value={scheduledAt}
            onChange={setScheduledAt}
          />
          <p className="text-xs text-muted-foreground">
            YouTube needs this time to be at least ~15 minutes from now. TikTok runs
            at this time after your MP4 is exported.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Tag className="size-4 text-primary" />
            Video details
          </div>
          {metadataLoading ? (
            <span className="text-xs text-muted-foreground animate-pulse">
              Generating with AI…
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "grid gap-4 sm:grid-cols-2 transition-opacity",
            metadataLoading && "opacity-70",
          )}
        >
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="social-schedule-title">Title (with hashtags)</Label>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {title.length}/{SOCIAL_PUBLISH_TITLE_MAX}
              </span>
            </div>
            <Input
              id="social-schedule-title"
              placeholder={titleDefault || "Video title"}
              value={title}
              maxLength={SOCIAL_PUBLISH_TITLE_MAX}
              disabled={metadataLoading}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="social-schedule-desc">Description</Label>
            <Textarea
              id="social-schedule-desc"
              placeholder="Video description"
              value={description}
              rows={4}
              disabled={metadataLoading}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {youtube ? (
          <div className="space-y-4 rounded-lg border border-dashed border-border/80 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              YouTube only
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="social-yt-category">Category</Label>
                <Select
                  value={youtubeCategoryId}
                  onValueChange={setYoutubeCategoryId}
                  disabled={metadataLoading}
                >
                  <SelectTrigger id="social-yt-category" className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {YOUTUBE_UPLOAD_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="social-yt-tags">Tags</Label>
                <Input
                  id="social-yt-tags"
                  placeholder="shorts, ai, story"
                  value={youtubeTagsInput}
                  disabled={metadataLoading}
                  onChange={(e) => setYoutubeTagsInput(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Comma-separated · up to ~30 tags
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <Button
        type="button"
        size="lg"
        className="w-full h-12 text-sm font-semibold uppercase tracking-wider shadow-md"
        disabled={
          uploading ||
          disabled ||
          (youtubeUploaded && tiktokUploaded)
        }
        onClick={() => void onUpload()}
      >
        {uploading
          ? "Uploading…"
          : youtubeUploaded && tiktokUploaded
            ? "Already uploaded"
            : "Upload to social media"}
      </Button>
    </div>
  );
}
