import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import type { Metadata } from "next";
import { UtilizationCalc } from "./calc";

export const metadata: Metadata = {
  title: "Yoga Studio Capacity Utilization Calculator",
  description:
    "Free yoga studio capacity utilization calculator. Find the empty spots quietly costing you revenue every week — across all your weekly classes.",
  alternates: {
    canonical:
      "https://www.yogateacherapp.com/tools/class-capacity-utilization-calculator",
  },
  openGraph: {
    title: "Class Capacity Utilization Calculator",
    description:
      "How full is your studio actually running? Per-day fill rate + lost-revenue estimate.",
    url: "https://www.yogateacherapp.com/tools/class-capacity-utilization-calculator",
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
          { label: "Capacity utilization" },
        ]}
      />
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Operations · Free calculator
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Capacity utilization{" "}
            <span className="italic text-primary">calculator</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            The empty spots in your schedule cost you revenue every week.
            Run the numbers for a single class type — fill rate, lost
            revenue, and the case for a price change.
          </p>
        </div>
      </section>

      <UtilizationCalc />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl tracking-tight mb-5">
          What good utilization looks like
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Boutique yoga studios should target an average 60–75% utilization
          across their schedule. Below 60% and you have either too many
          classes, the wrong times, or a price-mismatch problem. Above 80%
          and you&apos;re leaving money on the table — members can&apos;t
          book the time they want, so they leave for a less-full
          competitor.
        </p>
      </section>

      <SeoFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Class Capacity Utilization Calculator",
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
            name: "Capacity utilization",
            url: "https://www.yogateacherapp.com/tools/class-capacity-utilization-calculator",
          },
        ])}
      />
    </main>
  );
}
