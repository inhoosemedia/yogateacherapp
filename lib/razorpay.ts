import "server-only";

import { getSecret } from "@/lib/secrets";
import Razorpay from "razorpay";

/**
 * Platform-level Razorpay client (used to bill studios for the SaaS itself).
 * Reads credentials from platform_setting first, then env. Re-instantiated
 * per call so admin UI rotations take effect immediately.
 */
export async function getRazorpay(): Promise<Razorpay | null> {
  const key_id = await getSecret("razorpay_key_id");
  const key_secret = await getSecret("razorpay_key_secret");
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

export type PlanTier = "studio" | "multi_studio";

export async function planIdFor(tier: PlanTier): Promise<string | null> {
  if (tier === "studio") return getSecret("razorpay_plan_studio");
  if (tier === "multi_studio") return getSecret("razorpay_plan_multi");
  return null;
}

/**
 * Quick "is platform Razorpay configured?" — used by billing page to render
 * disabled buttons + a config nudge.
 */
export async function isPlatformRazorpayConfigured(): Promise<boolean> {
  const id = await getSecret("razorpay_key_id");
  const secret = await getSecret("razorpay_key_secret");
  return Boolean(id && secret);
}
