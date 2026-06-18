import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilates Booking Software | Online Class Reservations",
  description:
    "Pilates booking software for mat, reformer and equipment classes. Online reservations, waitlists, class packs and member payments — all in one.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/pilates-booking-software",
  },
};

export default function Page() {
  return (
    <FeaturePage
      slug="pilates-booking-software"
      h1="Pilates Booking Software"
      subheadline="Reformer beds. Mat spots. Private sessions. 10-class packs. Online reservations that fit how pilates studios actually sell."
      problem={{
        heading: "Pilates studios have a capacity problem and a pricing problem.",
        body: "Reformer classes have 6, 8 or 10 beds. Mat classes have 20 spots. Privates are 1-on-1. Your students mostly buy 10-class packs or unlimited monthly, not drop-ins. Most studio software treats all of this as 'a class' with one capacity field.\n\nPilates booking software treats class types as distinct shapes — each with its own capacity, its own pricing, its own validity rules.",
      }}
      solution={{
        heading: "Class types built for pilates.",
        body: "Create separate class types for Reformer 50, Mat Flow, Tower, Chair, Private 60. Set capacity per type (8 beds, 20 mats, 1 for privates). Set duration per type. Set pricing tiers — reformer-only packs, mat-only packs, mixed packs.\n\nMembers see real-time availability per class. They book in 2 taps. Credits decrement from the right pack automatically.",
      }}
      bullets={[
        "Per-class-type capacity (8 reformer beds, 20 mat spots, 1 for privates)",
        "Real-time availability bars on the booking page",
        "5-class, 10-class and 20-class packs with custom validity windows",
        "Reformer-only and mat-only pack options",
        "Auto-promote from waitlist when a spot opens",
        "Configurable cancellation window per studio",
        "Booking confirmations + class reminders via Resend",
        "Self-purchase packages from the public booking page",
        "Public booking PWA — no app to download",
      ]}
      useCases={[
        {
          title: "Reformer-focused studio",
          body: "8 reformer beds, 30 classes a week. Members buy 10-class packs that expire in 60 days. Capacity bars on the booking page show real-time availability.",
        },
        {
          title: "Mixed mat + reformer",
          body: "20-spot mat classes and 8-bed reformer classes. Separate packages or mixed-use packs — your choice.",
        },
        {
          title: "Privates + group",
          body: "Group classes for retention, privates for revenue. Both flow through the same booking page. Senior instructors flagged for privates.",
        },
      ]}
      integrationLinks={[
        { label: "Pilates studio software", href: "/pilates-studio-software" },
        { label: "Class scheduling", href: "/class-scheduling-software" },
        { label: "Memberships", href: "/membership-management-software" },
        { label: "Online payments", href: "/online-payments" },
      ]}
      faqs={[
        {
          question: "Does pilates booking software handle reformer class capacity?",
          answer:
            "Yes. Each class type sets its own capacity. A reformer class can be capped at 8 (or whatever your bed count is); a mat class can be capped at 20. The booking page shows real-time availability and stops accepting bookings when the class is full.",
        },
        {
          question: "Can I sell reformer-only class packs?",
          answer:
            "Yes. Class packs can be restricted to specific class types. Sell a 10-pack of reformer-only credits, a 10-pack of mat-only credits, or a mixed-use pack that decrements from either type.",
        },
        {
          question: "How are privates handled?",
          answer:
            "As classes with a capacity of 1. Set up a 'Private 60' class type, assign your senior instructors, and let members self-book — or restrict private booking to require teacher approval.",
        },
        {
          question: "Can a member be on the waitlist for multiple reformer classes?",
          answer:
            "Yes. The waitlist auto-promotes them to the first class that frees a spot, and removes them from the others to avoid double-bookings.",
        },
        {
          question: "How do I migrate from Pilates Anytime or Mindbody?",
          answer:
            "CSV imports for members, classes and packages. Most pilates studios complete the move in 1–3 days because the data shapes — members, packs, sessions — translate cleanly.",
        },
        {
          question: "Does the booking page work on mobile?",
          answer:
            "Yes. The page is mobile-first and PWA-ready, so members can add it to their phone's home screen and use it like an app.",
        },
      ]}
    />
  );
}
