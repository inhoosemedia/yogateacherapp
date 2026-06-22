import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import type { Metadata } from "next";
import { RetentionCalc } from "./calc";

export const metadata: Metadata = {
  title: "Yoga Studio Retention Rate Calculator (with Benchmarks)",
  description:
    "Free yoga studio retention rate calculator. Enter active members at the start and end of the month — get retention %, churn %, and how you compare to boutique-studio benchmarks.",
  alternates: {
    canonical:
      "https://www.yogateacherapp.com/tools/yoga-studio-retention-calculator",
  },
  openGraph: {
    title: "Yoga Studio Retention Rate Calculator",
    description:
      "Retention % + churn % + boutique-studio benchmarks. Free.",
    url: "https://www.yogateacherapp.com/tools/yoga-studio-retention-calculator",
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
          { label: "Retention rate" },
        ]}
      />
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Growth · Free calculator
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Studio retention{" "}
            <span className="italic text-primary">calculator</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Of the members who attended a class last month, what fraction
            came back this month? Compare to industry benchmarks for
            boutique studios.
          </p>
        </div>
      </section>

      <RetentionCalc />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl tracking-tight mb-5">
          Benchmarks for boutique yoga + pilates studios
        </h2>
        <ul className="space-y-2 text-base text-muted-foreground leading-relaxed list-disc pl-6">
          <li>
            <strong className="text-foreground">90%+ retention</strong> —
            elite. You&apos;ve built genuine community.
          </li>
          <li>
            <strong className="text-foreground">80–90%</strong> — typical
            for established boutique studios with a loyal core.
          </li>
          <li>
            <strong className="text-foreground">70–80%</strong> — common in
            year 1. Focus on the 30-day post-signup window.
          </li>
          <li>
            <strong className="text-foreground">Below 70%</strong> — leaky
            bucket. New acquisition can&apos;t outrun this.
          </li>
        </ul>
      </section>

      <SeoFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Yoga Studio Retention Rate Calculator",
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
            name: "Retention rate",
            url: "https://www.yogateacherapp.com/tools/yoga-studio-retention-calculator",
          },
        ])}
      />
    </main>
  );
}
