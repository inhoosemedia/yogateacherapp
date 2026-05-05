import { DashboardPreview } from "@/components/landing/dashboard-preview";
import {
  GrainOverlay,
  LotusDots,
  SoftBlob,
  SunDecoration,
} from "@/components/landing/decorations";
import { MembersPreview } from "@/components/landing/members-preview";
import { PackagesPreview } from "@/components/landing/packages-preview";
import { WeekCalendarPreview } from "@/components/landing/week-preview";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconCalendarMonth,
  IconCheck,
  IconCreditCard,
  IconFlame,
  IconHeart,
  IconSparkles,
  IconStar,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-foreground overflow-hidden">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-canvas/75 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg"
          >
            <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm shadow-sm">
              ॐ
            </span>
            Asana
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#product" className="hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#plans" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Start free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-32 px-6">
        {/* atmosphere */}
        <SunDecoration className="absolute -top-40 -right-40 w-[800px] h-[800px] text-primary/40 -z-10" />
        <SoftBlob className="absolute top-40 -left-60 w-[700px] h-[700px] text-[#b45f4a]/20 -z-10" />
        <LotusDots className="absolute top-32 right-1/4 w-32 text-primary/30 -z-10" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground mb-7 shadow-2xs">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-medium text-foreground">30 days free</span>
            <span className="text-muted-foreground/60">·</span>
            <span>No credit card required</span>
          </div>
          <h1 className="font-display text-6xl md:text-[88px] leading-[0.95] tracking-tight">
            Run your studio
            <br />
            <span className="italic text-primary relative inline-block">
              with one calm tool.
              <SunDecoration className="absolute -right-12 -top-8 w-24 h-24 text-primary/30 -z-10" />
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Members, classes, instructors, packages, bookings — all the
            back-office of a thriving studio, without the spreadsheet sprawl.
          </p>
          <div className="mt-10 flex justify-center gap-3 flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/15">
                Start your 30-day free trial
                <IconArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
          <ul className="mt-7 flex justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground flex-wrap">
            <Tick>30 days free</Tick>
            <Tick>No credit card up front</Tick>
            <Tick>Cancel anytime</Tick>
            <Tick>Multi-studio ready</Tick>
          </ul>
        </div>

        {/* Floating dashboard preview */}
        <div className="relative max-w-6xl mx-auto mt-20" id="product">
          <div className="absolute inset-x-12 top-12 bottom-0 bg-gradient-to-b from-primary/10 to-transparent blur-2xl -z-10" />
          <div className="relative">
            {/* hovering small previews around the main one */}
            <div className="hidden lg:block absolute -left-16 top-32 w-[300px] rotate-[-6deg] origin-top-right z-20 opacity-95">
              <PackagesPreview />
            </div>
            <div className="hidden lg:block absolute -right-12 bottom-16 w-[320px] rotate-[5deg] origin-top-left z-20 opacity-95">
              <MembersPreview />
            </div>
            <div className="relative max-w-4xl mx-auto">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trusted by / signal ────────────────────────────────── */}
      <section className="py-12 border-y border-border/60 bg-secondary/40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Trusted by boutique studios worldwide
          </div>
          <div className="flex items-center justify-center gap-x-12 gap-y-6 flex-wrap text-muted-foreground/70 font-display text-xl italic">
            <span>Sunrise Yoga</span>
            <span className="opacity-50">·</span>
            <span>Lotus House</span>
            <span className="opacity-50">·</span>
            <span>Stillwater</span>
            <span className="opacity-50">·</span>
            <span>Prana Studio</span>
            <span className="opacity-50">·</span>
            <span>Asana Bandra</span>
            <span className="opacity-50">·</span>
            <span>Open Sky</span>
          </div>
        </div>
      </section>

      {/* ─── Bento features ─────────────────────────────────────── */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              The tools you actually need
            </div>
            <h2 className="font-display text-5xl tracking-tight">
              Built for the way studios{" "}
              <span className="italic text-primary">breathe</span>.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              Every feature designed around the rhythm of a studio day —
              calm, fast, never in your way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FeatureCard
              icon={<IconUsers className="size-5" />}
              title="Members, organised"
              body="Profiles with photos, packages, attendance history, notes, and lifetime spend — all in one calm view."
              tone="sage"
            />
            <FeatureCard
              icon={<IconCalendarMonth className="size-5" />}
              title="Schedule that breathes"
              body="Week calendar with capacity, instructor, color-coded class types. Toggle to a list when you need a recap."
              tone="ochre"
            />
            <FeatureCard
              icon={<IconCreditCard className="size-5" />}
              title="Packages that just work"
              body="Drop-ins, class packs, unlimited memberships. Credits decrement automatically — and refund on cancel."
              tone="terracotta"
            />
            <FeatureCard
              icon={<IconUserCircle className="size-5" />}
              title="Your teaching team"
              body="Track instructors, what they're scheduled to lead, and how they're loaded across the week."
            />
            <FeatureCard
              icon={<IconSparkles className="size-5" />}
              title="One-tap check-in"
              body="A roster designed for the front desk: tap to check in, mark no-shows, restore cancellations — credits stay accurate."
            />
            <FeatureCard
              icon={<IconHeart className="size-5" />}
              title="Multi-studio ready"
              body="Run one studio or twenty. Each studio is its own tenant with isolated data, billing and team."
            />
          </div>
        </div>
      </section>

      {/* ─── Schedule showcase ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-secondary/30 to-canvas">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Schedule
            </div>
            <h2 className="font-display text-5xl leading-tight tracking-tight">
              Your week,{" "}
              <span className="italic text-primary">at a glance</span>.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              The week grid shows every class colored by type, with the
              instructor, capacity bar, and a live &ldquo;now&rdquo; line so you can
              see exactly where the day stands.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <BulletPoint>
                Day, week, list — pick the view that fits the moment.
              </BulletPoint>
              <BulletPoint>
                Color-coded class types you can read across the room.
              </BulletPoint>
              <BulletPoint>
                Capacity and bookings in real time, not yesterday&apos;s export.
              </BulletPoint>
              <BulletPoint>
                Cancel a class and bookings cancel + credits refund automatically.
              </BulletPoint>
            </ul>
          </div>
          <div className="lg:order-1 relative">
            <div className="absolute -inset-8 bg-primary/5 rounded-3xl blur-2xl -z-10" />
            <WeekCalendarPreview />
          </div>
        </div>
      </section>

      {/* ─── Members showcase ──────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Roster
            </div>
            <h2 className="font-display text-5xl leading-tight tracking-tight">
              Every student,
              <br />
              <span className="italic text-primary">in their own light</span>.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              Beautiful member profiles with deterministic gradient avatars,
              live search, status filters, and a single page per student that
              shows their packages, attendance, and notes.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Stat label="Search latency" value="< 50ms" />
              <Stat label="Lookup per click" value="One" />
              <Stat label="Spreadsheets" value="Zero" />
              <Stat label="Cups of chai saved" value="∞" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-[#b45f4a]/8 rounded-3xl blur-2xl -z-10" />
            <MembersPreview />
          </div>
        </div>
      </section>

      {/* ─── Lifestyle imagery + quote ──────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
              <Image
                src="https://picsum.photos/seed/asana-yoga-quote/1200/900"
                alt="Yoga studio scene"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <IconStar className="size-5 text-primary mb-5" />
              <blockquote className="font-display text-2xl md:text-3xl leading-[1.25] tracking-tight">
                &ldquo;We replaced five spreadsheets and two apps with Asana.
                The check-in flow alone gave my front desk{" "}
                <span className="italic text-primary">
                  twenty minutes back
                </span>{" "}
                every morning.&rdquo;
              </blockquote>
              <div className="mt-7 text-sm">
                <div className="font-medium">Priya R.</div>
                <div className="text-muted-foreground">
                  Owner · Sunrise Yoga, Bandra
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Packages preview ──────────────────────────────────── */}
      <section
        className="py-24 px-6 bg-gradient-to-b from-canvas to-secondary/30"
        id="pricing"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Packages
            </div>
            <h2 className="font-display text-5xl leading-tight tracking-tight">
              Sell the way{" "}
              <span className="italic text-primary">your studio sells</span>.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              Drop-ins, ten-class packs, monthly unlimited — your packages,
              your prices, your validity windows. Credits decrement on
              booking. Refunds happen on cancel.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <BulletPoint>
                Unlimited packages with custom credits and validity.
              </BulletPoint>
              <BulletPoint>
                Per-member pricing override at assignment time.
              </BulletPoint>
              <BulletPoint>
                Auto-expiry, auto-decrement, auto-refund.
              </BulletPoint>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-primary/5 rounded-3xl blur-2xl -z-10" />
            <PackagesPreview />
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────── */}
      <section className="py-24 px-6" id="plans">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Pricing
            </div>
            <h2 className="font-display text-5xl tracking-tight">
              Free for 30 days.
              <br />
              <span className="italic text-primary">Then keep going.</span>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              No credit card to start. After your trial, choose a plan that
              matches your studio. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <PricingTier
              name="Studio"
              price="₹2,500"
              cadence="/ month"
              tagline="One studio, unlimited members"
              cta="Start free trial"
              features={[
                "Unlimited members",
                "Unlimited classes & bookings",
                "Public booking link with QR",
                "Class types, instructors, packages",
                "Calendar & list views",
                "All updates included",
              ]}
            />
            <PricingTier
              featured
              name="Multi-studio"
              price="₹6,000"
              cadence="/ month"
              tagline="For owners running multiple locations"
              cta="Start free trial"
              features={[
                "Everything in Studio",
                "Up to 5 studios",
                "Per-studio team members",
                "Cross-studio reporting",
                "Priority support",
                "Custom branding",
              ]}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Need more than 5 studios or have specific needs?{" "}
              <a
                href="mailto:hello@asana.app"
                className="text-primary hover:underline"
              >
                Talk to us
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ─── Stats strip ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <BigStat value="6" label="Modules · all included" />
          <BigStat value="< 30s" label="Studio set up" />
          <BigStat value="0" label="Credit cards required" />
          <BigStat value="∞" label="Studios per account" />
        </div>
      </section>

      {/* ─── Big CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[28px] bg-gradient-to-br from-primary via-primary to-[#2c3a2e] text-primary-foreground p-12 md:p-20 relative overflow-hidden">
            <SunDecoration className="absolute -right-20 -top-20 w-[500px] h-[500px] text-white/30" />
            <LotusDots className="absolute left-12 bottom-12 w-32 text-white/30" />
            <GrainOverlay />
            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-xs text-white/90 mb-6">
                <IconFlame className="size-3.5" />
                Free during your first studio
              </div>
              <h2 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight">
                Tools that{" "}
                <span className="italic">breathe</span>{" "}
                with your day.
              </h2>
              <p className="mt-6 opacity-90 text-base md:text-lg leading-relaxed">
                A check-in flow that doesn&apos;t make members wait. A
                schedule you can read at a glance. Packages that just
                work — together, in one calm dashboard.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/95 shadow-lg gap-2"
                  >
                    Open your studio
                    <IconArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    I have an account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs">
              ॐ
            </span>
            <span className="font-display text-base text-foreground">
              Asana
            </span>
            <span className="text-xs ml-2">
              · The yoga studio operating system
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground">
              Terms
            </Link>
            <span>
              © {new Date().getFullYear()} Asana CRM
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Building blocks ─────────────────────────────────────── */

function FeatureCard({
  icon,
  title,
  body,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone?: "sage" | "ochre" | "terracotta";
}) {
  const tones: Record<string, string> = {
    sage: "bg-[color:var(--chart-1)]/10 text-[color:var(--chart-1)]",
    ochre: "bg-[color:var(--chart-3)]/15 text-[color:var(--chart-3)]",
    terracotta: "bg-[color:var(--chart-2)]/10 text-[color:var(--chart-2)]",
  };
  const cls = tone ? tones[tone] : "bg-primary/10 text-primary";
  return (
    <div className="group rounded-2xl border border-border bg-card p-7 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div
        className={`size-11 rounded-xl flex items-center justify-center ${cls}`}
      >
        {icon}
      </div>
      <h3 className="mt-5 font-display text-2xl tracking-tight">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function BulletPoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <IconCheck className="size-3 text-primary" />
      </span>
      <span className="text-foreground/90 leading-relaxed">{children}</span>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="font-display text-2xl tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-5xl md:text-6xl tracking-tight text-primary">
        {value}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-[0.16em] mt-2">
        {label}
      </div>
    </div>
  );
}

function PricingTier({
  name,
  price,
  cadence,
  tagline,
  features,
  cta,
  featured,
}: {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
}) {
  return (
    <div
      className={
        "relative rounded-3xl p-8 transition-all hover:-translate-y-0.5 " +
        (featured
          ? "bg-gradient-to-br from-primary/[0.07] via-card to-card border-2 border-primary/30 shadow-lg"
          : "bg-card border border-border")
      }
    >
      {featured && (
        <div className="absolute -top-3 left-8">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.16em] shadow-sm">
            Most popular
          </span>
        </div>
      )}
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {name}
        </div>
        <div className="text-sm text-muted-foreground">{tagline}</div>
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-5xl tracking-tight">{price}</span>
        <span className="text-sm text-muted-foreground">{cadence}</span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        After your 30-day free trial
      </div>
      <ul className="mt-7 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span className="mt-0.5 size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <IconCheck className="size-3 text-primary" />
            </span>
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link href="/sign-up">
          <Button
            size="lg"
            className="w-full"
            variant={featured ? "default" : "outline"}
          >
            {cta}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Tick({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <IconCheck className="size-3.5 text-primary" />
      {children}
    </li>
  );
}

