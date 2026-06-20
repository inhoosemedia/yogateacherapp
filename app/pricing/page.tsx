import { AmbientAtmosphere } from "@/components/seo/ambient-atmosphere";
import { DarkCtaBand } from "@/components/seo/dark-cta-band";
import { EditorialBreakout } from "@/components/seo/editorial-breakout";
import { FaqSection } from "@/components/seo/faq";
import {
  JsonLd,
  breadcrumbSchema,
  softwareAppSchema,
} from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "YogaTeacher Pricing — From $29/mo for Yoga & Pilates Studios",
  description:
    "Simple pricing for yoga and pilates studios. From $29/month for a single studio, $79/month for multi-location. No setup fees, no contracts, no transaction fees on top.",
  alternates: { canonical: "https://www.yogateacherapp.com/pricing" },
  openGraph: {
    title: "YogaTeacher Pricing — From $29/mo",
    description:
      "Single studio $29/mo. Multi-studio $79/mo. 30-day free trial, no credit card.",
    url: "https://www.yogateacherapp.com/pricing",
    type: "website",
  },
};

const FAQS = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes — 30 days, no credit card required to start. You get the full product, every feature, every integration. At day 30 you choose a plan or your studio data is held safely for 60 days while you decide.",
  },
  {
    question: "What happens after the 30-day trial ends?",
    answer:
      "If you don't pick a plan by day 30, your dashboard goes read-only — your data stays put for 60 days. Pick a plan within that window and everything switches back on instantly. Past 60 days the data is deleted permanently.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. Go from $29 single-studio to $79 multi-studio (and back) in Settings > Billing. The change takes effect immediately; billing is prorated for the remainder of the month.",
  },
  {
    question: "Do you offer annual discounts?",
    answer:
      "Not at the moment — we keep pricing simple and monthly. If you'd find an annual prepay useful, email hello@yogateacherapp.com and we'll work something out.",
  },
  {
    question: "Are there transaction fees on member payments?",
    answer:
      "No platform transaction fee from YogaTeacher. Your payment processor (PayPal, Stripe or Razorpay) charges its standard rate — typically 1.9%–2.9% + a small fixed fee. Those go directly to the processor; we never touch the money or take a cut.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />
      <section className="relative py-16 px-6 overflow-hidden">
        <AmbientAtmosphere />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Pricing
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            Simple pricing,{" "}
            <span className="italic text-primary">built for studios</span>.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            30 days free. No credit card. Cancel anytime. Every feature
            included in every plan — no upsells, no add-ons, no contracts.
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <PricingCard
            tier="Single studio"
            signature="One studio. One inbox. Everything where you can find it."
            price="$29"
            period="/month"
            ideal="Solo teachers and boutique studios"
            features={[
              "Unlimited members",
              "Unlimited classes",
              "Unlimited packages",
              "Online booking page",
              "Recurring memberships",
              "PayPal + Stripe + Razorpay",
              "Instructor portal",
              "Email reminders + receipts (Resend)",
              "CSV imports + exports",
              "30-day free trial",
            ]}
            cta="Start free trial"
            href="/sign-up"
            highlight={false}
          />
          <PricingCard
            tier="Multi-studio"
            signature="From one studio to five — same calm dashboard."
            price="$79"
            period="/month"
            ideal="Multi-location studios and growing brands"
            features={[
              "Everything in Single studio",
              "Unlimited locations",
              "Per-location reporting",
              "Per-location instructors",
              "Shared memberships across locations",
              "Team roles (admin, staff, instructor)",
              "Priority email support",
              "Onboarding help on request",
            ]}
            cta="Start free trial"
            href="/sign-up"
            highlight={true}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">
          Prices in USD. Your members can pay in any of 18 supported
          currencies (set per-studio). Payment processor fees (PayPal, Stripe,
          Razorpay) are paid directly to the processor, not through us.
        </p>
      </section>

      <EditorialBreakout attribution="No upsells, no add-ons, no contracts">
        Every feature, every integration, every plan — for the price you
        actually see.
      </EditorialBreakout>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl tracking-tight mb-4">
            What about competitors?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Comparing tiers across studio platforms is messy because add-ons
            change the picture. As a quick reference for entry-tier pricing
            published or commonly quoted as of May 2026:
          </p>
          <div className="border border-border rounded-2xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">
                    Entry plan
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">
                    Common add-ons
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60 bg-primary/5">
                  <td className="py-3 px-4 font-medium">YogaTeacher</td>
                  <td className="py-3 px-4">$29/mo</td>
                  <td className="py-3 px-4 text-muted-foreground">None</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-3 px-4 font-medium">
                    <Link href="/vs-mindbody" className="hover:text-primary hover:underline">
                      Mindbody
                    </Link>
                  </td>
                  <td className="py-3 px-4">~$159/mo</td>
                  <td className="py-3 px-4 text-muted-foreground">App, marketing, branded</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-3 px-4 font-medium">
                    <Link href="/vs-wellnessliving" className="hover:text-primary hover:underline">
                      WellnessLiving
                    </Link>
                  </td>
                  <td className="py-3 px-4">~$99/mo</td>
                  <td className="py-3 px-4 text-muted-foreground">Achieve app, marketing</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-3 px-4 font-medium">
                    <Link href="/vs-vagaro" className="hover:text-primary hover:underline">
                      Vagaro
                    </Link>
                  </td>
                  <td className="py-3 px-4">~$30/mo</td>
                  <td className="py-3 px-4 text-muted-foreground">Payments, branded app</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-3 px-4 font-medium">
                    <Link href="/vs-momence" className="hover:text-primary hover:underline">
                      Momence
                    </Link>
                  </td>
                  <td className="py-3 px-4">~$30–80/mo</td>
                  <td className="py-3 px-4 text-muted-foreground">Tiered features</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">
                    <Link href="/vs-glofox" className="hover:text-primary hover:underline">
                      Glofox
                    </Link>
                  </td>
                  <td className="py-3 px-4">Custom (often $150+)</td>
                  <td className="py-3 px-4 text-muted-foreground">Annual contract typical</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Competitor pricing is shown as a directional guide based on
            publicly available information. Always verify directly with the
            vendor — pricing changes.
          </p>
        </div>
      </section>

      <FaqSection items={FAQS} />
      <DarkCtaBand
        heading="Ready to run your studio without the chaos?"
        body="Start your 30-day free trial. No credit card. No demo calls. Cancel any time."
      />
      <SeoFooter />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          { name: "Pricing", url: "https://www.yogateacherapp.com/pricing" },
        ])}
      />
      <JsonLd data={softwareAppSchema} />
    </main>
  );
}

