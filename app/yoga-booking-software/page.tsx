import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga Booking Software for Studios & Solo Teachers",
  description:
    "Online yoga booking software with credits, class packs, waitlists, recurring schedules and member payments. PayPal, Stripe, Razorpay supported. Free 30-day trial.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/yoga-booking-software",
  },
  openGraph: {
    title: "Yoga Booking Software for Studios & Solo Teachers",
    description:
      "Online yoga booking software with credits, class packs, waitlists and member payments. Built for solo teachers and boutique studios.",
    url: "https://www.yogateacherapp.com/yoga-booking-software",
    type: "website",
    images: [
      {
        url: "/seo/og-yogateacher-app-on-tablet.jpg",
        width: 1200,
        height: 630,
        alt: "The YogaTeacher booking app on a studio tablet while a class holds warrior pose",
      },
    ],
  },
};

export default function Page() {
  return (
    <FeaturePage
      slug="yoga-booking-software"
      h1="Yoga Booking Software"
      subheadline="Online bookings that respect how your studio actually flows. Class packs, credits, waitlists, member self-service — without the chaos."
      problem={{
        heading: "Yoga bookings on WhatsApp don't scale.",
        body: "When you have 20 students, WhatsApp works. At 50, it strains. At 100, you're spending two evenings a week reconciling who paid for what, who used a credit, who showed up. By 200 you've either hired a part-time admin or built a Google Sheet that no one else understands.\n\nYoga booking software replaces all of that with one source of truth — your studio's schedule, every member's package balance, every booking, every cancellation, every refund, automatically tracked.",
      }}
      solution={{
        heading: "One link your students bookmark. One dashboard you live in.",
        body: "Every studio gets a public booking page at yogateacherapp.com/book/your-studio-slug. Members browse the schedule, see real-time class capacity, check their package balance and book in seconds. You see who's booked for every class, who's checked in, who cancelled and who's on the waitlist — without leaving the dashboard.",
      }}
      bullets={[
        "Public booking page at your studio's URL — PWA-ready, works on every phone",
        "Real-time class capacity so members see how many spots are left",
        "Credits decrement automatically on booking; refund automatically on cancellation",
        "Configurable cancellation window (1h, 6h, 12h, 24h — your studio's call)",
        "Waitlist with auto-promote when a spot opens",
        "Self-purchase packages directly on the booking page",
        "Booking confirmations + class reminders via Resend",
        "Per-class capacity (8 reformer beds vs 20 mat spots)",
        "Member account or guest booking — you choose",
      ]}
      useCases={[
        {
          title: "Solo yoga teacher",
          body: "You teach 6 classes a week from a rented studio. Send members the booking link, stop chasing WhatsApp messages on Sunday afternoons.",
        },
        {
          title: "Boutique studio",
          body: "20 classes a week, 4 instructors, 150 active members. Real-time capacity, instructor portal and a single source of truth.",
        },
        {
          title: "Multi-location",
          body: "Same booking system across every location. Members with shared memberships can book at any studio. Per-location reporting.",
        },
      ]}
      integrationLinks={[
        { label: "Class scheduling", href: "/class-scheduling-software" },
        { label: "Membership management", href: "/membership-management-software" },
        { label: "Online payments", href: "/online-payments" },
        { label: "Member booking app", href: "/customer-app" },
        { label: "Check-in system", href: "/check-in-system" },
      ]}
      faqs={[
        {
          question: "Do members need to download an app to book?",
          answer:
            "No. The public booking page is a Progressive Web App — members can add it to their phone's home screen and it behaves like an app, but they never need to download anything from the App Store or Play Store.",
        },
        {
          question: "Can students book without an account?",
          answer:
            "Yes. You can configure guest bookings (just name + email) or require an account. Most studios require an account for class packs and let guests book single drop-ins.",
        },
        {
          question: "How is the cancellation window set?",
          answer:
            "Per studio, in Settings. Pick 1, 6, 12 or 24 hours before class start. Cancellations inside the window forfeit the credit; outside the window, the credit refunds automatically.",
        },
        {
          question: "Does the waitlist auto-promote?",
          answer:
            "Yes. When a booked student cancels and frees a spot, the first person on the waitlist is auto-promoted and notified by email.",
        },
        {
          question: "Can I customize the booking page design?",
          answer:
            "You can set your studio's logo, your studio's name and a short welcome line. Full custom CSS is not exposed in the free tier; for now, the page inherits the YogaTeacher brand style with your assets layered on top.",
        },
        {
          question: "How do I migrate active bookings from another system?",
          answer:
            "Most studios don't — they announce the new booking link, leave existing bookings to play out on the old system, and let members migrate naturally over 1–2 weeks. For higher-volume studios, the support team can run a manual import.",
        },
      ]}
    />
  );
}
