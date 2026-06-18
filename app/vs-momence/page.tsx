import { ComparisonPage } from "@/components/seo/comparison-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Momence Alternative for Yoga & Pilates Studios",
  description:
    "A simpler, more mature Momence alternative for yoga and pilates studios. Built-in PayPal, Stripe, Razorpay. From $29/mo. Free 30-day trial.",
  alternates: { canonical: "https://www.yogateacherapp.com/vs-momence" },
  openGraph: {
    title: "Momence Alternative — YogaTeacher",
    description:
      "Mature, focused yoga + pilates software with built-in PayPal, Stripe and Razorpay.",
    url: "https://www.yogateacherapp.com/vs-momence",
    type: "website",
  },
};

export default function VsMomence() {
  return (
    <ComparisonPage
      competitor="Momence"
      competitorSlug="momence"
      tagline="Momence is newer. YogaTeacher is calmer."
      intro="Momence is a fast-moving newcomer with lots of features being added. YogaTeacher takes a different approach: do the essentials well, ship slowly, charge fairly. The result is a more predictable tool for a studio that wants to focus on teaching, not on adopting platform updates."
      lastUpdated="May 2026"
      reasons={[
        {
          title: "Stability",
          body: "Momence ships fast — which is great when you want the newest feature, less great when last week's UI gets replaced. YogaTeacher's product surface is narrower and changes slowly.",
        },
        {
          title: "Payment processors",
          body: "Momence relies primarily on Stripe. YogaTeacher supports PayPal (default), Stripe and Razorpay — each studio brings their own account, so you control fees and payouts.",
        },
        {
          title: "Pricing model",
          body: "Momence has tiered pricing with feature gates between plans. YogaTeacher is flat: $29/month single studio, $79/month multi — everything included, no upsells.",
        },
      ]}
      rows={[
        { feature: "Monthly cost (entry)", us: "$29", them: "~$30–$80" },
        { feature: "Online booking page", us: true, them: true },
        { feature: "Class packs", us: true, them: true },
        { feature: "Recurring memberships", us: true, them: true },
        { feature: "PayPal support", us: true, them: false },
        { feature: "Stripe support", us: true, them: true },
        { feature: "Razorpay support", us: true, them: false },
        { feature: "Instructor portal", us: true, them: true },
        { feature: "Multi-location", us: true, them: true },
        { feature: "Public booking page (PWA)", us: true, them: true },
        { feature: "Multi-currency (18 supported)", us: true, them: "partial" },
        { feature: "Free trial", us: "30 days", them: "30 days" },
        { feature: "Contract length", us: "Monthly", them: "Monthly" },
        { feature: "Platform transaction fee", us: "0%", them: "Varies" },
        { feature: "Open API", us: "Planned", them: true },
      ]}
      migrationSteps={[
        {
          day: "1",
          body: "Export your member list and class history from Momence.",
        },
        {
          day: "2",
          body: "Sign up for YogaTeacher, import members via CSV.",
        },
        {
          day: "3",
          body: "Re-create class types and packages. Connect your payment processor.",
        },
        {
          day: "4",
          body: "Build the weekly schedule. Test the public booking page.",
        },
        {
          day: "5",
          body: "Send members the new booking link.",
        },
        {
          day: "6",
          body: "Run both for 24 hours.",
        },
        {
          day: "7",
          body: "Turn off Momence renewals.",
        },
      ]}
      faqs={[
        {
          question: "Why would I leave Momence for YogaTeacher?",
          answer:
            "Two reasons we hear most: payment-processor choice (Momence is Stripe-only; YogaTeacher supports PayPal, Stripe and Razorpay) and pricing predictability (YogaTeacher is flat; Momence has feature-gated tiers).",
        },
        {
          question: "Is YogaTeacher cheaper than Momence?",
          answer:
            "Depending on the plan tier you'd need on Momence, YogaTeacher is typically $0–$50/month cheaper. For a single boutique studio, the savings work out to a few hundred dollars a year.",
        },
        {
          question: "Can I import my Momence data?",
          answer:
            "Yes. Momence exports members and class history as CSV. YogaTeacher's CSV import handles members and packages directly; class history is informational rather than operational so most studios don't bother re-importing it.",
        },
        {
          question: "Does YogaTeacher have a built-in API?",
          answer:
            "A public API is on the roadmap, not yet shipped. Most studios don't need one — webhooks are available for Stripe payment events; member sync to external tools is via CSV export.",
        },
        {
          question: "What about Momence's marketing automations?",
          answer:
            "YogaTeacher focuses on transactional email (bookings, reminders). For marketing campaigns, most studios connect a dedicated tool (Mailchimp, ConvertKit) via CSV member export.",
        },
        {
          question: "How long does migration take?",
          answer:
            "1–3 days. Largest task is re-modelling class types and packages.",
        },
      ]}
    />
  );
}
