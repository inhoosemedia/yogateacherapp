import "server-only";

import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  member,
  scheduledClass,
  studio,
  waitlistEntry,
} from "@/db/schema";
import {
  bookingCancelledTemplate,
  bookingConfirmationTemplate,
  parseNotificationPrefs,
  sendEmail,
  waitlistPromotedTemplate,
  type NotificationPrefs,
} from "@/lib/email";
import { and, asc, eq, gt, gte, isNull, or } from "drizzle-orm";
import { memberPackage } from "@/db/schema";
import { nanoid } from "nanoid";

type ClassContext = {
  studioId: string;
  studioName: string;
  notificationPrefs: NotificationPrefs;
  className: string;
  classId: string;
  instructorName: string | null;
  startsAt: Date;
  location: string | null;
};

async function loadContext(scheduledClassId: string): Promise<ClassContext | null> {
  const [row] = await db
    .select({
      studioId: scheduledClass.studioId,
      studioName: studio.name,
      notificationSettings: studio.notificationSettings,
      className: classType.name,
      classId: scheduledClass.id,
      instructorName: instructor.fullName,
      startsAt: scheduledClass.startsAt,
      location: scheduledClass.location,
    })
    .from(scheduledClass)
    .innerJoin(studio, eq(studio.id, scheduledClass.studioId))
    .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
    .leftJoin(instructor, eq(instructor.id, scheduledClass.instructorId))
    .where(eq(scheduledClass.id, scheduledClassId))
    .limit(1);
  if (!row) return null;
  return {
    studioId: row.studioId,
    studioName: row.studioName,
    notificationPrefs: parseNotificationPrefs(row.notificationSettings),
    className: row.className,
    classId: row.classId,
    instructorName: row.instructorName,
    startsAt: row.startsAt,
    location: row.location,
  };
}

function publicBookingUrl(studioSlug: string, classId: string): string | undefined {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  if (!origin) return undefined;
  return `${origin}/book/${studioSlug}/${classId}`;
}

export async function sendBookingConfirmation(input: {
  scheduledClassId: string;
  memberId: string;
  bookingId: string;
  usedCredit: boolean;
}) {
  const ctx = await loadContext(input.scheduledClassId);
  if (!ctx) return;
  if (!ctx.notificationPrefs.bookingConfirmation) return;

  const [m] = await db
    .select({
      fullName: member.fullName,
      email: member.email,
    })
    .from(member)
    .where(eq(member.id, input.memberId))
    .limit(1);
  if (!m?.email) return;

  const [s] = await db
    .select({ slug: studio.slug })
    .from(studio)
    .where(eq(studio.id, ctx.studioId))
    .limit(1);

  const tpl = bookingConfirmationTemplate({
    studioName: ctx.studioName,
    memberName: m.fullName,
    className: ctx.className,
    startsAt: ctx.startsAt,
    location: ctx.location,
    instructorName: ctx.instructorName,
    bookingUrl: s?.slug ? publicBookingUrl(s.slug, ctx.classId) : undefined,
    usedCredit: input.usedCredit,
  });
  await sendEmail({
    studioId: ctx.studioId,
    type: "booking_confirmation",
    to: m.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    bookingId: input.bookingId,
    scheduledClassId: input.scheduledClassId,
    memberId: input.memberId,
  });
}

export async function sendBookingCancelled(input: {
  scheduledClassId: string;
  memberId: string;
  bookingId: string;
  reason?: string;
  refunded?: boolean;
}) {
  const ctx = await loadContext(input.scheduledClassId);
  if (!ctx) return;
  if (!ctx.notificationPrefs.bookingCancelled) return;

  const [m] = await db
    .select({ fullName: member.fullName, email: member.email })
    .from(member)
    .where(eq(member.id, input.memberId))
    .limit(1);
  if (!m?.email) return;

  const tpl = bookingCancelledTemplate({
    studioName: ctx.studioName,
    memberName: m.fullName,
    className: ctx.className,
    startsAt: ctx.startsAt,
    reason: input.reason,
    refunded: input.refunded,
  });
  await sendEmail({
    studioId: ctx.studioId,
    type: "booking_cancelled",
    to: m.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    bookingId: input.bookingId,
    scheduledClassId: input.scheduledClassId,
    memberId: input.memberId,
  });
}

