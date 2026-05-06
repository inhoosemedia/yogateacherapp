import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  instructor,
  member,
  memberPackage,
  package_,
  scheduledClass,
} from "@/db/schema";
import { csvResponse, toCsv } from "@/lib/csv";
import { requireStudio } from "@/lib/studio";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  const { entity } = await params;
  const { studio } = await requireStudio();

  if (entity === "members") {
    const rows = await db
      .select({
        id: member.id,
        full_name: member.fullName,
        email: member.email,
        phone: member.phone,
        status: member.status,
        joined_at: member.joinedAt,
        notes: member.notes,
      })
      .from(member)
      .where(eq(member.studioId, studio.id))
      .orderBy(desc(member.joinedAt));
    return csvResponse(
      `${studio.slug}-members-${dateStamp()}.csv`,
      toCsv(rows),
    );
  }

  if (entity === "bookings") {
    const rows = await db
      .select({
        booking_id: booking.id,
        member_name: member.fullName,
        member_email: member.email,
        class_name: classType.name,
        instructor_name: instructor.fullName,
        starts_at: scheduledClass.startsAt,
        location: scheduledClass.location,
        status: booking.status,
        checked_in_at: booking.checkedInAt,
        cancelled_at: booking.cancelledAt,
        booked_at: booking.createdAt,
      })
      .from(booking)
      .innerJoin(member, eq(member.id, booking.memberId))
      .innerJoin(scheduledClass, eq(scheduledClass.id, booking.scheduledClassId))
      .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
      .leftJoin(instructor, eq(instructor.id, scheduledClass.instructorId))
      .where(eq(booking.studioId, studio.id))
      .orderBy(desc(scheduledClass.startsAt));
    return csvResponse(
      `${studio.slug}-bookings-${dateStamp()}.csv`,
      toCsv(rows),
    );
  }

  if (entity === "revenue") {
    const rows = await db
      .select({
        member_package_id: memberPackage.id,
        member_name: member.fullName,
        member_email: member.email,
        package_name: package_.name,
        package_kind: package_.kind,
        price_paid_cents: memberPackage.pricePaidCents,
        currency: package_.currency,
        starts_at: memberPackage.startsAt,
        expires_at: memberPackage.expiresAt,
        status: memberPackage.status,
        sold_at: memberPackage.createdAt,
      })
      .from(memberPackage)
      .innerJoin(member, eq(member.id, memberPackage.memberId))
      .innerJoin(package_, eq(package_.id, memberPackage.packageId))
      .where(and(eq(memberPackage.studioId, studio.id)))
      .orderBy(desc(memberPackage.createdAt));
    return csvResponse(
      `${studio.slug}-revenue-${dateStamp()}.csv`,
      toCsv(rows),
    );
  }

  if (entity === "classes") {
    const rows = await db
      .select({
        class_id: scheduledClass.id,
        class_name: classType.name,
        instructor_name: instructor.fullName,
        starts_at: scheduledClass.startsAt,
        ends_at: scheduledClass.endsAt,
        capacity: scheduledClass.capacity,
        location: scheduledClass.location,
        status: scheduledClass.status,
      })
      .from(scheduledClass)
      .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
      .leftJoin(instructor, eq(instructor.id, scheduledClass.instructorId))
      .where(eq(scheduledClass.studioId, studio.id))
      .orderBy(desc(scheduledClass.startsAt));
    return csvResponse(
      `${studio.slug}-classes-${dateStamp()}.csv`,
      toCsv(rows),
    );
  }

  return NextResponse.json({ error: "Unknown export" }, { status: 404 });
}

function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}
