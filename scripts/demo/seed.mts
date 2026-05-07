/**
 * Demo data seeder for the Playwright tour.
 *
 * Idempotent: if a studio with the demo slug already exists, it (and its owner
 * user) are wiped and recreated. Designed to populate every screen the tour
 * visits with realistic-looking content — multiple instructors, packages,
 * members, scheduled classes with mixed booking utilisation, a fully-booked
 * class with a 3-deep waitlist, and a pending team invite.
 *
 * Owner credentials (also used by the Playwright tour to sign in):
 *   email:    demo-owner@yogateacherapp.dev
 *   password: DemoYoga2026!
 *
 * Run AFTER the dev server is up — uses Better-Auth's HTTP API to create the
 * owner so the password hash matches what the runtime expects.
 */

import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: ".env" });

import { drizzle } from "drizzle-orm/neon-http";
import {
  and,
  eq,
  inArray,
  notInArray,
  sql as drizzleSql,
} from "drizzle-orm";
import { nanoid } from "nanoid";
// Repo isn't "type": "module"; Node 22 hands the .ts schema back through CJS
// interop. Pull the named exports off the default import.
import schemaDefault from "../../db/schema.ts";
const {
  booking,
  classType,
  instructor,
  member,
  memberPackage,
  package_,
  scheduledClass,
  studio,
  studioInvite,
  studioMember,
  user,
  waitlistEntry,
} = schemaDefault as typeof import("../../db/schema.ts");

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
const db = drizzle(DB_URL);

const APP_URL =
  process.env.DEMO_APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3300";

const OWNER_EMAIL = "demo-owner@yogateacherapp.dev";
const OWNER_PASSWORD = "DemoYoga2026!";
const OWNER_NAME = "Maya Solanki";
const STUDIO_SLUG = "demo-sunrise-yoga";
const STUDIO_NAME = "Sunrise Yoga · Bandra";

// Realistic-looking class types
const CLASS_TYPES = [
  {
    name: "Vinyasa Flow",
    description: "Dynamic breath-led sequences for strength + grace.",
    durationMinutes: 60,
    defaultCapacity: 18,
    color: "#3f5141",
  },
  {
    name: "Hatha Foundations",
    description: "Slower-paced postures, ideal for beginners.",
    durationMinutes: 75,
    defaultCapacity: 14,
    color: "#b45f4a",
  },
  {
    name: "Yin & Restorative",
    description: "Long-held poses with props — deep tissue release.",
    durationMinutes: 60,
    defaultCapacity: 12,
    color: "#d97706",
  },
  {
    name: "Power Flow",
    description: "Heat-building intermediate Vinyasa.",
    durationMinutes: 60,
    defaultCapacity: 18,
    color: "#7c4a2d",
  },
];

const INSTRUCTORS = [
  {
    fullName: "Priya Iyer",
    email: "priya@example.com",
    bio: "Certified E-RYT 500. 10 years of Vinyasa + breathwork practice.",
  },
  {
    fullName: "Daniel Cho",
    email: "daniel@example.com",
    bio: "Yin specialist, somatic movement, meditation guide.",
  },
  {
    fullName: "Sarah Limaye",
    email: "sarah@example.com",
    bio: "Hatha foundations + alignment-focused teacher.",
  },
];

const PACKAGES = [
  {
    name: "Drop-in",
    kind: "drop_in",
    credits: 1,
    validityDays: 7,
    priceCents: 2500,
    publiclyPurchasable: true,
  },
  {
    name: "5-Class Pack",
    kind: "class_pack",
    credits: 5,
    validityDays: 30,
    priceCents: 9900,
    publiclyPurchasable: true,
  },
  {
    name: "10-Class Pack",
    kind: "class_pack",
    credits: 10,
    validityDays: 60,
    priceCents: 17900,
    publiclyPurchasable: true,
  },
  {
    name: "Unlimited Monthly",
    kind: "unlimited",
    credits: null,
    validityDays: 30,
    priceCents: 14900,
    publiclyPurchasable: true,
  },
];

