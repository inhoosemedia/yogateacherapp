"use server";

import { db } from "@/db/drizzle";
import {
  booking,
  member,
  memberPackage,
  package_,
  scheduledClass,
  waitlistEntry,
} from "@/db/schema";
import {
  promoteFromWaitlist,
  sendBookingCancelled,
  sendBookingConfirmation,
} from "@/lib/notify";
import { requireStudio } from "@/lib/studio";
import { and, asc, eq, gt, gte, isNull, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function bookMember(input: {
  scheduledClassId: string;
  memberId: string;
}) {
  const { studio } = await requireStudio();
  const [klass] = await db
    .select()
    .from(scheduledClass)
    .where(
      and(
        eq(scheduledClass.id, input.scheduledClassId),
        eq(scheduledClass.studioId, studio.id),
      ),
    )
    .limit(1);
  if (!klass) throw new Error("Class not found");
  if (klass.status === "cancelled") throw new Error("Class is cancelled");

  // capacity check
  const [counts] = await db
    .select({ booked: sql<number>`count(*)::int` })
    .from(booking)
    .where(
      and(
        eq(booking.scheduledClassId, klass.id),
        eq(booking.status, "booked"),
      ),
    );
  if ((counts?.booked ?? 0) >= klass.capacity)
    throw new Error("Class is full");

  // pick best member package: active, not expired, has credits or unlimited
  const [pack] = await db
    .select()
    .from(memberPackage)
    .where(
      and(
        eq(memberPackage.memberId, input.memberId),
        eq(memberPackage.studioId, studio.id),
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

  const bookingId = nanoid();
  await db.insert(booking).values({
    id: bookingId,
    studioId: studio.id,
    scheduledClassId: klass.id,
    memberId: input.memberId,
    memberPackageId: pack?.id ?? null,
    status: "booked",
  });
  // decrement credits if applicable
  if (pack && pack.creditsRemaining !== null) {
    await db
      .update(memberPackage)
      .set({ creditsRemaining: pack.creditsRemaining - 1 })
      .where(eq(memberPackage.id, pack.id));
  }

  // Fire confirmation email (best-effort; never fail the booking on send error)
  try {
    await sendBookingConfirmation({
      scheduledClassId: klass.id,
      memberId: input.memberId,
      bookingId,
      usedCredit: !!pack,
    });
  } catch (e) {
    console.error("booking confirmation email failed", e);
  }

  revalidatePath(`/dashboard/classes/${klass.id}`);
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/members/${input.memberId}`);
}

export async function setBookingStatus(
  bookingId: string,
  status: "booked" | "cancelled" | "attended" | "no_show",
) {
  const { studio } = await requireStudio();
  const [b] = await db
    .select()
    .from(booking)
    .where(and(eq(booking.id, bookingId), eq(booking.studioId, studio.id)))
    .limit(1);
  if (!b) throw new Error("Booking not found");

  const wasActive = b.status === "booked" || b.status === "attended";
  const willBeActive = status === "booked" || status === "attended";

  await db
    .update(booking)
    .set({
      status,
      checkedInAt: status === "attended" ? new Date() : b.checkedInAt,
      cancelledAt: status === "cancelled" ? new Date() : b.cancelledAt,
    })
    .where(eq(booking.id, bookingId));

  // refund credit if cancelling an active booking that consumed one
  let refunded = false;
  if (wasActive && !willBeActive && b.memberPackageId) {
    const [pack] = await db
      .select()
      .from(memberPackage)
      .where(eq(memberPackage.id, b.memberPackageId))
      .limit(1);
    if (pack && pack.creditsRemaining !== null) {
      await db
        .update(memberPackage)
        .set({ creditsRemaining: pack.creditsRemaining + 1 })
        .where(eq(memberPackage.id, pack.id));
      refunded = true;
    }
  }

  // Email the member if their booking just got cancelled (don't email on
  // mark-as-attended or other transitions).
  if (wasActive && status === "cancelled") {
    try {
      await sendBookingCancelled({
        scheduledClassId: b.scheduledClassId,
        memberId: b.memberId,
        bookingId,
        refunded,
      });
    } catch (e) {
      console.error("booking cancellation email failed", e);
    }
  }

  // If a seat just opened, try to promote someone from the waitlist.
  if (wasActive && !willBeActive) {
    try {
      await promoteFromWaitlist({
        studioId: studio.id,
        scheduledClassId: b.scheduledClassId,
      });
    } catch (e) {
      console.error("waitlist promotion failed", e);
    }
  }

  revalidatePath(`/dashboard/classes/${b.scheduledClassId}`);
  revalidatePath(`/dashboard/members/${b.memberId}`);
}

export async function getEligibleMembers(scheduledClassId: string) {
  const { studio } = await requireStudio();
  // members not yet booked on this class
  const booked = await db
    .select({ memberId: booking.memberId })
    .from(booking)
    .where(eq(booking.scheduledClassId, scheduledClassId));
  const bookedSet = new Set(booked.map((b) => b.memberId));
  const all = await db
    .select({
      id: member.id,
      fullName: member.fullName,
      packageName: package_.name,
      credits: memberPackage.creditsRemaining,
      expiresAt: memberPackage.expiresAt,
    })
    .from(member)
    .leftJoin(
      memberPackage,
      and(
        eq(memberPackage.memberId, member.id),
        eq(memberPackage.status, "active"),
        gte(memberPackage.expiresAt, new Date()),
        or(
          isNull(memberPackage.creditsRemaining),
          gt(memberPackage.creditsRemaining, 0),
        ),
      ),
    )
    .leftJoin(package_, eq(package_.id, memberPackage.packageId))
    .where(
      and(eq(member.studioId, studio.id), eq(member.status, "active")),
    )
    .orderBy(asc(member.fullName));

  return all.filter((m) => !bookedSet.has(m.id));
}

/**
 * Add a member to the waitlist. The class must be full or the operation will
 * just be a regular booking — we don't take seats from real bookings.
 */
export async function joinWaitlist(input: {
  scheduledClassId: string;
  memberId: string;
}) {
  const { studio } = await requireStudio();

  const [klass] = await db
    .select()
    .from(scheduledClass)
    .where(
      and(
        eq(scheduledClass.id, input.scheduledClassId),
        eq(scheduledClass.studioId, studio.id),
      ),
    )
    .limit(1);
  if (!klass) throw new Error("Class not found");
  if (klass.status === "cancelled") throw new Error("Class is cancelled");

  // Already on waitlist or already booked?
  const [alreadyOn] = await db
    .select({ id: waitlistEntry.id, status: waitlistEntry.status })
    .from(waitlistEntry)
    .where(
      and(
        eq(waitlistEntry.scheduledClassId, klass.id),
        eq(waitlistEntry.memberId, input.memberId),
      ),
    )
    .limit(1);
  if (alreadyOn?.status === "waiting") {
    throw new Error("Member is already on the waitlist");
  }

  const [alreadyBooked] = await db
    .select({ id: booking.id, status: booking.status })
    .from(booking)
    .where(
      and(
        eq(booking.scheduledClassId, klass.id),
        eq(booking.memberId, input.memberId),
      ),
    )
    .limit(1);
  if (
    alreadyBooked &&
    (alreadyBooked.status === "booked" || alreadyBooked.status === "attended")
  ) {
    throw new Error("Member is already booked for this class");
  }

  if (alreadyOn) {
    // Re-activate a removed/promoted entry
    await db
      .update(waitlistEntry)
      .set({ status: "waiting", promotedAt: null })
      .where(eq(waitlistEntry.id, alreadyOn.id));
  } else {
    await db.insert(waitlistEntry).values({
      id: nanoid(),
      studioId: studio.id,
      scheduledClassId: klass.id,
      memberId: input.memberId,
      status: "waiting",
    });
  }

  revalidatePath(`/dashboard/classes/${klass.id}`);
}

export async function removeFromWaitlist(waitlistId: string) {
  const { studio } = await requireStudio();
  const [entry] = await db
    .select()
    .from(waitlistEntry)
    .where(
      and(
        eq(waitlistEntry.id, waitlistId),
        eq(waitlistEntry.studioId, studio.id),
      ),
    )
    .limit(1);
  if (!entry) throw new Error("Waitlist entry not found");
  await db
    .update(waitlistEntry)
    .set({ status: "removed" })
    .where(eq(waitlistEntry.id, waitlistId));
  revalidatePath(`/dashboard/classes/${entry.scheduledClassId}`);
}
