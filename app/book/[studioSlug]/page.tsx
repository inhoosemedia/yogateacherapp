import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  scheduledClass,
  studio,
} from "@/db/schema";
import { IconClock, IconMapPin, IconUserCircle } from "@tabler/icons-react";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PublicSchedule({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;
  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.slug, studioSlug))
    .limit(1);
  if (!s) notFound();

  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 30);

  const rows = await db
    .select({
      id: scheduledClass.id,
      startsAt: scheduledClass.startsAt,
      endsAt: scheduledClass.endsAt,
      capacity: scheduledClass.capacity,
      status: scheduledClass.status,
      location: scheduledClass.location,
      classTypeName: classType.name,
      classTypeColor: classType.color,
      instructorName: instructor.fullName,
      bookedCount: sql<number>`(
        select count(*)::int from ${booking}
        where ${booking.scheduledClassId} = ${scheduledClass.id}
          and ${booking.status} in ('booked', 'attended')
      )`,
    })
    .from(scheduledClass)
    .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
    .leftJoin(instructor, eq(instructor.id, scheduledClass.instructorId))
    .where(
      and(
        eq(scheduledClass.studioId, s.id),
        gte(scheduledClass.startsAt, new Date()),
      ),
    )
    .orderBy(asc(scheduledClass.startsAt))
    .limit(80);

  const grouped = groupByDate(rows);

  return (
    <main className="min-h-screen bg-canvas canvas-grain">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link href="/" className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display text-base shadow-sm">
            ॐ
          </Link>
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl truncate">{s.name}</div>
            <div className="text-[11px] text-muted-foreground">
              Public schedule · book a class below
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Upcoming classes
          </div>
          <h1 className="font-display text-5xl tracking-tight leading-tight">
            Reserve your{" "}
            <span className="italic text-primary">spot on the mat</span>.
          </h1>
          <p className="mt-4 text-muted-foreground text-[15px] max-w-md mx-auto">
            Pick a class, drop your details, and we&apos;ll see you in studio.
          </p>
        </div>

        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No classes scheduled in the next 30 days.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Check back soon, or reach out to the studio directly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(([dateKey, items]) => (
              <div
                key={dateKey}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs"
              >
                <div className="px-5 py-3 border-b border-border bg-secondary/40 flex items-baseline justify-between">
                  <div className="font-display text-base">
                    {formatDateHeading(dateKey)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {items.length} {items.length === 1 ? "class" : "classes"}
                  </div>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((c) => {
                    const full = c.bookedCount >= c.capacity;
                    const left = Math.max(0, c.capacity - c.bookedCount);
                    return (
                      <li key={c.id}>
                        <Link
                          href={`/book/${studioSlug}/${c.id}`}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors"
                          aria-disabled={c.status === "cancelled"}
                        >
                          <div className="w-16 text-center">
                            <div className="font-display text-lg leading-none tabular-nums">
                              {fmtTimeBig(c.startsAt)}
                            </div>
                            <div className="text-[10px] uppercase text-muted-foreground mt-1">
                              {fmtAmPm(c.startsAt)}
                            </div>
                          </div>
                          <span
                            className="w-1 h-12 rounded-full"
                            style={{ backgroundColor: c.classTypeColor }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">
                              {c.classTypeName}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="inline-flex items-center gap-1">
                                <IconClock className="size-3" />
                                {durationLabel(c.startsAt, c.endsAt)} min
                              </span>
                              {c.instructorName && (
                                <>
                                  <span className="text-muted-foreground/40">
                                    ·
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <IconUserCircle className="size-3" />
                                    {c.instructorName}
                                  </span>
                                </>
                              )}
                              {c.location && (
                                <>
                                  <span className="text-muted-foreground/40">
                                    ·
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <IconMapPin className="size-3" />
                                    {c.location}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {c.status === "cancelled" ? (
                              <span className="text-[11px] uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5">
                                Cancelled
                              </span>
                            ) : full ? (
                              <span className="text-[11px] uppercase tracking-wider text-stone-600 bg-stone-100 border border-stone-200 rounded-full px-2 py-0.5">
                                Full
                              </span>
                            ) : (
                              <div>
                                <div className="text-sm font-medium tabular-nums">
                                  {left}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {left === 1 ? "spot left" : "spots left"}
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <Link href="/" className="text-primary hover:underline">
            Asana CRM
          </Link>
        </p>
      </section>
    </main>
  );
}

function groupByDate<T extends { startsAt: Date }>(rows: T[]) {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const key = new Date(row.startsAt).toISOString().slice(0, 10);
    const arr = map.get(key) ?? [];
    arr.push(row);
    map.set(key, arr);
  }
  return Array.from(map.entries());
}

function formatDateHeading(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function durationLabel(start: Date, end: Date) {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000,
  );
}

function fmtTimeBig(d: Date) {
  return new Date(d)
    .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    .replace(/\s?(AM|PM)/i, "")
    .trim();
}

function fmtAmPm(d: Date) {
  const t = new Date(d).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const m = t.match(/AM|PM/i);
  return m ? m[0].toLowerCase() : "";
}
