// Centralised SEO copy — keeps page files focused on layout, copy auditable
// in one place. When Tyron edits text, he edits here.

import type { FaqItem } from "@/components/seo/faq";

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    question: "What is yoga studio management software?",
    answer:
      "Yoga studio management software is a single tool that handles bookings, memberships, payments and instructor scheduling for a yoga or pilates studio — replacing the patchwork of WhatsApp, spreadsheets and a separate payment app most studios use day-to-day.",
  },
  {
    question: "How does YogaTeacher compare to Mindbody?",
    answer:
      "YogaTeacher gives you the essentials — bookings, memberships, payments, instructor management — without the complexity or the $159/month price tag. Most studios switch in under a week. Mindbody is built for the gym; YogaTeacher is built for boutique yoga and pilates studios.",
  },
  {
    question: "Can I use YogaTeacher for a pilates studio?",
    answer:
      "Yes. YogaTeacher is built for both yoga and pilates studios. Reformer schedules, private sessions, mat classes, and equipment-based pilates packs are all first-class features — the same UI runs both disciplines.",
  },
  {
    question: "Does YogaTeacher handle online payments?",
    answer:
      "Yes. PayPal, Stripe and Razorpay are all built in. Funds settle directly to your studio's payment account — YogaTeacher never touches the money. You bring your own processor account and connect it in Settings.",
  },
  {
    question: "Can YogaTeacher manage multiple studio locations?",
    answer:
      "Yes. The $79/month Multi-Studio plan supports as many locations as you need, with per-location instructors, per-location reporting, and the ability to share memberships across locations if you choose.",
  },
  {
    question: "How long is the free trial?",
    answer:
      "30 days. No credit card required to start. You get the full product — every feature, every integration — for the full month. At day 30 you choose a plan or your studio data is held for 60 days while you decide.",
  },
  {
    question: "Can I migrate from Mindbody, Vagaro, or WellnessLiving?",
    answer:
      "Yes. CSV imports are supported for members, classes and packages. Most migrations complete in under a day — typically a single afternoon for a small studio, a weekend for a multi-location business.",
  },
  {
    question: "Does YogaTeacher include a member-facing booking app?",
    answer:
      "Yes — every studio gets a fast public booking page at yogateacherapp.com/book/your-studio. Members can browse the schedule, book classes, check credit balances and pay — all without downloading an app. The page is PWA-ready, so members can add it to their phone's home screen for an app-like experience.",
  },
  {
    question: "What payment processors does YogaTeacher support?",
    answer:
      "PayPal, Stripe and Razorpay. Each studio brings their own processor account, so you control your funds and your processor fees. PayPal is the default; you can switch in Settings > Payments at any time.",
  },
  {
    question: "Is YogaTeacher GDPR compliant?",
    answer:
      "Yes. Member data is hosted on Neon Postgres in EU-West-2, TLS-encrypted in transit, and we don't sell or share member data with third parties. Studios own their data and can export to CSV at any time. Full details in the privacy policy.",
  },
];
