import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  scheduledClass,
} from "@/db/schema";
import { cn } from "@/lib/utils";
import { requireStudio } from "@/lib/studio";
import {
  IconCalendarMonth,
  IconCalendarWeek,
  IconChevronRight,
  IconList,
} from "@tabler/icons-react";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import Link from "next/link";
import { ScheduleClassDialog } from "./_components/schedule-class-dialog";
import { WeekGrid } from "./_components/week-grid";

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; filter?: string }>;
}) {
  const { studio } = await requireStudio();
  const sp = await searchParams;
  const view = sp.view === "list" ? "list" : "week";
  const filter = sp.filter ?? "upcoming";

  // For week view, fetch a wider window. For list, fetch upcoming or all.
  let since: Date;
  if (view === "week") {
    since = new Date();
    since.setDate(since.getDate() - 14);
  } else {
    since = filter === "all" ? new Date(0) : new Date();
  }

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
        eq(scheduledClass.studioId, studio.id),
        gte(scheduledClass.startsAt, since),
      ),
    )
    .orderBy(asc(scheduledClass.startsAt));

  const types = await db
    .select()
    .from(classType)
    .where(
      and(eq(classType.studioId, studio.id), eq(classType.active, true)),
    );
  const instructors = await db
    .select()
    .from(instructor)
    .where(
      and(eq(instructor.studioId, studio.id), eq(instructor.active, true)),
    );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Schedule"
        title="Classes"
        description="Plan, fill and run your classes — week view shows what your studio is breathing."
        actions={
          <div className="flex items-center gap-2">
            <ViewSwitcher view={view} filter={filter} />
            <ScheduleClassDialog
              classTypes={types.map((t) => ({
                id: t.id,
                name: t.name,
                durationMinutes: t.durationMinutes,
                defaultCapacity: t.defaultCapacity,
              }))}
              instructors={instructors.map((i) => ({
                id: i.id,
                fullName: i.fullName,
              }))}
            >
              <Button>Schedule class</Button>
            </ScheduleClassDialog>
          </div>
        }
      />

      {types.length === 0 && (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconCalendarMonth className="size-5" />}
              title="Add a class type to get started"
              description="Class types are your templates — Hatha, Vinyasa, Yin. Once you have one, schedule sessions on the calendar."
              action={
                <Link href="/dashboard/class-types">
                  <Button>Go to class types</Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      )}

      {types.length > 0 && view === "week" && <WeekGrid classes={rows} />}

      {types.length > 0 && view === "list" && (
        <ListView rows={rows} filter={filter} />
      )}
    </div>
  );
}

function ViewSwitcher({ view, filter }: { view: string; filter: string }) {
  return (
    <div className="inline-flex items-center gap-1 bg-secondary/60 rounded-full p-1">
      <Link
        href={`/dashboard/classes?view=week`}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-colors",
          view === "week"
            ? "bg-card text-foreground shadow-xs ring-1 ring-border"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <IconCalendarWeek className="size-3.5" /> Week
      </Link>
      <Link
        href={`/dashboard/classes?view=list&filter=${filter}`}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-colors",
          view === "list"
            ? "bg-card text-foreground shadow-xs ring-1 ring-border"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <IconList className="size-3.5" /> List
      </Link>
    </div>
  );
}

function ListView({
  rows,
  filter,
}: {
  rows: {
    id: string;
    startsAt: Date;
    endsAt: Date;
    capacity: number;
    status: string;
    location: string | null;
    classTypeName: string;
    classTypeColor: string;
    instructorName: string | null;
    bookedCount: number;
  }[];
  filter: string;
}) {
  const grouped = groupByDate(rows);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Link
          href={
            filter === "upcoming"
              ? "/dashboard/classes?view=list&filter=all"
              : "/dashboard/classes?view=list&filter=upcoming"
          }
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {filter === "upcoming" ? "Show all" : "Show upcoming only"}
        </Link>
      </div>

      {grouped.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconCalendarMonth className="size-5" />}
              title="Nothing scheduled"
              description="Schedule a class to fill the calendar."
            />
          </CardContent>
        </Card>
      ) : (
        grouped.map(([dateKey, items]) => (
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
                    href={`/dashboard/classes/${c.id}`}
                    className="group flex items-center gap-4 px-6 py-4 hover:bg-secondary/40 transition-colors"
                  >
                    <span
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: c.classTypeColor }}
                    />
                    <div className="w-20 tabular-nums">
                      <div className="font-display text-lg leading-none">
                        {fmtTimeBig(c.startsAt)}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase mt-1">
                        {fmtAmPm(c.startsAt)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {c.classTypeName}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {c.instructorName && `${c.instructorName} `}
                        {c.location && ` · ${c.location}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium tabular-nums">
                        {c.bookedCount}/{c.capacity}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        booked
                      </div>
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
        ))
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

function fmtTimeBig(d: Date) {
  return new Date(d)
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })
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
