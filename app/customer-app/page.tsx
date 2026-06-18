import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga & Pilates Studio Member Booking App",
  description:
    "Your members get a fast public booking page (PWA-ready) to reserve classes and see their package balance. No app-store download required.",
  alternates: { canonical: "https://www.yogateacherapp.com/customer-app" },
};

export default function Page() {
  return (
    <FeaturePage
      slug="customer-app"
      h1="Member Booking App"
      subheadline="A fast booking page your members add to their phone home screen. No app store, no per-member fee, no friction."
      problem={{
        heading: "Native mobile apps are an expensive, friction-heavy lie.",
        body: "Most studio platforms upsell a 'branded mobile app' for an extra $50–200/month. Members are expected to download, install and create an account just to book one yoga class. Most don't bother — they go back to texting the studio. The branded app sits unused, the studio pays anyway, the friction is real.",
      }}
      solution={{
        heading: "A Progressive Web App at your studio's URL.",
        body: "Every studio gets a public booking page at yogateacherapp.com/book/your-studio-slug. It's a Progressive Web App — members tap 'Add to Home Screen' once and it behaves like a native app: full-screen, fast, offline-capable. No app store. No download. No per-member fee. Works on iOS, Android and desktop.",
      }}
      bullets={[
        "Public booking page at yogateacherapp.com/book/your-studio-slug",
        "PWA-ready — add to home screen, behaves like an app",
        "Browse the weekly schedule, see class details, check capacity",
        "Self-purchase class packs with PayPal, Stripe or Razorpay",
        "Book classes in 2 taps; credits decrement automatically",
        "Cancel within studio's window; credit refunds automatically",
        "Real-time waitlist with auto-promote",
        "Works on iOS, Android, desktop — no app store dependency",
        "No per-member fee — your subscription includes unlimited member access",
      ]}
      useCases={[
        {
          title: "Single studio",
          body: "Members bookmark the booking page or add to home screen. Behaves like an app, costs nothing extra.",
        },
        {
          title: "Multi-location",
          body: "Each location gets its own public booking page. Members with shared memberships can use either.",
        },
        {
          title: "Brand-conscious studio",
          body: "Page shows your logo, your name, your tagline. Custom CSS is on the roadmap for studios that want deeper customization.",
        },
      ]}
      integrationLinks={[
        { label: "Yoga booking", href: "/yoga-booking-software" },
        { label: "Pilates booking", href: "/pilates-booking-software" },
        { label: "Memberships", href: "/membership-management-software" },
        { label: "Online payments", href: "/online-payments" },
      ]}
      faqs={[
        {
          question: "Why no native iOS / Android app?",
          answer:
            "Two reasons. (1) Native apps add cost — $50–200/month extra on most competing platforms — and most studios don't get enough usage to justify it. (2) Modern Progressive Web Apps are 95% of the native experience without the App Store / Play Store friction. Members add to home screen once; it behaves like an app from then on.",
        },
        {
          question: "Can members book without an account?",
          answer:
            "Yes, for drop-ins. For class packs, an account is needed so credits and history track properly. Account creation is 30 seconds — name + email + password.",
        },
        {
          question: "Is the booking page customizable?",
          answer:
            "Today: your studio's logo, name, tagline. Full custom CSS is planned. The page already inherits the YogaTeacher brand style which most studios find clean enough.",
        },
        {
          question: "Does the booking page work offline?",
          answer:
            "Limited offline support — members can browse the schedule cached from their last visit, but bookings require connectivity. PWA service worker is on the roadmap for fuller offline support.",
        },
        {
          question: "How do members add the page to their home screen?",
          answer:
            "iOS: Open in Safari, tap Share, tap 'Add to Home Screen'. Android Chrome: prompts automatically with 'Install app?' button after a few visits.",
        },
        {
          question: "Is there a separate fee per member?",
          answer:
            "No. Your YogaTeacher subscription includes unlimited member access to your booking page. No per-member fee, no usage cap.",
        },
      ]}
    />
  );
}
