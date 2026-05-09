"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/ui/button";
import { SHORTS_BACKGROUND_TRACKS } from "@/lib/shorts-background-music";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const selected =
    SHORTS_BACKGROUND_TRACKS.find((t) => t.id === value) || SHORTS_BACKGROUND_TRACKS[0];

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPreviewing(false);
  }, [value]);

  const togglePreview = () => {
    const el = audioRef.current;
    if (!el?.src) return;
    if (previewing) {
      el.pause();
      setPreviewing(false);
    } else {
      void el.play().catch(() => setPreviewing(false));
      setPreviewing(true);
    }
  };

  return (
    <div className="w-full space-y-2">
      <h2 className="font-bold text-xl text-primary">Background music</h2>
      <p className="text-gray-500 dark:text-neutral-300">
        Royalty-free tracks for TikTok-style shorts. Mixes under your voice in the final export. Check license
        notes before posting publicly (especially CC BY tracks).
      </p>
      <Select value={value} onValueChange={(id) => onUserSelect(name, id)}>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Choose music" />
        </SelectTrigger>
        <SelectContent>
          {SHORTS_BACKGROUND_TRACKS.map((track) => (
            <SelectItem key={track.id} value={track.id}>
              {track.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected?.licenseNote && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{selected.licenseNote}</p>
      )}
      {selected?.url && (
        <div className="flex items-center gap-3 mt-2">
          <audio ref={audioRef} src={selected.url} onEnded={() => setPreviewing(false)} className="hidden" />
          <Button type="button" variant="outline" className="cursor-pointer" onClick={togglePreview}>
            {previewing ? "Stop preview" : "Preview track"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SelectBackgroundMusic;
