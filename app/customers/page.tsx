import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoCtaBlock,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import { STORIES } from "@/lib/customers";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer Stories",
  description:
    "Stories of yoga and pilates studios running on YogaTeacher. Solo teachers, boutique studios, multi-location brands.",
  alternates: { canonical: "https://www.yogateacherapp.com/customers" },
};

export default function CustomersIndex() {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Customer stories" }]}
      />
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Customer stories
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            How studios actually use{" "}
            <span className="italic text-primary">YogaTeacher</span>.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Three composite profiles representing the typical YogaTeacher use
            cases: solo teachers, boutique studios, and multi-location brands.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/70 max-w-2xl mx-auto">
            These initial profiles are illustrative composites. Real customer
            interviews are being added — if you&apos;re a YogaTeacher studio
            and want to share your story, email hello@yogateacherapp.com.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <Link
              key={s.slug}
              href={`/customers/${s.slug}`}
              className="group border border-border rounded-2xl p-7 bg-card hover:shadow-md transition-shadow"
            >
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3">
                {s.type === "solo"
                  ? "Solo teacher"
                  : s.type === "boutique"
                    ? "Boutique studio"
                    : "Multi-location"}{" "}
                · {s.location}
              </div>
              <div className="font-display text-2xl mb-3 group-hover:text-primary transition-colors">
                {s.studioName}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {s.excerpt}
              </p>
              <div className="space-y-1 text-xs text-muted-foreground/80 border-t border-border pt-3">
                {s.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="flex justify-between">
                    <span>{m.label}</span>
                    <span className="font-medium text-foreground">{m.value}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SeoCtaBlock />
      <SeoFooter />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          {
            name: "Customer stories",
            url: "https://www.yogateacherapp.com/customers",
          },
        ])}
      />
    </main>
  );
}
