import { LeafSprig } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  member,
  memberPackage,
  package_,
  scheduledClass,
  waitlistEntry,
} from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { requireStudio } from "@/lib/studio";
import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconBell,
  IconCalendarPlus,
  IconChevronRight,
  IconClock,
  IconHeart,
  IconPlus,
  IconSparkles,
  IconUserPlus,
} from "@tabler/icons-react";
import { and, between, desc, eq, gte, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { AttendanceChart } from "./_components/attendance-chart";
import { CopyLinkButton } from "./_components/copy-link-button";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const { studio } = await requireStudio();
  const cur = studio.currency;

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const weekEnd = new Date(tomorrow);
  const in7 = new Date(now);
  in7.setDate(in7.getDate() + 7);
  const upEnd = new Date(today);
  upEnd.setDate(upEnd.getDate() + 7);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const days21 = new Date(now);
  days21.setDate(days21.getDate() - 21);

  const [
    [members],
    [revenue],
    [bookings],
    todayClasses,
    weekStats,
    [occupancy],
    [bookedWk],
    [expiring],
    [ms],
    [mrrRow],
    recentBookings,
    recentPurchases,
    [inactive],
    inactiveSample,
    calRows,
  ] = await Promise.all([
    // members: total / active / new this month
    db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where ${member.status} = 'active')::int`,
        newThisMonth: sql<number>`count(*) filter (where ${member.createdAt} >= ${monthStart})::int`,
      })
      .from(member)
      .where(eq(member.studioId, studio.id)),
    // revenue this month vs last month
    db
      .select({
        thisMonth: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}) filter (where ${memberPackage.createdAt} >= ${monthStart}), 0)::int`,
        lastMonth: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}) filter (where ${memberPackage.createdAt} >= ${lastMonthStart} and ${memberPackage.createdAt} < ${monthStart}), 0)::int`,
      })
      .from(memberPackage)
      .where(eq(memberPackage.studioId, studio.id)),
    // attendance breakdown over the past week's classes (by class start time)
    db
      .select({
        attended: sql<number>`count(*) filter (where ${booking.status} = 'attended')::int`,
        cancelled: sql<number>`count(*) filter (where ${booking.status} = 'cancelled')::int`,
        noShow: sql<number>`count(*) filter (where ${booking.status} = 'no_show')::int`,
      })
      .from(booking)
      .innerJoin(scheduledClass, eq(scheduledClass.id, booking.scheduledClassId))
      .where(
        and(
          eq(booking.studioId, studio.id),
          between(scheduledClass.startsAt, weekAgo, tomorrow),
        ),
      ),
    // today's classes
    db
      .select({
        id: scheduledClass.id,
        startsAt: scheduledClass.startsAt,
        capacity: scheduledClass.capacity,
        status: scheduledClass.status,
        classTypeName: classType.name,
        classTypeColor: classType.color,
        instructorName: instructor.fullName,
        booked: sql<number>`(select count(*)::int from ${booking} where ${booking.scheduledClassId} = ${scheduledClass.id} and ${booking.status} in ('booked','attended'))`,
        waitlist: sql<number>`(select count(*)::int from ${waitlistEntry} where ${waitlistEntry.scheduledClassId} = ${scheduledClass.id} and ${waitlistEntry.status} = 'waiting')`,
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
    // per-day booked/attended for the line chart
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${scheduledClass.startsAt}), 'YYYY-MM-DD')`,
        bookings: sql<number>`count(*) filter (where ${booking.status} in ('booked','attended'))::int`,
        attended: sql<number>`count(*) filter (where ${booking.status} = 'attended')::int`,
      })
      .from(scheduledClass)
      .leftJoin(booking, eq(booking.scheduledClassId, scheduledClass.id))
      .where(
        and(
          eq(scheduledClass.studioId, studio.id),
          between(scheduledClass.startsAt, weekStart, weekEnd),
        ),
      )
      .groupBy(sql`date_trunc('day', ${scheduledClass.startsAt})`)
      .orderBy(sql`date_trunc('day', ${scheduledClass.startsAt})`),
    // upcoming-week capacity (by class start time)
    db
      .select({
        capacity: sql<number>`coalesce(sum(${scheduledClass.capacity}), 0)::int`,
      })
      .from(scheduledClass)
      .where(
        and(
          eq(scheduledClass.studioId, studio.id),
          between(scheduledClass.startsAt, today, upEnd),
        ),
      ),
    // booked seats this upcoming week vs the previous week (by class start time)
    db
      .select({
        thisWeek: sql<number>`count(*) filter (where ${scheduledClass.startsAt} >= ${today} and ${scheduledClass.startsAt} < ${upEnd} and ${booking.status} in ('booked','attended'))::int`,
        prevWeek: sql<number>`count(*) filter (where ${scheduledClass.startsAt} >= ${weekAgo} and ${scheduledClass.startsAt} < ${today} and ${booking.status} in ('booked','attended'))::int`,
      })
      .from(booking)
      .innerJoin(scheduledClass, eq(scheduledClass.id, booking.scheduledClassId))
      .where(
        and(
          eq(booking.studioId, studio.id),
          between(scheduledClass.startsAt, weekAgo, upEnd),
        ),
      ),
    // packages expiring in the next 7 days (revenue at risk)
    db
      .select({
        count: sql<number>`count(*)::int`,
        value: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}), 0)::int`,
      })
      .from(memberPackage)
      .where(
        and(
          eq(memberPackage.studioId, studio.id),
          eq(memberPackage.status, "active"),
          between(memberPackage.expiresAt, now, in7),
        ),
      ),
    // membership breakdown for the donut
    db
      .select({
        active: sql<number>`count(*) filter (where ${memberPackage.status} = 'active' and ${memberPackage.expiresAt} > ${now})::int`,
        activeValue: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}) filter (where ${memberPackage.status} = 'active' and ${memberPackage.expiresAt} > ${now}), 0)::int`,
        expiring: sql<number>`count(*) filter (where ${memberPackage.status} = 'active' and ${memberPackage.expiresAt} > ${now} and ${memberPackage.expiresAt} <= ${in7})::int`,
        expiringValue: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}) filter (where ${memberPackage.status} = 'active' and ${memberPackage.expiresAt} > ${now} and ${memberPackage.expiresAt} <= ${in7}), 0)::int`,
        lapsed: sql<number>`count(*) filter (where ${memberPackage.status} <> 'active' or ${memberPackage.expiresAt} <= ${now})::int`,
        lapsedValue: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}) filter (where ${memberPackage.status} <> 'active' or ${memberPackage.expiresAt} <= ${now}), 0)::int`,
      })
      .from(memberPackage)
      .where(eq(memberPackage.studioId, studio.id)),
    // MRR proxy — active unlimited (monthly) memberships
    db
      .select({
        mrr: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}), 0)::int`,
      })
      .from(memberPackage)
      .innerJoin(package_, eq(package_.id, memberPackage.packageId))
      .where(
        and(
          eq(memberPackage.studioId, studio.id),
          eq(memberPackage.status, "active"),
          gte(memberPackage.expiresAt, now),
          eq(package_.kind, "unlimited"),
        ),
      ),
    // recent bookings for the activity feed
    db
      .select({
        name: member.fullName,
        detail: classType.name,
        at: booking.createdAt,
        status: booking.status,
      })
      .from(booking)
      .innerJoin(member, eq(member.id, booking.memberId))
      .innerJoin(scheduledClass, eq(scheduledClass.id, booking.scheduledClassId))
      .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
      .where(eq(booking.studioId, studio.id))
      .orderBy(desc(booking.createdAt))
      .limit(5),
    // recent package purchases for the activity feed
    db
      .select({
        name: member.fullName,
        detail: package_.name,
        at: memberPackage.createdAt,
      })
      .from(memberPackage)
      .innerJoin(member, eq(member.id, memberPackage.memberId))
      .innerJoin(package_, eq(package_.id, memberPackage.packageId))
      .where(eq(memberPackage.studioId, studio.id))
      .orderBy(desc(memberPackage.createdAt))
      .limit(5),
    // members inactive 21+ days (count)
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(member)
      .where(
        and(
          eq(member.studioId, studio.id),
          eq(member.status, "active"),
          sql`not exists (select 1 from ${booking} b where b.member_id = ${member.id} and b.created_at >= ${days21} and b.status in ('booked','attended'))`,
        ),
      ),
    // members inactive 21+ days (sample names for avatars)
    db
      .select({ name: member.fullName })
      .from(member)
      .where(
        and(
          eq(member.studioId, studio.id),
          eq(member.status, "active"),
          sql`not exists (select 1 from ${booking} b where b.member_id = ${member.id} and b.created_at >= ${days21} and b.status in ('booked','attended'))`,
        ),
      )
      .limit(5),
    // days this month that have classes
    db
      .selectDistinct({
        day: sql<number>`extract(day from ${scheduledClass.startsAt})::int`,
      })
      .from(scheduledClass)
      .where(
        and(
          eq(scheduledClass.studioId, studio.id),
          between(scheduledClass.startsAt, monthStart, monthEnd),
        ),
      ),
  ]);

  // ── derived metrics ────────────────────────────────────────────────
  const revThisMonth = revenue?.thisMonth ?? 0;
  const revLastMonth = revenue?.lastMonth ?? 0;
  const revTrend = pctChange(revThisMonth, revLastMonth);
  const bookingsThisWeek = bookedWk?.thisWeek ?? 0;
  const bookTrend = pctChange(bookedWk?.thisWeek ?? 0, bookedWk?.prevWeek ?? 0);
  const capacityWk = occupancy?.capacity ?? 0;
  const occPct =
    capacityWk > 0 ? Math.min(100, Math.round((bookingsThisWeek / capacityWk) * 100)) : 0;
  const spacesLeft = Math.max(0, capacityWk - bookingsThisWeek);
  const attended = bookings?.attended ?? 0;
  const noShow = bookings?.noShow ?? 0;
  const attendanceRate =
    attended + noShow > 0 ? Math.round((attended / (attended + noShow)) * 100) : 0;
  const totalMembers = members?.total ?? 0;
  const activeMembers = members?.active ?? 0;
  const paying = ms?.active ?? 0;
  const retentionPct =
    totalMembers > 0 ? Math.min(100, Math.round((paying / totalMembers) * 100)) : 0;
  const monetizationPct =
    activeMembers > 0 ? Math.min(100, Math.round((paying / activeMembers) * 100)) : 0;

  const energyBars = [
    { label: "Bookings", pct: occPct || 0 },
    { label: "Retention", pct: retentionPct },
    { label: "Revenue", pct: monetizationPct },
    { label: "Attendance", pct: attendanceRate },
  ];
  const energyScore = Math.round(
    energyBars.reduce((a, b) => a + b.pct, 0) / energyBars.length,
  );

  const chartData = buildWeekSeries(weekStats, weekStart);
  const bookingSpark = chartData.map((d) => d.bookings);

  // sparkline series (fallback to a gentle rising curve when there's no data)
  const memberSpark = growthSeries(totalMembers, members?.newThisMonth ?? 0);
  const revSpark = growthSeries(
    Math.round(revThisMonth / 100),
    Math.round((revThisMonth - revLastMonth) / 100),
  );
  const occSpark = growthSeries(occPct, 6);

  // activity feed
  const activity = [
    ...recentBookings.map((r) => ({
      kind: r.status === "cancelled" ? ("alert" as const) : ("book" as const),
      text:
        r.status === "cancelled"
          ? `${r.name} cancelled ${r.detail}`
          : `${r.name} booked ${r.detail}`,
      at: r.at as Date,
    })),
    ...recentPurchases.map((r) => ({
      kind: "purchase" as const,
      text: `${r.name} purchased ${r.detail}`,
      at: r.at as Date,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5);

  const inactiveCount = inactive?.count ?? 0;
  const calendarDays = new Set(calRows.map((r) => r.day));

  const bookingUrl = `https://yogateacherapp.com/book/${studio.slug}`;

  return (
    <div className="space-y-6">
      {/* ── Header + hero ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-stretch">
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-4xl md:text-[46px] leading-[1.05] flex items-center gap-3">
            Good {greeting()}, <span className="italic text-primary">{studio.name}</span>.
            <IconSparkles className="size-6 text-[color:var(--chart-3)] hidden sm:block" />
          </h1>
          <p className="text-muted-foreground text-[15px] mt-2">
            Here&apos;s what&apos;s flowing in your studio today.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <QuickAction href="/dashboard/classes" icon={<IconPlus className="size-4" />}>
              Add Class
            </QuickAction>
            <QuickAction href="/dashboard/members" icon={<IconUserPlus className="size-4" />}>
              Add Member
            </QuickAction>
            <QuickAction
              href="/dashboard/bookings"
              icon={<IconCalendarPlus className="size-4" />}
              subtle
            >
              View Bookings
            </QuickAction>
          </div>
        </div>
        <div className="relative hidden lg:block w-[440px] xl:w-[600px] self-stretch min-h-[230px] rounded-2xl overflow-hidden ring-1 ring-border shadow-sm">
          <Image
            src="/images/studio-hero.jpg"
            alt="Yoga practice"
            fill
            sizes="600px"
            className="object-cover object-[center_35%]"
            priority
          />
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Revenue this month"
          value={formatMoney(revThisMonth, cur)}
          trend={revTrend}
          trendLabel="vs last month"
          spark={revSpark}
          color="var(--chart-1)"
          href="/dashboard/reports"
        />
        <MetricCard
          label="Active members"
          value={String(activeMembers)}
          trend={members?.newThisMonth ? { pct: null, up: true } : undefined}
          trendLabel={`${members?.newThisMonth ?? 0} this month`}
          spark={memberSpark}
          color="var(--chart-1)"
          href="/dashboard/members"
        />
        <MetricCard
          label="Bookings this week"
          value={String(bookingsThisWeek)}
          trend={bookTrend}
          trendLabel="vs last week"
          spark={bookingSpark}
          color="var(--chart-1)"
          href="/dashboard/bookings"
        />
        <MetricCard
          label="Average occupancy"
          value={`${occPct}%`}
          trendLabel={`${spacesLeft} spaces available`}
          spark={occSpark}
          color="var(--chart-3)"
          href="/dashboard/classes"
        />
      </div>

      {/* ── Row: Today's Flow · Needs Attention · Studio Energy ───── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Today's Flow */}
        <Card className="overflow-hidden">
          <CardHeader
            title="Today's Flow"
            action={
              <Link
                href="/dashboard/classes"
                className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
              >
                View Full Schedule
              </Link>
            }
            icon={<IconClock className="size-[18px]" />}
          />
          <CardContent className="p-0">
            {todayClasses.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No classes scheduled today.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {todayClasses.slice(0, 5).map((c) => {
                  const booked = Number(c.booked ?? 0);
                  const wait = Number(c.waitlist ?? 0);
                  const full = booked >= c.capacity;
                  const left = Math.max(0, c.capacity - booked);
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/dashboard/classes/${c.id}`}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/40 transition-colors"
                      >
                        <div className="w-[46px] shrink-0">
                          <div className="font-display text-[15px] leading-none">
                            {fmtTime(c.startsAt)}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                            {fmtAmPm(c.startsAt)}
                          </div>
                        </div>
                        <div className="relative shrink-0">
                          <InitialsAvatar
                            name={c.instructorName ?? c.classTypeName}
                            size="sm"
                          />
                          <span
                            className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-card"
                            style={{ backgroundColor: c.classTypeColor }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {c.classTypeName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {c.instructorName ?? "Unassigned"}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-medium tabular-nums">
                            {booked} / {c.capacity}
                          </div>
                          <div
                            className={
                              full
                                ? "text-[11px] font-medium text-[color:var(--chart-3)]"
                                : "text-[11px] text-muted-foreground"
                            }
                          >
                            {full
                              ? wait > 0
                                ? `${wait} waitlisted`
                                : "FULL"
                              : `${left} left`}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link
              href="/dashboard/classes"
              className="flex items-center justify-center gap-1.5 border-t border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
            >
              <IconPlus className="size-3.5" /> Add Class
            </Link>
          </CardContent>
        </Card>

        {/* Needs Your Attention */}
        <Card>
          <CardHeader title="Needs Your Attention" icon={<IconBell className="size-[18px]" />} />
          <CardContent className="p-3 space-y-1.5">
            {expiring && expiring.count > 0 && (
              <Alert
                tone="warn"
                href="/dashboard/memberships"
                title={`${expiring.count} ${expiring.count === 1 ? "membership expires" : "memberships expire"} this week`}
                sub={`${formatMoney(expiring.value, cur)} revenue at risk`}
              />
            )}
            {bookings && bookings.cancelled > 0 && (
              <Alert
                tone="alert"
                href="/dashboard/bookings"
                title={`${bookings.cancelled} ${bookings.cancelled === 1 ? "cancellation" : "cancellations"} this week`}
                sub="Review and re-fill those spots"
              />
            )}
            {spacesLeft > 0 && todayClasses.length > 0 && (
              <Alert
                tone="info"
                href="/dashboard/classes"
                title={`${spacesLeft} open ${spacesLeft === 1 ? "space" : "spaces"} in this week's classes`}
                sub="Promote them to fill the room"
              />
            )}
            {members && members.newThisMonth > 0 && (
              <Alert
                tone="good"
                href="/dashboard/members"
                title="Welcome your new members"
                sub={`${members.newThisMonth} joined this month`}
              />
            )}
            {noAttention(expiring, bookings, spacesLeft, members) && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                All calm. Nothing needs your attention.
              </div>
            )}
            <Link
              href="/dashboard/reports"
              className="flex items-center gap-1 px-3 pt-2 text-xs font-medium text-primary hover:underline"
            >
              View All Alerts <IconChevronRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Studio Energy */}
        <Card className="relative overflow-hidden">
          <CardHeader title="Studio Energy" icon={<IconSparkles className="size-[18px]" />} />
          <CardContent className="pt-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center shrink-0">
                <EnergyRing score={energyScore} />
                <div className="mt-1.5 max-w-[96px] text-center text-[11px] leading-tight text-muted-foreground">
                  Your studio is{" "}
                  <span className="text-foreground font-medium">
                    {energyLabel(energyScore)}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {energyBars.map((b) => (
                  <Bar key={b.label} label={b.label} pct={b.pct} />
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-secondary/50 p-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Your biggest opportunity
              </div>
              <p className="text-sm mt-1 leading-snug">
                {inactiveCount > 0
                  ? `You have ${inactiveCount} member${inactiveCount === 1 ? "" : "s"} who haven't booked in 21+ days.`
                  : "Everyone's active — keep the momentum going."}
              </p>
              {inactiveCount > 0 && (
                <Link
                  href="/dashboard/marketing"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 h-8 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Re-engage Members
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row: Bookings & Attendance · Membership Overview · Calendar ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bookings & Attendance */}
        <Card>
          <CardHeader title="Bookings & Attendance" />
          <CardContent className="pt-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <AttendanceChart data={chartData} />
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <Legend dot="var(--chart-1)" label="Bookings" />
                  <Legend dot="var(--chart-4)" label="Attendance" />
                </div>
              </div>
              <div className="w-[92px] shrink-0 space-y-3 text-right">
                <MiniStat value={String(bookingsThisWeek)} label="This week" />
                <MiniStat value={`${attendanceRate}%`} label="Attendance" />
                <MiniStat value={String(bookings?.cancelled ?? 0)} label="Cancellations" />
                <MiniStat value={String(noShow)} label="No-shows" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Overview */}
        <Card>
          <CardHeader
            title="Membership Overview"
            action={
              <Link
                href="/dashboard/memberships"
                className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
              >
                View Memberships
              </Link>
            }
          />
          <CardContent className="pt-3">
            <div className="flex items-center gap-4">
              <Donut
                centerTop={formatMoney(mrrRow?.mrr ?? 0, cur)}
                centerSub="MRR"
                segments={[
                  { value: ms?.active ?? 0, color: "var(--chart-1)" },
                  { value: ms?.expiring ?? 0, color: "var(--chart-3)" },
                  { value: ms?.lapsed ?? 0, color: "var(--chart-2)" },
                ]}
              />
              <ul className="flex-1 space-y-2.5 text-sm">
                <DonutLegend
                  color="var(--chart-1)"
                  label="Active memberships"
                  count={ms?.active ?? 0}
                  value={formatMoney(ms?.activeValue ?? 0, cur)}
                />
                <DonutLegend
                  color="var(--chart-3)"
                  label="Expiring this week"
                  count={ms?.expiring ?? 0}
                  value={formatMoney(ms?.expiringValue ?? 0, cur)}
                />
                <DonutLegend
                  color="var(--chart-2)"
                  label="Lapsed"
                  count={ms?.lapsed ?? 0}
                  value={formatMoney(ms?.lapsedValue ?? 0, cur)}
                />
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader
            title={now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            action={
              <Link
                href="/dashboard/calendar"
                className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
              >
                View Calendar
              </Link>
            }
          />
          <CardContent className="pt-3">
            <MiniCalendar
              year={now.getFullYear()}
              month={now.getMonth()}
              todayDate={now.getDate()}
              activeDays={calendarDays}
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Row: Booking Page · Recent Activity · Member Wellbeing · Motto ── */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Share booking page */}
        <Card className="overflow-hidden">
          <div className="relative h-24">
            <Image
              src="/images/booking-studio.jpg"
              alt="Studio"
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
          <CardContent className="pt-4">
            <div className="font-display text-lg leading-tight">Share Your Booking Page</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your booking page is live and ready for new students.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5">
              <span className="flex-1 truncate text-[11px] text-muted-foreground font-mono">
                yogateacherapp.com/book/{studio.slug}
              </span>
              <CopyLinkButton url={bookingUrl} />
            </div>
            <Link
              href={`/book/${studio.slug}`}
              target="_blank"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Preview <IconArrowUpRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity" />
          <CardContent className="p-3">
            {activity.length === 0 ? (
              <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                Activity from your studio will appear here.
              </div>
            ) : (
              <ul className="space-y-0.5">
                {activity.map((a, i) => (
                  <li key={i} className="flex items-center gap-2.5 px-2 py-1.5">
                    <span
                      className="size-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          a.kind === "alert"
                            ? "var(--chart-2)"
                            : a.kind === "purchase"
                              ? "var(--chart-3)"
                              : "var(--chart-1)",
                      }}
                    />
                    <span className="flex-1 text-sm truncate">{a.text}</span>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {timeAgo(a.at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/dashboard/reports"
              className="flex items-center gap-1 px-2 pt-2 text-xs font-medium text-primary hover:underline"
            >
              View All Activity <IconChevronRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Member wellbeing + motto stacked */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Member Wellbeing" icon={<IconHeart className="size-[18px]" />} />
            <CardContent className="pt-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {inactiveSample.slice(0, 4).map((m, i) => (
                    <div key={i} className="ring-2 ring-card rounded-full">
                      <InitialsAvatar name={m.name} size="sm" />
                    </div>
                  ))}
                  {inactiveCount > 4 && (
                    <span className="size-8 rounded-full bg-secondary ring-2 ring-card flex items-center justify-center text-[11px] font-medium text-muted-foreground">
                      +{inactiveCount - 4}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {inactiveCount > 0
                  ? `${inactiveCount} member${inactiveCount === 1 ? "" : "s"} haven't booked in 21+ days.`
                  : "Every member has booked recently."}
              </p>
              <Link
                href="/dashboard/marketing"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View &amp; Reach Out <IconChevronRight className="size-3.5" />
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-secondary/30">
            <LeafSprig
              size={80}
              className="pointer-events-none absolute -right-2 -bottom-3 text-primary/15"
            />
            <CardContent className="py-6 relative">
              <div className="font-display italic text-xl leading-tight">
                Less admin.
                <br />
                More teaching.
              </div>
              <IconHeart className="size-4 text-primary/60 mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── presentational helpers ─────────────────────────────────────────── */

function CardHeader({
  title,
  action,
  icon,
}: {
  title: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
      <div className="flex items-center gap-2 min-w-0">
        {icon && <span className="text-primary shrink-0">{icon}</span>}
        <h2 className="font-display text-[17px] leading-none truncate">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  children,
  subtle,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        subtle
          ? "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 h-10 text-sm font-medium hover:border-primary/30 hover:bg-secondary/40 transition-colors"
          : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 h-10 text-sm font-medium hover:border-primary/30 hover:bg-secondary/40 transition-colors"
      }
    >
      <span className="text-primary">{icon}</span>
      {children}
    </Link>
  );
}

function MetricCard({
  label,
  value,
  trend,
  trendLabel,
  spark,
  color,
  href,
}: {
  label: string;
  value: string;
  trend?: { pct: number | null; up: boolean };
  trendLabel?: string;
  spark: number[];
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
        {label}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="font-display text-[28px] leading-none tracking-tight">{value}</div>
        <Sparkline values={spark} color={color} />
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        {trend && (
          <span
            className={
              trend.up ? "text-[color:var(--success)] font-medium" : "text-[color:var(--chart-2)] font-medium"
            }
          >
            {trend.up ? "↑" : "↓"}
            {trend.pct !== null ? ` ${Math.abs(trend.pct)}%` : ""}
          </span>
        )}
        <span className="text-muted-foreground truncate">{trendLabel}</span>
      </div>
    </Link>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 64;
  const h = 26;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={w} height={h} className="shrink-0" aria-hidden>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EnergyRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, score)) / 100) * c;
  return (
    <div className="relative size-[92px] shrink-0">
      <svg viewBox="0 0 84 84" className="size-full -rotate-90">
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--secondary)" strokeWidth="7" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl leading-none">{score}</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, pct)}%`, backgroundColor: "var(--chart-1)" }}
        />
      </div>
    </div>
  );
}

function Alert({
  tone,
  title,
  sub,
  href,
}: {
  tone: "warn" | "alert" | "info" | "good";
  title: string;
  sub: string;
  href: string;
}) {
  const dot = {
    warn: "var(--chart-3)",
    alert: "var(--chart-2)",
    info: "var(--chart-4)",
    good: "var(--success)",
  }[tone];
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary/50 transition-colors"
    >
      <span
        className="size-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in srgb, ${dot} 14%, transparent)`, color: dot }}
      >
        <IconAlertTriangle className="size-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium leading-tight truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{sub}</div>
      </div>
      <IconChevronRight className="size-4 text-muted-foreground/50 shrink-0" />
    </Link>
  );
}

