"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

import { Button } from "@/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function parseTimeOfDay(value: string): { hour: number; minute: number } {
  const [hhRaw, mmRaw] = value.split(":");
  const hh = Number(hhRaw);
  const mm = Number(mmRaw);
  return {
    hour: Number.isNaN(hh) ? 12 : Math.min(23, Math.max(0, hh)),
    minute: Number.isNaN(mm) ? 0 : Math.min(59, Math.max(0, mm)),
  };
}

function toTimeOfDay(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const QUICK_TIMES = [
  { label: "9:00 AM", hour: 9, minute: 0 },
  { label: "12:00 PM", hour: 12, minute: 0 },
  { label: "6:00 PM", hour: 18, minute: 0 },
  { label: "8:00 PM", hour: 20, minute: 0 },
] as const;

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export default function ScheduleTimePicker({
  id,
  value,
  onChange,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const { hour, minute } = parseTimeOfDay(value || "12:00");

  const minuteOptions = useMemo(() => {
    const set = new Set(MINUTES);
    if (!set.has(minute)) set.add(minute);
    return Array.from(set).sort((a, b) => a - b);
  }, [minute]);

  const label = useMemo(() => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return format(d, "h:mm a");
  }, [hour, minute]);

  const apply = (nextHour: number, nextMinute: number) => {
    onChange(toTimeOfDay(nextHour, nextMinute));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-11 w-full justify-start gap-2 px-3 text-left font-normal",
            className,
          )}
        >
          <Clock className="size-4 shrink-0 text-primary" />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b border-border/60 bg-muted/20 px-3 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Quick pick
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TIMES.map((t) => (
              <Button
                key={t.label}
                type="button"
                variant={
                  hour === t.hour && minute === t.minute ? "default" : "outline"
                }
                size="sm"
                className="h-8 text-xs"
                onClick={() => apply(t.hour, t.minute)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="px-3 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Hour & minute
          </p>
          <div className="flex items-center gap-2">
            <Select
              value={String(hour)}
              onValueChange={(v) => apply(Number(v), minute)}
            >
              <SelectTrigger className="h-10 w-[88px] bg-background">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {HOURS.map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {String(h).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground font-medium">:</span>
            <Select
              value={String(minute)}
              onValueChange={(v) => apply(hour, Number(v))}
            >
              <SelectTrigger className="h-10 w-[72px] bg-background">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {String(m).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end border-t border-border/60 p-2">
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
