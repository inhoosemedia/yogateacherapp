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

function priceFor(currency) {
  const ladder = { USD: 2500, INR: 50000, EUR: 2200, GBP: 2000, AUD: 3500 };
  return ladder[currency] ?? 2500;
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
      console.log(`  ${s.name}: skipped (has ${ctc} class types, ${mc} members) — use --force`);
      return;
    }
  }

  const ct = {
    id: nanoid(), studioId: s.id,
    name: "Vinyasa Flow",
    description: "Sample class type — edit or delete this and add your own.",
    durationMinutes: 60, defaultCapacity: 15,
    color: "#3f5141", active: true,
  };
  await db.insert(classType).values(ct);

  const ins = {
    id: nanoid(), studioId: s.id,
    fullName: "Sample Instructor",
    email: "instructor@example.com",
    phone: null,
    bio: "Sample instructor — edit this with your team's details.",
    active: true,
  };
  await db.insert(instructor).values(ins);

  const mem = {
    id: nanoid(), studioId: s.id,
    fullName: "Sample Student",
    email: "student@example.com",
    phone: null, status: "active",
    notes: "Sample member — feel free to delete and add real students.",
  };
  await db.insert(member).values(mem);

  const pkg = {
    id: nanoid(), studioId: s.id,
    name: "Drop-in", kind: "drop_in", credits: 1, validityDays: 7,
    priceCents: priceFor(s.currency), currency: s.currency, active: true,
  };
  await db.insert(package_).values(pkg);

  const now = new Date();
  const inDays = (n) => { const d = new Date(now); d.setDate(d.getDate() + n); return d; };
  const mp = {
    id: nanoid(), studioId: s.id, memberId: mem.id, packageId: pkg.id,
    creditsRemaining: 1, startsAt: now, expiresAt: inDays(7),
    pricePaidCents: pkg.priceCents, status: "active",
  };
  await db.insert(memberPackage).values(mp);

  const startsAt = new Date(); startsAt.setDate(startsAt.getDate() + 1); startsAt.setHours(18, 0, 0, 0);
  const endsAt = new Date(startsAt.getTime() + ct.durationMinutes * 60_000);
  const klass = {
    id: nanoid(), studioId: s.id,
    classTypeId: ct.id, instructorId: ins.id,
    startsAt, endsAt, capacity: ct.defaultCapacity,
    location: "Studio A", status: "scheduled", notes: null,
  };
  await db.insert(scheduledClass).values(klass);

  await db.insert(booking).values({
    id: nanoid(), studioId: s.id,
    scheduledClassId: klass.id, memberId: mem.id, memberPackageId: mp.id,
    status: "booked",
  });

  console.log(`  ${s.name}: seeded ✓ (1 class type, 1 instructor, 1 member, 1 package, 1 class, 1 booking)`);
}

const force = process.argv.includes("--force");
const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.slice(7);
const studios = slugArg
  ? await db.select().from(studio).where(eq(studio.slug, slugArg))
  : await db.select().from(studio);
console.log(`Found ${studios.length} studio(s)${slugArg ? ` matching slug=${slugArg}` : ""}${force ? " — FORCE ON" : ""}:`);
for (const s of studios) await seedOne(s, { force });
console.log("Done.");
