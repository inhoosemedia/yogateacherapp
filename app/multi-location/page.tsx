import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Location Yoga & Pilates Studio Software",
  description:
    "Run multiple yoga or pilates studios from one account. Per-location reporting, per-location instructors, shared memberships across locations.",
  alternates: { canonical: "https://www.yogateacherapp.com/multi-location" },
};

export default function Page() {
  return (
    <FeaturePage
      slug="multi-location"
      h1="Multi-Location Studio Software"
      subheadline="From one studio to five. One account, multiple locations, per-location reporting, shared memberships if you want them."
      problem={{
        heading: "Most studio software treats your second location like a new customer.",
        body: "You open your second studio. Suddenly you're running two separate accounts, paying two subscriptions, exporting reports from one and pasting into the other to see total revenue. Members who travel between locations can't use their unlimited pass at both. Your instructors have two sets of logins.",
      }}
      solution={{
        heading: "One account. Many studios. Shared what you want shared.",
        body: "On the Multi-Studio plan, you add new locations from Settings > Studios. Each location has its own slug, its own schedule, its own instructors, its own bookings, its own reporting. You choose what's shared: memberships (a member with an unlimited pass attends at any location), instructors (a senior teacher works across two studios), reports (aggregate revenue across all locations or per-location).",
      }}
      bullets={[
        "Unlimited locations on the $79/month Multi-Studio plan",
        "Per-location schedule, instructors and reporting",
        "Shared memberships across locations (or keep them isolated)",
        "Shared instructor pool across locations",
        "Aggregate revenue dashboard across all locations",
        "Per-location public booking page at /book/<location-slug>",
        "Per-location currency + timezone settings",
        "Per-location payment processor (one studio in USD/Stripe, another in INR/Razorpay)",
      ]}
      useCases={[
        {
          title: "Two-location yoga brand",
          body: "Downtown and uptown. Members can buy a single unlimited pass valid at both. One brand, two booking pages, one revenue dashboard.",
        },
        {
          title: "Multi-city wellness business",
          body: "Studios in three cities, three timezones. Each studio uses its local currency and payment processor; aggregate revenue dashboard in your home currency.",
        },
        {
          title: "Franchise model",
          body: "Five franchisee studios with shared brand but independent finances. Each studio brings their own processor; the central account oversees performance.",
        },
      ]}
      integrationLinks={[
        { label: "Yoga studio software", href: "/yoga-studio-software" },
        { label: "Pilates studio software", href: "/pilates-studio-software" },
        { label: "Memberships", href: "/membership-management-software" },
        { label: "Reporting", href: "/reporting-analytics" },
      ]}
      faqs={[
        {
          question: "How many locations does the Multi-Studio plan support?",
          answer:
            "Unlimited. Add as many as your business needs. Each location gets its own slug, schedule, instructors and reporting.",
        },
        {
          question: "Can members use an unlimited pass at any location?",
          answer:
            "Yes — if you toggle it on. Configure in Settings > Memberships > Cross-location access. Or keep memberships scoped to a single location.",
        },
        {
          question: "Can different locations use different currencies?",
          answer:
            "Yes. Each studio sets its own currency and timezone. The Multi-Studio plan supports any mix of the 18 supported currencies.",
        },
        {
          question: "How do I switch between locations as an admin?",
          answer:
            "From the dashboard sidebar, click the studio name to open a switcher. One click moves between locations. Your role in each location is shown next to the studio name.",
        },
        {
          question: "Can instructors be assigned to multiple locations?",
          answer:
            "Yes. Invite an instructor once; assign them to specific studios. They see classes from every assigned studio in their portal.",
        },
        {
          question: "Is there an aggregate reporting view?",
          answer:
            "Yes. The reports page shows per-location revenue, attendance and membership growth, plus an aggregate total across all locations.",
        },
      ]}
    />
  );
}
