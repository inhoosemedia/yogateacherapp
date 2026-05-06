import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  member,
  scheduledClass,
} from "@/db/schema";
import { requireInstructor } from "@/lib/instructor";
import {
  IconArrowLeft,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstructorRoster } from "./_components/instructor-roster";

export default async function InstructorClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const ctx = await requireInstructor();

  const [k] = await db
    .select({
      id: scheduledClass.id,
      startsAt: scheduledClass.startsAt,
      endsAt: scheduledClass.endsAt,
      capacity: scheduledClass.capacity,
      status: scheduledClass.status,
      location: scheduledClass.location,
      notes: scheduledClass.notes,
      className: classType.name,
      classColor: classType.color,
    })
    .from(scheduledClass)
    .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
    .where(
      and(
        eq(scheduledClass.id, classId),
        eq(scheduledClass.instructorId, ctx.instructorId),
        eq(scheduledClass.studioId, ctx.studioId),
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

  const bookedCount = roster.filter(
    (r) => r.status === "booked" || r.status === "attended",
  ).length;
  const attendedCount = roster.filter((r) => r.status === "attended").length;
  const duration = Math.round(
    (new Date(k.endsAt).getTime() - new Date(k.startsAt).getTime()) / 60000,
  );

  return (
    <div className="space-y-8">
      <Link
        href="/instructor"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <IconArrowLeft className="size-4" />
        My classes
      </Link>

      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        <div
          className="h-2"
          style={{ backgroundColor: k.classColor }}
          aria-hidden
        />
        <div className="p-7 md:p-8 flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
              {new Date(k.startsAt).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h1 className="font-display text-4xl tracking-tight">
              {k.className}
            </h1>
            <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <IconClock className="size-4" />
                {fmt(k.startsAt)} – {fmt(k.endsAt)} · {duration} min
              </span>
              {k.location && (
                <span className="inline-flex items-center gap-1.5">
                  <IconMapPin className="size-4" />
                  {k.location}
                </span>
              )}
              {k.status === "cancelled" && (
                <Badge className="bg-rose-50 text-rose-700 border-rose-200">
                  Cancelled
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl tabular-nums">
              {bookedCount}
              <span className="text-muted-foreground/60">/{k.capacity}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {attendedCount} attended
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Roster</CardTitle>
          <p className="text-xs text-muted-foreground">
            Tap to check students in as they arrive.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <InstructorRoster bookings={roster} />
        </CardContent>
      </Card>
    </div>
  );
}

function fmt(d: Date) {
  return new Date(d).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
