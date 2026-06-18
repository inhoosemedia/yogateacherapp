import { ComparisonPage } from "@/components/seo/comparison-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Best Mindbody Alternative for Yoga & Pilates Studios",
  description:
    "Looking for a Mindbody alternative? YogaTeacher gives you bookings, memberships, payments and instructor management without the complexity or the $159/month price tag.",
  alternates: { canonical: "https://www.yogateacherapp.com/vs-mindbody" },
  openGraph: {
    title: "Mindbody Alternative for Yoga & Pilates — YogaTeacher",
    description:
      "From $29/mo. 1-hour setup. PayPal + Stripe + Razorpay built in. Built for boutique studios, not gyms.",
    url: "https://www.yogateacherapp.com/vs-mindbody",
    type: "website",
  },
};

export default function VsMindbody() {
  return (
    <ComparisonPage
      competitor="Mindbody"
      competitorSlug="mindbody"
      tagline="Mindbody is built for the gym. YogaTeacher is built for you."
      intro="A simpler, cheaper, faster-to-set-up alternative to Mindbody for boutique yoga and pilates studios. Also compare against Momence, Vagaro and WellnessLiving — see how studios are switching across the board."
      lastUpdated="May 2026"
      reasons={[
        {
          title: "Complexity",
          body: "Mindbody is built for studios with 5,000+ members and an admin team. Most boutique studios use 20% of the feature set and pay for 100%. YogaTeacher does what a 50–500-member studio actually needs.",
        },
        {
          title: "Price",
          body: "Mindbody starts around $159/month and climbs with add-ons (member app, marketing suite, custom branding). YogaTeacher is $29/month, all features included, no add-ons.",
        },
        {
          title: "Setup time",
          body: "Mindbody onboarding can take 2–4 weeks with sales calls, training and data migration consultants. YogaTeacher takes under an hour: sign up, create classes, send public booking link.",
        },
      ]}
      rows={[
        { feature: "Monthly cost (entry)", us: "$29", them: "~$159" },
        { feature: "Setup time", us: "< 1 hour", them: "2–4 weeks" },
        { feature: "Contract length", us: "Monthly, cancel anytime", them: "Annual common" },
        { feature: "Free trial", us: "30 days", them: "14 days" },
        { feature: "Online booking page", us: true, them: true },
        { feature: "Recurring memberships", us: true, them: "partial" },
        { feature: "Class packs (5/10/20)", us: true, them: true },
        { feature: "PayPal support", us: true, them: "partial" },
        { feature: "Stripe support", us: true, them: true },
        { feature: "Razorpay support", us: true, them: false },
        { feature: "Instructor portal", us: true, them: true },
        { feature: "Public booking page (PWA)", us: true, them: "partial" },
        { feature: "Multi-currency (18 supported)", us: true, them: true },
        { feature: "CSV import for migration", us: true, them: true },
        { feature: "Platform transaction fee", us: "0%", them: "Varies" },
      ]}
      migrationSteps={[
        {
          day: "1",
          body: "Export members, classes, packages and active memberships from Mindbody as CSV. Mindbody has a built-in export under Settings > Tools.",
        },
        {
          day: "2",
          body: "Sign up for YogaTeacher (30-day free trial, no card). Import members and packages via CSV. Set up your class types, instructors and weekly schedule.",
        },
        {
          day: "3",
          body: "Configure online payments (PayPal, Stripe or Razorpay). YogaTeacher uses your own processor account so funds settle to your bank directly.",
        },
        {
          day: "4",
          body: "Preview your public booking page at yogateacherapp.com/book/your-studio. Test self-purchase with a real card on a $1 test package.",
        },
        {
          day: "5",
          body: "Send a member announcement: 'We're moving to a new booking system. Old packages and class credits transferred automatically.' Include the new booking link.",
        },
        {
          day: "6",
          body: "Run both systems in parallel for 24 hours. Watch which students book where. Most will switch immediately once they see the simpler interface.",
        },
        {
          day: "7",
          body: "Turn off Mindbody auto-renew. Cancel the subscription at the end of your billing cycle. Welcome to the calm side.",
        },
      ]}
      faqs={[
        {
          question: "How is YogaTeacher different from Mindbody?",
          answer:
            "YogaTeacher is built for boutique yoga and pilates studios — typically 20 to 500 active members. Mindbody is built for high-volume gyms and large multi-location operators. The result is YogaTeacher feels like a calm, single-purpose tool; Mindbody feels like an enterprise platform with many panels you'll never use.",
        },
        {
          question: "Can I migrate my Mindbody data to YogaTeacher?",
          answer:
            "Yes. Mindbody exports members, classes and packages as CSV from Settings > Tools. YogaTeacher's CSV import handles all three. For active memberships and remaining class credits, you can either re-create them in YogaTeacher's package import or grant them manually per member (faster for studios with <200 active members).",
        },
        {
          question: "Will my members notice the switch?",
          answer:
            "Yes — and most notice positively. Your new public booking page at yogateacherapp.com/book/your-studio is faster, has fewer steps and works cleanly on mobile. Send a short announcement with the new link; members typically adapt within 1–2 visits.",
        },
        {
          question: "How long does migration take?",
          answer:
            "Most studios complete the move in 1–3 days. The 7-day plan above is the comfortable pace with a parallel-running overlap; if you're confident, a weekend is enough.",
        },
        {
          question: "Is there a Mindbody alternative for solo teachers?",
          answer:
            "Yes — YogaTeacher's $29/month single-studio plan is built for solo teachers. Mindbody's pricing model and onboarding flow are heavy for one person managing 50 students. YogaTeacher is intentionally smaller.",
        },
        {
          question: "Does YogaTeacher cost less than Mindbody?",
          answer:
            "Yes — roughly 80% less at the entry tier. YogaTeacher is $29/month for a single studio with all features included. Mindbody pricing is not publicly listed but typically starts around $159/month for the equivalent feature set, before add-ons.",
        },
      ]}
    />
  );
}
