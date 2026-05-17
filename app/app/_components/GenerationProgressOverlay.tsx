"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  title: string;
  detail: string;
  percentage: number;
  statusLabel?: string;
};

export default function GenerationProgressOverlay({
  open,
  title,
  detail,
  percentage,
  statusLabel,
}: Props) {
  if (!open) return null;

  const pct = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      role="alertdialog"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border-2 border-primary bg-card p-8 shadow-2xl",
          "ring-4 ring-primary/20",
        )}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <Image
            alt=""
            src="/loading1.gif"
            width={80}
            height={80}
            className="size-20"
            unoptimized
          />
          {statusLabel ? (
            <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {statusLabel}
            </span>
          ) : null}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{detail}</p>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums text-foreground">{pct}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Export is included — no extra credits for MP4
          </p>
        </div>
      </div>
    </div>
  );
}
