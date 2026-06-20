import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

// Full-bleed dark sage CTA. The most visually present moment on the page —
// breaks the cream wash with a confident block of brand color. Decorative
// circles on the right echo the lotus / sun motif from the existing
// landing decorations. Used once per page, max.

export function DarkCtaBand({
  eyebrow = "30-day free trial",
  heading = "Tools that breathe with your day.",
  body = "Bookings, memberships, payments and instructors — together, in one calm dashboard. Give it a fortnight and see how much quieter your front desk gets.",
  primaryLabel = "Start your free trial",
  primaryHref = "/sign-up",
  secondaryLabel = "See pricing",
  secondaryHref = "/pricing",
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden bg-primary text-primary-foreground rounded-3xl px-8 py-16 md:px-14 md:py-20 shadow-2xl shadow-primary/25">
          {/* Decorative circles — echo the existing landing decorations,
              dimmed to a near-imperceptible glow on the dark surface. */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-[340px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(244,241,236,0.14) 0%, rgba(244,241,236,0) 70%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-16 -bottom-32 size-[260px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(244,241,236,0.10) 0%, rgba(244,241,236,0) 70%)",
            }}
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/12 text-primary-foreground/95 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide mb-7 border border-primary-foreground/15">
              <span className="size-1.5 rounded-full bg-primary-foreground/80" />
              {eyebrow}
            </div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05] !text-primary-foreground">
              {heading}
            </h2>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-xl">
              {body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={primaryHref}>
                <Button
                  size="lg"
                  className="!bg-primary-foreground !text-primary hover:!bg-primary-foreground/95 cta-lift gap-2 shadow-lg shadow-primary-foreground/10"
                >
                  {primaryLabel}
                  <IconArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href={secondaryHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground hover:!bg-primary-foreground/8 cta-lift"
                >
                  {secondaryLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
