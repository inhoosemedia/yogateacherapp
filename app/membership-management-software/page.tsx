import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Membership Management Software for Yoga & Pilates",
  description:
    "Membership management software with recurring billing, credit-based class packs, auto-renewals and member self-service. Built for boutique studios.",
  alternates: {
    canonical: "https://www.yogateacherapp.com/membership-management-software",
  },
};

export default function Page() {
  return (
    <FeaturePage
      slug="membership-management-software"
      h1="Membership Management Software"
      subheadline="Drop-ins, class packs, unlimited monthly. Credits decrement on booking, refund on cancellation. Recurring memberships auto-renew. Member self-service throughout."
      problem={{
        heading: "The economics of a studio live and die on retention.",
        body: "A student who joins a monthly unlimited and stays for 8 months is worth ~6× the lifetime revenue of a student who buys 10 drop-ins once. Yet most studios still treat memberships as an afterthought — manually tracked in a spreadsheet, manually renewed, manually cancelled.\n\nMembership management software makes recurring memberships the easy choice for your studio and a frictionless choice for your members.",
      }}
      solution={{
        heading: "Every membership shape, in one place.",
        body: "Drop-in single classes, fixed class packs (5/10/20), unlimited monthly, recurring auto-renew subscriptions, private session credits — all live alongside each other in the package table. Members can self-purchase from your public booking page. Credits decrement automatically. Recurring memberships auto-renew. Members can cancel themselves without sending you an email.",
      }}
      bullets={[
        "Drop-ins, fixed class packs (5/10/20), unlimited monthly",
        "Recurring auto-renew subscriptions with member self-service cancel",
        "Credits decrement automatically on booking",
        "Credit refunds automatically on cancellation within the studio's window",
        "Custom validity windows per package (30, 60, 90 days)",
        "Per-package public-purchase toggle (some you sell, some you assign manually)",
        "Multi-currency support — 18 currencies",
        "Per-member package balance + expiration tracking",
      ]}
      useCases={[
        {
          title: "Drop-in heavy studio",
          body: "Tourist-adjacent studio with mostly drop-in revenue. Members self-purchase single classes from the booking page; no recurring management needed.",
        },
        {
          title: "Class-pack focused studio",
          body: "Most members on 10-class packs that expire in 60 days. Auto-tracking of credits + expirations + reminder emails 14 days before expiration.",
        },
        {
          title: "Unlimited-monthly studio",
          body: "Loyal community on $99/month unlimited auto-renew subscriptions. Members can cancel themselves; no awkward email exchanges with the studio.",
        },
      ]}
      integrationLinks={[
        { label: "Online payments", href: "/online-payments" },
        { label: "Yoga studio software", href: "/yoga-studio-software" },
        { label: "Pilates studio software", href: "/pilates-studio-software" },
        { label: "Reporting & analytics", href: "/reporting-analytics" },
      ]}
      faqs={[
        {
          question: "How are class credits tracked?",
          answer:
            "Each member's package shows remaining credits. When they book a class the credit decrements; when they cancel within your studio's cancellation window the credit refunds. The package balance is visible to both the member (on the booking page) and the studio (in the member detail view).",
        },
        {
          question: "Can members cancel their recurring membership themselves?",
          answer:
            "Yes. Members can cancel auto-renew from their member portal without contacting the studio. Their current month plays out and the next month doesn't bill.",
        },
        {
          question: "What happens when a class pack expires?",
          answer:
            "Unused credits expire on the validity date you set per package. Members receive a reminder email 14 days before expiration; the studio can manually extend an expiration on a case-by-case basis.",
        },
        {
          question: "Can I create custom packages?",
          answer:
            "Yes. You define the kind (drop-in, class pack, unlimited), the credits, the validity window, the price and the currency. Each studio can have unlimited package definitions.",
        },
        {
          question: "Are recurring memberships supported on PayPal and Razorpay too?",
          answer:
            "Yes. Recurring billing works on PayPal Subscriptions, Stripe Subscriptions and Razorpay Subscriptions. Each studio chooses one processor for recurring; one-time package purchases work across all three.",
        },
        {
          question: "Can I share memberships across multiple studio locations?",
          answer:
            "Yes — on the Multi-Studio plan. Optionally, a member's unlimited pass can be honored at any of your locations, or kept per-location. Configured in Settings > Memberships.",
        },
      ]}
    />
  );
}
