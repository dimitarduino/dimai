"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  oauthReturnPath: string;
  showYoutube?: boolean;
  showTiktok?: boolean;
  className?: string;
};

export default function SocialPlatformConnect({
  oauthReturnPath,
  showYoutube = true,
  showTiktok = true,
  className,
}: Props) {
  const searchParams = useSearchParams();
  const [youtube, setYoutube] = useState(false);
  const [tiktok, setTiktok] = useState(false);
  const [youtubeLabel, setYoutubeLabel] = useState<string | null>(null);
  const [tiktokLabel, setTiktokLabel] = useState<string | null>(null);

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
    if (ok === "1" && (oauth === "youtube" || oauth === "tiktok")) {
      toast.success(
        oauth === "youtube" ? "YouTube connected" : "TikTok connected",
      );
      void loadConnections();
    }
  }, [searchParams, loadConnections]);

  const connect = (provider: "youtube" | "tiktok") => {
    const q = new URLSearchParams({ returnTo: oauthReturnPath });
    window.location.href = `/api/oauth/${provider}/authorize?${q.toString()}`;
  };

  const disconnect = async (provider: "youtube" | "tiktok") => {
    try {
      await axios.post("/api/oauth/disconnect", { provider });
      toast.success(`Disconnected ${provider === "youtube" ? "YouTube" : "TikTok"}`);
      await loadConnections();
    } catch {
      toast.error("Could not disconnect");
    }
  };

  if (!showYoutube && !showTiktok) return null;

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {showYoutube ? (
        <PlatformRow
          name="YouTube"
          connected={youtube}
          label={youtubeLabel}
          onConnect={() => connect("youtube")}
          onDisconnect={() => void disconnect("youtube")}
        />
      ) : null}
      {showTiktok ? (
        <PlatformRow
          name="TikTok"
          connected={tiktok}
          label={tiktokLabel}
          onConnect={() => connect("tiktok")}
          onDisconnect={() => void disconnect("tiktok")}
        />
      ) : null}
    </div>
  );
}

function PlatformRow({
  name,
  connected,
  label,
  onConnect,
  onDisconnect,
}: {
  name: string;
  connected: boolean;
  label: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2.5 flex items-center justify-between gap-2",
        connected ? "border-primary/40 bg-background" : "border-border/80 bg-background/60",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {connected ? label || "Connected" : "Not connected"}
        </p>
      </div>
      {connected ? (
        <Button type="button" size="sm" variant="outline" onClick={onDisconnect}>
          Disconnect
        </Button>
      ) : (
        <Button type="button" size="sm" onClick={onConnect}>
          Connect
        </Button>
      )}
    </div>
  );
}
