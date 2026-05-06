"use server";

import { db } from "@/db/drizzle";
import {
  booking,
  member,
  memberPackage,
  scheduledClass,
  studio,
  waitlistEntry,
} from "@/db/schema";
import { sendBookingConfirmation } from "@/lib/notify";
import { and, asc, eq, gt, gte, isNull, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

type BookInput = {
  studioSlug: string;
  scheduledClassId: string;
  fullName: string;
  email: string;
  phone?: string;
};

export type BookResult =
  | { ok: true; usedCredit: boolean; memberId: string; waitlisted?: boolean }
  | { ok: false; error: string; full?: boolean };

async function resolveOrCreateMember(input: {
  studioId: string;
  fullName: string;
  email: string;
  phone: string | null;
}): Promise<string> {
  const [existing] = await db
    .select()
    .from(member)
    .where(
      and(
        eq(member.studioId, input.studioId),
        sql`lower(${member.email}) = ${input.email}`,
      ),
    )
    .limit(1);
  if (existing) {
    const patch: Partial<typeof member.$inferInsert> = {};
    if (!existing.fullName && input.fullName) patch.fullName = input.fullName;
    if (input.phone && !existing.phone) patch.phone = input.phone;
    if (Object.keys(patch).length) {
      await db
        .update(member)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(member.id, existing.id));
    }
    return existing.id;
  }
  const id = nanoid();
  await db.insert(member).values({
    id,
    studioId: input.studioId,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    status: "active",
  });
  return id;
}

export async function publicBookClass(input: BookInput): Promise<BookResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone?.trim() || null;

  if (!fullName) return { ok: false, error: "Name is required" };
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, error: "Enter a valid email" };

  // Resolve studio
  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.slug, input.studioSlug))
    .limit(1);
  if (!s) return { ok: false, error: "Studio not found" };

  // Resolve class within studio
  const [klass] = await db
    .select()
    .from(scheduledClass)
    .where(
      and(
        eq(scheduledClass.id, input.scheduledClassId),
        eq(scheduledClass.studioId, s.id),
      ),
    )
    .limit(1);
  if (!klass) return { ok: false, error: "Class not found" };
  if (klass.status === "cancelled")
    return { ok: false, error: "This class has been cancelled." };
  if (new Date(klass.startsAt) < new Date())
    return { ok: false, error: "This class has already started." };

  // Capacity
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
    return { ok: false, error: "This class is full.", full: true };

  const memberId = await resolveOrCreateMember({
    studioId: s.id,
    fullName,
    email,
    phone,
  });

  // Already booked?
  const [already] = await db
    .select({ id: booking.id, status: booking.status })
    .from(booking)
    .where(
      and(
        eq(booking.scheduledClassId, klass.id),
        eq(booking.memberId, memberId),
      ),
    )
    .limit(1);
  if (already) {
    if (already.status === "booked" || already.status === "attended")
      return { ok: false, error: "You're already booked for this class." };
    if (already.status === "cancelled") {
      // Restore the previous booking
      await db
        .update(booking)
        .set({ status: "booked", cancelledAt: null })
        .where(eq(booking.id, already.id));
      try {
        await sendBookingConfirmation({
          scheduledClassId: klass.id,
          memberId,
          bookingId: already.id,
          usedCredit: false,
        });
      } catch (e) {
        console.error("public booking confirmation email failed", e);
      }
      revalidatePath(`/dashboard/classes/${klass.id}`);
      return { ok: true, usedCredit: false, memberId };
    }
  }

  // Pick best active package — same logic as admin booking
  const [pack] = await db
    .select()
    .from(memberPackage)
    .where(
      and(
        eq(memberPackage.memberId, memberId),
        eq(memberPackage.studioId, s.id),
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
    studioId: s.id,
    scheduledClassId: klass.id,
    memberId,
    memberPackageId: pack?.id ?? null,
    status: "booked",
  });
  if (pack && pack.creditsRemaining !== null) {
    await db
      .update(memberPackage)
      .set({ creditsRemaining: pack.creditsRemaining - 1 })
      .where(eq(memberPackage.id, pack.id));
  }

  try {
    await sendBookingConfirmation({
      scheduledClassId: klass.id,
      memberId,
      bookingId,
      usedCredit: !!pack,
    });
  } catch (e) {
    console.error("public booking confirmation email failed", e);
  }

  revalidatePath(`/dashboard/classes/${klass.id}`);
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/members/${memberId}`);
  revalidatePath(`/book/${input.studioSlug}`);
  revalidatePath(`/book/${input.studioSlug}/${klass.id}`);

  return { ok: true, usedCredit: !!pack, memberId };
}

/**
 * Public waitlist join — used when the public booking page detects a class
 * is full. Creates the member if needed, then adds them to the waitlist.
 */
export async function publicJoinWaitlist(input: BookInput): Promise<BookResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone?.trim() || null;

  if (!fullName) return { ok: false, error: "Name is required" };
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, error: "Enter a valid email" };

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.slug, input.studioSlug))
    .limit(1);
  if (!s) return { ok: false, error: "Studio not found" };

  const [klass] = await db
    .select()
    .from(scheduledClass)
    .where(
      and(
        eq(scheduledClass.id, input.scheduledClassId),
        eq(scheduledClass.studioId, s.id),
      ),
    )
    .limit(1);
  if (!klass) return { ok: false, error: "Class not found" };
  if (klass.status === "cancelled")
    return { ok: false, error: "This class has been cancelled." };
  if (new Date(klass.startsAt) < new Date())
    return { ok: false, error: "This class has already started." };

  const memberId = await resolveOrCreateMember({
    studioId: s.id,
    fullName,
    email,
    phone,
  });

  // Already booked?
  const [alreadyBooked] = await db
    .select({ id: booking.id, status: booking.status })
    .from(booking)
    .where(
      and(
        eq(booking.scheduledClassId, klass.id),
        eq(booking.memberId, memberId),
      ),
    )
    .limit(1);
  if (
    alreadyBooked &&
    (alreadyBooked.status === "booked" || alreadyBooked.status === "attended")
  ) {
    return { ok: false, error: "You're already booked for this class." };
  }

  const [alreadyOn] = await db
    .select({ id: waitlistEntry.id, status: waitlistEntry.status })
    .from(waitlistEntry)
    .where(
      and(
        eq(waitlistEntry.scheduledClassId, klass.id),
        eq(waitlistEntry.memberId, memberId),
      ),
    )
    .limit(1);

  if (alreadyOn?.status === "waiting") {
    return { ok: true, usedCredit: false, memberId, waitlisted: true };
  }

  if (alreadyOn) {
    await db
      .update(waitlistEntry)
      .set({ status: "waiting", promotedAt: null })
      .where(eq(waitlistEntry.id, alreadyOn.id));
  } else {
    await db.insert(waitlistEntry).values({
      id: nanoid(),
      studioId: s.id,
      scheduledClassId: klass.id,
      memberId,
      status: "waiting",
    });
  }

  revalidatePath(`/dashboard/classes/${klass.id}`);
  revalidatePath(`/book/${input.studioSlug}/${klass.id}`);
  return { ok: true, usedCredit: false, memberId, waitlisted: true };
}
