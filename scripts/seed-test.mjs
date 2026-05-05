import { config } from "dotenv";
config({ path: ".env" });

import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { user, studio, studioMember, classType, instructor, package_, member } from "../db/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const email = process.argv[2] || "owner+test1@example.com";
const [u] = await db.select().from(user).where(eq(user.email, email));
if (!u) {
  console.error(`No user found for ${email}`);
  process.exit(1);
}
console.log("User:", u.id, u.name);

// avoid duplicate studio
const existing = await db.select().from(studioMember).where(eq(studioMember.userId, u.id));
let studioId;
if (existing.length > 0) {
  studioId = existing[0].studioId;
  console.log("Studio already exists:", studioId);
} else {
  studioId = nanoid();
  await db.insert(studio).values({
    id: studioId,
    name: "Sunrise Yoga",
    slug: "sunrise-yoga-" + nanoid(6),
    timezone: "Asia/Kolkata",
    currency: "INR",
    ownerUserId: u.id,
  });
  await db.insert(studioMember).values({
    id: nanoid(),
    studioId,
    userId: u.id,
    role: "owner",
  });
  console.log("Created studio:", studioId);
}

// add some seed data if empty
const types = await db.select().from(classType).where(eq(classType.studioId, studioId));
if (types.length === 0) {
  await db.insert(classType).values([
    { id: nanoid(), studioId, name: "Vinyasa Flow", durationMinutes: 60, defaultCapacity: 20, color: "#d97706" },
    { id: nanoid(), studioId, name: "Hatha", durationMinutes: 75, defaultCapacity: 15, color: "#0891b2" },
    { id: nanoid(), studioId, name: "Yin", durationMinutes: 90, defaultCapacity: 12, color: "#7c3aed" },
  ]);
  console.log("Seeded class types");
}

const instructors = await db.select().from(instructor).where(eq(instructor.studioId, studioId));
if (instructors.length === 0) {
  await db.insert(instructor).values([
    { id: nanoid(), studioId, fullName: "Priya Sharma", email: "priya@studio.test" },
    { id: nanoid(), studioId, fullName: "Arjun Mehta", email: "arjun@studio.test" },
  ]);
  console.log("Seeded instructors");
}

const pkgs = await db.select().from(package_).where(eq(package_.studioId, studioId));
if (pkgs.length === 0) {
  await db.insert(package_).values([
    { id: nanoid(), studioId, name: "Drop-in", kind: "drop_in", credits: 1, validityDays: 7, priceCents: 50000, currency: "INR" },
    { id: nanoid(), studioId, name: "10-class pack", kind: "class_pack", credits: 10, validityDays: 60, priceCents: 400000, currency: "INR" },
    { id: nanoid(), studioId, name: "Monthly Unlimited", kind: "unlimited", credits: null, validityDays: 30, priceCents: 700000, currency: "INR" },
  ]);
  console.log("Seeded packages");
}

const members = await db.select().from(member).where(eq(member.studioId, studioId));
if (members.length === 0) {
  await db.insert(member).values([
    { id: nanoid(), studioId, fullName: "Anita Rao", email: "anita@example.com", phone: "+91 90000 11111" },
    { id: nanoid(), studioId, fullName: "Vikram Singh", email: "vikram@example.com" },
    { id: nanoid(), studioId, fullName: "Maya Krishnan", email: "maya@example.com" },
  ]);
  console.log("Seeded members");
}

console.log("Done. studioId =", studioId);
