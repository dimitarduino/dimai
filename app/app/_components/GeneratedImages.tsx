"use client";

import React, { useState } from "react";

import { shouldUnoptimizeImageSrc } from "@/lib/next-image-src";
import { PREVIEW_MAX_PX, SIZES_GENERATED_IMAGES_STRIP } from "@/lib/image-preview-sizes";
import { NextImageFillWithLoading } from "./NextImageFillWithLoading";

/** Rows coming from shorts / image-video flows sometimes carry an optional caption. */
export type GalleryImageRow = {
  id: number;
  image: unknown;
  caption?: string | null;
};

function imageHref(image: GalleryImageRow["image"]) {
  if (typeof image === "string") return image;
  return "";
}

export type GeneratedImagesProps = {
  imagesList: GalleryImageRow[];
  onClickImage: (imageKey: string) => void;
  selectedImage?: string | null;
  /** Horizontal strip `max-width: min(75dvw, …px)`; defaults to shared preview max. */
  stripMaxWidthPx?: number;
  /** Passed to `next/image` `sizes` for strip thumbs (default matches `w-20` / 80px tiles). */
  imageSizes?: string;
  /** Lower = smaller files; strip previews only (default 40). */
  quality?: number;
};

/** Horizontal strip thumbnails — keep src unmodified so signed Firebase URLs stay valid; opt-in lower quality via next/image */
function GeneratedImages({
  imagesList,
  onClickImage,
  selectedImage,
  stripMaxWidthPx = PREVIEW_MAX_PX,
  imageSizes = SIZES_GENERATED_IMAGES_STRIP,
  quality = 40,
}: GeneratedImagesProps) {
  const [activeImage, setActiveImage] = useState(selectedImage);

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div
        className="flex gap-1 pb-2 overflow-x-auto"
        style={{ maxWidth: `min(75dvw, ${stripMaxWidthPx}px)` }}
      >
        {[...new Map(imagesList.map((v) => [imageHref(v.image), v])).values()]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .map((video, index) => {
            const keyImg = imageHref(video.image);
            if (!keyImg) return null;
            const isSelected =
              activeImage === keyImg || selectedImage === keyImg;
            const unoptimized = shouldUnoptimizeImageSrc(keyImg);
            return (
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveImage(keyImg);
                  onClickImage(keyImg);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveImage(keyImg);
                    onClickImage(keyImg);
                  }
                }}
                className={`overflow-hidden flex-shrink-0 w-20 h-32 rounded-xl ${isSelected ? "border-2 p-1 border-primary" : ""}`}
                key={video.id ?? index}
              >
                <div
                  className={`relative overflow-hidden w-full h-full flex transition-all cursor-pointer ${isSelected ? "hover:scale-110 " : ""}`}
                >
                  <NextImageFillWithLoading
                    className="absolute inset-0"
                    src={keyImg}
                    alt={video.caption ?? "Source image thumbnail"}
                    sizes={imageSizes}
                    quality={quality}
                    fetchPriority="low"
                    imageClassName="rounded-xl object-cover"
                    unoptimized={unoptimized}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default GeneratedImages;
