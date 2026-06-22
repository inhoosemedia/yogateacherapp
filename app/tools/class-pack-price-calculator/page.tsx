import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import type { Metadata } from "next";
import { PackPriceCalc } from "./calc";

export const metadata: Metadata = {
  title: "Yoga Class Pack Price Calculator (Free, No Sign-Up)",
  description:
    "Free yoga class pack pricing calculator. Set your 5/10/20-class pack price with the right discount — protect your margin without scaring members away.",
  alternates: {
    canonical:
      "https://www.yogateacherapp.com/tools/class-pack-price-calculator",
  },
  openGraph: {
    title: "Class Pack Price Calculator",
    description:
      "Set a 10-class pack price that members buy and your margin survives.",
    url: "https://www.yogateacherapp.com/tools/class-pack-price-calculator",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Free tools", href: "/tools" },
          { label: "Class pack pricing" },
        ]}
      />
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Pricing · Free calculator
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Class pack <span className="italic text-primary">price</span>{" "}
            calculator.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Set a 5, 10 or 20-class pack price that protects your margin
            and still feels like a deal worth committing to.
          </p>
        </div>
      </section>

      <PackPriceCalc />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl tracking-tight mb-5">
          The pricing math, in one line
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Pack price = drop-in price × pack size × (1 − discount). The
          calculator runs that math for you and adds two sanity checks: the
          per-class effective price (so members can see the deal), and the
          total discount given away (so you can see the cost).
        </p>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          A 10–20% discount on a 5-class pack is typical. 20–25% on a
          10-class pack. 25–30% on a 20-class pack. Bigger discounts only
          make sense if you&apos;re trying to capture committed regulars
          who would otherwise leak to a competitor.
        </p>
      </section>

      <SeoFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Yoga Class Pack Price Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          { name: "Free tools", url: "https://www.yogateacherapp.com/tools" },
          {
            name: "Class pack pricing",
            url: "https://www.yogateacherapp.com/tools/class-pack-price-calculator",
          },
        ])}
      />
    </main>
  );
}
