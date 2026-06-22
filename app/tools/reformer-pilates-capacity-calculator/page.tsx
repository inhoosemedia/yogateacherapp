import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import type { Metadata } from "next";
import { ReformerCalc } from "./calc";

export const metadata: Metadata = {
  title: "Reformer Pilates Revenue Capacity Calculator",
  description:
    "Free reformer pilates revenue capacity calculator. Beds × classes × price = your studio's revenue ceiling at 100%, 75% and 50% utilization.",
  alternates: {
    canonical:
      "https://www.yogateacherapp.com/tools/reformer-pilates-capacity-calculator",
  },
  openGraph: {
    title: "Reformer Pilates Capacity Calculator",
    description:
      "Calculate your reformer pilates studio's revenue capacity at different utilization rates.",
    url: "https://www.yogateacherapp.com/tools/reformer-pilates-capacity-calculator",
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
          { label: "Reformer capacity" },
        ]}
      />
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Pilates · Free calculator
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Reformer pilates revenue{" "}
            <span className="italic text-primary">capacity</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your beds × classes × price = annual revenue ceiling. Run it
            for your setup, see what 75% and 50% utilization look like in
            actual dollars.
          </p>
        </div>
      </section>

      <ReformerCalc />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl tracking-tight mb-5">
          What to do with this number
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          The 100% ceiling is theoretical — every bed full, every class,
          every week, no holidays. Reality is the 60–75% column. If your
          studio is doing $20K/month and the 75% number says $40K/month, you
          have a fill-rate problem, not a capacity problem. The reverse —
          near the 75% number — means more reformers are the only path to
          more revenue.
        </p>
      </section>

      <SeoFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Reformer Pilates Capacity Calculator",
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
            name: "Reformer capacity",
            url: "https://www.yogateacherapp.com/tools/reformer-pilates-capacity-calculator",
          },
        ])}
      />
    </main>
  );
}
