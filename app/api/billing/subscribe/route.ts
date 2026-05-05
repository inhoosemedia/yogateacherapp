import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getRazorpay, planIdFor, type PlanTier } from "@/lib/razorpay";
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

    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        },
        { status: 503 },
      );
    }

    const planId = planIdFor(tier);
    if (!planId) {
      return NextResponse.json(
        {
          error: `No Razorpay plan ID set for tier "${tier}". Set RAZORPAY_PLAN_${tier === "studio" ? "STUDIO" : "MULTI"}.`,
        },
        { status: 503 },
      );
    }

    // Create subscription
    const sub = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // 10 years of monthly billing
      notes: {
        studio_id: active.id,
        studio_name: active.name,
        owner_user_id: session.user.id,
        owner_email: session.user.email,
      },
    });

    // Persist the in-flight subscription id so the webhook can match
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
  } catch (e) {
    console.error("subscribe error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Subscribe failed" },
      { status: 500 },
    );
  }
}
