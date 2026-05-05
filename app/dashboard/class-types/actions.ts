"use server";

import { db } from "@/db/drizzle";
import { classType } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

type Input = {
  name: string;
  description?: string;
  durationMinutes: number;
  defaultCapacity: number;
  color: string;
  active?: boolean;
};

export async function createClassType(input: Input) {
  const { studio } = await requireStudio();
  await db.insert(classType).values({
    id: nanoid(),
    studioId: studio.id,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    durationMinutes: input.durationMinutes,
    defaultCapacity: input.defaultCapacity,
    color: input.color,
    active: input.active ?? true,
  });
  revalidatePath("/dashboard/class-types");
  revalidatePath("/dashboard/classes");
}

export async function updateClassType(id: string, input: Input) {
  const { studio } = await requireStudio();
  await db
    .update(classType)
    .set({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      durationMinutes: input.durationMinutes,
      defaultCapacity: input.defaultCapacity,
      color: input.color,
      active: input.active ?? true,
    })
    .where(and(eq(classType.id, id), eq(classType.studioId, studio.id)));
  revalidatePath("/dashboard/class-types");
  revalidatePath("/dashboard/classes");
}

export async function deleteClassType(id: string) {
  const { studio } = await requireStudio();
  await db
    .delete(classType)
    .where(and(eq(classType.id, id), eq(classType.studioId, studio.id)));
  revalidatePath("/dashboard/class-types");
}
