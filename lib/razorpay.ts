import Razorpay from "razorpay";

let cached: Razorpay | null = null;

export function getRazorpay(): Razorpay | null {
  if (cached) return cached;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  cached = new Razorpay({ key_id, key_secret });
  return cached;
}

export type PlanTier = "studio" | "multi_studio";

export function planIdFor(tier: PlanTier): string | null {
  if (tier === "studio") return process.env.RAZORPAY_PLAN_STUDIO ?? null;
  if (tier === "multi_studio") return process.env.RAZORPAY_PLAN_MULTI ?? null;
  return null;
}
