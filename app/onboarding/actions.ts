"use server";

import { db } from "@/db/drizzle";
import { studio, studioMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { seedStudioDemo } from "@/lib/seed-demo";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function createStudio(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  const name = String(formData.get("name") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "Asia/Kolkata");
  const currency = String(formData.get("currency") ?? "INR");

  if (!name) throw new Error("Studio name is required");

  // ensure unique slug
  const base = slugify(name) || "studio";
  let slug = base;
  for (let i = 1; i < 50; i++) {
    const [existing] = await db
      .select({ id: studio.id })
      .from(studio)
      .where(eq(studio.slug, slug))
      .limit(1);
    if (!existing) break;
    slug = `${base}-${i}`;
  }

  const studioId = nanoid();
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 30);
  await db.insert(studio).values({
    id: studioId,
    name,
    slug,
    timezone,
    currency,
    ownerUserId: session.user.id,
    trialEndsAt,
    subscriptionStatus: "trialing",
  });
  await db.insert(studioMember).values({
    id: nanoid(),
    studioId,
    userId: session.user.id,
    role: "owner",
  });

  // Pre-load demo data so the dashboard isn't empty on first visit.
  // Best-effort — never fails the studio creation.
  try {
    await seedStudioDemo({ studioId, currency });
  } catch (e) {
    console.error("Demo seed failed for studio", studioId, e);
  }

  (await cookies()).set("active_studio_id", studioId, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/dashboard");
}