function PricingCard({
  tier,
  price,
  period,
  ideal,
  features,
  cta,
  href,
  highlight,
  signature,
}: {
  tier: string;
  price: string;
  period: string;
  ideal: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
  signature: string;
}) {
  return (
    <div
      className={
        "group relative rounded-3xl p-8 md:p-10 border transition-all duration-500 " +
        (highlight
          ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 hover:shadow-primary/30 md:scale-[1.02]"
          : "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5")
      }
    >
      {highlight && (
        <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-primary-foreground/95 text-primary text-[10px] uppercase tracking-[0.18em] font-medium shadow-sm">
          Most studios
        </div>
      )}
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <div
            className={
              "text-[10px] uppercase tracking-[0.24em] mb-3 " +
              (highlight ? "opacity-80" : "text-muted-foreground")
            }
          >
            {tier}
          </div>
          <p
            className={
              "font-display italic text-base leading-snug " +
              (highlight ? "opacity-90" : "text-muted-foreground")
            }
          >
            {signature}
          </p>
        </div>
      </div>
      <div className="mt-8 flex items-baseline gap-2">
        <span className="font-display text-6xl tracking-tighter">{price}</span>
        <span
          className={
            "text-sm " + (highlight ? "opacity-80" : "text-muted-foreground")
          }
        >
          {period}
        </span>
      </div>
      <p
        className={
          "mt-1 text-sm " +
          (highlight ? "opacity-80" : "text-muted-foreground")
        }
      >
        {ideal}
      </p>
      <Link href={href} className="block mt-8">
        <Button
          size="lg"
          variant={highlight ? "secondary" : "default"}
          className={
            "w-full gap-2 cta-lift " +
            (highlight
              ? "!bg-primary-foreground !text-primary hover:!bg-primary-foreground/95 shadow-md"
              : "")
          }
        >
          {cta}
          <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </Link>
      <div
        className={
          "mt-8 h-px " +
          (highlight ? "bg-primary-foreground/20" : "bg-border")
        }
      />
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <IconCheck
              className={
                "size-4 mt-0.5 shrink-0 " +
                (highlight ? "opacity-90" : "text-primary")
              }
            />
            <span className={highlight ? "opacity-95" : ""}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
