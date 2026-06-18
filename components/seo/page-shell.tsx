import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

export function SeoNav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-canvas/75 border-b border-border/60">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg tracking-tight"
        >
          <Image
            src="/logo.png"
            alt="YogaTeacher"
            width={32}
            height={32}
            className="size-8 shadow-sm rounded-full"
            priority
          />
          YogaTeacher
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/yoga-studio-software"
            className="hover:text-foreground transition-colors"
          >
            Yoga
          </Link>
          <Link
            href="/pilates-studio-software"
            className="hover:text-foreground transition-colors"
          >
            Pilates
          </Link>
          <Link
            href="/vs-mindbody"
            className="hover:text-foreground transition-colors"
          >
            vs Mindbody
          </Link>
          <Link
            href="/pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
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
  );
}

export function SeoFooter() {
  return (
    <footer className="border-t border-border/60 py-10 px-6">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-4 gap-6 text-sm text-muted-foreground">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image
              src="/logo.png"
              alt="YogaTeacher"
              width={28}
              height={28}
              className="size-7 rounded-full"
            />
            <span className="font-display text-base text-foreground">
              YogaTeacher
            </span>
          </div>
          <p className="text-xs">The yoga teacher&apos;s app.</p>
        </div>
        <div>
          <div className="text-foreground font-medium mb-3 text-xs uppercase tracking-wider">
            Solutions
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/yoga-studio-software" className="hover:text-foreground">
                Yoga studio software
              </Link>
            </li>
            <li>
              <Link
                href="/pilates-studio-software"
                className="hover:text-foreground"
              >
                Pilates studio software
              </Link>
            </li>
            <li>
              <Link href="/multi-location" className="hover:text-foreground">
                Multi-location
              </Link>
            </li>
            <li>
              <Link href="/customer-app" className="hover:text-foreground">
                Member booking app
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-foreground font-medium mb-3 text-xs uppercase tracking-wider">
            Compare
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/vs-mindbody" className="hover:text-foreground">
                vs Mindbody
              </Link>
            </li>
            <li>
              <Link href="/vs-vagaro" className="hover:text-foreground">
                vs Vagaro
              </Link>
            </li>
            <li>
              <Link href="/vs-wellnessliving" className="hover:text-foreground">
                vs WellnessLiving
              </Link>
            </li>
            <li>
              <Link href="/vs-momence" className="hover:text-foreground">
                vs Momence
              </Link>
            </li>
            <li>
              <Link href="/vs-glofox" className="hover:text-foreground">
                vs Glofox
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-foreground font-medium mb-3 text-xs uppercase tracking-wider">
            Resources
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/customers" className="hover:text-foreground">
                Customer stories
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-foreground">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-foreground">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-border/40 text-xs text-muted-foreground/70 flex items-center justify-between flex-wrap gap-3">
        <span>© 2026 YogaTeacher · Inhoose Media</span>
        <span>Made with care for studios that breathe.</span>
      </div>
    </footer>
  );
}

export function SeoCtaBlock({
  title = "Ready to run your studio without the chaos?",
  body = "Start your 30-day free trial. No credit card. No demo calls. Cancel any time.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="py-20 px-6 border-t border-border/60">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">{body}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/15">
              Start your 30-day free trial
              <IconArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              See pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SeoBreadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-5xl mx-auto px-6 pt-6 text-xs text-muted-foreground"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 && <span className="opacity-50">/</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-foreground">
                {it.label}
              </Link>
            ) : (
              <span className="text-foreground">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
