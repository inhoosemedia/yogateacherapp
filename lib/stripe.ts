import "server-only";

import { getSecret } from "@/lib/secrets";
import Stripe from "stripe";

/**
 * Platform-level Stripe client (used to charge studios for the SaaS subscription
 * if PLATFORM_BILLING_PROVIDER is "stripe"). Reads creds from platform_setting
 * with env fallback. Re-instantiated per call so admin UI rotations take effect
 * immediately.
 */
export async function getPlatformStripe(): Promise<Stripe | null> {
  const key = await getSecret("stripe_secret_key");
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export async function getPlatformBillingProvider(): Promise<
  "razorpay" | "stripe"
> {
  const v = (await getSecret("platform_billing_provider"))?.toLowerCase();
  if (v === "stripe") return "stripe";
  return "razorpay";
}

export async function isPlatformStripeConfigured(): Promise<boolean> {
  const key = await getSecret("stripe_secret_key");
  const pub = await getSecret("stripe_publishable_key");
  return Boolean(key && pub);
}

/**
 * Studio-direct Stripe client — uses the studio's own Stripe Secret Key so the
 * payment lands directly in their account.
 */
export function studioStripe(secretKey: string): Stripe {
  return new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
}
