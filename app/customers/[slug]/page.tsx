import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoCtaBlock,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import { STORIES, getStory } from "@/lib/customers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return {
    title: `${story.studioName} — Customer story`,
    description: story.excerpt,
    alternates: {
      canonical: `https://www.yogateacherapp.com/customers/${story.slug}`,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getStory(slug);
  if (!s) notFound();

  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Customer stories", href: "/customers" },
          { label: s.studioName },
        ]}
      />
      {s.illustrative && (
        <div className="max-w-3xl mx-auto px-6 pt-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Illustrative profile.</strong> This story is a composite
            of typical YogaTeacher use patterns, not a specific named customer.
            Real customer stories — with named studios and interview-sourced
            details — are being added as we book them.
          </div>
        </div>
      )}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {s.type === "solo"
              ? "Solo teacher"
              : s.type === "boutique"
                ? "Boutique studio"
                : "Multi-location"}{" "}
            · {s.location}
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight mb-3">
            {s.studioName}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-10">
            {s.excerpt}
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {s.metrics.map((m) => (
              <div
                key={m.label}
                className="border border-border rounded-2xl p-5 bg-card"
              >
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                  {m.label}
                </div>
                <div className="font-display text-2xl tracking-tight">
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          <blockquote className="border-l-4 border-primary pl-6 py-3 italic text-xl text-foreground mb-12">
            &ldquo;{s.quote}&rdquo;
            <footer className="mt-3 text-sm not-italic text-muted-foreground">
              — {s.ownerName}, {s.ownerRole}
            </footer>
          </blockquote>

          <div className="space-y-6 text-base md:text-lg leading-relaxed text-muted-foreground">
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                Before YogaTeacher
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.beforeYogaTeacher}
              </p>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="text-[11px] uppercase tracking-[0.16em] text-primary mb-2">
                After YogaTeacher
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.afterYogaTeacher}
              </p>
            </div>
          </div>
        </div>
      </article>

      <SeoCtaBlock title={`Run your studio like ${s.studioName} does.`} />
      <SeoFooter />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          {
            name: "Customer stories",
            url: "https://www.yogateacherapp.com/customers",
          },
          {
            name: s.studioName,
            url: `https://www.yogateacherapp.com/customers/${s.slug}`,
          },
        ])}
      />
    </main>
  );
}
