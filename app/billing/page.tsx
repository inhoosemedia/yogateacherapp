import { BrandMark } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { getPlatformConfig } from "@/lib/platform";
import { isPlatformRazorpayConfigured } from "@/lib/razorpay";
import { getActiveStudio, trialDaysRemaining } from "@/lib/studio";
import {
  IconArrowLeft,
  IconCheck,
  IconLogout,
  IconSparkles,
} from "@tabler/icons-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubscribeButtons } from "./_components/subscribe-buttons";

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?returnTo=/billing");

  const studio = await getActiveStudio(session.user.id);
  if (!studio) redirect("/onboarding");

  const status = studio.subscriptionStatus;
  const trialActive = status === "trialing" && studio.trialEndsAt > new Date();
  const trialEnded = status === "trialing" && studio.trialEndsAt <= new Date();
  const daysLeft = trialActive ? trialDaysRemaining(studio) : 0;
  const subscribed = status === "active";

  const razorpayConfigured = await isPlatformRazorpayConfigured();

  const cfg = await getPlatformConfig();
  const studioPrice = formatMoney(cfg.priceStudioCents, cfg.currency);
  const multiPrice = formatMoney(cfg.priceMultiCents, cfg.currency);

  return (
    <main className="min-h-screen bg-canvas canvas-grain">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href={subscribed || trialActive ? "/dashboard" : "/"}
            className="inline-flex items-center gap-2 font-display text-lg tracking-tight"
          >
            <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <BrandMark size={18} />
            </span>
            YogaTeacher
          </Link>
          <form action="/api/auth/sign-out" method="post">
            <button className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <IconLogout className="size-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        {(subscribed || trialActive) && (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <IconArrowLeft className="size-4" /> Back to dashboard
          </Link>
        )}

        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Billing · {studio.name}
          </div>
          <h1 className="font-display text-5xl tracking-tight">
            {subscribed
              ? "You're all set."
              : trialEnded
                ? "Your trial has ended"
                : "Pick a plan when you're ready"}
          </h1>
          <p className="mt-4 text-muted-foreground text-[15px] max-w-md mx-auto">
            {subscribed
              ? `Your ${studio.planTier ?? "Studio"} subscription is active.`
              : trialEnded
                ? "Subscribe to keep using your dashboard. All your data is right where you left it."
                : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left on your free trial.`}
          </p>
        </div>

        {/* Status card */}
        <Card className="mb-8">
          <CardContent className="py-6 flex items-center gap-4 flex-wrap">
            <StatusDot status={status} />
            <div className="flex-1 min-w-[220px]">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Current status
              </div>
              <div className="font-display text-xl mt-0.5 capitalize">
                {status === "trialing"
                  ? trialActive
                    ? "Free trial"
                    : "Trial expired"
                  : status.replace("_", " ")}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {subscribed && studio.subscriptionCurrentPeriodEnd
                  ? `Renews ${studio.subscriptionCurrentPeriodEnd.toLocaleDateString()}`
                  : `Trial ends ${studio.trialEndsAt.toLocaleDateString()}`}
              </div>
            </div>
            {trialActive && (
              <div className="text-right">
                <div className="font-display text-3xl tabular-nums">
                  {daysLeft}
                </div>
                <div className="text-xs text-muted-foreground">
                  {daysLeft === 1 ? "day left" : "days left"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plans */}
        {!subscribed && (
          <>
            <div className="grid md:grid-cols-2 gap-5">
              <PlanCard
                tier="studio"
                name="Studio"
                price={studioPrice}
                cadence="/month"
                tagline="One studio, unlimited members"
                features={[
                  "Unlimited members",
                  "Unlimited classes & bookings",
                  "Public booking link with QR",
                  "Class types, instructors, packages",
                  "All updates included",
                ]}
                razorpayConfigured={razorpayConfigured}
              />
              <PlanCard
                featured
                tier="multi_studio"
                name="Multi-studio"
                price={multiPrice}
                cadence="/month"
                tagline="For owners running multiple locations"
                features={[
                  "Everything in Studio",
                  "Up to 5 studios",
                  "Per-studio team members",
                  "Cross-studio reporting",
                  "Priority support",
                ]}
                razorpayConfigured={razorpayConfigured}
              />
            </div>
            {!razorpayConfigured && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                <div className="font-medium">Razorpay isn&apos;t configured yet</div>
                <p className="mt-1 text-amber-800/90">
                  Subscriptions will activate once the platform Razorpay
                  credentials are saved in{" "}
                  <a href="/admin/settings" className="underline">
                    Super Admin → Settings → API keys
                  </a>{" "}
                  (or set as Vercel env vars).
                </p>
              </div>
            )}
          </>
        )}

        {subscribed && (
          <Card>
            <CardContent className="py-8 text-center">
              <IconSparkles className="size-7 text-primary mx-auto" />
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Manage payment method or cancel from your Razorpay customer
                portal. Reach out if you need help.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}

function PlanCard({
  tier,
  name,
  price,
  cadence,
  tagline,
  features,
  featured,
  razorpayConfigured,
}: {
  tier: "studio" | "multi_studio";
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  featured?: boolean;
  razorpayConfigured: boolean;
}) {
  return (
    <div
      className={
        "relative rounded-3xl p-7 transition-all hover:shadow-md " +
        (featured
          ? "bg-gradient-to-br from-primary/[0.07] via-card to-card border-2 border-primary/30"
          : "bg-card border border-border")
      }
    >
      {featured && (
        <div className="absolute -top-3 left-7">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.16em] shadow-sm">
            Most popular
          </span>
        </div>
      )}
      <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {name}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{tagline}</div>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-display text-4xl tracking-tight">{price}</span>
        <span className="text-sm text-muted-foreground">{cadence}</span>
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <IconCheck className="size-2.5 text-primary" />
            </span>
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <SubscribeButtons
          tier={tier}
          enabled={razorpayConfigured}
          featured={featured}
        />
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500",
    trialing: "bg-amber-500",
    past_due: "bg-rose-500",
    cancelled: "bg-stone-400",
    suspended: "bg-rose-500",
  };
  return (
    <span
      className={`size-3 rounded-full ${map[status] ?? "bg-stone-400"} ring-4 ring-white shadow-xs`}
    />
  );
}
