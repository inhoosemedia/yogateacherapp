import { FaqSection, type FaqItem } from "./faq";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "./json-ld";
import {
  SeoBreadcrumbs,
  SeoCtaBlock,
  SeoFooter,
  SeoNav,
} from "./page-shell";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import Link from "next/link";

export type FeaturePageProps = {
  slug: string;
  h1: string;
  subheadline: string;
  problem: { heading: string; body: string };
  solution: { heading: string; body: string };
  bullets: string[];
  useCases: { title: string; body: string }[];
  integrationLinks: { label: string; href: string }[];
  faqs: FaqItem[];
  ctaTitle?: string;
};

export function FeaturePage(p: FeaturePageProps) {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[{ label: "Home", href: "/" }, { label: p.h1 }]}
      />
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Feature
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            {p.h1}
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {p.subheadline}
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
                See all features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-6">
            {p.problem.heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {p.problem.body}
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-6">
            {p.solution.heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
            {p.solution.body}
          </p>
          <ul className="space-y-3">
            {p.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <IconCheck className="size-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-12 text-center">
            Built for{" "}
            <span className="italic text-primary">how studios actually run</span>.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {p.useCases.map((u) => (
              <div
                key={u.title}
                className="border border-border rounded-2xl p-6 bg-card"
              >
                <div className="font-display text-2xl mb-3">{u.title}</div>
                <p className="text-muted-foreground leading-relaxed">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl tracking-tight mb-6 text-center">
            Pairs well with
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {p.integrationLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border border-border rounded-full px-5 py-2 text-sm hover:bg-secondary/50 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection items={p.faqs} />
      <SeoCtaBlock title={p.ctaTitle ?? `Bring ${p.h1.toLowerCase()} to your studio.`} />
      <SeoFooter />

      <JsonLd data={{ ...softwareAppSchema, name: `YogaTeacher — ${p.h1}` }} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          {
            name: p.h1,
            url: `https://www.yogateacherapp.com/${p.slug}`,
          },
        ])}
      />
    </main>
  );
}
