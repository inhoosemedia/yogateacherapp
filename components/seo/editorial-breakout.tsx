// A transitional moment between sections. Single sentence in Fraunces italic
// with a sage hairline above and below — feels like a margin note in a
// well-printed program. Use sparingly; one per page max.
//
// Optional `imageSrc` shifts to a 2-column layout: a tall portrait on the
// left, the italic text on the right. Used on pages that are otherwise very
// text-heavy so the transition also gives the eye something to land on.

import Image from "next/image";

type Props = {
  children: React.ReactNode;
  attribution?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function EditorialBreakout({
  children,
  attribution,
  imageSrc,
  imageAlt,
}: Props) {
  if (imageSrc) {
    return (
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 md:gap-14 items-center">
          <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-secondary/30 ring-1 ring-primary/15 shadow-md shadow-primary/10">
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(63,81,65,0.0) 55%, rgba(63,81,65,0.10) 100%)",
              }}
              aria-hidden
            />
          </div>
          <div>
            <div className="h-px bg-primary/30 w-12 mb-8" aria-hidden />
            <p className="font-display italic text-2xl md:text-3xl leading-snug tracking-tight text-foreground/90">
              {children}
            </p>
            {attribution && (
              <div className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                — {attribution}
              </div>
            )}
            <div className="h-px bg-primary/30 w-12 mt-8" aria-hidden />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="h-px bg-primary/30 w-12 mb-8" aria-hidden />
        <p className="font-display italic text-2xl md:text-3xl leading-snug tracking-tight text-foreground/90">
          {children}
        </p>
        {attribution && (
          <div className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            — {attribution}
          </div>
        )}
        <div className="h-px bg-primary/30 w-12 mt-8" aria-hidden />
      </div>
    </section>
  );
}
