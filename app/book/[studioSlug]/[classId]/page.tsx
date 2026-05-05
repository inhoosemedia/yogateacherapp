import { BrandMark } from "@/components/brand";
import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  scheduledClass,
  studio,
} from "@/db/schema";
import {
  IconArrowLeft,
  IconCalendarMonth,
  IconClock,
  IconMapPin,
  IconUserCircle,
} from "@tabler/icons-react";
import { and, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookForm } from "./_components/book-form";

export const dynamic = "force-dynamic";

export default async function PublicClassPage({
  params,
}: {
  params: Promise<{ studioSlug: string; classId: string }>;
}) {
  const { studioSlug, classId } = await params;

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.slug, studioSlug))
    .limit(1);
  if (!s) notFound();

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
        eq(scheduledClass.id, classId),
        eq(scheduledClass.studioId, s.id),
      ),
    )
    .limit(1);

  if (!k) notFound();

  const cancelled = k.status === "cancelled";
  const past = new Date(k.startsAt) < new Date();
  const full = k.bookedCount >= k.capacity;
  const blocked = cancelled || past || full;
  const blockedReason = cancelled
    ? "This class has been cancelled."
    : past
      ? "This class has already started."
      : full
        ? "This class is full."
        : null;

  const duration = Math.round(
    (new Date(k.endsAt).getTime() - new Date(k.startsAt).getTime()) / 60000,
  );

  return (
    <main className="min-h-screen bg-canvas canvas-grain">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link
            href={`/book/${studioSlug}`}
            className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
          >
            <BrandMark size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl truncate">{s.name}</div>
            <div className="text-[11px] text-muted-foreground">
              Public schedule
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href={`/book/${studioSlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <IconArrowLeft className="size-4" />
          All classes
        </Link>

        {/* Class hero */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          <div
            className="h-2"
            style={{ backgroundColor: k.classTypeColor }}
            aria-hidden
          />
          <div className="p-7 md:p-9">
            <div className="flex items-center gap-2 mb-3">
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
            </div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
              {k.classTypeName}
            </h1>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <Detail
                icon={<IconClock className="size-4" />}
                label={`${fmtTime(k.startsAt)} – ${fmtTime(k.endsAt)}`}
                sub={`${duration} minutes`}
              />
              {k.instructorName && (
                <Detail
                  icon={<IconUserCircle className="size-4" />}
                  label={k.instructorName}
                  sub="Instructor"
                />
              )}
              {k.location && (
                <Detail
                  icon={<IconMapPin className="size-4" />}
                  label={k.location}
                  sub="Location"
                />
              )}
              <Detail
                icon={<IconCalendarMonth className="size-4" />}
                label={
                  full
                    ? "Full"
                    : `${k.capacity - k.bookedCount} of ${k.capacity} spots open`
                }
                sub={`${k.bookedCount} booked`}
              />
            </div>
            {k.notes && (
              <div className="mt-6 p-4 rounded-xl bg-secondary/50 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {k.notes}
              </div>
            )}
          </div>
        </div>

        {/* Booking form / blocked state */}
        <div className="mt-6">
          {blocked ? (
            <div className="rounded-2xl border border-border bg-card p-7 text-center">
              <div className="font-display text-xl">Booking unavailable</div>
              <p className="mt-2 text-sm text-muted-foreground">
                {blockedReason}
              </p>
              <div className="mt-5">
                <Link
                  href={`/book/${studioSlug}`}
                  className="text-sm text-primary hover:underline"
                >
                  ← Back to schedule
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3">
                Reserve your spot
              </div>
              <h2 className="font-display text-2xl tracking-tight">
                Book this class
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                If you have an active package, a credit will be used. If
                not, you can pay at the studio.
              </p>
              <div className="mt-6">
                <BookForm
                  studioSlug={studioSlug}
                  scheduledClassId={k.id}
                  className={k.classTypeName}
                  startsAt={k.startsAt}
                />
              </div>
            </div>
          )}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <Link href="/" className="text-primary hover:underline">
            YogaTeacher
          </Link>
        </p>
      </section>
    </main>
  );
}

function Detail({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="size-8 rounded-lg bg-secondary/70 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-foreground font-medium">{label}</div>
        {sub && (
          <div className="text-xs text-muted-foreground">{sub}</div>
        )}
      </div>
    </div>
  );
}

function fmtTime(d: Date) {
  return new Date(d).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
