// Four-stat strip — big Fraunces digits, small caps labels. A horizontal
// band between sections, framed by hairline rules top and bottom.
// Numbers are deliberately not annotated metrics — they punctuate the
// brand voice rather than substantiate a claim.

export function StatsStrip() {
  const stats = [
    { value: "6", label: "apps & spreadsheets replaced" },
    { value: "< 30s", label: "to schedule a week of classes" },
    { value: "0", label: "per-booking fees, ever" },
    { value: "∞", label: "classes on every plan" },
  ];
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 text-center border-y border-border/60 py-12 md:py-16">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl md:text-6xl tracking-tighter text-foreground leading-none">
                {s.value}
              </div>
              <div className="mt-3 text-xs text-muted-foreground leading-relaxed max-w-[18ch] mx-auto">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
