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

const CLASS_TYPES = [
  { name: "Vinyasa Flow", color: "#d97706", duration: 60, capacity: 20 },
  { name: "Hatha Slow Flow", color: "#0891b2", duration: 75, capacity: 15 },
  { name: "Yin & Restorative", color: "#7c3aed", duration: 90, capacity: 12 },
  { name: "Power Yoga", color: "#b45f4a", duration: 60, capacity: 20 },
  { name: "Sunrise Meditation", color: "#65a30d", duration: 30, capacity: 25 },
];

const INSTRUCTORS = [
  {
    name: "Priya Sharma",
    email: "priya@studio.demo",
    phone: "+1 555 0001",
    bio: "RYT-500 with 12 years teaching Vinyasa and Power Yoga. Loves slow mornings and strong cups of chai.",
  },
  {
    name: "Arjun Mehta",
    email: "arjun@studio.demo",
    phone: "+1 555 0002",
    bio: "Hatha and pranayama specialist. Trained in Mysore. Believes in stillness before strength.",
  },
  {
    name: "Maya Krishnan",
    email: "maya@studio.demo",
    phone: "+1 555 0003",
    bio: "Yin, Restorative and sound therapy. Reiki Level II. Quiet voice, deep practice.",
  },
];

const MEMBERS = [
  { name: "Anita Rao", email: "anita@example.com", phone: "+1 555 1001" },
  { name: "Vikram Singh", email: "vikram@example.com", phone: "+1 555 1002" },
  { name: "Meera Patel", email: "meera@example.com", phone: "+1 555 1003" },
  { name: "Rahul Iyer", email: "rahul@example.com", phone: "+1 555 1004" },
  { name: "Sneha Gupta", email: "sneha@example.com" },
  { name: "Sarah Chen", email: "sarah@example.com", phone: "+1 555 1006" },
  { name: "James Park", email: "james@example.com" },
  { name: "Olivia Bennett", email: "olivia@example.com", phone: "+1 555 1008" },
  { name: "Mohammed Al-Rashid", email: "mohammed@example.com" },
  { name: "Lisa Tanaka", email: "lisa@example.com", phone: "+1 555 1010" },
  { name: "Diego Silva", email: "diego@example.com" },
  { name: "Emma Williams", email: "emma@example.com", phone: "+1 555 1012" },
];

// Currency-scaled list prices (cents)
function pricesFor(currency: string) {
  const ladder: Record<string, [number, number, number]> = {
    USD: [2500, 20000, 15000], // $25 / $200 / $150
    INR: [50000, 400000, 300000], // ₹500 / ₹4,000 / ₹3,000
    EUR: [2200, 18000, 13000], // €22 / €180 / €130
    GBP: [2000, 16000, 12000], // £20 / £160 / £120
    AUD: [3500, 28000, 21000], // A$35 / A$280 / A$210
  };
  const [dropIn, pack, monthly] = ladder[currency] ?? ladder.USD;
  return { dropIn, pack, monthly };
}

