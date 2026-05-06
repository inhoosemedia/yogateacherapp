import { db } from "@/db/drizzle";
import { member, memberPackage, package_, studio } from "@/db/schema";
import { studioStripe } from "@/lib/stripe";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Studio-direct Stripe webhook. Each studio configures Stripe with this URL
 * and a per-studio webhook signing secret. We extract studio_id from the event
 * metadata, look up the studio's secret, then verify the signature.
 *
 * Subscribed events: checkout.session.completed, payment_intent.succeeded
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";
  if (!signature) {
    return NextResponse.json({ ok: false, error: "Missing signature" }, { status: 400 });
  }

  // Parse JSON to extract studio_id from metadata. We can't trust this until
  // we verify with the studio's webhook secret, but we need it to *find* the
  // secret. The forged-payload risk is mitigated because constructEvent will
  // throw if the signature doesn't match the secret.
  let parsed: { data?: { object?: { metadata?: Record<string, string> } } };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const studioId = parsed.data?.object?.metadata?.studio_id;
  if (!studioId) {
    // No metadata? Not one of ours — ignore silently.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.id, studioId))
    .limit(1);
  if (!s || !s.studioStripeWebhookSecret || !s.studioStripeSecretKey) {
    return NextResponse.json({ ok: true, ignored: "studio unconfigured" });
  }

  const stripe = studioStripe(s.studioStripeSecretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      signature,
      s.studioStripeWebhookSecret,
    );
  } catch (e) {
    console.warn("Stripe webhook signature verify failed", studioId, e);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // We process only the events that confirm a successful payment.
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "payment_intent.succeeded"
  ) {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const obj = event.data.object as
    | Stripe.Checkout.Session
    | Stripe.PaymentIntent;
  const metadata = obj.metadata ?? {};
  const packageId = metadata.package_id;
  const fullName = metadata.member_full_name?.trim() ?? "";
  const email = metadata.member_email?.trim().toLowerCase() ?? "";
  const phone = metadata.member_phone?.trim() || null;

  let sessionId: string | null = null;
  let paymentIntentId: string | null = null;
  if (event.type === "checkout.session.completed") {
    const session = obj as Stripe.Checkout.Session;
    sessionId = session.id;
    paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: true, ignored: "not paid" });
    }
  } else {
    const pi = obj as Stripe.PaymentIntent;
    paymentIntentId = pi.id;
  }

  if (!packageId || !email) {
    return NextResponse.json({ ok: true, ignored: "missing fields" });
  }

  // Idempotency: each Checkout Session should only create one member_package.
  if (sessionId) {
    const [existing] = await db
      .select({ id: memberPackage.id })
      .from(memberPackage)
      .where(eq(memberPackage.stripeCheckoutSessionId, sessionId))
      .limit(1);
    if (existing) {
      return NextResponse.json({ ok: true, alreadyRecorded: true });
    }
  } else if (paymentIntentId) {
    const [existing] = await db
      .select({ id: memberPackage.id })
      .from(memberPackage)
      .where(eq(memberPackage.stripePaymentIntentId, paymentIntentId))
      .limit(1);
    if (existing) {
      return NextResponse.json({ ok: true, alreadyRecorded: true });
    }
  }

  const [pkg] = await db
    .select()
    .from(package_)
    .where(
      and(eq(package_.id, packageId), eq(package_.studioId, studioId)),
    )
    .limit(1);
  if (!pkg) {
    return NextResponse.json({ ok: true, ignored: "unknown package" });
  }

  // Resolve / create member
  let memberId: string;
  const [existingMember] = await db
    .select({ id: member.id, fullName: member.fullName, phone: member.phone })
    .from(member)
    .where(
      and(
        eq(member.studioId, studioId),
        sql`lower(${member.email}) = ${email}`,
      ),
    )
    .limit(1);
  if (existingMember) {
    memberId = existingMember.id;
    const patch: Partial<typeof member.$inferInsert> = {};
    if (!existingMember.fullName && fullName) patch.fullName = fullName;
    if (phone && !existingMember.phone) patch.phone = phone;
    if (Object.keys(patch).length) {
      await db
        .update(member)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(member.id, memberId));
    }
  } else {
    memberId = nanoid();
    await db.insert(member).values({
      id: memberId,
      studioId,
      fullName: fullName || email,
      email,
      phone,
      status: "active",
    });
  }

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + pkg.validityDays * 24 * 60 * 60 * 1000,
  );
  await db.insert(memberPackage).values({
    id: nanoid(),
    studioId,
    memberId,
    packageId: pkg.id,
    creditsRemaining: pkg.credits,
    startsAt: now,
    expiresAt,
    pricePaidCents: pkg.priceCents,
    status: "active",
    stripeCheckoutSessionId: sessionId,
    stripePaymentIntentId: paymentIntentId,
  });

  return NextResponse.json({ ok: true });
}
