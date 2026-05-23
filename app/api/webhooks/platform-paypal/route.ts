import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import {
  getPlatformPayPalCreds,
  verifyPayPalWebhook,
} from "@/lib/paypal";
import { getSecret } from "@/lib/secrets";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Platform-level PayPal webhook (when PLATFORM_BILLING_PROVIDER=paypal —
 * which is the default). Studios pay the platform → PayPal → here. Updates
 * studio.subscriptionStatus on activation, cancellation, suspension.
 *
 * Configure in developer.paypal.com → Webhooks:
 *   URL:     https://<domain>/api/webhooks/platform-paypal
 *   Events:  BILLING.SUBSCRIPTION.ACTIVATED
 *            BILLING.SUBSCRIPTION.UPDATED
 *            BILLING.SUBSCRIPTION.CANCELLED
 *            BILLING.SUBSCRIPTION.SUSPENDED
 *            BILLING.SUBSCRIPTION.EXPIRED
 *            PAYMENT.SALE.COMPLETED (renewals)
 *   Webhook ID → saved in /admin/settings (paypal_webhook_id).
 */
export async function POST(req: Request) {
  const creds = await getPlatformPayPalCreds();
  const webhookId = await getSecret("paypal_webhook_id");
  if (!creds || !webhookId) {
    return NextResponse.json(
      { ok: false, error: "PayPal not configured" },
      { status: 503 },
    );
  }

  const raw = await req.text();
  const ok = await verifyPayPalWebhook({
    creds,
    webhookId,
    headers: req.headers,
    rawBody: raw,
  });
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = payload.event_type;
  const resource = payload.resource ?? {};
  const subscriptionId =
    resource.id ?? resource.billing_agreement_id ?? null;
  const customId = resource.custom_id ?? null;
  // Find studio either by subscription id (preferred — works for renewal
  // events that don't carry custom_id) or by custom_id (first activation).
  let studioId: string | null = null;
  if (subscriptionId) {
    const [s] = await db
      .select({ id: studio.id })
      .from(studio)
      .where(eq(studio.paypalSubscriptionId, subscriptionId))
      .limit(1);
    if (s) studioId = s.id;
  }
  if (!studioId && customId?.startsWith("v1:")) {
    const parts = customId.split(":");
    if (parts.length >= 2) studioId = parts[1];
  }
  if (!studioId) {
    return NextResponse.json({ ok: true, ignored: "no studio" });
  }

  const patch: {
    subscriptionStatus?: string;
    paypalSubscriptionId?: string;
    subscriptionCurrentPeriodEnd?: Date;
  } = {};
  switch (event) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
    case "BILLING.SUBSCRIPTION.UPDATED":
      patch.subscriptionStatus = "active";
      if (subscriptionId) patch.paypalSubscriptionId = subscriptionId;
      break;
    case "BILLING.SUBSCRIPTION.SUSPENDED":
      patch.subscriptionStatus = "suspended";
      break;
    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED":
      patch.subscriptionStatus = "cancelled";
      break;
    case "PAYMENT.SALE.COMPLETED":
    case "PAYMENT.CAPTURE.COMPLETED": {
      patch.subscriptionStatus = "active";
      // PayPal sends next_billing_time on the subscription, not on this event;
      // we leave period_end unchanged.
      break;
    }
    default:
      return NextResponse.json({ ok: true, ignored: event });
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: true, ignored: event });
  }

  await db.update(studio).set(patch).where(eq(studio.id, studioId));
  return NextResponse.json({ ok: true });
}

type WebhookPayload = {
  event_type: string;
  resource?: {
    id?: string;
    billing_agreement_id?: string;
    custom_id?: string;
    [k: string]: unknown;
  };
};
