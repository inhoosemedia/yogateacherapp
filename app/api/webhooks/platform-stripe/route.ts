import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import { getSecret } from "@/lib/secrets";
import { getPlatformStripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Platform-level Stripe webhook (when PLATFORM_BILLING_PROVIDER=stripe).
 * Studios pay the platform → Stripe → here. Updates studio.subscriptionStatus,
 * stripeCustomerId, stripeSubscriptionId, subscriptionCurrentPeriodEnd.
 *
 * Configure in Stripe → Developers → Webhooks:
 *   URL:     https://<domain>/api/webhooks/platform-stripe
 *   Events:  checkout.session.completed, customer.subscription.updated,
 *            customer.subscription.deleted, invoice.paid, invoice.payment_failed
 *   Secret:  saved via /admin/settings → API keys (stripe_webhook_secret)
 */
export async function POST(req: Request) {
  const stripe = await getPlatformStripe();
  const secret = await getSecret("stripe_webhook_secret");
  if (!stripe || !secret) {
    return NextResponse.json(
      { ok: false, error: "Stripe not configured" },
      { status: 503 },
    );
  }

  const raw = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.warn("Platform Stripe webhook signature failed", e);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // checkout.session.completed → first subscription sign-up. Persist customer
  // id + subscription id, mark active (Stripe charges immediately).
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const studioId = session.metadata?.studio_id;
    const tier = session.metadata?.tier;
    if (!studioId) return NextResponse.json({ ok: true, ignored: true });
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null);
    const subId =
      typeof session.subscription === "string"
        ? session.subscription
        : (session.subscription?.id ?? null);
    await db
      .update(studio)
      .set({
        subscriptionStatus:
          session.payment_status === "paid" ? "active" : "trialing",
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subId ?? undefined,
        planTier: tier ?? undefined,
      })
      .where(eq(studio.id, studioId));
    return NextResponse.json({ ok: true });
  }

  // Subscription lifecycle: status + current period end
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.created"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const studioId = sub.metadata?.studio_id;
    if (!studioId) return NextResponse.json({ ok: true, ignored: true });

    const status = mapStripeStatus(sub.status);
    // current_period_end is on subscription items in newer API versions; pull
    // from the first item if present, else from the legacy top-level field.
    const periodEndUnix =
      sub.items?.data?.[0]?.current_period_end ??
      (sub as unknown as { current_period_end?: number }).current_period_end ??
      null;
    const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000) : null;

    await db
      .update(studio)
      .set({
        subscriptionStatus: status,
        ...(periodEnd ? { subscriptionCurrentPeriodEnd: periodEnd } : {}),
      })
      .where(eq(studio.id, studioId));
    return NextResponse.json({ ok: true });
  }

  if (event.type === "invoice.payment_failed") {
    const inv = event.data.object as Stripe.Invoice;
    const subField = (inv as unknown as { subscription?: string | { id: string } })
      .subscription;
    const subId = typeof subField === "string" ? subField : (subField?.id ?? null);
    if (subId) {
      await db
        .update(studio)
        .set({ subscriptionStatus: "past_due" })
        .where(eq(studio.stripeSubscriptionId, subId));
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, ignored: event.type });
}

function mapStripeStatus(s: Stripe.Subscription.Status): string {
  switch (s) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "cancelled";
    case "paused":
      return "suspended";
    case "incomplete":
    default:
      return "trialing";
  }
}
