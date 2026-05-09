/**
 * Blob/data URLs bypass Next's image optimizer; using `unoptimized` avoids failures
 * when `src` is not a configurable remote hostname.
 */
export function shouldUnoptimizeImageSrc(src: string | null | undefined): boolean {
  if (!src) return false;
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:")
  );
}
