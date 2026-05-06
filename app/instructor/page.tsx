import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { booking, classType, scheduledClass } from "@/db/schema";
import { requireInstructor } from "@/lib/instructor";
import { IconCalendarMonth, IconChevronRight } from "@tabler/icons-react";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import Link from "next/link";

export default async function InstructorHome() {
  const ctx = await requireInstructor();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = await db
    .select({
      id: scheduledClass.id,
      startsAt: scheduledClass.startsAt,
      endsAt: scheduledClass.endsAt,
      capacity: scheduledClass.capacity,
      status: scheduledClass.status,
      location: scheduledClass.location,
      className: classType.name,
      classColor: classType.color,
      bookedCount: sql<number>`(
        select count(*)::int from ${booking}
        where ${booking.scheduledClassId} = ${scheduledClass.id}
          and ${booking.status} in ('booked', 'attended')
      )`,
    })
    .from(scheduledClass)
    .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
    .where(
      and(
        eq(scheduledClass.instructorId, ctx.instructorId),
        gte(scheduledClass.startsAt, today),
      ),
    )
    .orderBy(asc(scheduledClass.startsAt))
    .limit(40);

  const grouped = groupByDate(upcoming);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {today.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h1 className="font-display text-4xl tracking-tight mt-2">
          Hi {ctx.fullName.split(" ")[0]}.
        </h1>
        <p className="text-muted-foreground text-[15px] mt-2 max-w-xl">
          Here are the classes you&apos;re teaching. Tap a class to see the roster
          and check students in.
        </p>
      </div>

      {grouped.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <div className="size-12 rounded-full bg-secondary/70 flex items-center justify-center mx-auto mb-4">
              <IconCalendarMonth className="size-5 text-muted-foreground" />
            </div>
            <div className="font-display text-xl">Nothing scheduled</div>
            <p className="text-sm text-muted-foreground mt-1">
              When the studio assigns you to a class it will show up here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {grouped.map(([dateKey, items]) => (
            <Card key={dateKey}>
              <div className="px-6 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div className="font-display text-base">
                  {formatDateHeading(dateKey)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "class" : "classes"}
                </div>
              </div>
              <ul className="divide-y divide-border">
                {items.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/instructor/${c.id}`}
                      className="group flex items-center gap-4 px-6 py-4 hover:bg-secondary/40 transition-colors"
                    >
                      <span
                        className="w-1 h-12 rounded-full"
                        style={{ backgroundColor: c.classColor }}
                      />
                      <div className="w-20 tabular-nums">
                        <div className="font-display text-lg leading-none">
                          {fmtTime(c.startsAt)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{c.className}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {c.location || "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium tabular-nums">
                          {c.bookedCount}/{c.capacity}
                        </div>
                        <div className="text-xs text-muted-foreground">booked</div>
                      </div>
                      {c.status === "cancelled" && (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200">
                          Cancelled
                        </Badge>
                      )}
                      <IconChevronRight className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
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
    month: "short",
    day: "numeric",
  });
}

function fmtTime(d: Date) {
  return new Date(d).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
