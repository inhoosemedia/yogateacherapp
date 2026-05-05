"use server";

import { db } from "@/db/drizzle";
import { instructor } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

type Input = {
  fullName: string;
  email?: string;
  phone?: string;
  bio?: string;
  active?: boolean;
};

export async function createInstructor(input: Input) {
  const { studio } = await requireStudio();
  const id = nanoid();
  await db.insert(instructor).values({
    id,
    studioId: studio.id,
    fullName: input.fullName.trim(),
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    bio: input.bio?.trim() || null,
    active: input.active ?? true,
  });
  revalidatePath("/dashboard/instructors");
  return { id };
}

export async function updateInstructor(id: string, input: Input) {
  const { studio } = await requireStudio();
  await db
    .update(instructor)
    .set({
      fullName: input.fullName.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      bio: input.bio?.trim() || null,
      active: input.active ?? true,
    })
    .where(and(eq(instructor.id, id), eq(instructor.studioId, studio.id)));
  revalidatePath("/dashboard/instructors");
}

export async function deleteInstructor(id: string) {
  const { studio } = await requireStudio();
  await db
    .delete(instructor)
    .where(and(eq(instructor.id, id), eq(instructor.studioId, studio.id)));
  revalidatePath("/dashboard/instructors");
}
