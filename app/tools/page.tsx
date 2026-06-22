import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Tools for Yoga & Pilates Studio Owners",
  description:
    "Free calculators for running a yoga or pilates studio: break-even, member LTV, class pack pricing, capacity utilization, retention rate, reformer scheduling. No sign-up required.",
  alternates: { canonical: "https://www.yogateacherapp.com/tools" },
  openGraph: {
    title: "Free Tools for Yoga & Pilates Studio Owners",
    description:
      "Six free calculators every studio owner should bookmark. Break-even, LTV, retention, capacity — the numbers that actually decide whether your studio works.",
    url: "https://www.yogateacherapp.com/tools",
    type: "website",
  },
};

const TOOLS = [
  {
    slug: "yoga-studio-break-even-calculator",
    title: "Yoga studio break-even calculator",
    blurb:
      "How many classes a month do you need to fill before rent + instructors are paid? Plug in your numbers and find out.",
    category: "Profitability",
  },
  {
    slug: "class-pack-price-calculator",
    title: "Class pack price calculator",
    blurb:
      "Set a 10-class pack price that protects your margin without scaring members away. Solves for the per-class effective price.",
    category: "Pricing",
  },
  {
    slug: "yoga-member-ltv-calculator",
    title: "Yoga member lifetime value calculator",
    blurb:
      "Monthly revenue × retention curve = LTV. Tells you the most you can spend to acquire one member and still profit.",
    category: "Growth",
  },
  {
    slug: "class-capacity-utilization-calculator",
    title: "Class capacity utilization calculator",
    blurb:
      "Find the empty bed-hours quietly costing you revenue. Per-day fill rate + lost-revenue estimate.",
    category: "Operations",
  },
  {
    slug: "yoga-studio-retention-calculator",
    title: "Yoga studio retention rate calculator",
    blurb:
      "What fraction of last month's members came back this month? With industry benchmarks for boutique studios.",
    category: "Growth",
  },
  {
    slug: "reformer-pilates-capacity-calculator",
    title: "Reformer pilates revenue capacity calculator",
    blurb:
      "8 beds × 25 classes a week × 50 weeks = your studio's revenue ceiling. Run it for your own setup.",
    category: "Pilates",
  },
];

export default function ToolsIndex() {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Free tools" }]}
      />
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Free tools · no sign-up
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            The numbers that decide whether your studio{" "}
            <span className="italic text-primary">works</span>.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Six calculators every yoga and pilates studio owner should
            bookmark. Plug in your numbers. Get answers in seconds. No
            email required.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group border border-border rounded-2xl p-6 bg-card hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                {t.category}
              </div>
              <div className="font-display text-xl md:text-2xl tracking-tight mb-2 group-hover:text-primary transition-colors">
                {t.title}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.blurb}
              </p>
              <div className="mt-4 text-xs text-primary font-medium">
                Open the calculator →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SeoFooter />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          { name: "Free tools", url: "https://www.yogateacherapp.com/tools" },
        ])}
      />
    </main>
  );
}
