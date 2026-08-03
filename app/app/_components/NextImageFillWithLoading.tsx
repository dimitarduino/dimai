"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type NextImageFillWithLoadingProps = Omit<ImageProps, "fill"> & {
  /** Container: use e.g. `absolute inset-0` inside a positioned, sized parent */
  className?: string;
  imageClassName?: string;
};

/** Full-bleed Next/Image with a spinner until load completes or errors. */
export function NextImageFillWithLoading({
  className,
  imageClassName,
  onLoad,
  onError,
  loading = "lazy",
  decoding = "async",
  ...rest
}: NextImageFillWithLoadingProps) {
  const [loaded, setLoaded] = useState(false);
  const srcString =
    typeof rest.src === "string" ? rest.src : (rest.src as { src?: string })?.src ?? "";

  useEffect(() => {
    setLoaded(false);
  }, [srcString]);

  return (
    <div className={cn("relative h-full min-h-[1rem] w-full", className)}>
      <div
        className={cn(
          "absolute inset-0 z-[1] flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 transition-opacity duration-300",
          loaded ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        aria-hidden={loaded}
      >
        <Loader2
          className="h-8 w-8 animate-spin text-primary/70"
          aria-label="Loading image"
        />
      </div>
      <Image
        {...rest}
        fill
        loading={loading}
        decoding={decoding}
        className={cn(
          imageClassName,
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
      />
    </div>
  );
}

