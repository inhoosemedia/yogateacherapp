import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Razorpay sends subscription lifecycle events here. We map a handful of
 * statuses to our internal subscription_status and update period_end.
 *
 * Configure the webhook in Razorpay dashboard:
 *  URL:    https://<domain>/api/webhooks/razorpay
 *  Secret: env RAZORPAY_WEBHOOK_SECRET
 *  Events: subscription.activated, subscription.charged,
 *          subscription.completed, subscription.cancelled,
 *          subscription.paused, subscription.resumed,
 *          subscription.halted, subscription.updated
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Webhook hit but RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");
  if (signature !== expected) {
    console.warn("Invalid webhook signature");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: {
    event: string;
    payload: { subscription?: { entity: SubEntity } };
  };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = payload.event;
  const sub = payload.payload?.subscription?.entity;
  if (!sub?.id) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const status = mapStatus(event, sub.status);
  const periodEnd = sub.current_end
    ? new Date(sub.current_end * 1000)
    : null;

  await db
    .update(studio)
    .set({
      subscriptionStatus: status,
      ...(periodEnd
        ? { subscriptionCurrentPeriodEnd: periodEnd }
        : {}),
    })
    .where(eq(studio.razorpaySubscriptionId, sub.id));

  return NextResponse.json({ ok: true });
}

type SubEntity = {
  id: string;
  status: string;
  current_end?: number;
  current_start?: number;
};

function mapStatus(event: string, raw: string): string {
  if (event === "subscription.activated" || event === "subscription.charged")
    return "active";
  if (event === "subscription.completed") return "cancelled";
  if (event === "subscription.cancelled") return "cancelled";
  if (event === "subscription.halted") return "past_due";
  if (event === "subscription.paused") return "suspended";
  if (event === "subscription.resumed") return "active";
  // Fallback to raw mapping
  if (raw === "active" || raw === "authenticated") return "active";
  if (raw === "halted") return "past_due";
  if (raw === "cancelled" || raw === "completed") return "cancelled";
  return "trialing";
}
