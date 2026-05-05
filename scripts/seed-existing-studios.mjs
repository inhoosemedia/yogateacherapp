import { config } from "dotenv";
config({ path: ".env" });

import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  booking,
  classType,
  instructor,
  member,
  memberPackage,
  package_,
  scheduledClass,
  studio,
} from "../db/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const CLASS_TYPES = [
  { name: "Vinyasa Flow", color: "#d97706", duration: 60, capacity: 20 },
  { name: "Hatha Slow Flow", color: "#0891b2", duration: 75, capacity: 15 },
  { name: "Yin & Restorative", color: "#7c3aed", duration: 90, capacity: 12 },
  { name: "Power Yoga", color: "#b45f4a", duration: 60, capacity: 20 },
  { name: "Sunrise Meditation", color: "#65a30d", duration: 30, capacity: 25 },
];
const INSTRUCTORS = [
  { name: "Priya Sharma", email: "priya@studio.demo", phone: "+1 555 0001", bio: "RYT-500 with 12 years teaching Vinyasa and Power Yoga." },
  { name: "Arjun Mehta", email: "arjun@studio.demo", phone: "+1 555 0002", bio: "Hatha and pranayama specialist. Trained in Mysore." },
  { name: "Maya Krishnan", email: "maya@studio.demo", phone: "+1 555 0003", bio: "Yin, Restorative and sound therapy. Reiki Level II." },
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

function pricesFor(currency) {
  const ladder = {
    USD: [2500, 20000, 15000],
    INR: [50000, 400000, 300000],
    EUR: [2200, 18000, 13000],
    GBP: [2000, 16000, 12000],
    AUD: [3500, 28000, 21000],
  };
  const [d, p, m] = ladder[currency] ?? ladder.USD;
  return { dropIn: d, pack: p, monthly: m };
}

async function seedOne(s, { force = false } = {}) {
  if (!force) {
    const [{ count: ctc }] = await db
      .select({ count: sql`count(*)::int` })
      .from(classType)
      .where(eq(classType.studioId, s.id));
    const [{ count: mc }] = await db
      .select({ count: sql`count(*)::int` })
      .from(member)
      .where(eq(member.studioId, s.id));
    if (ctc > 0 || mc > 0) {
      console.log(`  ${s.name}: skipped (has ${ctc} class types, ${mc} members) — use --force to add anyway`);
      return;
    }
  }

  const ctRows = CLASS_TYPES.map((c) => ({
    id: nanoid(), studioId: s.id, name: c.name, description: null,
    durationMinutes: c.duration, defaultCapacity: c.capacity,
    color: c.color, active: true,
  }));
  await db.insert(classType).values(ctRows);

  const insRows = INSTRUCTORS.map((i) => ({
    id: nanoid(), studioId: s.id, fullName: i.name,
    email: i.email, phone: i.phone ?? null, bio: i.bio, active: true,
  }));
  await db.insert(instructor).values(insRows);

  const memRows = MEMBERS.map((m, idx) => ({
    id: nanoid(), studioId: s.id, fullName: m.name,
    email: m.email, phone: m.phone ?? null,
    status: idx === 6 ? "paused" : "active", notes: null,
  }));
  await db.insert(member).values(memRows);

  const prices = pricesFor(s.currency);
  const packDropIn = { id: nanoid(), studioId: s.id, name: "Drop-in", kind: "drop_in", credits: 1, validityDays: 7, priceCents: prices.dropIn, currency: s.currency, active: true };
  const packTen = { id: nanoid(), studioId: s.id, name: "10-class pack", kind: "class_pack", credits: 10, validityDays: 60, priceCents: prices.pack, currency: s.currency, active: true };
  const packUnlim = { id: nanoid(), studioId: s.id, name: "Monthly Unlimited", kind: "unlimited", credits: null, validityDays: 30, priceCents: prices.monthly, currency: s.currency, active: true };
  await db.insert(package_).values([packDropIn, packTen, packUnlim]);

  const now = new Date();
  const inDays = (n) => { const d = new Date(now); d.setDate(d.getDate() + n); return d; };
  const mps = [
    { id: nanoid(), studioId: s.id, memberId: memRows[0].id, packageId: packTen.id, creditsRemaining: 7, startsAt: inDays(-30), expiresAt: inDays(30), pricePaidCents: packTen.priceCents, status: "active" },
    { id: nanoid(), studioId: s.id, memberId: memRows[1].id, packageId: packUnlim.id, creditsRemaining: null, startsAt: inDays(-5), expiresAt: inDays(25), pricePaidCents: packUnlim.priceCents, status: "active" },
    { id: nanoid(), studioId: s.id, memberId: memRows[2].id, packageId: packDropIn.id, creditsRemaining: 1, startsAt: now, expiresAt: inDays(7), pricePaidCents: packDropIn.priceCents, status: "active" },
    { id: nanoid(), studioId: s.id, memberId: memRows[3].id, packageId: packTen.id, creditsRemaining: 3, startsAt: inDays(-20), expiresAt: inDays(40), pricePaidCents: packTen.priceCents, status: "active" },
    { id: nanoid(), studioId: s.id, memberId: memRows[5].id, packageId: packUnlim.id, creditsRemaining: null, startsAt: inDays(-15), expiresAt: inDays(15), pricePaidCents: packUnlim.priceCents, status: "active" },
    { id: nanoid(), studioId: s.id, memberId: memRows[7].id, packageId: packTen.id, creditsRemaining: 0, startsAt: inDays(-90), expiresAt: inDays(-30), pricePaidCents: packTen.priceCents, status: "expired" },
  ];
  await db.insert(memberPackage).values(mps);

  const ctVin = ctRows[0], ctHat = ctRows[1], ctYin = ctRows[2], ctPow = ctRows[3], ctSun = ctRows[4];
  const insPriya = insRows[0], insArjun = insRows[1], insMaya = insRows[2];
  const sched = [];
  const startOfToday = new Date(); startOfToday.setHours(0,0,0,0);

  function makeClass(d, h, mi, ct, ins) {
    const startsAt = new Date(startOfToday);
    startsAt.setDate(startsAt.getDate() + d);
    startsAt.setHours(h, mi, 0, 0);
    const endsAt = new Date(startsAt.getTime() + ct.durationMinutes * 60_000);
    return { id: nanoid(), studioId: s.id, classTypeId: ct.id, instructorId: ins?.id ?? null, startsAt, endsAt, capacity: ct.defaultCapacity, location: "Studio A", status: "scheduled", notes: null };
  }

  for (let d = 0; d < 7; d++) {
    const date = new Date(startOfToday); date.setDate(date.getDate() + d);
    const dow = date.getDay();
    sched.push(makeClass(d, 6, 0, ctSun, insMaya));
    if (dow !== 0) sched.push(makeClass(d, 7, 30, ctVin, insPriya));
    if (dow >= 1 && dow <= 5) {
      sched.push(makeClass(d, 12, 0, ctHat, insArjun));
      sched.push(makeClass(d, 18, 0, ctPow, insPriya));
    } else if (dow === 6) {
      sched.push(makeClass(d, 10, 30, ctHat, insArjun));
      sched.push(makeClass(d, 18, 0, ctYin, insMaya));
    } else {
      sched.push(makeClass(d, 16, 0, ctYin, insMaya));
    }
    if (dow === 2 || dow === 4) sched.push(makeClass(d, 19, 30, ctYin, insMaya));
  }
  await db.insert(scheduledClass).values(sched);

  const upcoming = sched.filter((x) => x.startsAt.getTime() >= Date.now());
  const past = sched.filter((x) => x.startsAt.getTime() < Date.now());
  const bks = [];
  let mIdx = 0;
  for (let i = 0; i < upcoming.length; i++) {
    const k = upcoming[i];
    const target = Math.max(2, Math.round(k.capacity * (0.3 + ((i*7)%6)/10)));
    const seen = new Set();
    for (let j = 0; j < target && j < memRows.length; j++) {
      const m = memRows[mIdx++ % memRows.length];
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      const pack = mps.find((mp) => mp.memberId === m.id && mp.status === "active");
      bks.push({ id: nanoid(), studioId: s.id, scheduledClassId: k.id, memberId: m.id, memberPackageId: pack?.id ?? null, status: "booked" });
    }
  }
  for (let i = 0; i < past.length; i++) {
    const k = past[i];
    for (let j = 0; j < 4 && j < memRows.length; j++) {
      const m = memRows[(i+j) % memRows.length];
      const noShow = (i + j) % 7 === 0;
      bks.push({ id: nanoid(), studioId: s.id, scheduledClassId: k.id, memberId: m.id, memberPackageId: null, status: noShow ? "no_show" : "attended", checkedInAt: noShow ? null : k.startsAt });
    }
  }
  if (bks.length) await db.insert(booking).values(bks).onConflictDoNothing();

  console.log(`  ${s.name}: seeded ✓ (${ctRows.length} class types, ${memRows.length} members, ${sched.length} classes, ${bks.length} bookings)`);
}

const force = process.argv.includes("--force");
const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.slice(7);
const studios = slugArg
  ? await db.select().from(studio).where(eq(studio.slug, slugArg))
  : await db.select().from(studio);
console.log(`Found ${studios.length} studio(s)${slugArg ? ` matching slug=${slugArg}` : ""}${force ? " — FORCE ON" : ""}:`);
for (const s of studios) await seedOne(s, { force });
console.log("Done.");
