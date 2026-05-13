"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import {
  SHORTS_BACKGROUND_TRACKS,
  type ShortsBackgroundTrack,
} from "@/lib/shorts-background-music";

type SelectBackgroundMusicProps = {
  value: string | undefined;
  onUserSelect: (name: string, id: string) => void;
  name?: string;
};

function SelectBackgroundMusic({
  value,
  onUserSelect,
  name = "backgroundMusicId",
}: SelectBackgroundMusicProps) {
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selected =
    SHORTS_BACKGROUND_TRACKS.find((t) => t.id === value) ?? SHORTS_BACKGROUND_TRACKS[0];

  const stopPreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setPreviewing(null);
    setLoadingPreview(null);
  }, []);

  useEffect(() => {
    return () => stopPreview();
  }, [stopPreview]);

  useEffect(() => {
    stopPreview();
  }, [value, stopPreview]);

  const playTrackPreview = async (track: ShortsBackgroundTrack) => {
    if (!track.url) return;

    if (previewing === track.id && audioRef.current && !audioRef.current.paused) {
      stopPreview();
      return;
    }

    stopPreview();
    setLoadingPreview(track.id);

    try {
      const audio = new Audio(track.url);
      audioRef.current = audio;
      setPreviewing(track.id);
      audio.onended = () => stopPreview();
      audio.onerror = () => {
        toast.error("Playback failed.");
        stopPreview();
      };
      await audio.play();
    } catch {
      toast.error("Could not play this track.");
      stopPreview();
    } finally {
      setLoadingPreview(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-primary">Background music</h2>
        <p className="text-sm text-muted-foreground">
          Royalty-free tracks for TikTok-style shorts. Tap a row to choose; use play to preview. Mix sits under
          your voice in the export. Check license notes before posting publicly (especially CC BY tracks).
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40">
        <ScrollArea className="h-[min(24rem,calc(100dvh-24rem))] sm:h-[18rem]">
          <ul className="divide-y divide-border/60 p-1" role="listbox" aria-label="Background tracks">
            {SHORTS_BACKGROUND_TRACKS.map((track) => {
              const isSelected = (value ?? selected.id) === track.id;
              const isPreviewing = previewing === track.id;
              const isLoading = loadingPreview === track.id;
              const canPreview = Boolean(track.url);

              return (
                <li key={track.id}
                onClick={() => onUserSelect(name, track.id)}>
                  <div
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                      isSelected && "bg-primary/10 ring-1 ring-primary/25",
                      !isSelected && "hover:bg-muted/50"
                    )}
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate font-medium text-foreground">{track.title}</span>
                    </button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        void playTrackPreview(track);
                      }}
                      disabled={!canPreview || isLoading}
                      aria-label={
                        !canPreview ? "No preview" : isPreviewing ? "Stop preview" : "Play preview"
                      }
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : isPreviewing ? (
                        <Pause className="size-4" />
                      ) : (
                        <Play className="size-4" />
                      )}
                      <span className="hidden sm:inline">{isPreviewing ? "Stop" : "Sample"}</span>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </div>

      {selected?.licenseNote && (
        <p className="text-xs text-muted-foreground">{selected.licenseNote}</p>
      )}
    </div>
  );
}

export default SelectBackgroundMusic;
