import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  member,
  memberPackage,
  scheduledClass,
} from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { requireStudio } from "@/lib/studio";
import {
  IconCalendarMonth,
  IconCash,
  IconCheck,
  IconChevronRight,
  IconExternalLink,
  IconLink,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import { and, between, eq, gte, sql } from "drizzle-orm";
import Link from "next/link";
import { AttendanceChart } from "./_components/attendance-chart";

export default async function DashboardHome() {
  const { studio } = await requireStudio();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const last7 = new Date(today);
  last7.setDate(last7.getDate() - 6);
  const last7End = new Date(today);
  last7End.setDate(last7End.getDate() + 1);

  const [
    [memberCount],
    [activePackageCount],
    [monthRevenue],
    [last30Bookings],
    todayClasses,
    weekStats,
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(member)
      .where(eq(member.studioId, studio.id)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(memberPackage)
      .where(
        and(
          eq(memberPackage.studioId, studio.id),
          eq(memberPackage.status, "active"),
          gte(memberPackage.expiresAt, new Date()),
        ),
      ),
    db
      .select({
        total: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}), 0)::int`,
      })
      .from(memberPackage)
      .where(
        and(
          eq(memberPackage.studioId, studio.id),
          gte(memberPackage.createdAt, monthStart),
        ),
      ),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(booking)
      .where(
        and(
          eq(booking.studioId, studio.id),
          gte(booking.createdAt, last7),
        ),
      ),
    db
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
          between(scheduledClass.startsAt, today, tomorrow),
        ),
      )
      .orderBy(scheduledClass.startsAt),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${scheduledClass.startsAt}), 'YYYY-MM-DD')`,
        bookings: sql<number>`count(*) filter (where ${booking.status} in ('booked', 'attended'))::int`,
        attended: sql<number>`count(*) filter (where ${booking.status} = 'attended')::int`,
      })
      .from(scheduledClass)
      .leftJoin(booking, eq(booking.scheduledClassId, scheduledClass.id))
      .where(
        and(
          eq(scheduledClass.studioId, studio.id),
          between(scheduledClass.startsAt, last7, last7End),
        ),
      )
      .groupBy(sql`date_trunc('day', ${scheduledClass.startsAt})`)
      .orderBy(sql`date_trunc('day', ${scheduledClass.startsAt})`),
  ]);

  const chartData = buildWeekSeries(weekStats, last7);

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
        <h1 className="font-display text-4xl md:text-[44px] leading-[1.1] mt-2">
          Good {greeting()},{" "}
          <span className="italic text-primary">{studio.name}</span>.
        </h1>
        <p className="text-muted-foreground text-[15px] mt-2 max-w-xl">
          Here&apos;s what&apos;s flowing today across your studio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<IconUsers className="size-4" />}
          label="Members"
          value={String(memberCount?.count ?? 0)}
          hint="Total in roster"
          href="/dashboard/members"
          accent="sage"
        />
        <StatCard
          icon={<IconUserCheck className="size-4" />}
          label="Active packages"
          value={String(activePackageCount?.count ?? 0)}
          hint="Not expired"
          accent="ochre"
        />
        <StatCard
          icon={<IconCalendarMonth className="size-4" />}
          label="Bookings · 7d"
          value={String(last30Bookings?.count ?? 0)}
          hint="Across all classes"
          href="/dashboard/classes"
          accent="terracotta"
        />
        <StatCard
          icon={<IconCash className="size-4" />}
          label="Revenue · MTD"
          value={formatMoney(monthRevenue?.total ?? 0, studio.currency)}
          hint={today.toLocaleDateString(undefined, { month: "long" })}
        />
      </div>

      <BookingLinkBanner slug={studio.slug} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="text-base">Today&apos;s schedule</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {todayClasses.length}{" "}
                {todayClasses.length === 1 ? "class" : "classes"} ·{" "}
                {todayClasses.reduce(
                  (acc, c) => acc + Number(c.bookedCount ?? 0),
                  0,
                )}{" "}
                booked seats
              </p>
            </div>
            <Link
              href="/dashboard/classes"
              className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
            >
              All classes <IconChevronRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {todayClasses.length === 0 ? (
              <EmptyState
                title="No classes today"
                description="Schedule a class from the Classes page or come back tomorrow."
                icon={<IconCalendarMonth className="size-5" />}
              />
            ) : (
              <ul className="divide-y divide-border">
                {todayClasses.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/classes/${c.id}`}
                      className="group flex items-center gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div
                        className="flex flex-col items-center justify-center w-14 py-2 rounded-lg ring-1 ring-border bg-card"
                        style={{ borderTop: `3px solid ${c.classTypeColor}` }}
                      >
                        <div className="font-display text-base leading-none">
                          {fmtTimeBig(c.startsAt)}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                          {fmtAmPm(c.startsAt)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {c.classTypeName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>
                            {durationLabel(c.startsAt, c.endsAt)} min
                          </span>
                          {c.instructorName && (
                            <>
                              <span className="text-muted-foreground/40">·</span>
                              <span>{c.instructorName}</span>
                            </>
                          )}
                          {c.location && (
                            <>
                              <span className="text-muted-foreground/40">·</span>
                              <span>{c.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Capacity
                        booked={Number(c.bookedCount ?? 0)}
                        capacity={c.capacity}
                      />
                      {c.status === "cancelled" && (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200">
                          Cancelled
                        </Badge>
                      )}
                      <IconChevronRight className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Last 7 days</CardTitle>
            <p className="text-xs text-muted-foreground">
              Bookings vs. attendance
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <AttendanceChart data={chartData} />
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <Legend dot="#3f5141" label="Booked" />
              <Legend dot="#b45f4a" label="Attended" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BookingLinkBanner({ slug }: { slug: string }) {
  return (
    <Card className="bg-gradient-to-br from-primary/[0.04] via-card to-card border-primary/15">
      <CardContent className="py-5 flex items-center gap-4 flex-wrap">
        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <IconLink className="size-5" />
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="font-display text-lg leading-tight">
            Share your booking link
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Members book themselves at{" "}
            <span className="font-mono text-foreground/80">/book/{slug}</span>{" "}
            — no account needed.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/book/${slug}`} target="_blank">
            <button className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              Open <IconExternalLink className="size-3.5" />
            </button>
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Copy link →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function Capacity({ booked, capacity }: { booked: number; capacity: number }) {
  const pct = capacity ? Math.min(100, (booked / capacity) * 100) : 0;
  const full = booked >= capacity;
  return (
    <div className="hidden sm:flex flex-col items-end min-w-[88px]">
      <div className="flex items-center gap-1.5 text-xs">
        {full && <IconCheck className="size-3 text-emerald-700" />}
        <span className="font-medium tabular-nums">{booked}</span>
        <span className="text-muted-foreground">/ {capacity}</span>
      </div>
      <div className="w-20 h-1 rounded-full bg-secondary mt-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: dot }}
      />
      {label}
    </div>
  );
}

function buildWeekSeries(
  raw: { day: string; bookings: number; attended: number }[],
  start: Date,
) {
  const map = new Map(raw.map((r) => [r.day, r]));
  const out: { day: string; bookings: number; attended: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const r = map.get(key);
    out.push({
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      bookings: r?.bookings ?? 0,
      attended: r?.attended ?? 0,
    });
  }
  return out;
}

function durationLabel(start: Date, end: Date) {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000,
  );
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

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
