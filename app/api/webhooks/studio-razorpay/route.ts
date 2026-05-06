import { db } from "@/db/drizzle";
import { member, memberPackage, package_, studio } from "@/db/schema";
import crypto from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Studio-direct Razorpay webhook. Each studio configures their Razorpay
 * dashboard with this URL and their own per-studio webhook secret. We figure
 * out which studio the event is for by looking at the order's notes.
 *
 * Events: payment.captured (preferred). Also supports order.paid for safety.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Razorpay sends the order or payment entity at different paths. We always
  // dig out studio_id from notes to identify the tenant.
  const notes = extractNotes(payload);
  const studioId = notes?.studio_id;
  if (!studioId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.id, studioId))
    .limit(1);
  if (!s) {
    return NextResponse.json({ ok: true, ignored: "unknown studio" });
  }

  // Verify HMAC using the studio's own webhook secret.
  const secret = s.studioRazorpayWebhookSecret;
  if (!secret) {
    console.warn("Studio webhook hit but secret not set", studioId);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");
  if (signature !== expected) {
    console.warn("Invalid studio webhook signature", studioId);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = payload.event;
  const isPaid =
    event === "payment.captured" ||
    event === "order.paid" ||
    event === "payment.authorized";
  if (!isPaid) {
    return NextResponse.json({ ok: true, ignored: event });
  }

  const packageId = notes.package_id;
  const fullName = notes.member_full_name?.trim();
  const email = notes.member_email?.trim().toLowerCase();
  const phone = notes.member_phone?.trim() || null;
  const orderId =
    payload.payload?.payment?.entity?.order_id ??
    payload.payload?.order?.entity?.id ??
    null;
  const paymentId = payload.payload?.payment?.entity?.id ?? null;

  if (!packageId || !fullName || !email || !orderId) {
    return NextResponse.json({ ok: true, ignored: "missing fields" });
  }

  // Idempotency: if we've already recorded this order, do nothing.
  const [existing] = await db
    .select({ id: memberPackage.id })
    .from(memberPackage)
    .where(eq(memberPackage.razorpayOrderId, orderId))
    .limit(1);
  if (existing) {
    return NextResponse.json({ ok: true, alreadyRecorded: true });
  }

  const [pkg] = await db
    .select()
    .from(package_)
    .where(
      and(
        eq(package_.id, packageId),
        eq(package_.studioId, studioId),
      ),
    )
    .limit(1);
  if (!pkg) {
    return NextResponse.json({ ok: true, ignored: "unknown package" });
  }

  // Resolve / create member
  let memberId: string;
  const [exMember] = await db
    .select({ id: member.id, fullName: member.fullName, phone: member.phone })
    .from(member)
    .where(
      and(
        eq(member.studioId, studioId),
        sql`lower(${member.email}) = ${email}`,
      ),
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
      fullName,
      email,
      phone,
      status: "active",
    });
  }

  // Create the member_package
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
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
  });

  return NextResponse.json({ ok: true });
}

type WebhookPayload = {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity?: {
        id?: string;
        notes?: Record<string, string>;
      };
    };
  };
};

function extractNotes(p: WebhookPayload): Record<string, string> | null {
  const fromPayment = p.payload?.payment?.entity?.notes;
  if (fromPayment && typeof fromPayment === "object") return fromPayment;
  const fromOrder = p.payload?.order?.entity?.notes;
  if (fromOrder && typeof fromOrder === "object") return fromOrder;
  return null;
}