// 22 members — must exceed max class capacity (18) so the "full" class can
// actually fill AND leave 3 people available for the demo waitlist.
const MEMBERS = [
  { fullName: "Aisha Khan", email: "aisha@example.com", phone: "+1 415 555 0144" },
  { fullName: "Marcus Reed", email: "marcus@example.com", phone: "+1 415 555 0177" },
  { fullName: "Jordan Lee", email: "jordan@example.com", phone: null },
  { fullName: "Marisol Vega", email: "marisol@example.com", phone: "+1 415 555 0198" },
  { fullName: "Ravi Kapoor", email: "ravi@example.com", phone: "+1 415 555 0123" },
  { fullName: "Naomi Park", email: "naomi@example.com", phone: null },
  { fullName: "Thomas Eliot", email: "thomas@example.com", phone: "+1 415 555 0102" },
  { fullName: "Leila Mansour", email: "leila@example.com", phone: "+1 415 555 0188" },
  { fullName: "Chen Wei", email: "chenwei@example.com", phone: "+1 415 555 0167" },
  { fullName: "Sofia Ramos", email: "sofia@example.com", phone: null },
  { fullName: "Aaliyah Carter", email: "aaliyah@example.com", phone: "+1 415 555 0145" },
  { fullName: "Olivia Dubois", email: "olivia@example.com", phone: "+1 415 555 0119" },
  { fullName: "Henry Tanaka", email: "henry@example.com", phone: "+1 415 555 0212" },
  { fullName: "Zara Ahmed", email: "zara@example.com", phone: null },
  { fullName: "Diego Martín", email: "diego@example.com", phone: "+1 415 555 0233" },
  { fullName: "Yusuf Aydın", email: "yusuf@example.com", phone: "+1 415 555 0245" },
  { fullName: "Hannah Schmidt", email: "hannah@example.com", phone: null },
  { fullName: "Felix Rousseau", email: "felix@example.com", phone: "+1 415 555 0256" },
  { fullName: "Mia Lindstrom", email: "mia@example.com", phone: "+1 415 555 0267" },
  { fullName: "Kenji Watanabe", email: "kenji@example.com", phone: null },
  { fullName: "Cleo Nakamura", email: "cleo@example.com", phone: "+1 415 555 0278" },
  { fullName: "Rohan Singh", email: "rohan@example.com", phone: "+1 415 555 0289" },
];

async function tearDownExistingDemo() {
  // Drop any prior demo studio (cascades to members, classes, bookings, etc).
  const [existing] = await db
    .select({ id: studio.id, ownerUserId: studio.ownerUserId })
    .from(studio)
    .where(eq(studio.slug, STUDIO_SLUG))
    .limit(1);
  if (existing) {
    await db.delete(studio).where(eq(studio.id, existing.id));
    // Drop the owner user too (cascade kills any sessions / accounts).
    await db.delete(user).where(eq(user.id, existing.ownerUserId));
  }
  // Also drop any orphan demo user with that email (could be lingering).
  await db.delete(user).where(eq(user.email, OWNER_EMAIL));
}

async function signUpOwnerViaApi() {
  const res = await fetch(`${APP_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Better-Auth requires an Origin matching trustedOrigins.
      Origin: APP_URL,
    },
    body: JSON.stringify({
      name: OWNER_NAME,
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Owner sign-up failed (${res.status}): ${text.slice(0, 300)}`);
  }
  // Find the inserted user.
  const [u] = await db
    .select()
    .from(user)
    .where(eq(user.email, OWNER_EMAIL))
    .limit(1);
  if (!u) throw new Error("Owner user not found after sign-up");
  return u;
}

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}
function setTime(d, hh, mm = 0) {
  const o = new Date(d);
  o.setHours(hh, mm, 0, 0);
  return o;
}
function startOfWeek(d) {
  const o = new Date(d);
  o.setHours(0, 0, 0, 0);
  const day = o.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday-first
  o.setDate(o.getDate() + diff);
  return o;
}

// Pseudo-random generator (deterministic) so re-seeding produces the same
// roster + bookings — handy for predictable Playwright timing.
function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

