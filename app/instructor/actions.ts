"use server";

import { db } from "@/db/drizzle";
import { booking, scheduledClass } from "@/db/schema";
import { requireInstructor } from "@/lib/instructor";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Instructor-scoped check-in — only allows updates on bookings whose class
 * is taught by the signed-in instructor.
 */
export async function instructorSetBookingStatus(
  bookingId: string,
  status: "booked" | "cancelled" | "attended" | "no_show",
) {
  const ctx = await requireInstructor();
  const [b] = await db
    .select({
      id: booking.id,
      scheduledClassId: booking.scheduledClassId,
      memberId: booking.memberId,
      currentStatus: booking.status,
      checkedInAt: booking.checkedInAt,
      cancelledAt: booking.cancelledAt,
      classInstructorId: scheduledClass.instructorId,
      studioId: scheduledClass.studioId,
    })
    .from(booking)
    .innerJoin(scheduledClass, eq(scheduledClass.id, booking.scheduledClassId))
    .where(
      and(eq(booking.id, bookingId), eq(scheduledClass.studioId, ctx.studioId)),
    )
    .limit(1);
  if (!b) throw new Error("Booking not found");
  if (b.classInstructorId !== ctx.instructorId)
    throw new Error("You don't teach this class");

  await db
    .update(booking)
    .set({
      status,
      checkedInAt: status === "attended" ? new Date() : b.checkedInAt,
      cancelledAt: status === "cancelled" ? new Date() : b.cancelledAt,
    })
    .where(eq(booking.id, bookingId));

  revalidatePath(`/instructor/${b.scheduledClassId}`);
  revalidatePath("/instructor");
}
