import "server-only";

import { db } from "@/db/drizzle";
import { platformSetting } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * Catalogue of platform-level credentials manageable from /admin/settings.
 *
 * Each entry maps a stable DB key → { env var name, secret? , label, group, hint }.
 * - `secret: true` keys are masked as •••••••• in the UI; the form uses a
 *   `__keep__` sentinel to preserve the existing value when the user submits
 *   without retyping.
 * - `getSecret(key)` resolves with DB-first, env-fallback semantics so
 *   existing env-driven deploys keep working without any UI change.
 */
export const PLATFORM_KEYS = {
  resend_api_key: {
    env: "RESEND_API_KEY",
    secret: true,
    label: "Resend API key",
    group: "email",
    hint: "Sign up free at resend.com — 3,000 emails/month, no card.",
  },
  resend_from_email: {
    env: "RESEND_FROM_EMAIL",
    secret: false,
    label: "Resend From address",
    group: "email",
    hint: 'e.g. "YogaTeacher <hello@yourdomain.com>" — must be on a domain you verified in Resend.',
  },
  razorpay_key_id: {
    env: "RAZORPAY_KEY_ID",
    secret: false,
    label: "Razorpay Key ID (platform)",
    group: "razorpay",
    hint: "Used to charge studios for the platform subscription.",
  },
  razorpay_key_secret: {
    env: "RAZORPAY_KEY_SECRET",
    secret: true,
    label: "Razorpay Key Secret (platform)",
    group: "razorpay",
    hint: "Pairs with the platform Key ID above.",
  },
  razorpay_plan_studio: {
    env: "RAZORPAY_PLAN_STUDIO",
    secret: false,
    label: "Razorpay plan ID — Studio tier",
    group: "razorpay",
    hint: "From Razorpay → Subscriptions → Plans.",
  },
  razorpay_plan_multi: {
    env: "RAZORPAY_PLAN_MULTI",
    secret: false,
    label: "Razorpay plan ID — Multi-studio tier",
    group: "razorpay",
    hint: "From Razorpay → Subscriptions → Plans.",
  },
  razorpay_webhook_secret: {
    env: "RAZORPAY_WEBHOOK_SECRET",
    secret: true,
    label: "Razorpay webhook secret (platform)",
    group: "razorpay",
    hint: "Verifies subscription lifecycle webhooks.",
  },
  stripe_secret_key: {
    env: "STRIPE_SECRET_KEY",
    secret: true,
    label: "Stripe Secret Key (platform)",
    group: "stripe",
    hint: 'sk_live_… or sk_test_… — used to charge studios for the SaaS.',
  },
  stripe_publishable_key: {
    env: "STRIPE_PUBLISHABLE_KEY",
    secret: false,
    label: "Stripe Publishable Key (platform)",
    group: "stripe",
    hint: "pk_live_… or pk_test_… — sent to the browser for Checkout.",
  },
  stripe_price_studio: {
    env: "STRIPE_PRICE_STUDIO",
    secret: false,
    label: "Stripe Price ID — Studio tier",
    group: "stripe",
    hint: "From Stripe → Products. The recurring price the Studio plan uses.",
  },
  stripe_price_multi: {
    env: "STRIPE_PRICE_MULTI",
    secret: false,
    label: "Stripe Price ID — Multi-studio tier",
    group: "stripe",
    hint: "From Stripe → Products.",
  },
  stripe_webhook_secret: {
    env: "STRIPE_WEBHOOK_SECRET",
    secret: true,
    label: "Stripe webhook secret (platform)",
    group: "stripe",
    hint: "whsec_… — verifies subscription webhooks from Stripe.",
  },
  platform_billing_provider: {
    env: "PLATFORM_BILLING_PROVIDER",
    secret: false,
    label: "Platform billing provider",
    group: "platform",
    hint: 'Either "razorpay" or "stripe". Picks which provider charges studios for the SaaS subscription.',
  },
  cron_secret: {
    env: "CRON_SECRET",
    secret: true,
    label: "Cron bearer token",
    group: "ops",
    hint: "Vercel Cron / external schedulers send this as Authorization: Bearer <token>.",
  },
} as const;

export type PlatformKey = keyof typeof PLATFORM_KEYS;

export const PLATFORM_KEY_LIST = Object.keys(PLATFORM_KEYS) as PlatformKey[];

const KEEP_SENTINEL = "__keep__";

/**
 * Resolve a platform key with DB-first / env-fallback semantics. Returns null
 * if neither is set. Treats empty strings the same as unset.
 */
export async function getSecret(key: PlatformKey): Promise<string | null> {
  const [row] = await db
    .select({ value: platformSetting.value })
    .from(platformSetting)
    .where(eq(platformSetting.key, key))
    .limit(1);
  if (row?.value && row.value.length > 0) return row.value;
  const envName = PLATFORM_KEYS[key].env;
  const envVal = process.env[envName];
  return envVal && envVal.length > 0 ? envVal : null;
}

export type KeyStatus = {
  key: PlatformKey;
  source: "db" | "env" | "unset";
  hasValue: boolean;
  // For non-secret keys we expose the actual value so the form can render
  // it. For secrets we never expose the raw value — UI gets `null` and shows
  // dots instead.
  value: string | null;
};

/**
 * Resolve every catalogued key in one DB roundtrip. For secret keys, value is
 * always null (don't leak to client); the boolean tells the UI whether to show
 * "saved" dots.
 */
export async function getKeyStatuses(): Promise<Record<PlatformKey, KeyStatus>> {
  const rows = await db
    .select()
    .from(platformSetting)
    .where(inArray(platformSetting.key, PLATFORM_KEY_LIST as string[]));
  const dbMap = new Map(rows.map((r) => [r.key, r.value]));

  const out = {} as Record<PlatformKey, KeyStatus>;
  for (const k of PLATFORM_KEY_LIST) {
    const meta = PLATFORM_KEYS[k];
    const db = dbMap.get(k);
    const env = process.env[meta.env];
    let source: "db" | "env" | "unset" = "unset";
    let value: string | null = null;
    let hasValue = false;
    if (db && db.length > 0) {
      source = "db";
      hasValue = true;
      value = meta.secret ? null : db;
    } else if (env && env.length > 0) {
      source = "env";
      hasValue = true;
      value = meta.secret ? null : env;
    }
    out[k] = { key: k, source, hasValue, value };
  }
  return out;
}

/**
 * Bulk upsert of platform keys. Empty string clears the DB row (falls back to
 * env). The `__keep__` sentinel is a no-op for that key — used by forms so a
 * blank password input doesn't accidentally wipe an existing secret.
 */
export async function setSecrets(
  patch: Partial<Record<PlatformKey, string>>,
): Promise<void> {
  const now = new Date();
  for (const [k, v] of Object.entries(patch) as [PlatformKey, string][]) {
    if (!(k in PLATFORM_KEYS)) continue;
    if (v === KEEP_SENTINEL) continue;
    if (v === "" || v === null || v === undefined) {
      await db.delete(platformSetting).where(eq(platformSetting.key, k));
      continue;
    }
    // Upsert
    await db
      .insert(platformSetting)
      .values({ key: k, value: v, updatedAt: now })
      .onConflictDoUpdate({
        target: platformSetting.key,
        set: { value: v, updatedAt: now },
      });
  }
}

export const KEEP = KEEP_SENTINEL;
