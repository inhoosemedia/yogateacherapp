import { config } from "dotenv";
config({ path: ".env" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`CREATE TABLE IF NOT EXISTS platform_setting (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
)`;

await sql`INSERT INTO platform_setting (key, value) VALUES ('currency', 'USD') ON CONFLICT DO NOTHING`;
await sql`INSERT INTO platform_setting (key, value) VALUES ('price_studio_cents', '2900') ON CONFLICT DO NOTHING`;
await sql`INSERT INTO platform_setting (key, value) VALUES ('price_multi_cents', '7900') ON CONFLICT DO NOTHING`;

const all = await sql`SELECT * FROM platform_setting ORDER BY key`;
console.log("Platform settings:");
for (const row of all) console.log(` ${row.key} = ${row.value}`);
