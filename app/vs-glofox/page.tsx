import { ComparisonPage } from "@/components/seo/comparison-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glofox Alternative for Boutique Yoga & Pilates Studios",
  description:
    "Glofox is gym-focused. YogaTeacher is boutique-studio-focused. Run memberships, classes and payments without the gym overhead. From $29/mo.",
  alternates: { canonical: "https://www.yogateacherapp.com/vs-glofox" },
  openGraph: {
    title: "Glofox Alternative — YogaTeacher",
    description:
      "Built for boutique yoga and pilates studios, not gyms. Cleaner UI, simpler pricing.",
    url: "https://www.yogateacherapp.com/vs-glofox",
    type: "website",
  },
};

export default function VsGlofox() {
  return (
    <ComparisonPage
      competitor="Glofox"
      competitorSlug="glofox"
      tagline="Glofox is built for gyms. YogaTeacher is built for studios."
      intro="Glofox (now part of ABC Fitness) is built primarily for boutique gyms and HIIT studios. The product shape — recurring gym memberships, class-pass-style booking, gym-floor check-in — doesn't always fit a yoga or pilates studio. YogaTeacher does."
      lastUpdated="May 2026"
      reasons={[
        {
          title: "Built for the discipline",
          body: "Glofox's UI was designed for HIIT and CrossFit; class packs and credit-based booking are bolted on. YogaTeacher treats class packs, credits and recurring memberships as first-class.",
        },
        {
          title: "Pricing model",
          body: "Glofox doesn't publish pricing — every studio negotiates a custom quote, often $150+/month with annual contracts. YogaTeacher is $29/month, listed publicly, cancel anytime.",
        },
        {
          title: "Onboarding",
          body: "Glofox requires sales calls and onboarding sessions. YogaTeacher: sign up at /sign-up, you're live in under an hour.",
        },
      ]}
      rows={[
        { feature: "Monthly cost (entry)", us: "$29", them: "Custom (often $150+)" },
        { feature: "Public pricing", us: true, them: false },
        { feature: "Sales call required", us: false, them: true },
        { feature: "Contract length", us: "Monthly", them: "Annual common" },
        { feature: "Built for yoga + pilates", us: true, them: "partial" },
        { feature: "Class packs", us: true, them: true },
        { feature: "Recurring memberships", us: true, them: true },
        { feature: "PayPal support", us: true, them: false },
        { feature: "Stripe support", us: true, them: true },
        { feature: "Razorpay support", us: true, them: false },
        { feature: "Instructor portal", us: true, them: "partial" },
        { feature: "Public booking page (PWA)", us: true, them: "partial" },
        { feature: "Multi-location", us: true, them: true },
        { feature: "Free trial", us: "30 days", them: "Demo only" },
        { feature: "Multi-currency (18 supported)", us: true, them: true },
      ]}
      migrationSteps={[
        {
          day: "1",
          body: "Ask Glofox for a full data export. They typically provide CSVs for members, memberships and bookings on request.",
        },
        {
          day: "2",
          body: "Sign up for YogaTeacher and CSV-import members.",
        },
        {
          day: "3",
          body: "Re-create your class types, packages and weekly schedule.",
        },
        {
          day: "4",
          body: "Connect PayPal, Stripe or Razorpay.",
        },
        {
          day: "5",
          body: "Notify members of the new booking link.",
        },
        {
          day: "6",
          body: "Run both for 24 hours.",
        },
        {
          day: "7",
          body: "Notify Glofox to end your contract (check your annual-contract terms — there may be a notice period).",
        },
      ]}
      faqs={[
        {
          question: "Is Glofox or YogaTeacher better for a yoga studio?",
          answer:
            "For a boutique yoga or pilates studio, YogaTeacher. Glofox is optimized for HIIT, CrossFit and gym-floor membership models. The class-pack and reformer-capacity flows in YogaTeacher were built specifically for studio classes, not gym sessions.",
        },
        {
          question: "Can I leave Glofox mid-contract?",
          answer:
            "Depends on your contract terms. Most Glofox contracts are annual with a 30–60-day notice period. Read your agreement; if you're past the notice window, you can switch immediately to YogaTeacher and let the Glofox contract wind down in parallel.",
        },
        {
          question: "Does YogaTeacher support gym-style perpetual memberships?",
          answer:
            "Yes — unlimited monthly with auto-renew works the same. The difference is YogaTeacher's UI doesn't push you toward gym-shaped flows (lead capture, sales funnels, fitness challenges).",
        },
        {
          question: "How much will I save?",
          answer:
            "Glofox doesn't publish pricing, but typical boutique-studio quotes are $120–200/month. Switching to YogaTeacher saves $90–170/month — about $1,000–$2,000/year.",
        },
        {
          question: "Does YogaTeacher integrate with my access-control hardware?",
          answer:
            "Not currently. If you use a door-access system tied to membership status, you'll need a CSV bridge from YogaTeacher exports. For most yoga and pilates studios this isn't a use case; for hybrid studios it might be a blocker.",
        },
        {
          question: "How long does migration take?",
          answer:
            "1–3 days for the platform switch; longer if you need to coordinate end-of-contract timing with Glofox.",
        },
      ]}
    />
  );
}
