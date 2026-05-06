import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  member,
  scheduledClass,
  waitlistEntry,
} from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import {
  IconArrowLeft,
  IconClock,
  IconHourglassHigh,
  IconMapPin,
  IconUserCircle,
} from "@tabler/icons-react";
import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEligibleMembers } from "./actions";
import { BookMemberDialog } from "./_components/book-member-dialog";
import { CancelClassButton } from "./_components/cancel-class-button";
import { Roster } from "./_components/roster";
import { WaitlistPanel } from "./_components/waitlist-panel";

export default async function ClassDetail({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const { studio } = await requireStudio();

  const [k] = await db
    .select({
      id: scheduledClass.id,
      startsAt: scheduledClass.startsAt,
      endsAt: scheduledClass.endsAt,
      capacity: scheduledClass.capacity,
      status: scheduledClass.status,
      location: scheduledClass.location,
      notes: scheduledClass.notes,
      classTypeName: classType.name,
      classTypeColor: classType.color,
      instructorName: instructor.fullName,
    })
    .from(scheduledClass)
    .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
    .leftJoin(instructor, eq(instructor.id, scheduledClass.instructorId))
    .where(
      and(
        eq(scheduledClass.id, classId),
        eq(scheduledClass.studioId, studio.id),
      ),
    )
    .limit(1);

  if (!k) notFound();

  const roster = await db
    .select({
      id: booking.id,
      status: booking.status,
      checkedInAt: booking.checkedInAt,
      memberId: member.id,
      memberName: member.fullName,
      memberEmail: member.email,
    })
    .from(booking)
    .innerJoin(member, eq(member.id, booking.memberId))
    .where(eq(booking.scheduledClassId, classId));

  const eligible = await getEligibleMembers(classId);

  const waitlist = await db
    .select({
      id: waitlistEntry.id,
      memberId: member.id,
      memberName: member.fullName,
      memberEmail: member.email,
      joinedAt: waitlistEntry.createdAt,
    })
    .from(waitlistEntry)
    .innerJoin(member, eq(member.id, waitlistEntry.memberId))
    .where(
      and(
        eq(waitlistEntry.scheduledClassId, classId),
        eq(waitlistEntry.status, "waiting"),
      ),
    )
    .orderBy(asc(waitlistEntry.createdAt));

  const bookedCount = roster.filter(
    (r) => r.status === "booked" || r.status === "attended",
  ).length;
  const attendedCount = roster.filter((r) => r.status === "attended").length;
  const fillPct = k.capacity ? Math.min(100, (bookedCount / k.capacity) * 100) : 0;
  const duration = Math.round(
    (new Date(k.endsAt).getTime() - new Date(k.startsAt).getTime()) / 60000,
  );

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/classes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Classes
      </Link>

      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        <div
          className="h-2"
          style={{ backgroundColor: k.classTypeColor }}
          aria-hidden
        />
        <div className="p-8 flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: k.classTypeColor }}
              />
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {new Date(k.startsAt).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {k.status === "cancelled" && (
                <Badge className="bg-rose-50 text-rose-700 border-rose-200">
                  Cancelled
                </Badge>
              )}
            </div>
            <h1 className="font-display text-4xl tracking-tight">
              {k.classTypeName}
            </h1>
            <div className="flex items-center gap-5 mt-4 text-sm text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <IconClock className="size-4" />
                {fmt(k.startsAt)} – {fmt(k.endsAt)} · {duration} min
              </span>
              {k.instructorName && (
                <span className="inline-flex items-center gap-1.5">
                  <IconUserCircle className="size-4" />
                  {k.instructorName}
                </span>
              )}
              {k.location && (
                <span className="inline-flex items-center gap-1.5">
                  <IconMapPin className="size-4" />
                  {k.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <div className="font-display text-3xl tabular-nums">
                {bookedCount}
                <span className="text-muted-foreground/60">/{k.capacity}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {attendedCount} attended
              </div>
            </div>
            <div className="w-40 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <div className="flex gap-2 mt-2">
              {k.status !== "cancelled" && (
                <BookMemberDialog
                  scheduledClassId={k.id}
                  eligibleMembers={eligible}
                  full={bookedCount >= k.capacity}
                />
              )}
              {k.status !== "cancelled" && (
                <CancelClassButton classId={k.id} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Roster</CardTitle>
            <p className="text-xs text-muted-foreground">
              Check students in as they arrive.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Roster bookings={roster} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base inline-flex items-center gap-2">
                  <IconHourglassHigh className="size-4 text-primary" />
                  Waitlist
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {waitlist.length === 0
                    ? "No one waiting."
                    : `${waitlist.length} in line — auto-promoted on cancel.`}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <WaitlistPanel entries={waitlist} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/90 whitespace-pre-wrap py-4 leading-relaxed">
              {k.notes || (
                <span className="text-muted-foreground italic">
                  No notes for this class.
                </span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function fmt(d: Date) {
  return new Date(d).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
