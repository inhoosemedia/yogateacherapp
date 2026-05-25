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

/**
 * Google Ads conversion event with an `event_callback`. Resolves once gtag
 * confirms the event was sent (so the browser doesn't kill the request when
 * we navigate away). Times out at 800ms — long enough for the typical
 * gtag.js ping, short enough that ad-blocked users don't feel the hang.
 *
 * `sendTo` looks like `AW-18186812498/ARP-CJfo7LIcENL4kuBD` — the conversion
 * label Google Ads gives you on the conversion-action page.
 */
function reportConversion(sendTo: string | undefined): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !sendTo) {
      resolve();
      return;
    }
    const g = window.gtag;
    if (!g) {
      resolve();
      return;
    }
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    setTimeout(done, 800);
    g("event", "conversion", {
      send_to: sendTo,
      event_callback: done,
    });
  });
}

/**
 * New account created on /sign-up. Fires:
 *  - a generic `sign_up` event (good for GA4)
 *  - the Google Ads conversion if NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_CONVERSION is set
 *
 * Returns a promise so callers can `await trackSignUp()` before navigating —
 * keeps gtag's beacon alive long enough to actually reach Google's servers.
 */
export async function trackSignUp(extra: Record<string, unknown> = {}) {
  fire("sign_up", { method: "email", ...extra });
  await reportConversion(
    process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_CONVERSION,
  );
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