export async function sendWaitlistPromoted(input: {
  scheduledClassId: string;
  memberId: string;
  bookingId: string;
}) {
  const ctx = await loadContext(input.scheduledClassId);
  if (!ctx) return;
  if (!ctx.notificationPrefs.waitlistPromoted) return;

  const [m] = await db
    .select({ fullName: member.fullName, email: member.email })
    .from(member)
    .where(eq(member.id, input.memberId))
    .limit(1);
  if (!m?.email) return;

  const [s] = await db
    .select({ slug: studio.slug })
    .from(studio)
    .where(eq(studio.id, ctx.studioId))
    .limit(1);

  const tpl = waitlistPromotedTemplate({
    studioName: ctx.studioName,
    memberName: m.fullName,
    className: ctx.className,
    startsAt: ctx.startsAt,
    location: ctx.location,
    instructorName: ctx.instructorName,
    bookingUrl: s?.slug ? publicBookingUrl(s.slug, ctx.classId) : undefined,
  });
  await sendEmail({
    studioId: ctx.studioId,
    type: "waitlist_promoted",
    to: m.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    bookingId: input.bookingId,
    scheduledClassId: input.scheduledClassId,
    memberId: input.memberId,
  });
}

/**
 * Promote the next waiting member on the waitlist into a booking, decrementing
 * a credit if available. Returns the new booking id (or null if no one waiting).
 *
 * Caller is responsible for capacity-checking before calling — typically this
 * runs whenever a seat opens (a booking is cancelled or no-showed, or the
 * class capacity is increased).
 */
export async function promoteFromWaitlist(input: {
  studioId: string;
  scheduledClassId: string;
}): Promise<{ bookingId: string; memberId: string } | null> {
  const [next] = await db
    .select()
    .from(waitlistEntry)
    .where(
      and(
        eq(waitlistEntry.studioId, input.studioId),
        eq(waitlistEntry.scheduledClassId, input.scheduledClassId),
        eq(waitlistEntry.status, "waiting"),
      ),
    )
    .orderBy(asc(waitlistEntry.createdAt))
    .limit(1);
  if (!next) return null;

  // Don't promote if member is already booked for this class.
  const [already] = await db
    .select({ id: booking.id, status: booking.status })
    .from(booking)
    .where(
      and(
        eq(booking.scheduledClassId, input.scheduledClassId),
        eq(booking.memberId, next.memberId),
      ),
    )
    .limit(1);
  if (already && (already.status === "booked" || already.status === "attended")) {
    // Skip — mark the waitlist entry as removed and try the next one.
    await db
      .update(waitlistEntry)
      .set({ status: "removed" })
      .where(eq(waitlistEntry.id, next.id));
    return promoteFromWaitlist(input);
  }

  // Pick best active package for the member
  const [pack] = await db
    .select()
    .from(memberPackage)
    .where(
      and(
        eq(memberPackage.memberId, next.memberId),
        eq(memberPackage.studioId, input.studioId),
        eq(memberPackage.status, "active"),
        gte(memberPackage.expiresAt, new Date()),
        or(
          isNull(memberPackage.creditsRemaining),
          gt(memberPackage.creditsRemaining, 0),
        ),
      ),
    )
    .orderBy(asc(memberPackage.expiresAt))
    .limit(1);

  let bookingId: string;
  if (already && already.status === "cancelled") {
    bookingId = already.id;
    await db
      .update(booking)
      .set({
        status: "booked",
        cancelledAt: null,
        memberPackageId: pack?.id ?? null,
      })
      .where(eq(booking.id, already.id));
  } else {
    bookingId = nanoid();
    await db.insert(booking).values({
      id: bookingId,
      studioId: input.studioId,
      scheduledClassId: input.scheduledClassId,
      memberId: next.memberId,
      memberPackageId: pack?.id ?? null,
      status: "booked",
    });
  }

  if (pack && pack.creditsRemaining !== null) {
    await db
      .update(memberPackage)
      .set({ creditsRemaining: pack.creditsRemaining - 1 })
      .where(eq(memberPackage.id, pack.id));
  }

  await db
    .update(waitlistEntry)
    .set({ status: "promoted", promotedAt: new Date() })
    .where(eq(waitlistEntry.id, next.id));

  // Fire-and-forget email
  await sendWaitlistPromoted({
    scheduledClassId: input.scheduledClassId,
    memberId: next.memberId,
    bookingId,
  });

  return { bookingId, memberId: next.memberId };
}
