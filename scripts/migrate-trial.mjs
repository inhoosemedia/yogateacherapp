import { config } from "dotenv";
config({ path: ".env" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

console.log("Backfilling existing studios with trial_ends_at = now + 30d...");

await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_super_admin boolean NOT NULL DEFAULT false`;

await sql`ALTER TABLE studio ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz`;
await sql`ALTER TABLE studio ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'trialing'`;
await sql`ALTER TABLE studio ADD COLUMN IF NOT EXISTS plan_tier text`;
await sql`ALTER TABLE studio ADD COLUMN IF NOT EXISTS razorpay_customer_id text`;
await sql`ALTER TABLE studio ADD COLUMN IF NOT EXISTS razorpay_subscription_id text`;
await sql`ALTER TABLE studio ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamptz`;

await sql`UPDATE studio SET trial_ends_at = NOW() + interval '30 days' WHERE trial_ends_at IS NULL`;
await sql`ALTER TABLE studio ALTER COLUMN trial_ends_at SET NOT NULL`;

console.log("Done. Verifying:");
const studios = await sql`SELECT id, name, trial_ends_at, subscription_status FROM studio`;
for (const s of studios) console.log(`  ${s.name}: trial→${s.trial_ends_at}, status=${s.subscription_status}`);
const users = await sql`SELECT id, email, is_super_admin FROM "user"`;
for (const u of users) console.log(`  user ${u.email}: super=${u.is_super_admin}`);