function Donut({
  segments,
  centerTop,
  centerSub,
}: {
  segments: { value: number; color: string }[];
  centerTop: string;
  centerSub: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = 34;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative size-[104px] shrink-0">
      <svg viewBox="0 0 84 84" className="size-full -rotate-90">
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--secondary)" strokeWidth="9" />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * c;
            const el = (
              <circle
                key={i}
                cx="42"
                cy="42"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="9"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-base leading-none">{centerTop}</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
          {centerSub}
        </span>
      </div>
    </div>
  );
}

function DonutLegend({
  color,
  label,
  count,
  value,
}: {
  color: string;
  label: string;
  count: number;
  value: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="flex-1 min-w-0">
        <span className="font-medium tabular-nums">{count}</span>{" "}
        <span className="text-muted-foreground text-xs">{label}</span>
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">{value}</span>
    </li>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-lg leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}

function MiniCalendar({
  year,
  month,
  todayDate,
  activeDays,
}: {
  year: number;
  month: number;
  todayDate: number;
  activeDays: Set<number>;
}) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset
  const startOffset = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d.slice(0, 1)}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const isToday = d === todayDate;
          const hasClass = activeDays.has(d);
          return (
            <div
              key={i}
              className={
                "relative flex items-center justify-center h-8 rounded-lg text-xs " +
                (isToday
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-secondary/60 text-foreground")
              }
            >
              {d}
              {hasClass && !isToday && (
                <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ backgroundColor: dot }} />
      {label}
    </div>
  );
}

