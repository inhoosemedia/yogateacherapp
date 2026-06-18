import { ComparisonPage } from "@/components/seo/comparison-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WellnessLiving Alternative for Boutique Yoga & Pilates Studios",
  description:
    "Switching from WellnessLiving? YogaTeacher gives you the essentials — bookings, memberships, payments — at a fraction of the price. From $29/mo.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/vs-wellnessliving",
  },
  openGraph: {
    title: "WellnessLiving Alternative — YogaTeacher",
    description:
      "Less surface area. Simpler product. Cheaper. Built for boutique yoga and pilates studios.",
    url: "https://www.yogateacherapp.com/vs-wellnessliving",
    type: "website",
  },
};

export default function VsWellnessLiving() {
  return (
    <ComparisonPage
      competitor="WellnessLiving"
      competitorSlug="wellnessliving"
      tagline="WellnessLiving tries to do everything. YogaTeacher does the essentials, well."
      intro="WellnessLiving has 200+ features across wellness verticals. Most boutique studios use 15 of them. YogaTeacher is the focused alternative: bookings, memberships, payments, instructors — done well, priced honestly."
      lastUpdated="May 2026"
      reasons={[
        {
          title: "Smaller surface area",
          body: "WellnessLiving's admin dashboard has 20+ navigation items. YogaTeacher has 7. Most studio owners we talk to never used the reward programs, in-app challenges or branded marketing automations they're paying for.",
        },
        {
          title: "Honest pricing",
          body: "WellnessLiving entry pricing is around $99/month; add-ons (Achieve mobile app, marketing tools, branded ENB) push most studios into the $150–250 range. YogaTeacher is $29/month, everything included.",
        },
        {
          title: "Built for yoga + pilates only",
          body: "WellnessLiving serves yoga, pilates, dance, martial arts, salons, gyms and spas — the breadth means the depth in any one is shallow. YogaTeacher is yoga + pilates, end of list.",
        },
      ]}
      rows={[
        { feature: "Monthly cost (entry)", us: "$29", them: "~$99" },
        { feature: "Built specifically for yoga + pilates", us: true, them: false },
        { feature: "Recurring memberships", us: true, them: true },
        { feature: "Class packs", us: true, them: true },
        { feature: "Online booking page", us: true, them: true },
        { feature: "PayPal support", us: true, them: "partial" },
        { feature: "Stripe support", us: true, them: true },
        { feature: "Razorpay support", us: true, them: false },
        { feature: "Branded mobile app", us: "Public booking PWA", them: "Extra fee" },
        { feature: "Instructor portal", us: true, them: true },
        { feature: "Multi-location", us: true, them: true },
        { feature: "Multi-currency", us: "18 currencies", them: true },
        { feature: "Free trial", us: "30 days", them: "14 days" },
        { feature: "Setup time", us: "< 1 hour", them: "1–2 weeks" },
        { feature: "Platform transaction fee", us: "0%", them: "Varies" },
      ]}
      migrationSteps={[
        {
          day: "1",
          body: "Export your member list, class history and packages from WellnessLiving (Reports > Export).",
        },
        {
          day: "2",
          body: "Sign up for YogaTeacher and CSV-import members. Re-create class types and packages — the data shapes translate cleanly.",
        },
        {
          day: "3",
          body: "Connect PayPal, Stripe or Razorpay. Test a $1 purchase to confirm payouts.",
        },
        {
          day: "4",
          body: "Build the weekly schedule. Assign instructors. Preview the public booking page.",
        },
        {
          day: "5",
          body: "Announce the new booking link to members.",
        },
        {
          day: "6",
          body: "Run both for 24 hours.",
        },
        {
          day: "7",
          body: "Cancel WellnessLiving. Pocket the ~$70/month difference.",
        },
      ]}
      faqs={[
        {
          question: "What's the main difference between YogaTeacher and WellnessLiving?",
          answer:
            "YogaTeacher is focused — yoga and pilates, bookings, memberships, payments. WellnessLiving is broad — many verticals, many features, higher price. If you need the breadth, WellnessLiving makes sense; if you don't, YogaTeacher is faster and cheaper.",
        },
        {
          question: "Can I migrate from WellnessLiving without losing member data?",
          answer:
            "Yes. WellnessLiving's CSV export includes members, classes and packages. YogaTeacher's CSV import handles all three. Plan a 24-hour overlap to catch any in-flight bookings.",
        },
        {
          question: "Does YogaTeacher have a branded mobile app like WellnessLiving's Achieve?",
          answer:
            "Not a native app, but a PWA-ready public booking page that members can add to their phone home screen and use like an app. Why: native apps add cost ($50–200/month) and friction (one app per studio); the PWA approach scales to multi-location without extra cost.",
        },
        {
          question: "How much will I save by switching?",
          answer:
            "For a single studio: about $70/month (~$840/year). For multi-location with WellnessLiving add-ons: often $100–200/month (~$1,200–$2,400/year).",
        },
        {
          question: "Will WellnessLiving's mobile-check-in workflow work in YogaTeacher?",
          answer:
            "Yes. YogaTeacher's instructor portal and front-desk check-in flow both work on mobile. Instructors mark attendance with one tap; the roster updates live.",
        },
        {
          question: "How long does migration take?",
          answer:
            "1–3 days for most studios. Largest time sink is re-modelling class types and packages; data migration is straightforward via CSV.",
        },
      ]}
    />
  );
}
