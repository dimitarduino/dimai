import { SHORTS_SERIES_PART_COUNT } from "@/lib/shorts-series";

export type JobProgressPayload = {
  step?: string;
  percentage?: number;
  part?: number;
  totalParts?: number;
  detail?: string;
};

export function labelForJobProgress(
  progress: JobProgressPayload,
  formatMode?: "single" | "series",
): { title: string; detail: string } {
  const step = progress.step ?? "";
  const part = progress.part;
  const total = progress.totalParts ?? SHORTS_SERIES_PART_COUNT;
  const partLabel =
    part != null ? `Part ${part} of ${total}` : null;

  if (step === "initializing") {
    return { title: "Starting…", detail: "Preparing your job" };
  }
  if (step === "generating_script") {
    return { title: "Writing script", detail: "AI is drafting your scenes" };
  }
  if (step === "generating_audio") {
    return { title: "Generating voiceover", detail: "Creating narration audio" };
  }
  if (step === "generating_captions") {
    return { title: "Building captions", detail: "Syncing words to audio" };
  }
  if (step === "generating_images") {
    return { title: "Creating images", detail: "Rendering scene visuals" };
  }
  if (step === "saving") {
    return { title: "Saving project", detail: "Storing your short in the library" };
  }
  if (step === "exporting") {
    return {
      title: partLabel ? `${partLabel} — Exporting MP4` : "Exporting MP4",
      detail: "Rendering video on cloud (no extra credits)",
    };
  }
  if (step.startsWith("series_part_") && step.endsWith("_exporting")) {
    return {
      title: partLabel ? `${partLabel} — Exporting MP4` : "Exporting MP4",
      detail: "Rendering this episode (included, no export credits)",
    };
  }
  if (step.startsWith("series_part_") && !step.includes("done")) {
    return {
      title: partLabel ? `${partLabel} — Generating` : "Generating series",
      detail: "Script, voice, captions & images",
    };
  }
  if (step.startsWith("series_part_") && step.endsWith("_done")) {
    return {
      title: partLabel ? `${partLabel} complete` : "Episode complete",
      detail: "Exported and ready",
    };
  }
  if (step === "completed") {
    return {
      title: formatMode === "series" ? "Series ready!" : "Your short is ready!",
      detail: "Exported automatically — open publish when you like",
    };
  }
  if (progress.detail) {
    return { title: "Working…", detail: progress.detail };
  }
  return { title: "Creating your short", detail: "Please wait…" };
}
