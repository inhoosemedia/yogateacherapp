import { FaqSection, type FaqItem } from "./faq";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "./json-ld";
import {
  SeoBreadcrumbs,
  SeoCtaBlock,
  SeoFooter,
  SeoNav,
} from "./page-shell";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconCheck, IconMinus, IconX } from "@tabler/icons-react";
import Link from "next/link";

export type Cell = boolean | "partial" | string;

export type ComparisonRow = {
  feature: string;
  us: Cell;
  them: Cell;
};

export type ComparisonPageProps = {
  competitor: string;
  competitorSlug: string;
  tagline: string;
  intro: string;
  reasons: { title: string; body: string }[];
  rows: ComparisonRow[];
  migrationSteps: { day: string; body: string }[];
  faqs: FaqItem[];
  lastUpdated: string;
};

function renderCell(c: Cell, brand: "us" | "them") {
  if (c === true) {
    return (
      <span
        className={
          "inline-flex items-center gap-1.5 text-xs font-medium " +
          (brand === "us"
            ? "text-primary"
            : "text-muted-foreground")
        }
      >
        <IconCheck className="size-4" />
        Built-in
      </span>
    );
  }
  if (c === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
        <IconX className="size-4" />
        No
      </span>
    );
  }
  if (c === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
        <IconMinus className="size-4" />
        Add-on
      </span>
    );
  }
  return <span className="text-sm">{c}</span>;
}

export function ComparisonPage(p: ComparisonPageProps) {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Compare" },
          { label: `vs ${p.competitor}` },
        ]}
      />
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            The {p.competitor} alternative for yoga &amp; pilates
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            {p.tagline}
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {p.intro}
          </p>
          <div className="mt-9 flex justify-center gap-3 flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Start your 30-day free trial
                <IconArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/yoga-studio-software">
              <Button size="lg" variant="outline">
                See yoga studio software
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-12 text-center">
            Why studios switch from {p.competitor}.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {p.reasons.map((r) => (
              <div
                key={r.title}
                className="border border-border rounded-2xl p-6 bg-card"
              >
                <div className="font-display text-2xl mb-3">{r.title}</div>
                <p className="text-muted-foreground leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-3 text-center">
            Feature-by-feature comparison
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-10">
            Last updated: {p.lastUpdated}. {p.competitor} pricing and feature
            details change — please verify on their site before deciding.
          </p>
          <div className="border border-border rounded-2xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">
                    Feature
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider text-primary">
                    YogaTeacher
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">
                    {p.competitor}
                  </th>
                </tr>
              </thead>
              <tbody>
                {p.rows.map((r) => (
                  <tr
                    key={r.feature}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-3 px-4 font-medium">{r.feature}</td>
                    <td className="py-3 px-4">{renderCell(r.us, "us")}</td>
                    <td className="py-3 px-4">{renderCell(r.them, "them")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-3">
            How to switch from {p.competitor} in 7 days.
          </h2>
          <p className="text-muted-foreground mb-10">
            A pragmatic 1-week migration plan. Most studios complete this
            inside a single weekend; the 7-day version below is the
            comfortable pace.
          </p>
          <ol className="space-y-6">
            {p.migrationSteps.map((s) => (
              <li key={s.day} className="flex gap-5">
                <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg shrink-0">
                  {s.day}
                </div>
                <div className="pt-2 text-muted-foreground leading-relaxed">
                  {s.body}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-border/60">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl tracking-tight mb-6">
            Considering other alternatives too?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/vs-mindbody", label: "vs Mindbody" },
              { href: "/vs-momence", label: "vs Momence" },
              { href: "/vs-wellnessliving", label: "vs WellnessLiving" },
              { href: "/vs-vagaro", label: "vs Vagaro" },
              { href: "/vs-glofox", label: "vs Glofox" },
            ]
              .filter((x) => x.href !== `/vs-${p.competitorSlug}`)
              .map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  className="border border-border rounded-full px-5 py-2 text-sm hover:bg-secondary/50 transition-colors"
                >
                  {x.label}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <FaqSection items={p.faqs} />
      <SeoCtaBlock title={`Switch from ${p.competitor} to YogaTeacher.`} />
      <SeoFooter />

      <JsonLd
        data={{
          ...softwareAppSchema,
          name: `YogaTeacher — ${p.competitor} alternative`,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          {
            name: `vs ${p.competitor}`,
            url: `https://www.yogateacherapp.com/vs-${p.competitorSlug}`,
          },
        ])}
      />
    </main>
  );
}
