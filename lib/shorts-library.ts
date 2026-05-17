import type { InferSelectModel } from "drizzle-orm";

import type { VideoData } from "@/configs/schema";

export type VideoRecord = InferSelectModel<typeof VideoData>;

export type ShortsLibrarySingle = {
  kind: "single";
  video: VideoRecord;
  sortId: number;
};

export type ShortsLibrarySeries = {
  kind: "series";
  seriesGroupId: string;
  parts: VideoRecord[];
  sortId: number;
  title: string;
  partTotal: number;
};

export type ShortsLibraryItem = ShortsLibrarySingle | ShortsLibrarySeries;

export function titleFromVideoRecord(video: VideoRecord | null | undefined): string {
  if (!video?.script) return "Short";
  try {
    const s = video.script as unknown;
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

export function firstPosterFromVideo(video: VideoRecord): string | null {
  const first = video.images?.[0];
  return typeof first === "string" && first.trim().length > 0 ? first : null;
}

/** Collapse DB rows into one grid item per standalone short or per series. */
export function groupVideosForLibrary(videos: VideoRecord[]): ShortsLibraryItem[] {
  const bySeries = new Map<string, VideoRecord[]>();
  const singles: VideoRecord[] = [];

  for (const v of videos) {
    if (v.seriesGroupId) {
      const list = bySeries.get(v.seriesGroupId) ?? [];
      list.push(v);
      bySeries.set(v.seriesGroupId, list);
    } else {
      singles.push(v);
    }
  }

  const items: ShortsLibraryItem[] = [];

  for (const [seriesGroupId, parts] of bySeries) {
    const sorted = [...parts].sort(
      (a, b) => (a.seriesPartIndex ?? 0) - (b.seriesPartIndex ?? 0),
    );
    const sortId = Math.max(...sorted.map((p) => p.id));
    const partTotal = sorted[0]?.seriesPartTotal ?? sorted.length;
    items.push({
      kind: "series",
      seriesGroupId,
      parts: sorted,
      sortId,
      title: titleFromVideoRecord(sorted[0]),
      partTotal,
    });
  }

  for (const video of singles) {
    items.push({ kind: "single", video, sortId: video.id });
  }

  items.sort((a, b) => b.sortId - a.sortId);
  return items;
}

/** Load every part for series cards (pagination can omit sibling rows). */
export async function hydrateSeriesLibraryParts<T extends VideoRecord>(
  items: ShortsLibraryItem[],
  fetchPartsBySeriesId: (seriesGroupIds: string[]) => Promise<T[]>,
): Promise<ShortsLibraryItem[]> {
  const incomplete = items.filter(
    (i): i is ShortsLibrarySeries =>
      i.kind === "series" && i.parts.length < i.partTotal,
  );
  if (incomplete.length === 0) return items;

  const ids = [...new Set(incomplete.map((i) => i.seriesGroupId))];
  const rows = await fetchPartsBySeriesId(ids);
  const bySeries = new Map<string, T[]>();
  for (const row of rows) {
    if (!row.seriesGroupId) continue;
    const list = bySeries.get(row.seriesGroupId) ?? [];
    list.push(row);
    bySeries.set(row.seriesGroupId, list);
  }

  return items.map((item) => {
    if (item.kind !== "series") return item;
    const full = bySeries.get(item.seriesGroupId);
    if (!full || full.length <= item.parts.length) return item;
    const sorted = [...full].sort(
      (a, b) => (a.seriesPartIndex ?? 0) - (b.seriesPartIndex ?? 0),
    );
    return {
      ...item,
      parts: sorted,
      partTotal: sorted[0]?.seriesPartTotal ?? sorted.length,
    };
  });
}

export function libraryCursorFromItems(items: ShortsLibraryItem[]): number | undefined {
  if (items.length === 0) return undefined;
  const ids = items.flatMap((item) =>
    item.kind === "single" ? [item.video.id] : item.parts.map((p) => p.id),
  );
  return Math.min(...ids);
}
