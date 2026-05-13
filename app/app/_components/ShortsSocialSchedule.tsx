"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type SocialScheduleApiPayload = {
  postYouTube: boolean;
  postTiktok: boolean;
  scheduledAt: string;
  title: string;
  description: string;
};

export type ShortsSocialScheduleState = {
  enabled: boolean;
  apiPayload: SocialScheduleApiPayload | null;
};

type Props = {
  topicDefault: string;
  disabled?: boolean;
  onChange: (state: ShortsSocialScheduleState) => void;
};

export default function ShortsSocialSchedule({
  topicDefault,
  disabled,
  onChange,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [youtube, setYoutube] = useState(false);
  const [tiktok, setTiktok] = useState(false);
  const [youtubeLabel, setYoutubeLabel] = useState<string | null>(null);
  const [tiktokLabel, setTiktokLabel] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [postYoutube, setPostYoutube] = useState(true);
  const [postTiktok, setPostTiktok] = useState(false);
  const [scheduledLocal, setScheduledLocal] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
    router.replace("/app/shorts/create");
  }, [searchParams, router, loadConnections]);

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

  useEffect(() => {
    if (!enabled) {
      onChange({ enabled: false, apiPayload: null });
      return;
    }

    const when = new Date(scheduledLocal);
    if (!scheduledLocal || Number.isNaN(when.getTime())) {
      onChange({ enabled: true, apiPayload: null });
      return;
    }
    if (when.getTime() < Date.now() + 60_000) {
      onChange({ enabled: true, apiPayload: null });
      return;
    }

    const wantYt = postYoutube;
    const wantTk = postTiktok;
    if (!wantYt && !wantTk) {
      onChange({ enabled: true, apiPayload: null });
      return;
    }
    if (wantYt && !youtube) {
      onChange({ enabled: true, apiPayload: null });
      return;
    }
    if (wantTk && !tiktok) {
      onChange({ enabled: true, apiPayload: null });
      return;
    }

    onChange({
      enabled: true,
      apiPayload: {
        postYouTube: wantYt && youtube,
        postTiktok: wantTk && tiktok,
        scheduledAt: when.toISOString(),
        title: (title.trim() || topicDefault).slice(0, 500),
        description: description.trim().slice(0, 2000),
      },
    });
  }, [
    enabled,
    scheduledLocal,
    postYoutube,
    postTiktok,
    title,
    description,
    topicDefault,
    youtube,
    tiktok,
    onChange,
  ]);

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-4",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">
          Schedule social upload (optional)
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          Connect YouTube and/or TikTok, export your short to MP4 from the player
          before the scheduled time, and we will upload automatically at the time
          you pick. TikTok URL pulls require a verified video domain in TikTok
          Developer settings.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={youtube ? "secondary" : "default"}
          size="sm"
          onClick={() => {
            window.location.href = "/api/oauth/youtube/authorize";
          }}
        >
          {youtube ? "YouTube connected" : "Connect YouTube"}
        </Button>
        {youtube ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void disconnect("youtube")}
          >
            Disconnect
          </Button>
        ) : null}
        <Button
          type="button"
          variant={tiktok ? "secondary" : "default"}
          size="sm"
          onClick={() => {
            window.location.href = "/api/oauth/tiktok/authorize";
          }}
        >
          {tiktok ? "TikTok connected" : "Connect TikTok"}
        </Button>
        {tiktok ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void disconnect("tiktok")}
          >
            Disconnect
          </Button>
        ) : null}
      </div>
      {(youtubeLabel || tiktokLabel) && (
        <p className="text-xs text-muted-foreground">
          {youtubeLabel ? `YouTube: ${youtubeLabel}` : null}
          {youtubeLabel && tiktokLabel ? " · " : null}
          {tiktokLabel ? `TikTok: ${tiktokLabel}` : null}
        </p>
      )}

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          className="size-4 rounded border-input"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Schedule automatic upload after I export the MP4
      </label>

      {enabled ? (
        <div className="space-y-3 pt-1 border-t border-border/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                checked={postYoutube}
                onChange={(e) => setPostYoutube(e.target.checked)}
                disabled={!youtube}
              />
              Post to YouTube
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                checked={postTiktok}
                onChange={(e) => setPostTiktok(e.target.checked)}
                disabled={!tiktok}
              />
              Post to TikTok inbox
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shorts-schedule-at">Date and time</Label>
            <Input
              id="shorts-schedule-at"
              type="datetime-local"
              value={scheduledLocal}
              onChange={(e) => setScheduledLocal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shorts-schedule-title">Title</Label>
            <Input
              id="shorts-schedule-title"
              placeholder={topicDefault || "Video title"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shorts-schedule-desc">Description</Label>
            <Input
              id="shorts-schedule-desc"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
