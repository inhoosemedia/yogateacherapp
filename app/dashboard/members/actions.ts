"use server";

import { db } from "@/db/drizzle";
import { member } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type MemberInput = {
  fullName: string;
  email?: string;
  phone?: string;
  status?: string;
  notes?: string;
};

export async function createMember(input: MemberInput) {
  const { studio } = await requireStudio();
  const id = nanoid();
  await db.insert(member).values({
    id,
    studioId: studio.id,
    fullName: input.fullName.trim(),
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    status: input.status || "active",
    notes: input.notes?.trim() || null,
  });
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard");
  return { id };
}

export async function updateMember(id: string, input: MemberInput) {
  const { studio } = await requireStudio();
  await db
    .update(member)
    .set({
      fullName: input.fullName.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      status: input.status || "active",
      notes: input.notes?.trim() || null,
      updatedAt: new Date(),
    })
    .where(and(eq(member.id, id), eq(member.studioId, studio.id)));
  revalidatePath("/dashboard/members");
  revalidatePath(`/dashboard/members/${id}`);
}

export async function deleteMember(id: string) {
  const { studio } = await requireStudio();
  await db
    .delete(member)
    .where(and(eq(member.id, id), eq(member.studioId, studio.id)));
  revalidatePath("/dashboard/members");
  redirect("/dashboard/members");
}
