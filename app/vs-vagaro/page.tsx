import { ComparisonPage } from "@/components/seo/comparison-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vagaro Alternative for Yoga & Pilates Studios",
  description:
    "Vagaro is built for hair salons. YogaTeacher is built for yoga and pilates. Cleaner UX, simpler memberships, lower price. From $29/mo.",
  alternates: { canonical: "https://www.yogateacherapp.com/vs-vagaro" },
  openGraph: {
    title: "Vagaro Alternative for Yoga & Pilates — YogaTeacher",
    description:
      "Class packs, recurring memberships, reformer scheduling. Built for studios, not salons.",
    url: "https://www.yogateacherapp.com/vs-vagaro",
    type: "website",
  },
};

export default function VsVagaro() {
  return (
    <ComparisonPage
      competitor="Vagaro"
      competitorSlug="vagaro"
      tagline="Vagaro is built for salons. YogaTeacher is built for studios."
      intro="Vagaro got its start in hair and nail salons, then bolted on fitness features later. YogaTeacher is built ground-up for boutique yoga and pilates: class packs, capacity-aware bookings, recurring memberships, instructor portals."
      lastUpdated="May 2026"
      reasons={[
        {
          title: "Built for the discipline",
          body: "Vagaro's appointment-shaped logic doesn't map cleanly to class-shaped yoga and pilates. Capacity, credits, packs and recurring memberships feel like add-ons there; they're first-class here.",
        },
        {
          title: "Simpler pricing",
          body: "Vagaro pricing scales by add-ons: payments, email marketing, branded app, website all cost extra. YogaTeacher is $29/month, everything included.",
        },
        {
          title: "Faster onboarding",
          body: "Vagaro asks you to model your studio as a service-provider salon. YogaTeacher's onboarding is: studio name, currency, timezone, done. 5 minutes from sign-up to public booking page live.",
        },
      ]}
      rows={[
        { feature: "Monthly cost (entry)", us: "$29", them: "~$30 + add-ons" },
        { feature: "Built for class-based studios", us: true, them: "partial" },
        { feature: "Reformer/equipment capacity", us: true, them: "partial" },
        { feature: "Class packs as first-class concept", us: true, them: "partial" },
        { feature: "Recurring memberships", us: true, them: "partial" },
        { feature: "PayPal support", us: true, them: false },
        { feature: "Stripe support", us: true, them: true },
        { feature: "Razorpay support", us: true, them: false },
        { feature: "Public booking page (PWA)", us: true, them: "partial" },
        { feature: "Instructor portal", us: true, them: "partial" },
        { feature: "Multi-location", us: true, them: true },
        { feature: "Multi-currency (18 supported)", us: true, them: "partial" },
        { feature: "Free trial", us: "30 days", them: "30 days" },
        { feature: "Contract length", us: "Monthly", them: "Monthly" },
        { feature: "Platform transaction fee", us: "0%", them: "Varies" },
      ]}
      migrationSteps={[
        {
          day: "1",
          body: "Export your client list, services and any subscription data from Vagaro (Reports > Export).",
        },
        {
          day: "2",
          body: "Sign up for YogaTeacher and CSV-import your member list. Re-model your services as class types in YogaTeacher (e.g. 'Reformer 50', 'Mat Flow', 'Private').",
        },
        {
          day: "3",
          body: "Build your weekly schedule. Set capacity per class type. Set up your packages: drop-in, 10-class pack, unlimited monthly.",
        },
        {
          day: "4",
          body: "Connect your payment processor. Test a $1 purchase end-to-end.",
        },
        {
          day: "5",
          body: "Announce the new booking link to your members. Vagaro doesn't auto-migrate appointments, so send a clear cut-over date.",
        },
        {
          day: "6",
          body: "Run both systems for 24 hours. Most members switch to the simpler page within a session.",
        },
        {
          day: "7",
          body: "Cancel Vagaro. Reclaim the calm.",
        },
      ]}
      faqs={[
        {
          question: "Is YogaTeacher better than Vagaro for a yoga studio?",
          answer:
            "For a yoga or pilates studio, yes — YogaTeacher is purpose-built for class-based bookings, packs and capacity. Vagaro shines for appointment-based businesses (hair, nails, massage); the fitness features feel grafted on.",
        },
        {
          question: "Can I import my Vagaro client list?",
          answer:
            "Yes. Export from Vagaro as CSV, then use YogaTeacher's Members > Import. Most studios complete the data migration in under an hour.",
        },
        {
          question: "Does YogaTeacher handle reformer pilates?",
          answer:
            "Yes. Each class type has its own capacity (e.g. 8 reformer beds vs 20 mat spots) and the public booking page shows real-time availability per class.",
        },
        {
          question: "What about email marketing — does Vagaro do that better?",
          answer:
            "Vagaro includes a marketing suite for an extra monthly fee. YogaTeacher focuses on transactional email (bookings, reminders, package expirations) via Resend; for marketing emails, most studios use a dedicated tool like Mailchimp or ConvertKit and connect via CSV export.",
        },
        {
          question: "Does YogaTeacher have a branded mobile app?",
          answer:
            "No — and that's intentional. Branded apps add cost ($50–200/month extra) and friction (your members need to download an app for one studio). YogaTeacher's public booking page is PWA-ready: members add it to their phone home screen and it behaves like an app.",
        },
        {
          question: "How long does migration take?",
          answer:
            "1–3 days for most studios. CSV import handles members; class types and schedules are re-modelled cleanly because YogaTeacher's shape fits class-based studios.",
        },
      ]}
    />
  );
}
