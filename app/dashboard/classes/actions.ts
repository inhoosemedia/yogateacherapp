"use server";

import { db } from "@/db/drizzle";
import { booking, classType, scheduledClass } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

type ScheduleInput = {
  classTypeId: string;
  instructorId?: string;
  startsAt: string; // ISO
  durationMinutes?: number; // optional override; falls back to class type
  capacity?: number; // optional override
  location?: string;
  notes?: string;
};

export async function scheduleClass(input: ScheduleInput) {
  const { studio } = await requireStudio();
  const [ct] = await db
    .select()
    .from(classType)
    .where(
      and(
        eq(classType.id, input.classTypeId),
        eq(classType.studioId, studio.id),
      ),
    )
    .limit(1);
  if (!ct) throw new Error("Unknown class type");

  const startsAt = new Date(input.startsAt);
  if (isNaN(startsAt.getTime())) throw new Error("Invalid start time");
  const durationMinutes = input.durationMinutes ?? ct.durationMinutes;
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);
  const capacity = input.capacity ?? ct.defaultCapacity;

  const id = nanoid();
  await db.insert(scheduledClass).values({
    id,
    studioId: studio.id,
    classTypeId: input.classTypeId,
    instructorId: input.instructorId || null,
    startsAt,
    endsAt,
    capacity,
    location: input.location?.trim() || null,
    notes: input.notes?.trim() || null,
  });
  revalidatePath("/dashboard/classes");
  revalidatePath("/dashboard");
  return { id };
}

export async function cancelScheduledClass(id: string) {
  const { studio } = await requireStudio();
  await db
    .update(scheduledClass)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(scheduledClass.id, id),
        eq(scheduledClass.studioId, studio.id),
      ),
    );
  // mark all bookings cancelled
  await db
    .update(booking)
    .set({ status: "cancelled", cancelledAt: new Date() })
    .where(
      and(
        eq(booking.scheduledClassId, id),
        eq(booking.status, "booked"),
      ),
    );
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/classes/${id}`);
}

export async function deleteScheduledClass(id: string) {
  const { studio } = await requireStudio();
  await db
    .delete(scheduledClass)
    .where(
      and(
        eq(scheduledClass.id, id),
        eq(scheduledClass.studioId, studio.id),
      ),
    );
  revalidatePath("/dashboard/classes");
}

export async function classBookingCount(scheduledClassId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(booking)
    .where(
      and(
        eq(booking.scheduledClassId, scheduledClassId),
        eq(booking.status, "booked"),
      ),
    );
  return row?.count ?? 0;
}
