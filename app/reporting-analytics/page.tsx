import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga & Pilates Studio Reporting & Analytics",
  description:
    "Studio reporting and analytics — memberships, revenue, attendance, retention. See what's working, weekly. Built for boutique studio owners.",
  alternates: { canonical: "https://www.yogateacherapp.com/reporting-analytics" },
};

export default function Page() {
  return (
    <FeaturePage
      slug="reporting-analytics"
      h1="Reporting & Analytics"
      subheadline="See what's working, weekly. Revenue, attendance, memberships, retention — surfaced as numbers you can actually act on."
      problem={{
        heading: "Most studios fly blind on the metrics that matter.",
        body: "How many new memberships did you sell last month? What's your average revenue per active member? How many members did you lose in the last 30 days? Most studio owners can't answer these on the spot — the data exists somewhere, but it lives across spreadsheets, payment-processor dashboards and a vague spreadsheet from the bookkeeper.",
      }}
      solution={{
        heading: "One dashboard, the metrics that actually matter.",
        body: "Revenue this month, active members, new sign-ups, attendance rate, package expiration alerts — surfaced in one /dashboard/reports view. Numbers update in real time as bookings happen. Drill into any number to see the underlying transactions.",
      }}
      bullets={[
        "Revenue MTD by package type",
        "Active members + new sign-ups (30-day rolling)",
        "Attendance rate by class type",
        "Membership retention (% renewed)",
        "Package expiration alerts (members within 14 days of expiry)",
        "Per-instructor classes taught + students attended (payroll-ready)",
        "Per-location aggregates on multi-studio plans",
        "CSV export of every report",
      ]}
      useCases={[
        {
          title: "Solo teacher",
          body: "Quick weekly glance: revenue this month, active members, what's expiring soon. 5 minutes on Sunday evening.",
        },
        {
          title: "Boutique studio",
          body: "Monthly review: revenue by package type, instructor performance, member retention. Decide which packages to push next month.",
        },
        {
          title: "Multi-location",
          body: "Compare locations side by side. Spot the one with declining retention before it becomes a problem.",
        },
      ]}
      integrationLinks={[
        { label: "Memberships", href: "/membership-management-software" },
        { label: "Instructor management", href: "/instructor-management" },
        { label: "Multi-location", href: "/multi-location" },
      ]}
      faqs={[
        {
          question: "What metrics does the reporting dashboard show?",
          answer:
            "Revenue MTD, active members, new sign-ups (30-day), attendance rate, retention rate, package expirations, per-instructor performance. All on one screen, updating live.",
        },
        {
          question: "Can I export reports to CSV?",
          answer:
            "Yes. Every report has a CSV export button. Useful for monthly accounting, year-end reviews and any analysis you want to do in Excel.",
        },
        {
          question: "Are there scheduled email reports?",
          answer:
            "Not today. Most studio owners check the dashboard manually once a week. Scheduled email summaries are on the roadmap.",
        },
        {
          question: "How is retention calculated?",
          answer:
            "Active members at month start vs. members still active at month end (renewals + new). The dashboard shows both a % and the raw numbers behind it.",
        },
        {
          question: "Can I see revenue by payment processor?",
          answer:
            "Yes. The reports view breaks down revenue by processor (PayPal vs Stripe vs Razorpay) so you can see which payment method members prefer.",
        },
        {
          question: "Does the dashboard work on mobile?",
          answer:
            "Yes — all reports are mobile-responsive. Most studio owners check from their phone in the morning.",
        },
      ]}
    />
  );
}
