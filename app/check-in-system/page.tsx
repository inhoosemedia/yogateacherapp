import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga & Pilates Studio Check-in System",
  description:
    "Front-desk check-in for yoga and pilates studios. One-tap check-in, instructor roll-call, accurate attendance tracking. Built for the studio floor.",
  alternates: { canonical: "https://www.yogateacherapp.com/check-in-system" },
};

export default function Page() {
  return (
    <FeaturePage
      slug="check-in-system"
      h1="Studio Check-in System"
      subheadline="A roster designed for the front desk. Tap to check in, mark no-shows, restore cancellations. Credits stay accurate."
      problem={{
        heading: "The front-desk minute is the most important minute.",
        body: "Students arriving at the studio is when the customer experience happens. If the front desk is hunting through a list, asking 'did you book online?', double-checking package balances, that moment is wasted. If the front-desk system is slow, the line backs up and class starts late.",
      }}
      solution={{
        heading: "One-tap check-in. The whole class in 30 seconds.",
        body: "Open the class roster. See every booked student in alphabetical order with their package balance. Tap a name to check them in (green check). Tap again to undo. Tap the X to mark a no-show; their credit forfeits per your studio's policy. Tap restore on a cancelled student if they showed up anyway; their credit re-decrements.",
      }}
      bullets={[
        "Class roster designed for the front-desk minute",
        "One-tap check-in (no scrolling, no searching)",
        "Real-time package balance per student",
        "Walk-in handling — add a guest with name + email",
        "Mark no-show — credit forfeits per studio policy",
        "Restore cancelled — credit re-decrements if they walked in anyway",
        "Mobile-first roster works on the instructor's phone too",
        "Attendance feeds into per-instructor and per-member reporting",
      ]}
      useCases={[
        {
          title: "Front-desk studio",
          body: "Receptionist checks in students at a tablet near the door. 30-second turnaround per student even on a busy Saturday morning.",
        },
        {
          title: "Self-service studio",
          body: "Tablet at the door — students tap their own name to check in. Instructor verifies count at the start of class.",
        },
        {
          title: "Instructor-led check-in",
          body: "No reception. Instructor opens the class roster on their phone, marks attendance in the first minute of class.",
        },
      ]}
      integrationLinks={[
        { label: "Class scheduling", href: "/class-scheduling-software" },
        { label: "Instructor management", href: "/instructor-management" },
        { label: "Yoga booking", href: "/yoga-booking-software" },
      ]}
      faqs={[
        {
          question: "Can students check themselves in?",
          answer:
            "Yes — leave the class roster open on a tablet near the door and students tap their own name. Instructor verifies at class start.",
        },
        {
          question: "What happens to a no-show student's credit?",
          answer:
            "By default, no-shows forfeit the credit per your studio's policy. You can override this per-student if there's a legitimate reason (sick, family emergency).",
        },
        {
          question: "How are walk-ins handled?",
          answer:
            "From the class roster, tap 'Add walk-in'. Enter name + email, charge them a drop-in (if you sell drop-ins from a tablet) or have them book + pay on the public page first.",
        },
        {
          question: "Can I check in students for multiple classes at once?",
          answer:
            "Not currently — check-in is per-class. Most studios only need this for back-to-back classes with the same students (rare).",
        },
        {
          question: "Does check-in work offline?",
          answer:
            "Limited offline support today. The page loads cached state; new check-ins queue until the connection returns. Most studios use a wired-internet front desk so this rarely matters.",
        },
        {
          question: "Can I see attendance history per student?",
          answer:
            "Yes. On the member detail view you see every class they've been booked for, with status (attended, no-show, cancelled, late-cancelled).",
        },
      ]}
    />
  );
}
