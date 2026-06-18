import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga & Pilates Instructor Management Software",
  description:
    "Pay your teachers without spreadsheets. Track instructor hours, classes, attendance and earnings. Per-instructor portal with limited access.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/instructor-management",
  },
};

export default function Page() {
  return (
    <FeaturePage
      slug="instructor-management"
      h1="Instructor Management"
      subheadline="Per-instructor portals, class assignment, attendance tracking and a clean export for payroll. Stop reconciling teacher hours in a spreadsheet."
      problem={{
        heading: "Paying teachers is the studio's other Sunday-afternoon problem.",
        body: "Most studios still calculate teacher payroll the same way: print the schedule, mark who actually taught, count students per class, multiply by the rate. Two hours every week, 30 mistakes per year, and one annual awkward conversation when someone notices they got short-paid in March.",
      }}
      solution={{
        heading: "Every instructor has their own portal. You have a clean payroll view.",
        body: "Each instructor signs in at /instructor and sees only their classes, their rosters and their check-in flow. They mark attendance themselves; the system records who taught, when, and how many students attended. At month-end you open the per-instructor view, see classes taught and students attended, and export to CSV for whatever payroll tool you use.",
      }}
      bullets={[
        "Per-instructor portal at /instructor — only their classes, only their rosters",
        "Self-service check-in — instructor marks attendance after class",
        "Per-instructor view of classes taught + students attended for the month",
        "CSV export ready for any payroll tool",
        "Role-scoped access (instructors can't see admin pages or member-data beyond their classes)",
        "Email invitations for new instructors — they accept and onboard themselves",
        "Per-class instructor assignment from the schedule view",
        "Easy reassignment when a teacher is out",
      ]}
      useCases={[
        {
          title: "Solo teacher",
          body: "You teach all your own classes. The instructor portal isn't strictly needed but the per-instructor view shows your teaching load.",
        },
        {
          title: "3–5 instructor studio",
          body: "Each teacher has their own portal. Monthly payroll exports take 10 minutes instead of 2 hours.",
        },
        {
          title: "Multi-location with shared instructors",
          body: "Instructors teach across locations. Single view aggregates all classes for payroll, no matter where they were taught.",
        },
      ]}
      integrationLinks={[
        { label: "Class scheduling", href: "/class-scheduling-software" },
        { label: "Check-in system", href: "/check-in-system" },
        { label: "Reporting", href: "/reporting-analytics" },
      ]}
      faqs={[
        {
          question: "Can instructors see other instructors' classes?",
          answer:
            "No. Each instructor portal is scoped to only that instructor's classes and rosters. Studio admins see everything; instructors see only their own.",
        },
        {
          question: "Can instructors edit class details?",
          answer:
            "No — only attendance and check-ins. Class times, instructor assignment and class settings are admin-only.",
        },
        {
          question: "How do I invite a new instructor?",
          answer:
            "From Settings > Team, send an invite by email. They click the link, set a password, and land in the instructor portal. No admin intervention needed.",
        },
        {
          question: "Can instructors set their own availability?",
          answer:
            "Not today — studios assign classes to instructors. Self-service availability is on the roadmap.",
        },
        {
          question: "Can I track instructor pay rates in YogaTeacher?",
          answer:
            "Not directly today. The CSV export gives you classes taught and students attended; you multiply by your pay rate (which usually varies per instructor and class type) in your payroll tool.",
        },
        {
          question: "Do instructors need to install an app?",
          answer:
            "No. The instructor portal is a web app at /instructor — they sign in on their phone browser. PWA-ready, so they can add it to their home screen.",
        },
      ]}
    />
  );
}
