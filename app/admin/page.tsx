import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { db } from "@/db/drizzle";
import {
  booking,
  member,
  scheduledClass,
  studio,
  user,
} from "@/db/schema";
import {
  IconBuildingStore,
  IconCalendarMonth,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { sql } from "drizzle-orm";

export default async function AdminOverview() {
  const [
    [studioCount],
    [userCount],
    [memberCount],
    [classCount],
    [bookingCount],
    [trialing],
    [active],
    [past],
  ] = await Promise.all([
    db.select({ c: sql<number>`count(*)::int` }).from(studio),
    db.select({ c: sql<number>`count(*)::int` }).from(user),
    db.select({ c: sql<number>`count(*)::int` }).from(member),
    db.select({ c: sql<number>`count(*)::int` }).from(scheduledClass),
    db.select({ c: sql<number>`count(*)::int` }).from(booking),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(studio)
      .where(sql`${studio.subscriptionStatus} = 'trialing' and ${studio.trialEndsAt} > now()`),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(studio)
      .where(sql`${studio.subscriptionStatus} = 'active'`),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(studio)
      .where(sql`${studio.subscriptionStatus} = 'trialing' and ${studio.trialEndsAt} <= now()`),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform"
        title="Overview"
        description="Every studio, every user, every booking that has ever touched Asana."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<IconBuildingStore className="size-4" />}
          label="Studios"
          value={String(studioCount.c)}
          accent="sage"
          href="/admin/studios"
        />
        <StatCard
          icon={<IconUsersGroup className="size-4" />}
          label="Users"
          value={String(userCount.c)}
          accent="ochre"
          href="/admin/users"
        />
        <StatCard
          icon={<IconUsers className="size-4" />}
          label="Members"
          value={String(memberCount.c)}
          accent="terracotta"
        />
        <StatCard
          icon={<IconCalendarMonth className="size-4" />}
          label="Bookings"
          value={String(bookingCount.c)}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <SubBox label="Active subscriptions" value={active.c} tone="emerald" />
        <SubBox label="In free trial" value={trialing.c} tone="amber" />
        <SubBox label="Trial expired" value={past.c} tone="rose" />
      </div>

      <div className="text-sm text-muted-foreground">
        {classCount.c} classes scheduled across all studios.
      </div>
    </div>
  );
}

function SubBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose";
}) {
  const map = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    rose: "bg-rose-50 border-rose-200 text-rose-900",
  };
  return (
    <div
      className={`rounded-2xl border px-5 py-4 flex items-center justify-between ${map[tone]}`}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="font-display text-3xl tabular-nums">{value}</div>
    </div>
  );
}