/* ── data helpers ───────────────────────────────────────────────────── */

function noAttention(
  expiring: { count: number } | undefined,
  bookings: { cancelled: number } | undefined,
  spacesLeft: number,
  members: { newThisMonth: number } | undefined,
) {
  return (
    !(expiring && expiring.count > 0) &&
    !(bookings && bookings.cancelled > 0) &&
    !(spacesLeft > 0) &&
    !(members && members.newThisMonth > 0)
  );
}

function pctChange(cur: number, prev: number): { pct: number | null; up: boolean } {
  if (prev <= 0) return { pct: null, up: cur >= 0 };
  const change = Math.round(((cur - prev) / prev) * 100);
  return { pct: change, up: change >= 0 };
}

/** Build a gentle N-point series ending at `end`, so sparklines look alive
 *  even before there's per-day history. */
function growthSeries(end: number, delta: number, n = 7): number[] {
  const start = Math.max(0, end - Math.abs(delta));
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const wobble = Math.sin(i * 1.3) * (Math.abs(delta) * 0.12);
    out.push(Math.max(0, start + (end - start) * t + wobble));
  }
  return out;
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

function fmtTime(d: Date) {
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

function timeAgo(d: Date) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function energyLabel(score: number) {
  if (score >= 80) return "flourishing";
  if (score >= 60) return "growing";
  if (score >= 40) return "finding its rhythm";
  return "ready for a boost";
}
