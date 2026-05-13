"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Pause, Play } from "lucide-react";
import { toast } from "sonner";

export type VoicePickerOption = { name: string; ssmlGender: string; label?: string };

type VoicePickerProps = {
  voices: VoicePickerOption[];
  gender: string;
  selectedVoice: string;
  onGenderChange: (gender: "MALE" | "FEMALE") => void;
  onVoiceSelect: (voiceName: string) => void;
};

function formatVoiceLabel(fullName: string): string {
  return fullName.replace(/^en-US-/, "").replace(/-/g, " ");
}

export default function VoicePicker({
  voices,
  gender,
  selectedVoice,
  onGenderChange,
  onVoiceSelect,
}: VoicePickerProps) {
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const maleVoices = useMemo(
    () => voices.filter((v) => v.ssmlGender === "MALE"),
    [voices]
  );
  const femaleVoices = useMemo(
    () => voices.filter((v) => v.ssmlGender === "FEMALE"),
    [voices]
  );

  const activeList = gender === "FEMALE" ? femaleVoices : maleVoices;

  useEffect(() => {
    const names = activeList.map((v) => v.name);
    if (names.length === 0) return;
    if (!names.includes(selectedVoice)) {
      onVoiceSelect(names[0]);
    }
  }, [activeList, selectedVoice, onVoiceSelect]);

  const stopPreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewing(null);
    setLoadingPreview(null);
  }, []);

  useEffect(() => {
    return () => stopPreview();
  }, [stopPreview]);

  const playSample = async (voiceName: string) => {
    if (previewing === voiceName && audioRef.current && !audioRef.current.paused) {
      stopPreview();
      return;
    }

    stopPreview();
    setLoadingPreview(voiceName);

    try {
      const res = await fetch("/api/voice-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice: voiceName, gender }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(typeof err.error === "string" ? err.error : "Could not load voice sample.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      setPreviewing(voiceName);
      audio.onended = () => stopPreview();
      audio.onerror = () => {
        toast.error("Playback failed.");
        stopPreview();
      };
      await audio.play();
    } catch {
      toast.error("Could not play voice sample.");
      stopPreview();
    } finally {
      setLoadingPreview(null);
    }
  };

  const tab = (value: "MALE" | "FEMALE", label: string) => {
    const active = gender === value;
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => {
          stopPreview();
          onGenderChange(value);
        }}
        className={cn(
          "relative flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-primary">Voice and gender</h2>
        <p className="text-sm text-muted-foreground">
          Pick who narrates your short, then tap a row to select. Use play to hear a quick sample.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Narrator gender"
        className="flex gap-2 rounded-xl border border-border/70 bg-muted/30 p-1.5"
      >
        {tab("MALE", "Man")}
        {tab("FEMALE", "Woman")}
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40">
        <ScrollArea className="h-[min(28rem,calc(100dvh-18rem))] sm:h-[18rem]">
          <ul className="divide-y divide-border/60 p-1" role="listbox" aria-label="Voices">
            {activeList.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                No voices loaded for this category yet.
              </li>
            ) : (
              activeList.map(({ name, label }) => {
                const selected = selectedVoice === name;
                const isPreviewing = previewing === name;
                const isLoading = loadingPreview === name;
                const title = label?.trim() || formatVoiceLabel(name);

                return (
                  <li key={name}
                  onClick={() => onVoiceSelect(name)}>
                    <div
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                        selected && "bg-primary/10 ring-1 ring-primary/25",
                        !selected && "hover:bg-muted/50"
                      )}
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block truncate font-medium text-foreground">
                          {title}
                        </span>
                        <span className="block truncate font-mono text-[11px] text-muted-foreground">
                          {name}
                        </span>
                      </button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          void playSample(name);
                        }}
                        disabled={isLoading}
                        aria-label={isPreviewing ? "Stop sample" : "Play sample"}
                      >
                        {isLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : isPreviewing ? (
                          <Pause className="size-4" />
                        ) : (
                          <Play className="size-4" />
                        )}
                        <span className="hidden sm:inline">
                          {isPreviewing ? "Stop" : "Sample"}
                        </span>
                      </Button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}
