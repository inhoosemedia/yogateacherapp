"use server";

import { db } from "@/db/drizzle";
import {
  booking,
  member,
  memberPackage,
  scheduledClass,
  studio,
} from "@/db/schema";
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
  | { ok: true; usedCredit: boolean; memberId: string }
  | { ok: false; error: string };

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
    return { ok: false, error: "This class is full." };

  // Find or create member by email within this studio
  const [existing] = await db
    .select()
    .from(member)
    .where(
      and(
        eq(member.studioId, s.id),
        sql`lower(${member.email}) = ${email}`,
      ),
    )
    .limit(1);

  let memberId: string;
  if (existing) {
    memberId = existing.id;
    // light update if name/phone provided and missing
    const patch: Partial<typeof member.$inferInsert> = {};
    if (!existing.fullName && fullName) patch.fullName = fullName;
    if (phone && !existing.phone) patch.phone = phone;
    if (Object.keys(patch).length) {
      await db
        .update(member)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(member.id, existing.id));
    }
  } else {
    memberId = nanoid();
    await db.insert(member).values({
      id: memberId,
      studioId: s.id,
      fullName,
      email,
      phone,
      status: "active",
    });
  }

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

  await db.insert(booking).values({
    id: nanoid(),
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

  revalidatePath(`/dashboard/classes/${klass.id}`);
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/members/${memberId}`);
  revalidatePath(`/book/${input.studioSlug}`);
  revalidatePath(`/book/${input.studioSlug}/${klass.id}`);

  return { ok: true, usedCredit: !!pack, memberId };
}
