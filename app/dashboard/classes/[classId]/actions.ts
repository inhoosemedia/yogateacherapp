"use server";

import { db } from "@/db/drizzle";
import {
  booking,
  member,
  memberPackage,
  package_,
  scheduledClass,
} from "@/db/schema";
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

  await db.insert(booking).values({
    id: nanoid(),
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
