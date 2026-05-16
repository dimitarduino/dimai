/** YouTube tags: max ~30 tags, each ≤100 chars; combined length often capped ~500. */
export function parseYoutubeTagsFromUserInput(raw: string): string[] {
  const parts = raw
    .split(/[,#\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  let combined = 0;
  for (const p of parts) {
    const t = p.slice(0, 100);
    const key = t.toLowerCase();
    if (out.some((x) => x.toLowerCase() === key)) continue;
    const addLen = t.length + (out.length > 0 ? 1 : 0);
    if (combined + addLen > 500 || out.length >= 30) break;
    out.push(t);
    combined += addLen;
  }
  return out;
}
