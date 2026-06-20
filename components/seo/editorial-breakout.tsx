// A transitional moment between sections. Single sentence in Fraunces italic
// with a sage hairline above and below — feels like a margin note in a
// well-printed program. Use sparingly; one per page max.

type Props = {
  children: React.ReactNode;
  attribution?: string;
};

export function EditorialBreakout({ children, attribution }: Props) {
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
