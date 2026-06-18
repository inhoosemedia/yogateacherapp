import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Class Scheduling Software for Yoga & Pilates Studios",
  description:
    "Class scheduling software for boutique studios. Set recurring schedules, assign instructors, handle bookings and check-ins. Free 30-day trial.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/class-scheduling-software",
  },
};

export default function Page() {
  return (
    <FeaturePage
      slug="class-scheduling-software"
      h1="Class Scheduling Software"
      subheadline="Build your weekly schedule once. It runs forever. Recurring rules, instructor assignment, real-time capacity, color-coded class types."
      problem={{
        heading: "Re-entering the same class every week is the actual job.",
        body: "Most studios have a repeating weekly schedule: Monday 7am Vinyasa with Sarah, Monday 9am Restorative with James, Monday 5pm Reformer Flow with Mia. The schedule barely changes month to month. But on Mindbody or Vagaro you're re-creating each class instance, week after week, or wrestling with a recurring-rule UI that fights you.\n\nClass scheduling software should let you build the pattern once and adjust the exceptions.",
      }}
      solution={{
        heading: "Recurring schedules that just work.",
        body: "Define the weekly pattern in one screen. Every Monday at 7am, run Vinyasa with Sarah at 60 minutes with a 20-spot capacity. Every Tuesday at 6pm, run Reformer Flow with Mia at 50 minutes with an 8-bed capacity. YogaTeacher generates the instances forward. Need to cancel one specific Monday? Edit that single instance without breaking the recurring rule.",
      }}
      bullets={[
        "Build a weekly recurring schedule in one screen",
        "Color-coded class types you can read across the room",
        "Real-time capacity bars on every class instance",
        "Per-class instructor assignment",
        "Cancel a single instance without breaking the recurring rule",
        "Bulk-edit a class type (capacity, duration) across all instances",
        "Day / week / list views — switch on the fly",
        "Mobile schedule view for front-desk + instructor portal",
      ]}
      useCases={[
        {
          title: "Weekly-rhythm studio",
          body: "Same 25 classes every week. Build once, run forever. Edit the rare exception when an instructor is out.",
        },
        {
          title: "Workshop-heavy studio",
          body: "Recurring schedule for the weekly rhythm + one-off workshops layered on top. Both flow through the same schedule view.",
        },
        {
          title: "Reformer studio",
          body: "Tight back-to-back reformer classes with capacity per class type. Schedule view shows real-time bookings and instructor allocation.",
        },
      ]}
      integrationLinks={[
        { label: "Yoga booking", href: "/yoga-booking-software" },
        { label: "Pilates booking", href: "/pilates-booking-software" },
        { label: "Instructor management", href: "/instructor-management" },
        { label: "Check-in system", href: "/check-in-system" },
      ]}
      faqs={[
        {
          question: "Can I edit a single class instance without affecting the recurring schedule?",
          answer:
            "Yes. Open the specific instance, change the instructor or cancel it, and the recurring rule stays untouched. The exception applies only to that date.",
        },
        {
          question: "How do I handle holidays?",
          answer:
            "Cancel the affected class instances for that week. Members on the booking page see the class is cancelled and credits refund automatically. The recurring rule resumes the following week.",
        },
        {
          question: "Can different class types have different capacities?",
          answer:
            "Yes. Each class type has its own capacity field. Reformer 50 might be 8; Mat Flow might be 20; Private 60 is 1.",
        },
        {
          question: "Does the schedule support multiple instructors per class?",
          answer:
            "Not today — each class has one assigned instructor. For co-taught classes, most studios either pick the primary instructor or set up a 'Co-taught' instructor record.",
        },
        {
          question: "Can students see the schedule before they sign up?",
          answer:
            "Yes. The public booking page at yogateacherapp.com/book/your-studio shows the full weekly schedule to anyone — no sign-up needed to browse.",
        },
        {
          question: "How far in advance can students book?",
          answer:
            "By default 30 days, configurable per studio. Some studios set 7 days for high-demand classes, others set 60 days for retreat-style programs.",
        },
      ]}
    />
  );
}
