"use server";

import { db } from "@/db/drizzle";
import { platformSetting } from "@/db/schema";
import { requireSuperAdmin } from "@/lib/admin";
import { revalidateTag } from "next/cache";

export async function updatePlatformConfig(input: {
  currency: string;
  priceStudioCents: number;
  priceMultiCents: number;
}) {
  await requireSuperAdmin();

  const updates = [
    { key: "currency", value: input.currency },
    { key: "price_studio_cents", value: String(input.priceStudioCents) },
    { key: "price_multi_cents", value: String(input.priceMultiCents) },
  ];

  for (const u of updates) {
    await db
      .insert(platformSetting)
      .values({ key: u.key, value: u.value })
      .onConflictDoUpdate({
        target: platformSetting.key,
        set: { value: u.value, updatedAt: new Date() },
      });
  }

  revalidateTag("platform-config");
}
