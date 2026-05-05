import { config } from "dotenv";
config({ path: ".env" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const slug = process.argv.find((a) => a.startsWith("--slug="))?.slice(7);
if (!slug) {
  console.error("Usage: node reset-studio-data.mjs --slug=<studio-slug>");
  process.exit(1);
}

const [studioRow] = await sql`SELECT id, name FROM studio WHERE slug = ${slug}`;
if (!studioRow) {
  console.error(`No studio with slug "${slug}"`);
  process.exit(1);
}

console.log(`Resetting data for "${studioRow.name}" (${studioRow.id})…`);

// Order matters: delete dependents first
await sql`DELETE FROM booking WHERE studio_id = ${studioRow.id}`;
await sql`DELETE FROM scheduled_class WHERE studio_id = ${studioRow.id}`;
await sql`DELETE FROM member_package WHERE studio_id = ${studioRow.id}`;
await sql`DELETE FROM "package" WHERE studio_id = ${studioRow.id}`;
await sql`DELETE FROM member WHERE studio_id = ${studioRow.id}`;
await sql`DELETE FROM instructor WHERE studio_id = ${studioRow.id}`;
await sql`DELETE FROM class_type WHERE studio_id = ${studioRow.id}`;

console.log("Done. Now run: node scripts/seed-existing-studios.mjs --slug=" + slug);
