import { BrandMark } from "@/components/brand";
import { db } from "@/db/drizzle";
import { package_, studio } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import {
  IconArrowLeft,
  IconCheck,
  IconCircleCheck,
} from "@tabler/icons-react";
import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPackageButton } from "./_components/buy-package-button";
import { PayPalCapture } from "./_components/paypal-capture";

export const dynamic = "force-dynamic";

export default async function PublicPackagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ studioSlug: string }>;
  searchParams: Promise<{
    paid?: string;
    cancelled?: string;
    paypal_order?: string;
  }>;
}) {
  const { studioSlug } = await params;
  const sp = await searchParams;
  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.slug, studioSlug))
    .limit(1);
  if (!s) notFound();

  const provider: "paypal" | "razorpay" | "stripe" | null =
    s.studioPaymentProvider === "paypal"
      ? "paypal"
      : s.studioPaymentProvider === "stripe"
        ? "stripe"
        : s.studioPaymentProvider === "razorpay"
          ? "razorpay"
          : null;
  const acceptsPayments =
    (provider === "paypal" &&
      Boolean(s.studioPaypalClientId && s.studioPaypalClientSecret)) ||
    (provider === "razorpay" &&
      Boolean(s.studioRazorpayKeyId && s.studioRazorpayKeySecret)) ||
    (provider === "stripe" &&
      Boolean(s.studioStripeSecretKey && s.studioStripePublishableKey));

  const packages = await db
    .select()
    .from(package_)
    .where(
      and(
        eq(package_.studioId, s.id),
        eq(package_.active, true),
        eq(package_.publiclyPurchasable, true),
      ),
    )
    .orderBy(asc(package_.priceCents));

  return (
    <main className="min-h-screen bg-canvas canvas-grain">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link
            href={`/book/${studioSlug}`}
            className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
          >
            <BrandMark size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl truncate">{s.name}</div>
            <div className="text-[11px] text-muted-foreground">Packages</div>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href={`/book/${studioSlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <IconArrowLeft className="size-4" />
          Back to schedule
        </Link>

        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Packages
          </div>
          <h1 className="font-display text-5xl tracking-tight leading-tight">
            Build your{" "}
            <span className="italic text-primary">practice</span>.
          </h1>
          <p className="mt-4 text-muted-foreground text-[15px] max-w-md mx-auto">
            Pick a package that fits your rhythm. Pay online and we&apos;ll set up
            your credits instantly.
          </p>
        </div>

        {sp.paypal_order && (
          <PayPalCapture studioSlug={studioSlug} orderId={sp.paypal_order} />
        )}

        {sp.paid === "1" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 mb-6 flex items-start gap-3">
            <IconCircleCheck className="size-5 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">Payment successful</div>
              <p className="mt-0.5 text-emerald-800/90">
                Your credits are activated. Head back to the schedule to book your
                first class.
              </p>
            </div>
          </div>
        )}
        {sp.cancelled === "1" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 mb-6">
            <div className="font-medium">Payment cancelled</div>
            <p className="mt-0.5 text-amber-800/90">
              No charge was made. You can try again anytime.
            </p>
          </div>
        )}

        {!acceptsPayments && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-6">
            <div className="font-medium">Online payments aren&apos;t enabled</div>
            <p className="mt-1 text-amber-800/90">
              You can still browse packages — visit the studio in person to
              purchase, or contact them directly.
            </p>
          </div>
        )}

        {packages.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No packages available for online purchase yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {packages.map((p) => (
              <div
                key={p.id}
                className={
                  "relative rounded-2xl border p-6 transition-all hover:shadow-md " +
                  (p.kind === "unlimited"
                    ? "bg-gradient-to-br from-primary/[0.06] via-card to-card border-primary/30"
                    : "bg-card border-border")
                }
              >
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground capitalize">
                  {p.kind.replace("_", " ")}
                </div>
                <div className="font-display text-2xl mt-1">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <div className="font-display text-4xl tracking-tight">
                    {formatMoney(p.priceCents, p.currency)}
                  </div>
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  <Bullet>
                    {p.credits === null
                      ? "Unlimited classes"
                      : `${p.credits} ${p.credits === 1 ? "class" : "classes"}`}
                  </Bullet>
                  <Bullet>Valid {p.validityDays} days</Bullet>
                  <Bullet>Credits decrement automatically</Bullet>
                </ul>
                <div className="mt-6">
                  <BuyPackageButton
                    studioSlug={studioSlug}
                    packageId={p.id}
                    packageName={p.name}
                    priceLabel={formatMoney(p.priceCents, p.currency)}
                    priceCents={p.priceCents}
                    currency={p.currency}
                    enabled={acceptsPayments}
                    provider={provider}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <Link href="/" className="text-primary hover:underline">
            YogaTeacher
          </Link>
        </p>
      </section>
    </main>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
        <IconCheck className="size-2.5 text-primary" />
      </span>
      <span className="text-foreground/90">{children}</span>
    </li>
  );
}
