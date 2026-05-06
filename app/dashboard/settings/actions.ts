"use server";

import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import {
  DEFAULT_NOTIFICATION_PREFS,
  isEmailConfigured,
  sendEmail,
  testEmailTemplate,
  type NotificationPrefs,
} from "@/lib/email";
import { auth } from "@/lib/auth";
import { assertMembership, requireStudio } from "@/lib/studio";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
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

export async function updateNotificationPrefs(prefs: NotificationPrefs) {
  const { studio: s } = await requireStudio();
  const merged: NotificationPrefs = {
    ...DEFAULT_NOTIFICATION_PREFS,
    ...prefs,
  };
  await db
    .update(studio)
    .set({ notificationSettings: merged })
    .where(eq(studio.id, s.id));
  revalidatePath("/dashboard/settings/notifications");
}

export async function sendTestEmail() {
  if (!isEmailConfigured()) {
    return { ok: false, error: "RESEND_API_KEY is not set in env" };
  }
  const { studio: s } = await requireStudio();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, error: "Not signed in" };
  const tpl = testEmailTemplate({ studioName: s.name });
  const r = await sendEmail({
    studioId: s.id,
    type: "test",
    to: session.user.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });
  return r;
}

export async function updateStudioRazorpay(input: {
  keyId: string;
  keySecret: string; // "__keep__" sentinel preserves existing value
  webhookSecret: string;
}) {
  const { studio: s } = await requireStudio();
  const patch: {
    studioRazorpayKeyId: string | null;
    studioRazorpayKeySecret?: string | null;
    studioRazorpayWebhookSecret?: string | null;
  } = {
    studioRazorpayKeyId: input.keyId.trim() || null,
  };
  if (input.keySecret !== "__keep__") {
    patch.studioRazorpayKeySecret = input.keySecret.trim() || null;
  }
  if (input.webhookSecret !== "__keep__") {
    patch.studioRazorpayWebhookSecret = input.webhookSecret.trim() || null;
  }
  await db.update(studio).set(patch).where(eq(studio.id, s.id));
  // If this is the first time Razorpay got fully configured and no provider
  // is active yet, auto-pick razorpay so the public packages page works.
  const finalKeyId = patch.studioRazorpayKeyId;
  const finalKeySecret =
    patch.studioRazorpayKeySecret !== undefined
      ? patch.studioRazorpayKeySecret
      : "kept";
  if (!s.studioPaymentProvider && finalKeyId && finalKeySecret) {
    await db
      .update(studio)
      .set({ studioPaymentProvider: "razorpay" })
      .where(eq(studio.id, s.id));
  }
  revalidatePath("/dashboard/settings/payments");
  revalidatePath(`/book/${s.slug}/packages`);
}

export async function updateStudioStripe(input: {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}) {
  const { studio: s } = await requireStudio();
  const patch: {
    studioStripePublishableKey: string | null;
    studioStripeSecretKey?: string | null;
    studioStripeWebhookSecret?: string | null;
  } = {
    studioStripePublishableKey: input.publishableKey.trim() || null,
  };
  if (input.secretKey !== "__keep__") {
    patch.studioStripeSecretKey = input.secretKey.trim() || null;
  }
  if (input.webhookSecret !== "__keep__") {
    patch.studioStripeWebhookSecret = input.webhookSecret.trim() || null;
  }
  await db.update(studio).set(patch).where(eq(studio.id, s.id));
  // If this is the first time Stripe got fully configured and no provider is
  // active, default to stripe.
  const finalPk = patch.studioStripePublishableKey;
  const finalSk =
    patch.studioStripeSecretKey !== undefined
      ? patch.studioStripeSecretKey
      : "kept";
  if (!s.studioPaymentProvider && finalPk && finalSk) {
    await db
      .update(studio)
      .set({ studioPaymentProvider: "stripe" })
      .where(eq(studio.id, s.id));
  }
  revalidatePath("/dashboard/settings/payments");
  revalidatePath(`/book/${s.slug}/packages`);
}

export async function setActiveProvider(provider: "razorpay" | "stripe") {
  if (provider !== "razorpay" && provider !== "stripe") {
    throw new Error("Invalid provider");
  }
  const { studio: s } = await requireStudio();
  // Validate that the chosen provider is actually configured.
  const [row] = await db
    .select({
      razorpayKeyId: studio.studioRazorpayKeyId,
      razorpayKeySecret: studio.studioRazorpayKeySecret,
      stripeSecretKey: studio.studioStripeSecretKey,
      stripePublishableKey: studio.studioStripePublishableKey,
    })
    .from(studio)
    .where(eq(studio.id, s.id))
    .limit(1);
  if (provider === "razorpay" && !(row?.razorpayKeyId && row?.razorpayKeySecret)) {
    throw new Error("Configure Razorpay credentials first");
  }
  if (
    provider === "stripe" &&
    !(row?.stripeSecretKey && row?.stripePublishableKey)
  ) {
    throw new Error("Configure Stripe credentials first");
  }
  await db
    .update(studio)
    .set({ studioPaymentProvider: provider })
    .where(eq(studio.id, s.id));
  revalidatePath("/dashboard/settings/payments");
  revalidatePath(`/book/${s.slug}/packages`);
}
