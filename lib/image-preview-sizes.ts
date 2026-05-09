/** Max width for preview `next/image` `sizes` and layout caps on edit / image-video flows. */
export const PREVIEW_MAX_PX = 640;

export const SIZES_FULL_PREVIEW = `(max-width: ${PREVIEW_MAX_PX}px) 100vw, ${PREVIEW_MAX_PX}px`;

/**
 * Horizontal strip in `GeneratedImages`: tiles are fixed `w-20` (80px). Always use this there — larger
 * `sizes` values make Next fetch unnecessarily wide images (painful on mobile data).
 */
export const SIZES_GENERATED_IMAGES_STRIP = "80px";

/** Responsive grid thumbnails (e.g. edit-image gallery cards), not the 80px `GeneratedImages` strip. */
export const SIZES_GRID_THUMB = `(max-width: ${PREVIEW_MAX_PX}px) 50vw, min(25vw, 200px)`;

/** Image-to-video: cap preview decode / layout width (upload, strip, video poster tiles). */
export const IMAGE_VIDEO_PREVIEW_MAX_PX = 320;

export const SIZES_IMAGE_VIDEO_UPLOAD = `(max-width: ${IMAGE_VIDEO_PREVIEW_MAX_PX}px) 100vw, ${IMAGE_VIDEO_PREVIEW_MAX_PX}px`;

/** @alias SIZES_GENERATED_IMAGES_STRIP — image-to-video passes this explicitly. */
export const SIZES_IMAGE_VIDEO_STRIP_THUMB = SIZES_GENERATED_IMAGES_STRIP;

/** Responsive grid posters; never suggests a slot wider than 320px. */
export const SIZES_IMAGE_VIDEO_GRID_POSTER = `(max-width: 640px) 50vw, (max-width: 1280px) 25vw, ${IMAGE_VIDEO_PREVIEW_MAX_PX}px`;