/**
 * Seed a studio with realistic demo data: class types, instructors, members,
 * packages, a week of scheduled classes, and bookings.
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

  // 1. Class types
  const classTypeRows = CLASS_TYPES.map((ct) => ({
    id: nanoid(),
    studioId,
    name: ct.name,
    description: null,
    durationMinutes: ct.duration,
    defaultCapacity: ct.capacity,
    color: ct.color,
    active: true,
  }));
  await db.insert(classType).values(classTypeRows);

  // 2. Instructors
  const instructorRows = INSTRUCTORS.map((i) => ({
    id: nanoid(),
    studioId,
    fullName: i.name,
    email: i.email,
    phone: i.phone ?? null,
    bio: i.bio,
    active: true,
  }));
  await db.insert(instructor).values(instructorRows);

  // 3. Members
  const memberRows = MEMBERS.map((m, idx) => ({
    id: nanoid(),
    studioId,
    fullName: m.name,
    email: m.email,
    phone: m.phone ?? null,
    status: idx === 6 ? "paused" : "active", // James Park paused
    notes: null,
  }));
  await db.insert(member).values(memberRows);

  // 4. Packages
  const prices = pricesFor(currency);
  const packDropIn = {
    id: nanoid(),
    studioId,
    name: "Drop-in",
    kind: "drop_in",
    credits: 1,
    validityDays: 7,
    priceCents: prices.dropIn,
    currency,
    active: true,
  };
  const packTen = {
    id: nanoid(),
    studioId,
    name: "10-class pack",
    kind: "class_pack",
    credits: 10,
    validityDays: 60,
    priceCents: prices.pack,
    currency,
    active: true,
  };
  const packUnlimited = {
    id: nanoid(),
    studioId,
    name: "Monthly Unlimited",
    kind: "unlimited",
    credits: null,
    validityDays: 30,
    priceCents: prices.monthly,
    currency,
    active: true,
  };
  await db.insert(package_).values([packDropIn, packTen, packUnlimited]);

  // 5. Member packages (5 of the 12 members have an active package)
  const now = new Date();
  const inDays = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  };
  const memberPackages = [
    {
      id: nanoid(),
      studioId,
      memberId: memberRows[0].id, // Anita
      packageId: packTen.id,
      creditsRemaining: 7,
      startsAt: inDays(-30),
      expiresAt: inDays(30),
      pricePaidCents: packTen.priceCents,
      status: "active",
    },
    {
      id: nanoid(),
      studioId,
      memberId: memberRows[1].id, // Vikram
      packageId: packUnlimited.id,
      creditsRemaining: null,
      startsAt: inDays(-5),
      expiresAt: inDays(25),
      pricePaidCents: packUnlimited.priceCents,
      status: "active",
    },
    {
      id: nanoid(),
      studioId,
      memberId: memberRows[2].id, // Meera
      packageId: packDropIn.id,
      creditsRemaining: 1,
      startsAt: now,
      expiresAt: inDays(7),
      pricePaidCents: packDropIn.priceCents,
      status: "active",
    },
    {
      id: nanoid(),
      studioId,
      memberId: memberRows[3].id, // Rahul
      packageId: packTen.id,
      creditsRemaining: 3,
      startsAt: inDays(-20),
      expiresAt: inDays(40),
      pricePaidCents: packTen.priceCents,
      status: "active",
    },
    {
      id: nanoid(),
      studioId,
      memberId: memberRows[5].id, // Sarah
      packageId: packUnlimited.id,
      creditsRemaining: null,
      startsAt: inDays(-15),
      expiresAt: inDays(15),
      pricePaidCents: packUnlimited.priceCents,
      status: "active",
    },
    // Olivia — expired pack (good for "lapsed" demo)
    {
      id: nanoid(),
      studioId,
      memberId: memberRows[7].id,
      packageId: packTen.id,
      creditsRemaining: 0,
      startsAt: inDays(-90),
      expiresAt: inDays(-30),
      pricePaidCents: packTen.priceCents,
      status: "expired",
    },
  ];
  await db.insert(memberPackage).values(memberPackages);

  // 6. Scheduled classes — 7 days, several per day
  // Index into classTypeRows: 0=Vinyasa, 1=Hatha, 2=Yin, 3=Power, 4=Sunrise Meditation
  const ctVin = classTypeRows[0];
  const ctHat = classTypeRows[1];
  const ctYin = classTypeRows[2];
  const ctPow = classTypeRows[3];
  const ctSun = classTypeRows[4];
  const insPriya = instructorRows[0];
  const insArjun = instructorRows[1];
  const insMaya = instructorRows[2];

  const scheduled: (typeof scheduledClass.$inferInsert)[] = [];
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  function makeClass(
    dayOffset: number,
    hour: number,
    minute: number,
    ct: (typeof classTypeRows)[number],
    inst: (typeof instructorRows)[number] | null,
  ) {
    const startsAt = new Date(startOfToday);
    startsAt.setDate(startsAt.getDate() + dayOffset);
    startsAt.setHours(hour, minute, 0, 0);
    const endsAt = new Date(startsAt.getTime() + ct.durationMinutes * 60_000);
    return {
      id: nanoid(),
      studioId,
      classTypeId: ct.id,
      instructorId: inst?.id ?? null,
      startsAt,
      endsAt,
      capacity: ct.defaultCapacity,
      location: "Studio A",
      status: "scheduled",
      notes: null,
    } satisfies typeof scheduledClass.$inferInsert;
  }

  for (let d = 0; d < 7; d++) {
    const date = new Date(startOfToday);
    date.setDate(date.getDate() + d);
    const dow = date.getDay(); // 0 = Sunday

    // Sunrise meditation — every day at 6:00 AM
    scheduled.push(makeClass(d, 6, 0, ctSun, insMaya));

    if (dow !== 0) {
      // Mon–Sat: morning Vinyasa 7:30 AM
      scheduled.push(makeClass(d, 7, 30, ctVin, insPriya));
    }

    if (dow >= 1 && dow <= 5) {
      // Weekdays: midday Hatha 12:00 PM
      scheduled.push(makeClass(d, 12, 0, ctHat, insArjun));
      // Weekday evening Power 6:00 PM
      scheduled.push(makeClass(d, 18, 0, ctPow, insPriya));
    } else if (dow === 6) {
      // Saturday afternoon Hatha
      scheduled.push(makeClass(d, 10, 30, ctHat, insArjun));
      // Saturday evening Yin
      scheduled.push(makeClass(d, 18, 0, ctYin, insMaya));
    } else {
      // Sunday: long Yin in the afternoon
      scheduled.push(makeClass(d, 16, 0, ctYin, insMaya));
    }

    // Tue/Thu evening Yin 7:30 PM
    if (dow === 2 || dow === 4) {
      scheduled.push(makeClass(d, 19, 30, ctYin, insMaya));
    }
  }
  await db.insert(scheduledClass).values(scheduled);

  // 7. Bookings — distribute across upcoming classes deterministically.
  // Use the first 5 active member-packs to attach credit usage.
  const bookings: (typeof booking.$inferInsert)[] = [];
  const upcoming = scheduled.filter(
    (s) => new Date(s.startsAt as Date).getTime() >= Date.now(),
  );
  const memberRing = memberRows; // cycle through members

  let memberIdx = 0;
  for (let i = 0; i < upcoming.length; i++) {
    const klass = upcoming[i];
    // Fill 30–80% of capacity using deterministic counts
    const target = Math.max(2, Math.round(klass.capacity * (0.3 + ((i * 7) % 6) / 10)));
    const seen = new Set<string>();
    for (let j = 0; j < target && j < memberRing.length; j++) {
      const m = memberRing[memberIdx++ % memberRing.length];
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      // attach to a member's active package if one exists
      const pack = memberPackages.find(
        (mp) => mp.memberId === m.id && mp.status === "active",
      );
      bookings.push({
        id: nanoid(),
        studioId,
        scheduledClassId: klass.id,
        memberId: m.id,
        memberPackageId: pack?.id ?? null,
        status: "booked",
      });
    }
  }

  // Past classes: mark some as attended, a couple as no-show
  const past = scheduled.filter(
    (s) => new Date(s.startsAt as Date).getTime() < Date.now(),
  );
  for (let i = 0; i < past.length; i++) {
    const klass = past[i];
    // 4 members per past class, mostly attended
    for (let j = 0; j < 4 && j < memberRing.length; j++) {
      const m = memberRing[(i + j) % memberRing.length];
      const noShow = (i + j) % 7 === 0;
      bookings.push({
        id: nanoid(),
        studioId,
        scheduledClassId: klass.id,
        memberId: m.id,
        memberPackageId: null,
        status: noShow ? "no_show" : "attended",
        checkedInAt: noShow ? null : new Date(klass.startsAt as Date),
      });
    }
  }

  if (bookings.length) {
    // Booking has unique (scheduled_class_id, member_id) — onConflictDoNothing
    await db.insert(booking).values(bookings).onConflictDoNothing();
  }

  return { seeded: true };
}
