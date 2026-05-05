import { config } from "dotenv";
config({ path: ".env" });
import { drizzle } from "drizzle-orm/neon-http";
import { studio, scheduledClass } from "../db/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);
const studios = await db.select().from(studio);
for (const s of studios) {
  console.log(`slug=${s.slug}  id=${s.id}  name=${s.name}`);
  const classes = await db.select().from(scheduledClass).where(eq(scheduledClass.studioId, s.id));
  console.log(`  classes: ${classes.length}`);
  for (const c of classes.slice(0, 3)) console.log(`  - ${c.id} starts ${c.startsAt.toISOString()}`);
}
