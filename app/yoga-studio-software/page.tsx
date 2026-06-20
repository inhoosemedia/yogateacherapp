import { FaqSection } from "@/components/seo/faq";
import {
  JsonLd,
  breadcrumbSchema,
  softwareAppSchema,
} from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import { AmbientAtmosphere } from "@/components/seo/ambient-atmosphere";
import { DarkCtaBand } from "@/components/seo/dark-cta-band";
import { EditorialBreakout } from "@/components/seo/editorial-breakout";
import { RevealOnScroll } from "@/components/seo/reveal-on-scroll";
import { StudioDay } from "@/components/seo/studio-day";
import { StudioPhoto } from "@/components/seo/studio-photo";
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
  title: "Yoga Studio Software | Scheduling, Memberships & Payments",
  description:
    "Yoga studio software built for teachers and boutique studios. Online bookings, recurring memberships, automated payments, instructor scheduling, and a free 30-day trial.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/yoga-studio-software",
  },
  openGraph: {
    title: "Yoga Studio Software | YogaTeacher",
    description:
      "The easiest way to run a yoga studio. Bookings, memberships, payments, instructors — one calm app.",
    url: "https://www.yogateacherapp.com/yoga-studio-software",
    type: "website",
  },
};

const FAQS = [
  {
    question: "What is yoga studio software?",
    answer:
      "Yoga studio software is a single platform that handles the day-to-day operations of a yoga studio: class scheduling, online bookings, recurring memberships, package management, instructor scheduling, member payments and attendance tracking. It replaces the manual patchwork of WhatsApp, Google Sheets, a separate calendar app and a third-party payment processor that most independent studios start with.",
  },
  {
    question: "How much does yoga studio software cost?",
    answer:
      "YogaTeacher starts at $29/month for a single studio and $79/month for multi-location. Both plans include unlimited members, unlimited classes, unlimited packages, online booking, and instructor management. There are no setup fees, no transaction fees (your processor charges its standard rate directly), and no contracts. You can cancel any time. Mindbody, by comparison, typically starts around $159/month with annual contracts.",
  },
  {
    question: "Can yoga studio software manage memberships?",
    answer:
      "Yes. YogaTeacher handles drop-in single classes, fixed class packs (5-class, 10-class, 20-class), unlimited monthly memberships, and recurring memberships that auto-renew. Credits decrement automatically when a member books a class and refund automatically when they cancel within your studio's window. Members can self-purchase from your public booking page if you choose to enable it.",
  },
  {
    question: "Does yoga studio software work for solo teachers?",
    answer:
      "Yes — in fact YogaTeacher is built primarily for solo teachers and small boutique studios. The single-studio plan ($29/month) gives a solo teacher everything they need: a public booking page, member self-service, recurring memberships, online payments and a clean dashboard to see who's booked for the week. No multi-employee complexity, no team-management overhead.",
  },
  {
    question: "Can I run multiple yoga studios from one account?",
    answer:
      "Yes. The Multi-Studio plan ($79/month) supports as many locations as you need. Each studio has its own members, its own classes, its own instructors, and its own reporting view. You can share memberships across locations (so a member with an unlimited pass can attend at any of your studios) or keep them isolated. You can also invite team members with role-scoped access — admin, staff or instructor.",
  },
  {
    question: "How do students book classes — through a website or an app?",
    answer:
      "Through a website — every studio gets a fast public booking page at yogateacherapp.com/book/your-studio-slug. Students can browse the weekly schedule, see class details (instructor, duration, capacity), check their package balance, and book in seconds. The page is PWA-ready, so members can add it to their phone's home screen and it behaves like an app. No app-store download required, no per-member app fee.",
  },
  {
    question: "Can yoga studio software integrate with PayPal or Stripe?",
    answer:
      "Yes. YogaTeacher supports PayPal, Stripe and Razorpay out of the box. Each studio brings their own processor account, so you control your funds (they settle directly to your bank — YogaTeacher never holds the money) and your processor fees. You can switch providers in Settings > Payments at any time without losing data.",
  },
  {
    question: "How do I migrate from Mindbody to YogaTeacher?",
    answer:
      "CSV imports for members, classes and packages, plus a manual one-week overlap period where members can book on either platform. Most studios complete the move in 1–3 days. A more detailed migration guide is on the /vs-mindbody page, including a 7-day step-by-step plan.",
  },
];

