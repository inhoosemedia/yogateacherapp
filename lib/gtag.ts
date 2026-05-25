/**
 * Client-side helpers for firing Google Ads / gtag.js conversion events.
 * Safe to call from server components — the function is a no-op when window
 * (and therefore gtag) isn't available. Also a no-op when the tracking ID
 * isn't configured, so dev environments stay silent.
 *
 * Custom conversion labels are only meaningful once the customer creates
 * matching conversion actions in Google Ads — until then these fire as
 * generic events that still feed remarketing and audience-building.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function fire(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const g = window.gtag;
  if (!g) return;
  g("event", name, params);
}

/** New account created on /sign-up. Lead-generation conversion. */
export function trackSignUp(extra: Record<string, unknown> = {}) {
  fire("sign_up", { method: "email", ...extra });
}

/** Public member booked a class via /book/<slug>/<classId>. */
export function trackBooking(
  className: string,
  extra: Record<string, unknown> = {},
) {
  fire("book_class", { class_name: className, ...extra });
}

/** Member bought a package via PayPal / Stripe / Razorpay. */
export function trackPurchase(input: {
  value: number;
  currency: string;
  packageName?: string;
  provider?: "paypal" | "stripe" | "razorpay";
  transactionId?: string;
}) {
  fire("purchase", {
    value: input.value,
    currency: input.currency,
    items: input.packageName
      ? [{ item_name: input.packageName }]
      : undefined,
    payment_type: input.provider,
    transaction_id: input.transactionId,
  });
}

/** Studio owner started a subscription on /billing. */
export function trackSubscription(
  tier: "studio" | "multi_studio",
  extra: Record<string, unknown> = {},
) {
  fire("begin_subscription", { tier, ...extra });
}
