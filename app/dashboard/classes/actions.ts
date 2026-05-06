"use server";

import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  memberPackage,
  recurringRule,
  scheduledClass,
} from "@/db/schema";
import { sendBookingCancelled } from "@/lib/notify";
import { requireStudio } from "@/lib/studio";
import { addDays } from "date-fns";
import { and, eq, gte, sql } from "drizzle-orm";
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
  // Recurring (weekly): when set, generates one scheduled_class per week for
  // `repeatWeeks` weeks (the first one being startsAt).
  repeatWeeks?: number;
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
  const capacity = input.capacity ?? ct.defaultCapacity;
  const location = input.location?.trim() || null;
  const notes = input.notes?.trim() || null;
  const instructorId = input.instructorId || null;

  const repeatWeeks = Math.max(1, Math.min(52, input.repeatWeeks ?? 1));

  // Optional rule for recurring series so users can later identify the source.
  let ruleId: string | null = null;
  if (repeatWeeks > 1) {
    ruleId = nanoid();
    const dayBit = 1 << startsAt.getDay();
    const hh = String(startsAt.getHours()).padStart(2, "0");
    const mm = String(startsAt.getMinutes()).padStart(2, "0");
    await db.insert(recurringRule).values({
      id: ruleId,
      studioId: studio.id,
      classTypeId: input.classTypeId,
      instructorId,
      daysOfWeek: dayBit,
      startTime: `${hh}:${mm}`,
      durationMinutes,
      capacity,
      location,
      notes,
      startsOn: startsAt,
      endsOn: addDays(startsAt, (repeatWeeks - 1) * 7),
    });
  }

  const ids: string[] = [];
  for (let i = 0; i < repeatWeeks; i++) {
    const occStart = addDays(startsAt, i * 7);
    const occEnd = new Date(occStart.getTime() + durationMinutes * 60_000);
    const id = nanoid();
    ids.push(id);
    await db.insert(scheduledClass).values({
      id,
      studioId: studio.id,
      classTypeId: input.classTypeId,
      instructorId,
      recurringRuleId: ruleId,
      startsAt: occStart,
      endsAt: occEnd,
      capacity,
      location,
      notes,
    });
  }

  revalidatePath("/dashboard/classes");
  revalidatePath("/dashboard");
  return { id: ids[0], count: ids.length };
}

export async function cancelScheduledClass(id: string) {
  const { studio } = await requireStudio();
  const [klass] = await db
    .select()
    .from(scheduledClass)
    .where(
      and(
        eq(scheduledClass.id, id),
        eq(scheduledClass.studioId, studio.id),
      ),
    )
    .limit(1);
  if (!klass) throw new Error("Class not found");

  await db
    .update(scheduledClass)
    .set({ status: "cancelled" })
    .where(eq(scheduledClass.id, id));

  // Snapshot active bookings BEFORE updating so we know who to email.
  const active = await db
    .select({
      id: booking.id,
      memberId: booking.memberId,
      memberPackageId: booking.memberPackageId,
    })
    .from(booking)
    .where(
      and(
        eq(booking.scheduledClassId, id),
        eq(booking.status, "booked"),
      ),
    );

  await db
    .update(booking)
    .set({ status: "cancelled", cancelledAt: new Date() })
    .where(
      and(
        eq(booking.scheduledClassId, id),
        eq(booking.status, "booked"),
      ),
    );

  // Refund credits + email members in parallel
  await Promise.all(
    active.map(async (b) => {
      let refunded = false;
      if (b.memberPackageId) {
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
      try {
        await sendBookingCancelled({
          scheduledClassId: id,
          memberId: b.memberId,
          bookingId: b.id,
          reason: "The class has been cancelled.",
          refunded,
        });
      } catch (e) {
        console.error("class cancellation email failed", e);
      }
    }),
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

/**
 * Cancel a recurring rule and (optionally) all its future occurrences. Past
 * scheduled classes are preserved as historical record.
 */
export async function cancelRecurringRule(input: {
  ruleId: string;
  cancelFutureClasses: boolean;
}) {
  const { studio } = await requireStudio();
  const [rule] = await db
    .select()
    .from(recurringRule)
    .where(
      and(
        eq(recurringRule.id, input.ruleId),
        eq(recurringRule.studioId, studio.id),
      ),
    )
    .limit(1);
  if (!rule) throw new Error("Recurring rule not found");

  await db
    .update(recurringRule)
    .set({ active: false })
    .where(eq(recurringRule.id, input.ruleId));

  if (input.cancelFutureClasses) {
    const future = await db
      .select({ id: scheduledClass.id })
      .from(scheduledClass)
      .where(
        and(
          eq(scheduledClass.recurringRuleId, input.ruleId),
          gte(scheduledClass.startsAt, new Date()),
          eq(scheduledClass.status, "scheduled"),
        ),
      );
    for (const f of future) {
      await cancelScheduledClass(f.id);
    }
  }

  revalidatePath("/dashboard/classes");
}
