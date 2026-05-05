import "server-only";

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
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

// Currency-scaled list price (cents)
function priceFor(currency: string): number {
  const ladder: Record<string, number> = {
    USD: 2500, // $25
    INR: 50000, // ₹500
    EUR: 2200,
    GBP: 2000,
    AUD: 3500,
  };
  return ladder[currency] ?? 2500;
}

/**
 * Seed a studio with a minimal one-of-everything starter set so the
 * dashboard isn't empty on first visit. The user is meant to edit/delete
 * these as they add their real data.
 *
 * Idempotent: if the studio already has any class types or members, skip.
 */
export async function seedStudioDemo(input: {
  studioId: string;
  currency: string;
}): Promise<{ seeded: boolean; reason?: string }> {
  const { studioId, currency } = input;

  // Idempotency check
  const [{ count: classTypeCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(classType)
    .where(eq(classType.studioId, studioId));
  const [{ count: memberCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(member)
    .where(eq(member.studioId, studioId));
  if (classTypeCount > 0 || memberCount > 0) {
    return { seeded: false, reason: "Studio already has data" };
  }

  // 1 class type
  const ct = {
    id: nanoid(),
    studioId,
    name: "Vinyasa Flow",
    description:
      "Sample class type — edit or delete this and add your own.",
    durationMinutes: 60,
    defaultCapacity: 15,
    color: "#3f5141",
    active: true,
  };
  await db.insert(classType).values(ct);

  // 1 instructor
  const ins = {
    id: nanoid(),
    studioId,
    fullName: "Sample Instructor",
    email: "instructor@example.com",
    phone: null,
    bio: "Sample instructor — edit this with your team's details.",
    active: true,
  };
  await db.insert(instructor).values(ins);

  // 1 member
  const mem = {
    id: nanoid(),
    studioId,
    fullName: "Sample Student",
    email: "student@example.com",
    phone: null,
    status: "active",
    notes: "Sample member — feel free to delete and add real students.",
  };
  await db.insert(member).values(mem);

  // 1 package
  const pkg = {
    id: nanoid(),
    studioId,
    name: "Drop-in",
    kind: "drop_in",
    credits: 1,
    validityDays: 7,
    priceCents: priceFor(currency),
    currency,
    active: true,
  };
  await db.insert(package_).values(pkg);

  // 1 member-package (so the sample student can book)
  const now = new Date();
  const inDays = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  };
  const mp = {
    id: nanoid(),
    studioId,
    memberId: mem.id,
    packageId: pkg.id,
    creditsRemaining: 1,
    startsAt: now,
    expiresAt: inDays(7),
    pricePaidCents: pkg.priceCents,
    status: "active",
  };
  await db.insert(memberPackage).values(mp);

  // 1 scheduled class — tomorrow at 6:00 PM in the studio's local-ish time
  const startsAt = new Date();
  startsAt.setDate(startsAt.getDate() + 1);
  startsAt.setHours(18, 0, 0, 0);
  const endsAt = new Date(startsAt.getTime() + ct.durationMinutes * 60_000);
  const klass = {
    id: nanoid(),
    studioId,
    classTypeId: ct.id,
    instructorId: ins.id,
    startsAt,
    endsAt,
    capacity: ct.defaultCapacity,
    location: "Studio A",
    status: "scheduled",
    notes: null,
  };
  await db.insert(scheduledClass).values(klass);

  // 1 booking (sample student booked into the class, using their drop-in)
  await db.insert(booking).values({
    id: nanoid(),
    studioId,
    scheduledClassId: klass.id,
    memberId: mem.id,
    memberPackageId: mp.id,
    status: "booked",
  });

  return { seeded: true };
}
