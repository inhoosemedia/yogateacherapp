import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import type { Metadata } from "next";
import { LtvCalc } from "./calc";

export const metadata: Metadata = {
  title: "Yoga Member Lifetime Value (LTV) Calculator",
  description:
    "Free yoga member lifetime value calculator. Enter average monthly revenue per member and monthly churn rate — get LTV plus the max you can spend to acquire a member.",
  alternates: {
    canonical:
      "https://www.yogateacherapp.com/tools/yoga-member-ltv-calculator",
  },
  openGraph: {
    title: "Yoga Member LTV Calculator",
    description:
      "Lifetime value of a yoga studio member, calculated from monthly revenue and churn. Free.",
    url: "https://www.yogateacherapp.com/tools/yoga-member-ltv-calculator",
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
          { label: "Member LTV" },
        ]}
      />
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Growth · Free calculator
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Member lifetime value{" "}
            <span className="italic text-primary">calculator</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            How much revenue does one yoga member generate over their entire
            relationship with your studio? The number caps how much you can
            spend to acquire one.
          </p>
        </div>
      </section>

      <LtvCalc />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl tracking-tight mb-5">
          The formula behind the result
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          LTV = average monthly revenue per member ÷ monthly churn rate.
          The reciprocal of churn is your average customer lifetime in
          months — multiply by revenue and you have lifetime value.
        </p>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Typical boutique-yoga monthly churn is 6–10%. 5% is excellent.
          12%+ means the studio is leaking faster than it&apos;s acquiring.
        </p>
      </section>

      <SeoFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Yoga Member LTV Calculator",
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
            name: "Member LTV",
            url: "https://www.yogateacherapp.com/tools/yoga-member-ltv-calculator",
          },
        ])}
      />
    </main>
  );
}
