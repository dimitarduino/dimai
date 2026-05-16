"use client";

import { useMemo, useState } from "react";
import { format, setHours, setMinutes, startOfDay } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

type Props = {
  id?: string;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
};

function defaultScheduleDate(): Date {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30, 0, 0);
  const m = d.getMinutes();
  d.setMinutes(Math.ceil(m / 5) * 5, 0, 0);
  return d;
}

export default function ScheduleDateTimePicker({
  id,
  value,
  onChange,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const minDay = useMemo(() => startOfDay(new Date()), []);

  const selected = value ?? defaultScheduleDate();
  const hour = selected.getHours();
  const minute = selected.getMinutes();

  const applyTime = (nextHour: number, nextMinute: number, base?: Date) => {
    const day = base ?? value ?? defaultScheduleDate();
    onChange(setMinutes(setHours(day, nextHour), nextMinute));
  };

  const applyDay = (day: Date | undefined) => {
    if (!day) {
      onChange(undefined);
      return;
    }
    applyTime(hour, minute, day);
  };

  const label = value
    ? format(value, "EEE, MMM d, yyyy · h:mm a")
    : "Pick date and time";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-11 w-full max-w-md justify-start gap-2 px-3 text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-primary" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(day) => {
            if (day) applyDay(day);
          }}
          disabled={{ before: minDay }}
          defaultMonth={value ?? new Date()}
        />
        <div className="border-t border-border/60 bg-muted/20 px-3 py-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Clock className="size-3.5" />
            Time
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={String(hour)}
              onValueChange={(v) => applyTime(Number(v), minute)}
            >
              <SelectTrigger className="h-9 w-[88px] bg-background">
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
              onValueChange={(v) => applyTime(hour, Number(v))}
            >
              <SelectTrigger className="h-9 w-[72px] bg-background">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {String(m).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border/60 p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(undefined);
              setOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (!value) onChange(defaultScheduleDate());
              setOpen(false);
            }}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
