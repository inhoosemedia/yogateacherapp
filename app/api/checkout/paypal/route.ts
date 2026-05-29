import { db } from "@/db/drizzle";
import { package_, studio } from "@/db/schema";
import { createPayPalOrder, studioPayPalCreds } from "@/lib/paypal";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Studio-direct PayPal checkout. Each studio brings its own PayPal Business
 * account; funds settle to them. We create a CAPTURE-intent order, return the
 * approve URL — the client redirects there, PayPal redirects back with
 * ?token=<orderId>&PayerID=…, and the public packages page completes capture
 * via /api/checkout/paypal/capture (POST).
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

  const creds = studioPayPalCreds(s);
  if (s.studioPaymentProvider !== "paypal" || !creds) {
    return NextResponse.json(
      {
        error:
          "This studio doesn't accept PayPal payments. Pay at the studio when you arrive, or contact them.",
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

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    `https://${req.headers.get("host") ?? "localhost"}`;

  // Embed the data needed for capture into custom_id so we don't have to
  // round-trip through a separate session store. Truncate to PayPal's 127-char
  // limit; email is the only field that might exceed.
  const customId = [
    "v1",
    s.id,
    pkg.id,
    Buffer.from(`${fullName}|${email}|${phone}`).toString("base64").slice(0, 90),
  ].join(":");

  try {
    const order = await createPayPalOrder(creds, {
      amountCents: pkg.priceCents,
      currency: s.currency,
      description: `${s.name} — ${pkg.name}`,
      returnUrl: `${origin}/book/${studioSlug}/packages?paypal_order={order_id}`,
      cancelUrl: `${origin}/book/${studioSlug}/packages?cancelled=1`,
      customId,
    });
    // PayPal substitutes {order_id} on its own. Some integrations require we
    // do it ourselves; just include the id in the return path so capture can
    // run.
    const approveUrl = order.approveUrl.includes("token=")
      ? order.approveUrl
      : `${order.approveUrl}&token=${order.id}`;
    return NextResponse.json({
      orderId: order.id,
      approveUrl,
    });
  } catch (e) {
    console.error("paypal create order failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not start checkout" },
      { status: 500 },
    );
  }
}
