import {
  JsonLd,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { SeoBreadcrumbs, SeoFooter, SeoNav } from "@/components/seo/page-shell";
import { POSTS } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "YogaTeacher Blog — Run a Better Yoga or Pilates Studio",
  description:
    "Practical guides for yoga and pilates studio owners. Growth, operations, marketing, software comparisons — written by people who've operated studios.",
  alternates: { canonical: "https://www.yogateacherapp.com/blog" },
};

const CLUSTER_LABELS: Record<string, string> = {
  "yoga-growth": "Yoga studio growth",
  "pilates-growth": "Pilates studio growth",
  switching: "Switching software",
  operations: "Operations",
};

export default function BlogIndex() {
  const pillars = POSTS.filter((p) => p.pillar);
  const supporting = POSTS.filter((p) => !p.pillar);

  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Blog
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            Run a better studio.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practical guides for yoga and pilates studio owners. Growth,
            operations, marketing, software — the unromantic stuff that
            actually moves the numbers.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Pillar guides
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group border border-border rounded-2xl p-7 bg-card hover:shadow-md transition-shadow"
              >
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3">
                  {CLUSTER_LABELS[p.cluster]} · {p.readTime}
                </div>
                <div className="font-display text-2xl md:text-3xl mb-3 group-hover:text-primary transition-colors">
                  {p.title}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {p.excerpt}
                </p>
                <div className="mt-4 text-sm text-primary">Read the guide →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground">
            See how real studios use YogaTeacher — read{" "}
            <Link href="/customers" className="text-primary hover:underline">
              customer stories
            </Link>{" "}
            from solo teachers, boutique studios and multi-location brands.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Supporting articles
          </h2>
          <div className="space-y-3">
            {supporting.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex items-baseline justify-between gap-4 border-b border-border py-5 hover:border-primary transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                    {CLUSTER_LABELS[p.cluster]}
                  </div>
                  <div className="font-display text-xl md:text-2xl group-hover:text-primary transition-colors">
                    {p.title}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {p.excerpt}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {p.readTime}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SeoFooter />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          { name: "Blog", url: "https://www.yogateacherapp.com/blog" },
        ])}
      />
    </main>
  );
}
