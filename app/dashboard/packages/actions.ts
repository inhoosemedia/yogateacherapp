"use server";

import { db } from "@/db/drizzle";
import { member, memberPackage, package_ } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

type PackageInput = {
  name: string;
  kind: "drop_in" | "class_pack" | "unlimited";
  credits?: number | null;
  validityDays: number;
  priceCents: number;
  active?: boolean;
};

export async function createPackage(input: PackageInput) {
  const { studio } = await requireStudio();
  const credits = input.kind === "unlimited" ? null : input.credits ?? 1;
  await db.insert(package_).values({
    id: nanoid(),
    studioId: studio.id,
    name: input.name.trim(),
    kind: input.kind,
    credits,
    validityDays: input.validityDays,
    priceCents: input.priceCents,
    currency: studio.currency,
    active: input.active ?? true,
  });
  revalidatePath("/dashboard/packages");
}

export async function updatePackage(id: string, input: PackageInput) {
  const { studio } = await requireStudio();
  const credits = input.kind === "unlimited" ? null : input.credits ?? 1;
  await db
    .update(package_)
    .set({
      name: input.name.trim(),
      kind: input.kind,
      credits,
      validityDays: input.validityDays,
      priceCents: input.priceCents,
      active: input.active ?? true,
    })
    .where(and(eq(package_.id, id), eq(package_.studioId, studio.id)));
  revalidatePath("/dashboard/packages");
}

export async function deletePackage(id: string) {
  const { studio } = await requireStudio();
  await db
    .delete(package_)
    .where(and(eq(package_.id, id), eq(package_.studioId, studio.id)));
  revalidatePath("/dashboard/packages");
}

export async function assignPackageToMember(input: {
  memberId: string;
  packageId: string;
  pricePaidCents?: number;
}) {
  const { studio } = await requireStudio();
  const [pkg] = await db
    .select()
    .from(package_)
    .where(
      and(
        eq(package_.id, input.packageId),
        eq(package_.studioId, studio.id),
      ),
    )
    .limit(1);
  if (!pkg) throw new Error("Package not found");

  const [m] = await db
    .select({ id: member.id })
    .from(member)
    .where(and(eq(member.id, input.memberId), eq(member.studioId, studio.id)))
    .limit(1);
  if (!m) throw new Error("Member not found");

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + pkg.validityDays * 24 * 60 * 60 * 1000,
  );

  await db.insert(memberPackage).values({
    id: nanoid(),
    studioId: studio.id,
    memberId: input.memberId,
    packageId: input.packageId,
    creditsRemaining: pkg.credits,
    startsAt: now,
    expiresAt,
    pricePaidCents: input.pricePaidCents ?? pkg.priceCents,
    status: "active",
  });
  revalidatePath(`/dashboard/members/${input.memberId}`);
  revalidatePath("/dashboard");
}
