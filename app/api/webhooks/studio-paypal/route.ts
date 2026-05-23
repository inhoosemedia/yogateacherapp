import { db } from "@/db/drizzle";
import { member, memberPackage, package_, studio } from "@/db/schema";
import {
  studioPayPalCreds,
  verifyPayPalWebhook,
} from "@/lib/paypal";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Studio-direct PayPal webhook. Each studio registers this URL in their PayPal
 * Developer dashboard and pastes the webhook ID into Settings → Payments.
 * Subscribe to: PAYMENT.CAPTURE.COMPLETED, CHECKOUT.ORDER.APPROVED.
 *
 * Belt-and-braces — the /api/checkout/paypal/capture endpoint normally creates
 * the member_package, but if the buyer closes the tab before the redirect
 * lands, this webhook still finalises the purchase. Idempotent via paypal_order_id.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Get custom_id from resource — points at our studio.
  const customId = extractCustomId(payload);
  if (!customId) return NextResponse.json({ ok: true, ignored: "no custom_id" });

  const parts = customId.split(":");
  if (parts.length < 4 || parts[0] !== "v1") {
    return NextResponse.json({ ok: true, ignored: "bad custom_id" });
  }
  const studioId = parts[1];

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.id, studioId))
    .limit(1);
  const creds = s ? studioPayPalCreds(s) : null;
  if (!s || !creds || !s.studioPaypalWebhookId) {
    return NextResponse.json({ ok: true, ignored: "studio unconfigured" });
  }

  // Verify against PayPal's verify-webhook-signature API
  const ok = await verifyPayPalWebhook({
    creds,
    webhookId: s.studioPaypalWebhookId,
    headers: req.headers,
    rawBody: raw,
  });
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (payload.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ ok: true, ignored: payload.event_type });
  }

  const capture = payload.resource as PayPalCaptureResource;
  const orderId =
    capture.supplementary_data?.related_ids?.order_id ?? capture.id ?? null;
  const captureId = capture.id ?? null;
  if (!orderId) {
    return NextResponse.json({ ok: true, ignored: "no order id" });
  }

  // Idempotency
  const [existing] = await db
    .select({ id: memberPackage.id })
    .from(memberPackage)
    .where(eq(memberPackage.paypalOrderId, orderId))
    .limit(1);
  if (existing) {
    return NextResponse.json({ ok: true, alreadyRecorded: true });
  }

  const [, , packageId, blob] = parts;
  let fullName = "";
  let email = "";
  let phone: string | null = null;
  try {
    const [n, e, p] = Buffer.from(blob, "base64").toString().split("|");
    fullName = n;
    email = (e ?? "").toLowerCase();
    phone = p || null;
  } catch {
    return NextResponse.json({ ok: true, ignored: "bad blob" });
  }
  if (!email) return NextResponse.json({ ok: true, ignored: "no email" });

  const [pkg] = await db
    .select()
    .from(package_)
    .where(
      and(eq(package_.id, packageId), eq(package_.studioId, studioId)),
    )
    .limit(1);
  if (!pkg) return NextResponse.json({ ok: true, ignored: "unknown package" });

  // Resolve/create member
  let memberId: string;
  const [exMember] = await db
    .select({ id: member.id, fullName: member.fullName, phone: member.phone })
    .from(member)
    .where(
      and(eq(member.studioId, studioId), sql`lower(${member.email}) = ${email}`),
    )
    .limit(1);
  if (exMember) {
    memberId = exMember.id;
    const patch: Partial<typeof member.$inferInsert> = {};
    if (!exMember.fullName && fullName) patch.fullName = fullName;
    if (phone && !exMember.phone) patch.phone = phone;
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
    paypalOrderId: orderId,
    paypalCaptureId: captureId,
  });

  return NextResponse.json({ ok: true });
}

type WebhookPayload = {
  event_type: string;
  resource?: unknown;
};

type PayPalCaptureResource = {
  id?: string;
  custom_id?: string;
  supplementary_data?: { related_ids?: { order_id?: string } };
  // Capture-level events sometimes nest under purchase_units
  purchase_units?: { custom_id?: string }[];
};

function extractCustomId(p: WebhookPayload): string | null {
  if (!p?.resource || typeof p.resource !== "object") return null;
  const r = p.resource as PayPalCaptureResource;
  if (r.custom_id) return r.custom_id;
  return r.purchase_units?.[0]?.custom_id ?? null;
}
