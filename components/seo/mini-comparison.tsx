import Link from "next/link";

// Inline "YogaTeacher vs. that other tool" — a punchy 7-row comparison
// for the homepage. Generic "that other tool" framing (not Mindbody-specific
// — the dedicated /vs-mindbody page does that work). Read this as the
// honest comparison, the kind a yoga studio owner would write themselves.

const ROWS: { label: string; us: string; them: string }[] = [
  { label: "Pricing model", us: "Flat monthly", them: "Per-booking fees" },
  { label: "Setup time", us: "Under an hour", them: "Weeks of onboarding" },
  { label: "Front-desk experience", us: "Calm & quiet", them: "Cluttered dashboards" },
  { label: "Member booking", us: "Two taps", them: "Six screens deep" },
  { label: "Contracts", us: "None, ever", them: "12-month lock-in" },
  { label: "Support", us: "Real humans who teach", them: "Ticket queue" },
];

export function MiniComparison() {
  return (
    <section className="py-20 px-6 border-t border-border/60">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-medium mb-4">
          The honest comparison
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">
          YogaTeacher vs.{" "}
          <span className="italic text-primary">that other tool</span>.
        </h2>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="border border-border/70 rounded-2xl overflow-hidden bg-card shadow-sm">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-secondary/40 border-b border-border/70">
            <div className="py-4 px-6 text-xs uppercase tracking-[0.14em] text-muted-foreground font-medium" />
            <div className="py-4 px-4 text-center font-display text-lg text-primary border-l border-border/50">
              YogaTeacher
            </div>
            <div className="py-4 px-4 text-center text-sm text-muted-foreground font-medium border-l border-border/50">
              That other tool
            </div>
          </div>
          {ROWS.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border/50 last:border-b-0"
            >
              <div className="py-4 px-6 text-sm text-foreground/85">
                {r.label}
              </div>
              <div className="py-4 px-4 text-center text-sm font-medium text-primary bg-primary/5 border-l border-border/40">
                {r.us}
              </div>
              <div className="py-4 px-4 text-center text-sm text-muted-foreground border-l border-border/40">
                {r.them}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground/80 mt-5">
          Want the named-name comparison?{" "}
          <Link
            href="/vs-mindbody"
            className="text-primary hover:underline font-medium"
          >
            Read YogaTeacher vs Mindbody →
          </Link>
        </p>
      </div>
    </section>
  );
}
