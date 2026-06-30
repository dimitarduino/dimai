/**
 * Replicate `.run()` return shapes vary by model (string, URL array, nested objects).
 * Use this before passing a value to `axios.get` etc.
 */
export function coerceReplicateFetchUrl(payload: unknown): string {
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload) && payload[0] != null)
    return coerceReplicateFetchUrl(payload[0]);
  if (
    payload !== null &&
    typeof payload === "object" &&
    "url" in payload &&
    typeof (payload as { url: unknown }).url === "function"
  ) {
    return String((payload as { url: () => URL }).url());
  }
  if (payload !== null && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    const keys = [
      "audio_output",
      "url",
      "output",
      "image",
      "href",
    ] as const;
    for (const k of keys) {
      const v = o[k];
      if (typeof v === "string") return v;
    }
  }
  return payload != null ? String(payload) : "";
}
