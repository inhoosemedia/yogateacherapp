import { db } from "@/db/drizzle";
import { member, memberPackage, package_, studio } from "@/db/schema";
import { capturePayPalOrder, studioPayPalCreds } from "@/lib/paypal";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Called by the public packages page after PayPal redirects back with the
 * approved order. Captures the payment and creates the member_package
 * idempotently.
 *
 * The webhook (/api/webhooks/studio-paypal) also creates the row if it fires
 * first — both paths use razorpay_order_id-style idempotency to avoid
 * duplicates.
 */
export async function POST(req: Request) {
  let body: { studioSlug?: string; orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const studioSlug = (body.studioSlug ?? "").trim();
  const orderId = (body.orderId ?? "").trim();
  if (!studioSlug || !orderId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.slug, studioSlug))
    .limit(1);
  if (!s) return NextResponse.json({ error: "Studio not found" }, { status: 404 });

  const creds = studioPayPalCreds(s);
  if (!creds) {
    return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
  }

  // Idempotency: if we've already recorded this order, do nothing.
  const [existing] = await db
    .select({ id: memberPackage.id })
    .from(memberPackage)
    .where(eq(memberPackage.paypalOrderId, orderId))
    .limit(1);
  if (existing) {
    return NextResponse.json({ ok: true, alreadyRecorded: true });
  }

  let result: Awaited<ReturnType<typeof capturePayPalOrder>>;
  try {
    result = await capturePayPalOrder(creds, orderId);
  } catch (e) {
    console.error("paypal capture failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Capture failed" },
      { status: 500 },
    );
  }

  if (result.status !== "COMPLETED") {
    return NextResponse.json(
      { error: `Capture status was ${result.status}` },
      { status: 400 },
    );
  }

  if (!result.customId) {
    return NextResponse.json(
      { error: "Capture missing custom_id (lost the package/member context)" },
      { status: 400 },
    );
  }

  // Parse custom_id (v1:studioId:packageId:base64<fullName|email|phone>)
  const parts = result.customId.split(":");
  if (parts.length < 4 || parts[0] !== "v1") {
    return NextResponse.json({ error: "Bad custom_id format" }, { status: 400 });
  }
  const [, studioId, packageId, blob] = parts;
  if (studioId !== s.id) {
    return NextResponse.json({ error: "Studio mismatch" }, { status: 400 });
  }
  let fullName = "";
  let email = "";
  let phone: string | null = null;
  try {
    const [n, e, p] = Buffer.from(blob, "base64").toString().split("|");
    fullName = n;
    email = (e ?? "").toLowerCase();
    phone = p || null;
  } catch {
    return NextResponse.json({ error: "Bad custom_id payload" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Missing buyer email" }, { status: 400 });
  }

  const [pkg] = await db
    .select()
    .from(package_)
    .where(
      and(eq(package_.id, packageId), eq(package_.studioId, s.id)),
    )
    .limit(1);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  // Resolve or create member
  let memberId: string;
  const [exMember] = await db
    .select({ id: member.id, fullName: member.fullName, phone: member.phone })
    .from(member)
    .where(
      and(eq(member.studioId, s.id), sql`lower(${member.email}) = ${email}`),
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
      studioId: s.id,
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
    studioId: s.id,
    memberId,
    packageId: pkg.id,
    creditsRemaining: pkg.credits,
    startsAt: now,
    expiresAt,
    pricePaidCents: pkg.priceCents,
    status: "active",
    paypalOrderId: orderId,
    paypalCaptureId: result.captureId,
  });

  return NextResponse.json({ ok: true });
}
