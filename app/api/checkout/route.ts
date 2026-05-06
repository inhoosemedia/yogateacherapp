import { db } from "@/db/drizzle";
import { package_, studio } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

/**
 * Create a Razorpay order on behalf of a studio so a public visitor can pay
 * for a package on the studio's booking page. The studio supplies their own
 * key (stored in the studio row) — payment settles directly to them.
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

  if (!s.studioRazorpayKeyId || !s.studioRazorpayKeySecret) {
    return NextResponse.json(
      {
        error:
          "This studio doesn't accept online payments yet. Pay at the studio when you arrive, or contact them.",
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
    const rp = new Razorpay({
      key_id: s.studioRazorpayKeyId,
      key_secret: s.studioRazorpayKeySecret,
    });
    const order = await rp.orders.create({
      amount: pkg.priceCents,
      currency: pkg.currency,
      receipt: `pkg-${pkg.id.slice(0, 12)}-${Date.now()}`,
      notes: {
        studio_id: s.id,
        package_id: pkg.id,
        member_full_name: fullName,
        member_email: email,
        member_phone: phone,
      },
    });
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: s.studioRazorpayKeyId,
      packageName: pkg.name,
      studioName: s.name,
    });
  } catch (e) {
    console.error("checkout order create failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not start checkout" },
      { status: 500 },
    );
  }
}
