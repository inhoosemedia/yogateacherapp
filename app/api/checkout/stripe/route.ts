import { db } from "@/db/drizzle";
import { package_, studio } from "@/db/schema";
import { studioStripe } from "@/lib/stripe";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Studio-direct Stripe Checkout Session creator. Each studio brings their own
 * Stripe Secret Key; payment lands in their Stripe account, not the platform's.
 * Returns { url } — the client redirects to it.
 */
export async function POST(req: Request) {
  let body: {
    studioSlug?: string;
    packageId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const studioSlug = (body.studioSlug ?? "").trim();
  const packageId = (body.packageId ?? "").trim();
  const fullName = (body.fullName ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim();

  if (!studioSlug || !packageId) {
    return NextResponse.json({ error: "Missing studio or package" }, { status: 400 });
  }
  if (!fullName || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Name and valid email required" },
      { status: 400 },
    );
  }

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.slug, studioSlug))
    .limit(1);
  if (!s) return NextResponse.json({ error: "Studio not found" }, { status: 404 });

  if (s.studioPaymentProvider !== "stripe" || !s.studioStripeSecretKey) {
    return NextResponse.json(
      {
        error:
          "This studio doesn't accept Stripe payments. Pay at the studio when you arrive, or contact them.",
      },
      { status: 503 },
    );
  }

  const [pkg] = await db
    .select()
    .from(package_)
    .where(
      and(
        eq(package_.id, packageId),
        eq(package_.studioId, s.id),
        eq(package_.active, true),
        eq(package_.publiclyPurchasable, true),
      ),
    )
    .limit(1);
  if (!pkg) {
    return NextResponse.json(
      { error: "Package not available for purchase" },
      { status: 404 },
    );
  }
  if (pkg.priceCents <= 0) {
    return NextResponse.json(
      { error: "Free packages can't be purchased online" },
      { status: 400 },
    );
  }

  try {
    const stripe = studioStripe(s.studioStripeSecretKey);
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      `https://${req.headers.get("host") ?? "localhost"}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: s.currency.toLowerCase(),
            product_data: { name: pkg.name },
            unit_amount: pkg.priceCents,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${origin}/book/${studioSlug}/packages?paid=1`,
      cancel_url: `${origin}/book/${studioSlug}/packages?cancelled=1`,
      metadata: {
        studio_id: s.id,
        package_id: pkg.id,
        member_full_name: fullName,
        member_email: email,
        member_phone: phone,
      },
      payment_intent_data: {
        metadata: {
          studio_id: s.id,
          package_id: pkg.id,
          member_email: email,
        },
      },
    });
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (e) {
    console.error("stripe checkout create failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not start checkout" },
      { status: 500 },
    );
  }
}