async function seed() {
  console.log("→ Tearing down any prior demo studio…");
  await tearDownExistingDemo();

  console.log("→ Signing up demo owner via Better-Auth…");
  const owner = await signUpOwnerViaApi();

  console.log("→ Promoting owner to super admin…");
  await db
    .update(user)
    .set({ isSuperAdmin: true, name: OWNER_NAME })
    .where(eq(user.id, owner.id));

  console.log("→ Creating studio…");
  const studioId = nanoid();
  const trialEndsAt = addDays(new Date(), 24);
  await db.insert(studio).values({
    id: studioId,
    name: STUDIO_NAME,
    slug: STUDIO_SLUG,
    timezone: "America/Los_Angeles",
    currency: "USD",
    ownerUserId: owner.id,
    trialEndsAt,
    subscriptionStatus: "trialing",
  });
  await db.insert(studioMember).values({
    id: nanoid(),
    studioId,
    userId: owner.id,
    role: "owner",
  });

  console.log("→ Creating class types, instructors, packages…");
  const classTypeIds = [];
  for (const ct of CLASS_TYPES) {
    const id = nanoid();
    classTypeIds.push(id);
    await db.insert(classType).values({
      id,
      studioId,
      name: ct.name,
      description: ct.description,
      durationMinutes: ct.durationMinutes,
      defaultCapacity: ct.defaultCapacity,
      color: ct.color,
      active: true,
    });
  }

  const instructorIds = [];
  for (const ins of INSTRUCTORS) {
    const id = nanoid();
    instructorIds.push(id);
    await db.insert(instructor).values({
      id,
      studioId,
      fullName: ins.fullName,
      email: ins.email,
      bio: ins.bio,
      active: true,
    });
  }

  const packageIds = [];
  for (const p of PACKAGES) {
    const id = nanoid();
    packageIds.push(id);
    await db.insert(package_).values({
      id,
      studioId,
      name: p.name,
      kind: p.kind,
      credits: p.credits,
      validityDays: p.validityDays,
      priceCents: p.priceCents,
      currency: "USD",
      active: true,
      publiclyPurchasable: p.publiclyPurchasable ?? false,
    });
  }

  console.log("→ Creating members + their packages…");
  const rng = mulberry32(20260507);
  const memberIds = [];
  const memberActivePack = new Map(); // memberId → memberPackageId
  for (let i = 0; i < MEMBERS.length; i++) {
    const m = MEMBERS[i];
    const id = nanoid();
    memberIds.push(id);
    await db.insert(member).values({
      id,
      studioId,
      fullName: m.fullName,
      email: m.email,
      phone: m.phone,
      status: i === 4 ? "paused" : "active",
      notes:
        i === 1
          ? "Prefers blocks for restorative; left shoulder injury 2025."
          : null,
    });

    // Most members get an active package
    if (i % 5 !== 4) {
      const pkgIdx = i % PACKAGES.length;
      const pkg = PACKAGES[pkgIdx];
      const mpId = nanoid();
      const startsAt = addDays(new Date(), -Math.floor(rng() * 14));
      const expiresAt = addDays(startsAt, pkg.validityDays);
      const credits = pkg.credits === null ? null : Math.max(
        1,
        pkg.credits - Math.floor(rng() * (pkg.credits - 1)),
      );
      await db.insert(memberPackage).values({
        id: mpId,
        studioId,
        memberId: id,
        packageId: packageIds[pkgIdx],
        creditsRemaining: credits,
        startsAt,
        expiresAt,
        pricePaidCents: pkg.priceCents,
        status: "active",
      });
      memberActivePack.set(id, mpId);
    }
  }

  console.log("→ Scheduling 14 days of classes with realistic utilisation…");
  // Generate a weekly grid of classes for last week + this week + next week
  const weekStart = startOfWeek(new Date());
  const weekStartPrev = addDays(weekStart, -7);
  const scheduledClassIds = [];

  // Schedule pattern (day-of-week 0=Mon … 6=Sun):
  //   Mon  6:30am Vinyasa, 7:00pm Power
  //   Tue  9:00am Hatha, 6:00pm Yin
  //   Wed  6:30am Vinyasa, 12:00pm Hatha, 7:00pm Power
  //   Thu  9:00am Yin, 6:00pm Vinyasa
  //   Fri  6:30am Power, 5:30pm Yin
  //   Sat  8:00am Vinyasa, 10:00am Hatha
  //   Sun  9:00am Vinyasa, 5:00pm Yin
  const PATTERN = [
    [{ h: 6, m: 30, ct: 0, ins: 0 }, { h: 19, m: 0, ct: 3, ins: 0 }],
    [{ h: 9, m: 0, ct: 1, ins: 2 }, { h: 18, m: 0, ct: 2, ins: 1 }],
    [
      { h: 6, m: 30, ct: 0, ins: 0 },
      { h: 12, m: 0, ct: 1, ins: 2 },
      { h: 19, m: 0, ct: 3, ins: 0 },
    ],
    [{ h: 9, m: 0, ct: 2, ins: 1 }, { h: 18, m: 0, ct: 0, ins: 0 }],
    [{ h: 6, m: 30, ct: 3, ins: 0 }, { h: 17, m: 30, ct: 2, ins: 1 }],
    [{ h: 8, m: 0, ct: 0, ins: 0 }, { h: 10, m: 0, ct: 1, ins: 2 }],
    [{ h: 9, m: 0, ct: 0, ins: 0 }, { h: 17, m: 0, ct: 2, ins: 1 }],
  ];

  // Generate classes for prev week + this week + next week (3 weeks).
  const allClasses = [];
  for (let week = -1; week <= 1; week++) {
    const w = addDays(weekStart, week * 7);
    for (let dow = 0; dow < 7; dow++) {
      const day = addDays(w, dow);
      for (const slot of PATTERN[dow]) {
        const startsAt = setTime(day, slot.h, slot.m);
        const ct = CLASS_TYPES[slot.ct];
        const endsAt = new Date(
          startsAt.getTime() + ct.durationMinutes * 60_000,
        );
        const id = nanoid();
        allClasses.push({
          id,
          startsAt,
          endsAt,
          ctIndex: slot.ct,
          insIndex: slot.ins,
          capacity: ct.defaultCapacity,
        });
        await db.insert(scheduledClass).values({
          id,
          studioId,
          classTypeId: classTypeIds[slot.ct],
          instructorId: instructorIds[slot.ins],
          startsAt,
          endsAt,
          capacity: ct.defaultCapacity,
          location: dow % 2 === 0 ? "Studio A" : "Studio B",
        });
      }
    }
  }

  console.log("→ Adding bookings (~70% utilisation, mixed statuses)…");
  // The Playwright tour clicks the first upcoming class — make THAT the full
  // one so the waitlist screenshot lands deterministically.
  const upcoming = allClasses
    .filter((c) => c.startsAt > new Date())
    .sort((a, b) => a.startsAt - b.startsAt);
  const fullClassIdx = allClasses.indexOf(upcoming[0]);
  const fullClass = allClasses[fullClassIdx];

  for (let ci = 0; ci < allClasses.length; ci++) {
    const c = allClasses[ci];
    const isPast = c.startsAt < new Date();
    const isFull = ci === fullClassIdx;
    const target = isFull
      ? c.capacity
      : Math.max(2, Math.floor(c.capacity * (0.5 + rng() * 0.4)));

    // Pick distinct members for this class
    const pool = [...memberIds].sort(() => rng() - 0.5).slice(0, target);
    for (let bi = 0; bi < pool.length; bi++) {
      const mId = pool[bi];
      const mpId = memberActivePack.get(mId) ?? null;
      let status = "booked";
      if (isPast) {
        const r = rng();
        status = r < 0.78 ? "attended" : r < 0.92 ? "no_show" : "cancelled";
      }
      await db.insert(booking).values({
        id: nanoid(),
        studioId,
        scheduledClassId: c.id,
        memberId: mId,
        memberPackageId: mpId,
        status,
        checkedInAt: status === "attended" ? c.startsAt : null,
        cancelledAt: status === "cancelled" ? new Date() : null,
      });
    }
  }

  console.log("→ Adding 3-deep waitlist on the fully-booked class…");
  // Pick 3 members NOT booked into the full class.
  const fullClassBookedMemberIds = new Set(
    (
      await db
        .select({ memberId: booking.memberId })
        .from(booking)
        .where(eq(booking.scheduledClassId, fullClass.id))
    ).map((r) => r.memberId),
  );
  const waitMembers = memberIds
    .filter((m) => !fullClassBookedMemberIds.has(m))
    .slice(0, 3);
  for (const m of waitMembers) {
    await db.insert(waitlistEntry).values({
      id: nanoid(),
      studioId,
      scheduledClassId: fullClass.id,
      memberId: m,
      status: "waiting",
    });
  }

  console.log("→ Adding pending team invite…");
  await db.insert(studioInvite).values({
    id: nanoid(),
    studioId,
    email: "newhire@example.com",
    role: "staff",
    invitedByUserId: owner.id,
    token: nanoid(32),
    expiresAt: addDays(new Date(), 7),
  });

  console.log("\n✓ Demo studio seeded successfully.");
  console.log(`  URL:      ${APP_URL}`);
  console.log(`  Owner:    ${OWNER_EMAIL} / ${OWNER_PASSWORD}`);
  console.log(`  Studio:   ${STUDIO_NAME}  (slug: ${STUDIO_SLUG})`);
  console.log(`  Public:   ${APP_URL}/book/${STUDIO_SLUG}`);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