export default function YogaStudioSoftwarePage() {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Yoga studio software" },
        ]}
      />
      {/* Hero */}
      <section className="relative py-16 px-6 overflow-hidden">
        <AmbientAtmosphere />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            For yoga teachers and boutique studios
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
            Yoga studio software,
            <br />
            <span className="italic text-primary">without the chaos</span>.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bookings, memberships, payments and instructor management in one
            calm app. Built for solo teachers and boutique yoga studios — not
            gyms, not salons, not enterprises.
          </p>
          <div className="mt-9 flex justify-center gap-3 flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 cta-lift">
                Start your 30-day free trial
                <IconArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/vs-mindbody">
              <Button size="lg" variant="outline" className="cta-lift">
                Compare to Mindbody
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Signature: a yoga studio day */}
      <section className="py-16 px-6 border-t border-border/60">
        <RevealOnScroll>
          <div className="text-center text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-10">
            One yoga studio · Tuesday
          </div>
        </RevealOnScroll>
        <StudioDay
          entries={[
            { time: "06:30", className: "Sunrise Vinyasa", instructor: "Sarah", note: "14 / 20" },
            { time: "09:00", className: "Restorative", instructor: "James" },
            { time: "12:00", className: "Lunchtime Flow", instructor: "Sarah", note: "full" },
            { time: "18:00", className: "Slow Yin", instructor: "Priya" },
            { time: "19:30", className: "Candlelit Yoga Nidra", instructor: "Aanya" },
          ]}
        />
      </section>

      {/* Problem */}
      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-6">
            Running a yoga studio gets messy fast.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            You started teaching yoga to share a practice you love. But the
            business side has crept in. Class bookings live in WhatsApp.
            Membership renewals live in a spreadsheet. Payments live half in
            Venmo, half in cash. Instructor schedules live on a paper roster
            on the wall.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Each tool works on its own. Together they create the &quot;Sunday
            afternoon admin&quot; problem: 2–4 hours every week reconciling
            attendance, renewals, payments and no-shows across five different
            apps. Mistakes happen. Members get double-charged or never
            charged. Classes get over-booked or under-attended. You stop
            growing because the back-office can&apos;t keep up.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Yoga studio software replaces all of that with one tool — one
            inbox, one source of truth.
          </p>
        </div>
      </section>

      {/* Solution overview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-12 text-center">
            Everything you need to run a yoga studio,{" "}
            <span className="italic text-primary">in one calm app</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureBlock
              icon={<IconCalendarMonth className="size-5" />}
              title="Class scheduling"
              body="Build recurring weekly schedules. Color-code class types. Assign instructors with one click. The week grid shows every class with its capacity, instructor and a live 'now' line."
              href="/class-scheduling-software"
            />
            <FeatureBlock
              icon={<IconUsers className="size-5" />}
              title="Member management"
              body="Member profiles with photos, contact info, package balances, attendance history and notes. Search across 1,000+ members in under 50ms."
              href="/membership-management-software"
            />
            <FeatureBlock
              icon={<IconCreditCard className="size-5" />}
              title="Recurring memberships"
              body="Drop-ins, 5/10/20-class packs, unlimited monthly. Credits decrement on booking, refund on cancellation. Monthly subscriptions auto-renew."
              href="/membership-management-software"
            />
            <FeatureBlock
              icon={<IconReceipt className="size-5" />}
              title="Online payments"
              body="PayPal, Stripe and Razorpay built in. Funds settle directly to your account. Members self-purchase from the public booking page."
              href="/online-payments"
            />
            <FeatureBlock
              icon={<IconUsers className="size-5" />}
              title="Instructor portal"
              body="Teachers see only their classes, their roster and their check-in flow. No admin permissions, no member-data access beyond what they teach."
              href="/instructor-management"
            />
            <FeatureBlock
              icon={<IconCalendarMonth className="size-5" />}
              title="Public booking + check-in"
              body="A fast PWA-ready page at yogateacherapp.com/book/your-studio. Front-desk check-in for the studio floor."
              href="/check-in-system"
            />
          </div>
        </div>
      </section>

      {/* Online booking — deeper section */}
      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Online booking
            </div>
            <h2 className="font-display text-4xl tracking-tight mb-4">
              Online booking that respects your studio&apos;s flow.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Most yoga studio booking software treats every studio the same —
              same form fields, same flow, same cancellation policy.
              YogaTeacher treats your studio as the source of truth. Set your
              own cancellation window. Decide whether members need to create
              an account or can book as guests. Choose which packages are
              publicly purchasable and which require a teacher to assign.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Members browse the weekly schedule at your URL, self-purchase
              packages with PayPal, Stripe or Razorpay, and book classes in a
              single tap. Credits decrement automatically; cancellations
              within your window refund automatically; waitlists auto-promote
              when a spot opens.
            </p>
            <Link
              href="/yoga-booking-software"
              className="inline-block mt-6 text-primary font-medium hover:underline"
            >
              See full yoga booking features →
            </Link>
          </div>
          <StudioPhoto
            src="/seo/instructor-with-tablet-warrior-class.jpg"
            alt="A yoga instructor checks the class schedule on a tablet while students hold warrior pose in the background"
            width={1024}
            height={1024}
            caption="Class schedule on the studio floor — not stuck behind a desk."
          />
        </div>
      </section>

      {/* Memberships */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Memberships
          </div>
          <h2 className="font-display text-4xl tracking-tight mb-4">
            Recurring memberships that retain students.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-8">
            The economics of a yoga studio live and die on retention. A
            student who joins a monthly unlimited and stays for 8 months is
            worth ~6× the lifetime revenue of a student who buys 10 drop-ins
            once. YogaTeacher is designed to make recurring memberships the
            easy choice for your studio and a frictionless choice for your
            members.
          </p>
          <ul className="grid md:grid-cols-2 gap-4">
            <Bullet>
              <strong>Monthly auto-renew</strong> with member self-service
              cancel (no awkward emails to your studio).
            </Bullet>
            <Bullet>
              <strong>Fixed class packs</strong> (5/10/20) that expire on a
              validity window you set.
            </Bullet>
            <Bullet>
              <strong>Unlimited monthly</strong> with optional class-per-day cap.
            </Bullet>
            <Bullet>
              <strong>Drop-ins</strong> for new students who aren&apos;t ready
              to commit.
            </Bullet>
            <Bullet>
              <strong>Credit refunds</strong> on cancellation within your
              studio&apos;s window.
            </Bullet>
            <Bullet>
              <strong>Manual overrides</strong> for the times you need to grant
              a credit or extend a validity by hand.
            </Bullet>
          </ul>
          <Link
            href="/membership-management-software"
            className="inline-block mt-8 text-primary font-medium hover:underline"
          >
            Read more about membership management →
          </Link>
        </div>
      </section>

      {/* Payments */}
      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Payments
          </div>
          <h2 className="font-display text-4xl tracking-tight mb-4">
            Payments that just work — PayPal, Stripe, Razorpay.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
            YogaTeacher does not touch your money. Each studio brings their
            own PayPal, Stripe or Razorpay account; funds settle directly to
            your bank. We charge no transaction fees; your processor charges
            its standard rate (usually 1.9%–2.9% + a small fixed fee per
            transaction).
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
            This matters because most all-in-one studio platforms layer their
            own 2–4% &quot;platform fee&quot; on top of the processor fee. On
            $10,000/month in member payments that&apos;s an extra $200–400
            you&apos;re paying for the same service.
          </p>
          <Link
            href="/online-payments"
            className="inline-block text-primary font-medium hover:underline"
          >
            See payment processor details →
          </Link>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Instructor management
          </div>
          <h2 className="font-display text-4xl tracking-tight mb-4">
            Pay your teachers without spreadsheets.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Every instructor gets their own portal at /instructor showing only
            their classes and only their rosters. They can mark attendance,
            check students in, and see their own teaching load week by week.
            You get a per-instructor view showing classes taught, students
            attended and a clean export for payroll.
          </p>
          <Link
            href="/instructor-management"
            className="inline-block mt-6 text-primary font-medium hover:underline"
          >
            See instructor management details →
          </Link>
        </div>
      </section>

      {/* Multi-location teaser */}
      <section className="py-20 px-6 bg-secondary/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            From one studio to five
          </div>
          <h2 className="font-display text-4xl tracking-tight mb-4">
            Multi-location yoga studio software, when you&apos;re ready.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
            Start with one studio on the $29/month plan. When you open a second
            location, upgrade in Settings — the second studio joins your
            account in under a minute. Each location has its own slug, its own
            instructors, its own schedule and its own reporting. Memberships
            can be shared across locations or kept isolated; you choose.
          </p>
          <Link
            href="/multi-location"
            className="inline-block text-primary font-medium hover:underline"
          >
            See multi-location features →
          </Link>
        </div>
      </section>

      {/* Why studios switch */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl tracking-tight mb-4">
            Why yoga studios switch{" "}
            <span className="italic text-primary">to YogaTeacher</span>.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-8">
            We talk to a lot of studio owners who&apos;ve already been through
            one or two platforms. The complaints are remarkably consistent.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="font-display text-2xl mb-3">vs Mindbody</div>
              <p className="text-sm text-muted-foreground mb-4">
                $159/month → $29/month. 2-week setup → 1-hour setup. Enterprise
                complexity → boutique-studio simplicity.
              </p>
              <Link
                href="/vs-mindbody"
                className="text-sm text-primary hover:underline"
              >
                Read the comparison →
              </Link>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="font-display text-2xl mb-3">vs Vagaro</div>
              <p className="text-sm text-muted-foreground mb-4">
                Vagaro is built for hair salons and nail studios. YogaTeacher
                is built for yoga and pilates — packages, credits and class
                logic that actually fit.
              </p>
              <Link
                href="/vs-vagaro"
                className="text-sm text-primary hover:underline"
              >
                Read the comparison →
              </Link>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card">
              <div className="font-display text-2xl mb-3">vs WellnessLiving</div>
              <p className="text-sm text-muted-foreground mb-4">
                WellnessLiving covers a huge surface area — too much for most
                boutique studios. YogaTeacher does the essentials and does
                them well.
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

      <EditorialBreakout attribution="Built for studios that breathe">
        Run your yoga studio from one calm dashboard — not from a patchwork
        of WhatsApp, Sheets and Venmo.
      </EditorialBreakout>
      <FaqSection items={FAQS} />
      <DarkCtaBand
        heading="Run your yoga studio without the chaos."
        body="Bookings, memberships, payments and instructors — all in one calm app. Give YogaTeacher a fortnight and see how much quieter your front desk gets."
      />
      <SeoFooter />

      <JsonLd
        data={{
          ...softwareAppSchema,
          name: "YogaTeacher — Yoga Studio Software",
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          {
            name: "Yoga studio software",
            url: "https://www.yogateacherapp.com/yoga-studio-software",
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
