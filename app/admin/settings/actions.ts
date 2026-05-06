"use server";

import { db } from "@/db/drizzle";
import { platformSetting } from "@/db/schema";
import { requireSuperAdmin } from "@/lib/admin";
import { sendEmail, testEmailTemplate } from "@/lib/email";
import {
  PLATFORM_KEY_LIST,
  setSecrets,
  type PlatformKey,
} from "@/lib/secrets";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

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

/**
 * Bulk-update platform API keys (Resend, Razorpay, Stripe, cron, billing
 * provider). Empty string clears (falls back to env). The "__keep__" sentinel
 * is a no-op for that key — used by the form so an unfilled secret field
 * doesn't accidentally wipe an existing value.
 */
export async function updatePlatformApiKeys(
  patch: Partial<Record<PlatformKey, string>>,
) {
  await requireSuperAdmin();
  // Allow only catalogued keys.
  const cleaned: Partial<Record<PlatformKey, string>> = {};
  for (const k of PLATFORM_KEY_LIST) {
    if (k in patch) cleaned[k] = patch[k];
  }
  await setSecrets(cleaned);
  revalidatePath("/admin/settings");
}

/**
 * Send a test email from the configured platform-level Resend setup. Used by
 * the admin settings page to verify the keys actually work.
 */
export async function sendAdminTestEmail() {
  await requireSuperAdmin();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, error: "Not signed in" };
  const tpl = testEmailTemplate({ studioName: "Platform admin" });
  return sendEmail({
    studioId: null,
    type: "test",
    to: session.user.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });
}
