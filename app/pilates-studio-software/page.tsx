import { FaqSection } from "@/components/seo/faq";
import {
  JsonLd,
  breadcrumbSchema,
  softwareAppSchema,
} from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoCtaBlock,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconCalendarMonth,
  IconCheck,
  IconCreditCard,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pilates Studio Software for Scheduling & Memberships",
  description:
    "Pilates studio software for class scheduling, recurring memberships, online bookings and member payments. Reformer and mat — same calm app. Free 30-day trial.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/pilates-studio-software",
  },
  openGraph: {
    title: "Pilates Studio Software | YogaTeacher",
    description:
      "Reformer schedules, 10-class packs, private 1-on-1 bookings — built for boutique pilates studios.",
    url: "https://www.yogateacherapp.com/pilates-studio-software",
    type: "website",
  },
};

const FAQS = [
  {
    question: "What is pilates studio software?",
    answer:
      "Pilates studio software is a single platform that handles the operational side of a pilates studio: reformer and mat class scheduling, online bookings, fixed class packs (typical pilates pricing), recurring memberships, instructor scheduling, member payments and attendance tracking. It replaces the manual workflow of paper schedules, WhatsApp bookings, spreadsheets and a separate payment app.",
  },
  {
    question: "How much does pilates studio software cost?",
    answer:
      "YogaTeacher starts at $29/month for a single pilates studio and $79/month for multi-location. Both plans include unlimited members, unlimited classes, unlimited packages, online booking and instructor management. There are no setup fees, no transaction fees beyond what your processor charges, and no contracts. By contrast, Mindbody pricing typically starts around $159/month with annual commitments.",
  },
  {
    question: "Can pilates studio software handle reformer scheduling?",
    answer:
      "Yes. Each pilates class type can have its own capacity (e.g. 8 reformer beds, 20 mat spots), its own duration, and its own color in the schedule. The week grid shows reformer classes and mat classes side by side with separate capacity bars so you can see at a glance whether your reformer beds are filling up.",
  },
  {
    question: "Can I run private and group pilates classes from the same system?",
    answer:
      "Yes. Private 1-on-1 sessions are just classes with a capacity of 1. You can create a 'Private' class type, assign your senior instructors, and let members self-book privates from the public booking page — or restrict them to require teacher assignment.",
  },
  {
    question: "Does pilates studio software support multiple instructors?",
    answer:
      "Yes. Each instructor gets their own portal showing only their classes and their rosters. They can mark attendance, check students in, and see their teaching load week by week. You get a per-instructor view for payroll: classes taught, students attended, ready to export to CSV.",
  },
  {
    question: "How do clients book a pilates session?",
    answer:
      "Through a fast public booking page at yogateacherapp.com/book/your-studio-slug. Clients browse your weekly schedule, see class details (instructor, equipment type, duration, capacity), check their package balance, and book in seconds. The page is PWA-ready, so clients can add it to their phone's home screen.",
  },
  {
    question: "Can the software handle pilates 10-class packs?",
    answer:
      "Yes — fixed class packs (5/10/20 sessions) are a first-class concept. You set the price, the validity window (typically 60–90 days for pilates), and whether unused credits expire or roll over. Credits decrement automatically when a member books a class and refund automatically when they cancel within your studio's window.",
  },
  {
    question: "How do I migrate from Pilates Anytime or Mindbody?",
    answer:
      "CSV imports for members, classes and packages, plus a one-week overlap period where members can book on either platform. Most pilates studios complete the move in 1–3 days — the data shapes (member, class pack, attendance) translate cleanly.",
  },
];

