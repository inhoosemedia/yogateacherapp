import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoCtaBlock,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import { POSTS, getPost } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.yogateacherapp.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.yogateacherapp.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {post.cluster.replace("-", " ")} · {post.readTime} read
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-10">
            {post.excerpt}
          </p>

          <div className="space-y-5 text-base md:text-lg leading-relaxed">
            {post.sections.map((s, i) => {
              if (s.type === "h2")
                return (
                  <h2
                    key={i}
                    className="font-display text-3xl md:text-4xl mt-12 mb-3 tracking-tight"
                  >
                    {s.body}
                  </h2>
                );
              if (s.type === "h3")
                return (
                  <h3
                    key={i}
                    className="font-display text-2xl mt-8 mb-2 tracking-tight"
                  >
                    {s.body}
                  </h3>
                );
              if (s.type === "p")
                return (
                  <p key={i} className="text-muted-foreground">
                    {s.body}
                  </p>
                );
              if (s.type === "ul")
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {s.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                );
              if (s.type === "ol")
                return (
                  <ol key={i} className="list-decimal pl-6 space-y-2 text-muted-foreground">
                    {s.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ol>
                );
              if (s.type === "quote")
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-primary pl-5 italic text-muted-foreground"
                  >
                    &ldquo;{s.body}&rdquo;
                    {s.cite && (
                      <footer className="mt-2 text-sm not-italic text-muted-foreground/70">
                        — {s.cite}
                      </footer>
                    )}
                  </blockquote>
                );
              return null;
            })}
          </div>

          {post.relatedPages.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Related
              </div>
              <div className="flex flex-wrap gap-3">
                {post.relatedPages.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="border border-border rounded-full px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <SeoCtaBlock title="Run your studio without the chaos." />
      <SeoFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { "@type": "Organization", name: "YogaTeacher" },
          publisher: {
            "@type": "Organization",
            name: "YogaTeacher",
            logo: {
              "@type": "ImageObject",
              url: "https://www.yogateacherapp.com/logo.png",
            },
          },
          mainEntityOfPage: `https://www.yogateacherapp.com/blog/${post.slug}`,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          { name: "Blog", url: "https://www.yogateacherapp.com/blog" },
          {
            name: post.title,
            url: `https://www.yogateacherapp.com/blog/${post.slug}`,
          },
        ])}
      />
    </main>
  );
}
