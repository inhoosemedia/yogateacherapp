import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  member,
  scheduledClass,
  studio,
} from "@/db/schema";
import {
  classReminderTemplate,
  parseNotificationPrefs,
  sendEmail,
} from "@/lib/email";
import { addHours } from "date-fns";
import { and, between, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Fires class-reminder emails to every member booked for a class starting
 * roughly 23–25 hours from now. Idempotent via booking.reminder_sent_at.
 *
 * Called by Vercel Cron (or any scheduler) hourly. Auth via Bearer token.
 *
 * vercel.json snippet:
 * { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 * * * *" }] }
 *
 * Headers: Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(req: Request) {
  return run(req);
}
export async function POST(req: Request) {
  return run(req);
}

async function run(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }
  const got = req.headers.get("authorization") ?? "";
  if (got !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Window: classes starting between 23h and 25h from now, that haven't been
  // reminded yet. Generous window so a late cron run still catches everything.
  const now = new Date();
  const windowStart = addHours(now, 23);
  const windowEnd = addHours(now, 25);

  const rows = await db
    .select({
      bookingId: booking.id,
      memberId: booking.memberId,
      memberName: member.fullName,
      memberEmail: member.email,
      scheduledClassId: scheduledClass.id,
      classStartsAt: scheduledClass.startsAt,
      classLocation: scheduledClass.location,
      classStatus: scheduledClass.status,
      className: classType.name,
      instructorName: instructor.fullName,
      studioId: studio.id,
      studioName: studio.name,
      notificationSettings: studio.notificationSettings,
    })
    .from(booking)
    .innerJoin(member, eq(member.id, booking.memberId))
    .innerJoin(scheduledClass, eq(scheduledClass.id, booking.scheduledClassId))
    .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
    .leftJoin(instructor, eq(instructor.id, scheduledClass.instructorId))
    .innerJoin(studio, eq(studio.id, booking.studioId))
    .where(
      and(
        eq(booking.status, "booked"),
        between(scheduledClass.startsAt, windowStart, windowEnd),
        isNull(booking.reminderSentAt),
      ),
    );

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const r of rows) {
    if (r.classStatus !== "scheduled") {
      skipped++;
      continue;
    }
    if (!r.memberEmail) {
      skipped++;
      continue;
    }
    const prefs = parseNotificationPrefs(r.notificationSettings);
    if (!prefs.classReminder) {
      skipped++;
      continue;
    }
    const tpl = classReminderTemplate({
      studioName: r.studioName,
      memberName: r.memberName,
      className: r.className,
      startsAt: r.classStartsAt,
      location: r.classLocation,
      instructorName: r.instructorName,
    });
    const result = await sendEmail({
      studioId: r.studioId,
      type: "class_reminder",
      to: r.memberEmail,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      bookingId: r.bookingId,
      scheduledClassId: r.scheduledClassId,
      memberId: r.memberId,
    });
    if (result.ok) {
      await db
        .update(booking)
        .set({ reminderSentAt: new Date() })
        .where(eq(booking.id, r.bookingId));
      sent++;
    } else {
      failed++;
    }
  }

  return NextResponse.json({
    ok: true,
    candidates: rows.length,
    sent,
    skipped,
    failed,
  });
}
