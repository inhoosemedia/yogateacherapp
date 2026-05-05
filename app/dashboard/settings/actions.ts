"use server";

import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import { assertMembership, requireStudio } from "@/lib/studio";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateStudioSettings(input: {
  id: string;
  name: string;
  timezone: string;
  currency: string;
}) {
  const { userId } = await requireStudio();
  await assertMembership(userId, input.id);
  await db
    .update(studio)
    .set({
      name: input.name.trim(),
      timezone: input.timezone,
      currency: input.currency,
    })
    .where(eq(studio.id, input.id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}
