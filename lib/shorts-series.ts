export const SHORTS_SERIES_PART_COUNT = 5;

export type ShortsFormatMode = "single" | "series";

export type SeriesScheduleConfig = {
  /** ISO date of the first publish day (local date from picker). */
  startAt: string;
  /** Publish every N days (1 = daily). */
  intervalDays: number;
  /** Local time "HH:mm" applied on each publish day. */
  timeOfDay: string;
  postYouTube: boolean;
  postTiktok: boolean;
};

export function defaultSeriesSchedule(): SeriesScheduleConfig {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(12, 0, 0, 0);
  return {
    startAt: start.toISOString(),
    intervalDays: 1,
    timeOfDay: "12:00",
    postYouTube: false,
    postTiktok: false,
  };
}

/** Credits per generated short (single = 1×, series = 5×). */
export const SHORTS_CREDITS_PER_PART = 10;

export function shortsCreditsRequired(formatMode: ShortsFormatMode): number {
  return formatMode === "series"
    ? SHORTS_SERIES_PART_COUNT * SHORTS_CREDITS_PER_PART
    : SHORTS_CREDITS_PER_PART;
}

export function computeSeriesPublishTimes(
  config: SeriesScheduleConfig,
  parts = SHORTS_SERIES_PART_COUNT,
): string[] {
  const [hhRaw, mmRaw] = config.timeOfDay.split(":");
  const hh = Number(hhRaw);
  const mm = Number(mmRaw);
  const interval = Math.max(1, Math.min(30, config.intervalDays || 1));

  const first = new Date(config.startAt);
  if (Number.isNaN(first.getTime())) {
    first.setTime(Date.now() + 86400000);
    first.setHours(12, 0, 0, 0);
  }

  const times: string[] = [first.toISOString()];
  const base = new Date(first);

  for (let i = 1; i < parts; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i * interval);
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      d.setHours(hh, mm, 0, 0);
    }
    times.push(d.toISOString());
  }
  return times;
}

export function buildSeriesScriptPrompt(
  formData: Record<string, unknown>,
  partIndex: number,
  totalParts: number,
): string {
  const topic = String(formData.topic ?? "");
  const style = String(formData.style ?? "");
  const comment = String(formData.comment ?? "");
  const duration = String(formData.duration ?? "30 seconds");
  const part = partIndex + 1;

  let arc = "";
  if (part === 1) {
    arc =
      "This is PART 1 — open with a viral hook question or bold statement. Set up the story; tease what comes next.";
  } else if (part === totalParts) {
    arc =
      `This is PART ${part} (FINALE) — deliver the payoff and a strong call-to-action. Reference that this is the last part.`;
  } else {
    arc = `This is PART ${part} of ${totalParts} — continue the story from previous parts with a cliffhanger ending that makes viewers want part ${part + 1}.`;
  }

  return `Write a script for a ${duration} short-form video (vertical short).

Topic / series: "${topic}"
${arc}

Visual style for image prompts: ${style}
Extra instructions: ${comment}

Requirements:
- Return JSON only: an array of scenes like [{ "imagePrompt": "...", "contentText": "..." }]
- 4–8 scenes for this part only (~${duration} total when narrated)
- imagePrompt in ${style} style for each scene
- contentText is the spoken narration
- imagePrompt must be family-friendly and SFW (no violence, gore, nudity, or horror)
- Mention "Part ${part}" naturally once in the narration if it fits`;
}

export function seriesPartTitle(
  topic: string,
  partIndex: number,
  totalParts: number,
): string {
  const base = topic.trim() || "Short";
  return `${base} — Part ${partIndex + 1}/${totalParts}`.slice(0, 500);
}
