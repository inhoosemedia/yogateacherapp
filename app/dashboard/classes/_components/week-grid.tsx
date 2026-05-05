"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Klass = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number;
  status: string;
  bookedCount: number;
  classTypeName: string;
  classTypeColor: string;
  instructorName: string | null;
  location: string | null;
};

const HOUR_HEIGHT = 56; // px per hour
const START_HOUR = 6;
const END_HOUR = 22;

export function WeekGrid({ classes }: { classes: Klass[] }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const days = useMemo(() => {
    const out: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      out.push(d);
    }
    return out;
  }, [weekStart]);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const inWeek = classes.filter((c) => {
    const s = new Date(c.startsAt);
    return s >= weekStart && s < weekEnd;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <IconChevronRight className="size-4" />
          </Button>
          <div className="ml-3 font-display text-lg">
            {weekStart.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
            })}{" "}
            –{" "}
            {addDays(weekStart, 6).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {inWeek.length} {inWeek.length === 1 ? "class" : "classes"} this week
        </div>
      </div>

      <div className="grid grid-cols-[60px_repeat(7,_minmax(0,_1fr))] border-b border-border bg-secondary/30">
        <div className="p-2" />
        {days.map((d) => {
          const isToday = sameDay(d, today);
          return (
            <div
              key={d.toISOString()}
              className="p-2 text-center border-l border-border"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <div
                className={cn(
                  "font-display text-xl mt-0.5",
                  isToday && "text-primary",
                )}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="relative grid grid-cols-[60px_repeat(7,_minmax(0,_1fr))]"
        style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}
      >
        {/* hours column */}
        <div className="border-r border-border">
          {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
            <div
              key={i}
              className="text-[10px] text-muted-foreground/70 text-right pr-2 -mt-1.5"
              style={{ height: HOUR_HEIGHT }}
            >
              {formatHour(START_HOUR + i)}
            </div>
          ))}
        </div>

        {/* day columns */}
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className="relative border-l border-border"
          >
            {/* hour grid lines */}
            {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
              <div
                key={i}
                className="border-t border-border/60"
                style={{ height: HOUR_HEIGHT }}
              />
            ))}
            {/* events */}
            {inWeek
              .filter((c) => sameDay(new Date(c.startsAt), d))
              .map((c) => {
                const top = positionFor(c.startsAt);
                const height = Math.max(28, durationPx(c.startsAt, c.endsAt));
                const cancelled = c.status === "cancelled";
                return (
                  <Link
                    key={c.id}
                    href={`/dashboard/classes/${c.id}`}
                    className={cn(
                      "absolute left-1 right-1 rounded-md p-2 text-[11px] overflow-hidden ring-1 transition-shadow shadow-2xs hover:shadow-md hover:z-10",
                      cancelled
                        ? "ring-rose-200 bg-rose-50/80"
                        : "ring-border bg-card",
                    )}
                    style={{
                      top,
                      height,
                      borderLeft: `3px solid ${c.classTypeColor}`,
                    }}
                    title={`${c.classTypeName} · ${c.bookedCount}/${c.capacity}`}
                  >
                    <div
                      className={cn(
                        "font-medium leading-tight truncate",
                        cancelled && "line-through text-rose-700",
                      )}
                    >
                      {c.classTypeName}
                    </div>
                    <div className="text-muted-foreground tabular-nums">
                      {fmtTime(c.startsAt)}
                    </div>
                    {height > 60 && (
                      <div className="mt-1 text-muted-foreground truncate">
                        {c.instructorName ?? ""}
                      </div>
                    )}
                    {height > 78 && (
                      <Badge className="mt-1 bg-secondary/70 text-foreground border-border">
                        {c.bookedCount}/{c.capacity}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            {/* current time line */}
            {sameDay(d, today) && <NowLine />}
          </div>
        ))}
      </div>
    </div>
  );
}

function NowLine() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  if (hour < START_HOUR || hour > END_HOUR) return null;
  const top = (hour - START_HOUR) * HOUR_HEIGHT;
  return (
    <div className="absolute left-0 right-0 z-[5]" style={{ top }}>
      <div className="h-[2px] bg-primary/80" />
      <div className="absolute -left-1 -top-1 size-2 rounded-full bg-primary pulse-ring" />
    </div>
  );
}

function startOfWeek(d: Date) {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  const day = out.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day; // start Monday
  out.setDate(out.getDate() + diff);
  return out;
}
function addDays(d: Date, n: number) {
  const o = new Date(d);
  o.setDate(o.getDate() + n);
  return o;
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function positionFor(d: Date) {
  const start = new Date(d);
  const hour = start.getHours() + start.getMinutes() / 60;
  return (hour - START_HOUR) * HOUR_HEIGHT;
}
function durationPx(s: Date, e: Date) {
  const ms = new Date(e).getTime() - new Date(s).getTime();
  return (ms / 3_600_000) * HOUR_HEIGHT;
}
function fmtTime(d: Date) {
  return new Date(d).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
function formatHour(h: number) {
  if (h === 0) return "12 am";
  if (h === 12) return "12 pm";
  if (h < 12) return `${h} am`;
  return `${h - 12} pm`;
}
