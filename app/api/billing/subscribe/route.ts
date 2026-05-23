import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  createPayPalSubscription,
  getPlatformPayPalCreds,
} from "@/lib/paypal";
import { getRazorpay, planIdFor, type PlanTier } from "@/lib/razorpay";
import { getSecret } from "@/lib/secrets";
import { getPlatformBillingProvider, getPlatformStripe } from "@/lib/stripe";
import { getActiveStudio } from "@/lib/studio";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const active = await getActiveStudio(session.user.id);
    if (!active) {
      return NextResponse.json({ error: "No active studio" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const tier = body.tier as PlanTier;
    if (tier !== "studio" && tier !== "multi_studio") {
      return NextResponse.json({ error: "Invalid plan tier" }, { status: 400 });
    }

    const provider = await getPlatformBillingProvider();
    if (provider === "paypal") return subscribeWithPayPal(active, session.user, tier, req);
    if (provider === "stripe") return subscribeWithStripe(active, session.user, tier, req);
    return subscribeWithRazorpay(active, session.user, tier);
  } catch (e) {
    console.error("subscribe error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Subscribe failed" },
      { status: 500 },
    );
  }
}

async function subscribeWithRazorpay(
  active: { id: string; name: string },
  user: { id: string; email: string },
  tier: PlanTier,
) {
  const razorpay = await getRazorpay();
  if (!razorpay) {
    return NextResponse.json(
      {
        error:
          "Razorpay is not configured. Set the platform Razorpay credentials in /admin/settings.",
      },
      { status: 503 },
    );
  }

  const planId = await planIdFor(tier);
  if (!planId) {
    return NextResponse.json(
      {
        error: `No Razorpay plan ID set for tier "${tier}". Set it in /admin/settings → API keys.`,
      },
      { status: 503 },
    );
  }

  const sub = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 120,
    notes: {
      studio_id: active.id,
      studio_name: active.name,
      owner_user_id: user.id,
      owner_email: user.email,
    },
  });

  await db
    .update(studio)
    .set({
      razorpaySubscriptionId: sub.id,
      planTier: tier,
    })
    .where(eq(studio.id, active.id));

  return NextResponse.json({
    id: sub.id,
    shortUrl: (sub as { short_url?: string }).short_url,
    status: sub.status,
  });
}

async function subscribeWithStripe(
  active: { id: string; name: string },
  user: { id: string; email: string },
  tier: PlanTier,
  req: Request,
) {
  const stripe = await getPlatformStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Set Stripe Secret Key + Publishable Key in /admin/settings.",
      },
      { status: 503 },
    );
  }

  const priceId = await getSecret(
    tier === "studio" ? "stripe_price_studio" : "stripe_price_multi",
  );
  if (!priceId) {
    return NextResponse.json(
      {
        error: `No Stripe price ID set for tier "${tier}". Add it in /admin/settings → API keys.`,
      },
      { status: 503 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    `https://${req.headers.get("host") ?? "localhost"}`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    success_url: `${origin}/billing?paid=1`,
    cancel_url: `${origin}/billing?cancelled=1`,
    metadata: {
      studio_id: active.id,
      tier,
      owner_user_id: user.id,
    },
    subscription_data: {
      metadata: {
        studio_id: active.id,
        tier,
      },
    },
  });

  await db
    .update(studio)
    .set({ planTier: tier })
    .where(eq(studio.id, active.id));

  return NextResponse.json({
    sessionId: session.id,
    shortUrl: session.url,
    status: "created",
  });
}

async function subscribeWithPayPal(
  active: { id: string; name: string },
  user: { id: string; email: string },
  tier: PlanTier,
  req: Request,
) {
  const creds = await getPlatformPayPalCreds();
  if (!creds) {
    return NextResponse.json(
      {
        error:
          "PayPal is not configured. Set the platform PayPal credentials in /admin/settings.",
      },
      { status: 503 },
    );
  }
  const planId = await getSecret(
    tier === "studio" ? "paypal_plan_studio" : "paypal_plan_multi",
  );
  if (!planId) {
    return NextResponse.json(
      {
        error: `No PayPal plan ID set for tier "${tier}". Add it in /admin/settings → API keys.`,
      },
      { status: 503 },
    );
  }
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    `https://${req.headers.get("host") ?? "localhost"}`;

  const sub = await createPayPalSubscription(creds, {
    planId,
    customId: `v1:${active.id}:${tier}`,
    subscriberEmail: user.email,
    returnUrl: `${origin}/billing?paid=1`,
    cancelUrl: `${origin}/billing?cancelled=1`,
  });

  await db
    .update(studio)
    .set({ planTier: tier, paypalSubscriptionId: sub.id })
    .where(eq(studio.id, active.id));

  return NextResponse.json({
    id: sub.id,
    shortUrl: sub.approveUrl,
    status: "created",
  });
}
