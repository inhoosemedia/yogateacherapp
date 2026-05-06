import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { db } from "@/db/drizzle";
import {
  booking,
  member,
  memberPackage,
  scheduledClass,
  studio,
  studioMember,
} from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { auth } from "@/lib/auth";
import {
  IconCalendarMonth,
  IconCash,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?returnTo=/dashboard/reports");

  // Studios this user is owner/admin of (we don't show staff-only or instructor
  // memberships here — reports are a management view).
  const studios = await db
    .select({
      id: studio.id,
      name: studio.name,
      currency: studio.currency,
      role: studioMember.role,
    })
    .from(studioMember)
    .innerJoin(studio, eq(studio.id, studioMember.studioId))
    .where(
      and(
        eq(studioMember.userId, session.user.id),
        inArray(studioMember.role, ["owner", "admin"]),
      ),
    );

  if (studios.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Reports"
          title="Cross-studio reports"
          description="Aggregate view across every studio you own or manage."
        />
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            You don&apos;t own any studios yet.
          </CardContent>
        </Card>
      </div>
    );
  }

  const studioIds = studios.map((s) => s.id);
  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Per-studio aggregate roll-up
  const perStudio = await Promise.all(
    studios.map(async (s) => {
      const [[m], [b30], [rev], [activePack]] = await Promise.all([
        db
          .select({ c: sql<number>`count(*)::int` })
          .from(member)
          .where(eq(member.studioId, s.id)),
        db
          .select({ c: sql<number>`count(*)::int` })
          .from(booking)
          .where(
            and(
              eq(booking.studioId, s.id),
              gte(booking.createdAt, since30),
            ),
          ),
        db
          .select({
            total: sql<number>`coalesce(sum(${memberPackage.pricePaidCents}),0)::int`,
          })
          .from(memberPackage)
          .where(
            and(
              eq(memberPackage.studioId, s.id),
              gte(memberPackage.createdAt, monthStart),
            ),
          ),
        db
          .select({ c: sql<number>`count(*)::int` })
          .from(memberPackage)
          .where(
            and(
              eq(memberPackage.studioId, s.id),
              eq(memberPackage.status, "active"),
              gte(memberPackage.expiresAt, new Date()),
            ),
          ),
      ]);
      return {
        ...s,
        members: m.c,
        bookings30: b30.c,
        revenueMtd: rev.total,
        activePackages: activePack.c,
      };
    }),
  );

  const totals = perStudio.reduce(
    (acc, s) => ({
      members: acc.members + s.members,
      bookings30: acc.bookings30 + s.bookings30,
      activePackages: acc.activePackages + s.activePackages,
    }),
    { members: 0, bookings30: 0, activePackages: 0 },
  );

  // Sum revenue per currency (currencies may differ between studios)
  const revenueByCurrency = perStudio.reduce(
    (acc, s) => {
      acc[s.currency] = (acc[s.currency] ?? 0) + s.revenueMtd;
      return acc;
    },
    {} as Record<string, number>,
  );
  const upcomingClasses = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(scheduledClass)
    .where(
      and(
        inArray(scheduledClass.studioId, studioIds),
        gte(scheduledClass.startsAt, new Date()),
        eq(scheduledClass.status, "scheduled"),
      ),
    );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reports"
        title="Cross-studio reports"
        description={`Aggregate view across ${studios.length} ${studios.length === 1 ? "studio" : "studios"}.`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<IconUsers className="size-4" />}
          label="Total members"
          value={String(totals.members)}
          accent="sage"
        />
        <StatCard
          icon={<IconUserCheck className="size-4" />}
          label="Active packages"
          value={String(totals.activePackages)}
          accent="ochre"
        />
        <StatCard
          icon={<IconCalendarMonth className="size-4" />}
          label="Bookings · 30d"
          value={String(totals.bookings30)}
          accent="terracotta"
        />
        <StatCard
          icon={<IconCash className="size-4" />}
          label="Revenue · MTD"
          value={Object.entries(revenueByCurrency)
            .map(([c, v]) => formatMoney(v, c))
            .join(" · ") || "—"}
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Per-studio breakdown</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {upcomingClasses[0].c} upcoming classes across all studios.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-3 font-medium">Studio</th>
                <th className="px-6 py-3 font-medium text-right">Members</th>
                <th className="px-6 py-3 font-medium text-right">Active packages</th>
                <th className="px-6 py-3 font-medium text-right">Bookings (30d)</th>
                <th className="px-6 py-3 font-medium text-right">Revenue (MTD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {perStudio.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-3.5">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {s.role}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums">
                    {s.members}
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums">
                    {s.activePackages}
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums">
                    {s.bookings30}
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums">
                    {formatMoney(s.revenueMtd, s.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Want a single report?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground py-4 leading-relaxed">
          Use the{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/exports/revenue"
            className="text-primary hover:underline"
          >
            Revenue
          </a>
          ,{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/exports/bookings"
            className="text-primary hover:underline"
          >
            Bookings
          </a>
          , and{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/exports/members"
            className="text-primary hover:underline"
          >
            Members
          </a>{" "}
          CSV exports to combine in your favourite spreadsheet — they currently
          export the active studio. Switch studios from the top right to export
          another.
        </CardContent>
      </Card>
    </div>
  );
}
