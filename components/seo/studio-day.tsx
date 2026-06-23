// The "studio day" rhythm — a recurring motif that says this product is
// shaped by a real day in a real studio. Time in tabular monospace digits,
// class name in display italic, instructor in small caps. Sage rule above
// each entry like a torn program. Used 3-4× across the site at section
// transitions to give the page a sense of place.
//
// Optional `avatarSrc` adds a small circular portrait of the instructor at
// the right edge — humanises the signature element without it stealing
// focus from the typography.

import Image from "next/image";

type Entry = {
  time: string;        // "06:30"
  className: string;   // "Sunrise Vinyasa"
  instructor: string;  // "Sarah"
  note?: string;       // optional one-word state — "full", "8/8", "private"
  avatarSrc?: string;  // optional /seo/photos/avatar-N.jpg
};

type Props = {
  eyebrow?: string;
  entries: Entry[];
  align?: "left" | "center";
};

export function StudioDay({ eyebrow, entries, align = "left" }: Props) {
  return (
    <div
      className={
        "max-w-3xl mx-auto " +
        (align === "center" ? "text-center" : "text-left")
      }
    >
      {eyebrow && (
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-6">
          {eyebrow}
        </div>
      )}
      <dl className="space-y-3">
        {entries.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 md:gap-x-6 border-t border-primary/15 pt-3 first:border-t-0 first:pt-0"
          >
            <dt
              className="font-mono text-sm md:text-base text-foreground tabular-nums self-baseline"
              aria-label={`${e.time} class`}
            >
              {e.time}
            </dt>
            <dd className="font-display italic text-xl md:text-2xl tracking-tight text-foreground/90 self-baseline">
              {e.className}
            </dd>
            <dd className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap self-baseline">
              {e.note ? (
                <span className="text-primary/80 mr-3">{e.note}</span>
              ) : null}
              with {e.instructor}
            </dd>
            <dd className="size-10 md:size-11 shrink-0">
              {e.avatarSrc ? (
                <div className="relative size-full rounded-full overflow-hidden ring-1 ring-primary/20 shadow-sm">
                  <Image
                    src={e.avatarSrc}
                    alt={`${e.instructor}, ${e.className} teacher`}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="size-full rounded-full bg-secondary/40 ring-1 ring-border" />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