export default function PilatesStudioSoftwarePage() {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Pilates studio software" },
        ]}
      />
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            For pilates instructors and boutique pilates studios
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            Pilates studio software,
            <br />
            <span className="italic text-primary">built for the discipline</span>.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reformer schedules, 10-class packs, mat sessions, private 1-on-1s
            — managed from one calm app. Built for boutique pilates studios,
            not gyms.
          </p>
          <div className="mt-9 flex justify-center gap-3 flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Start your 30-day free trial
                <IconArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/vs-mindbody">
              <Button size="lg" variant="outline">
                Compare to Mindbody
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-6">
            Pilates is not yoga. It&apos;s not gym either.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Most studio software is built for one of two shapes: high-volume
            drop-in yoga (Mindbody, Glofox) or hair-salon-style appointments
            (Vagaro). Pilates falls in between. Your reformer classes have
            small capacities. Your 10-class packs have specific validity
            windows. Your privates need 1-on-1 booking. Your members care
            about which instructor — sometimes more than which time.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            YogaTeacher was built with the understanding that pilates needs
            its own flow. Reformer-class capacity. Equipment-specific
            scheduling. Mat-vs-equipment package pricing. Instructor-specific
            roster views. The whole product respects how pilates studios
            actually work.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-12 text-center">
            Everything a pilates studio needs,{" "}
            <span className="italic text-primary">without the gym overhead</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureBlock
              icon={<IconCalendarMonth className="size-5" />}
              title="Reformer + mat scheduling"
              body="Each class type has its own capacity, duration and color. Reformer classes show available beds; mat classes show available spots. Both in the same week grid."
              href="/class-scheduling-software"
            />
            <FeatureBlock
              icon={<IconUsers className="size-5" />}
              title="Private session booking"
              body="Privates are classes with capacity 1. Senior instructors can be auto-assigned. Members self-book privates from the public booking page — or you require teacher assignment."
              href="/yoga-booking-software"
            />
            <FeatureBlock
              icon={<IconCreditCard className="size-5" />}
              title="Class packs that fit pilates pricing"
              body="5-class, 10-class, 20-class packs with custom validity windows (60–90 days is typical for pilates). Unused credits expire or roll over — you decide."
              href="/membership-management-software"
            />
            <FeatureBlock
              icon={<IconReceipt className="size-5" />}
              title="Online payments — PayPal, Stripe, Razorpay"
              body="Members self-purchase class packs from the public booking page. Funds settle to your account, not ours. No platform transaction fees on top."
              href="/online-payments"
            />
            <FeatureBlock
              icon={<IconUsers className="size-5" />}
              title="Per-instructor portal + payroll"
              body="Each instructor sees only their classes and their roster. You get a per-instructor view for monthly payroll: classes taught, students attended, ready to export."
              href="/instructor-management"
            />
            <FeatureBlock
              icon={<IconCalendarMonth className="size-5" />}
              title="Public booking page"
              body="A fast PWA-ready page at yogateacherapp.com/book/your-studio. Members browse, check credits, book. No app to download, no per-member fee."
              href="/customer-app"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Reformer scheduling
            </div>
            <h2 className="font-display text-4xl tracking-tight mb-4">
              Built for studios with limited reformer beds.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              The biggest scheduling pain in a pilates studio is reformer
              capacity. You have 6, 8 or 10 beds. Sessions are 50 or 55
              minutes. Reformer classes need to be back-to-back without
              over-booking, but you also want the booking page to let members
              see exactly how many spots are open.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              YogaTeacher&apos;s capacity bars show this in real time on both
              the admin schedule and the public booking page. A student sees
              &quot;6/8 booked&quot; before they reserve their spot — and the
              moment the 8th student books, the class disappears from the
              public list.
            </p>
          </div>
          <ul className="space-y-3 text-base">
            <Bullet>Per-class capacity (8 beds vs 20 mat spots)</Bullet>
            <Bullet>Real-time capacity bars on schedule and booking page</Bullet>
            <Bullet>Auto-close on capacity, auto-promote from waitlist</Bullet>
            <Bullet>Back-to-back reformer scheduling without bed conflicts</Bullet>
            <Bullet>Separate class types for reformer, mat, tower, chair</Bullet>
            <Bullet>Instructor-specific scheduling — easy to see &quot;all of Sarah&apos;s reformer classes this week&quot;</Bullet>
          </ul>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Class packs + memberships
          </div>
          <h2 className="font-display text-4xl tracking-tight mb-4">
            Pricing that matches how pilates actually sells.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
            Pilates pricing is different from yoga. Drop-ins are rare —
            most members buy 10-class packs or commit to unlimited monthly.
            Pack validity windows are tighter (60 days is common). YogaTeacher
            makes all of this configurable per package, per studio.
          </p>
          <ul className="grid md:grid-cols-2 gap-4">
            <Bullet>
              <strong>5/10/20-class packs</strong> with custom validity windows
            </Bullet>
            <Bullet>
              <strong>Unlimited monthly</strong> with optional class-per-day cap
            </Bullet>
            <Bullet>
              <strong>Reformer-only packs</strong> separated from mat packs if you choose
            </Bullet>
            <Bullet>
              <strong>Private session credits</strong> as their own package type
            </Bullet>
            <Bullet>
              <strong>Auto-renew</strong> on monthly subscriptions
            </Bullet>
            <Bullet>
              <strong>Member self-service</strong> cancel, purchase, top-up
            </Bullet>
          </ul>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-4">
            Why pilates studios switch{" "}
            <span className="italic text-primary">to YogaTeacher</span>.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="font-display text-2xl mb-3">vs Mindbody</div>
              <p className="text-sm text-muted-foreground mb-4">
                Cheaper, faster setup, simpler UI. Mindbody&apos;s reformer
                booking flow takes 5 taps; YogaTeacher takes 2.
              </p>
              <Link
                href="/vs-mindbody"
                className="text-sm text-primary hover:underline"
              >
                Read the comparison →
              </Link>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="font-display text-2xl mb-3">vs Glofox</div>
              <p className="text-sm text-muted-foreground mb-4">
                Glofox is gym-software. Class packs feel bolted on, reformer
                capacity isn&apos;t a first-class concept.
              </p>
              <Link
                href="/vs-glofox"
                className="text-sm text-primary hover:underline"
              >
                Read the comparison →
              </Link>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="font-display text-2xl mb-3">vs WellnessLiving</div>
              <p className="text-sm text-muted-foreground mb-4">
                WellnessLiving tries to do everything for everyone. YogaTeacher
                does pilates well and stops there.
              </p>
              <Link
                href="/vs-wellnessliving"
                className="text-sm text-primary hover:underline"
              >
                Read the comparison →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={FAQS} />
      <SeoCtaBlock title="Run your pilates studio without the gym-software bloat." />
      <SeoFooter />

      <JsonLd
        data={{
          ...softwareAppSchema,
          name: "YogaTeacher — Pilates Studio Software",
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          {
            name: "Pilates studio software",
            url: "https://www.yogateacherapp.com/pilates-studio-software",
          },
        ])}
      />
    </main>
  );
}

function FeatureBlock({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <div className="border border-border rounded-2xl p-6 bg-card hover:shadow-md transition-shadow">
      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="font-display text-2xl mb-2">{title}</div>
      <p className="text-muted-foreground leading-relaxed mb-3">{body}</p>
      <Link href={href} className="text-sm text-primary hover:underline">
        Learn more →
      </Link>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <IconCheck className="size-5 text-primary mt-0.5 shrink-0" />
      <span className="text-muted-foreground leading-relaxed">{children}</span>
    </li>
  );
}
