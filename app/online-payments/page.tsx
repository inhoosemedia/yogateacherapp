import { FeaturePage } from "@/components/seo/feature-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Payments for Yoga & Pilates Studios — PayPal, Stripe, Razorpay",
  description:
    "Take online payments for memberships and packages — PayPal, Stripe and Razorpay supported. Funds settle directly to your studio's account.",
  alternates: { canonical: "https://www.yogateacherapp.com/online-payments" },
};

export default function Page() {
  return (
    <FeaturePage
      slug="online-payments"
      h1="Online Payments"
      subheadline="PayPal, Stripe and Razorpay built in. Funds settle directly to your studio. No platform transaction fee on top — just your processor's standard rate."
      problem={{
        heading: "All-in-one studio platforms layer their own fees.",
        body: "Most studio platforms route member payments through their account first, then pass funds to you — taking a 2–4% 'platform fee' on top of your processor's standard rate. On $10,000 a month in member payments that's an extra $200–400 you're paying for plumbing.\n\nThis is the part nobody talks about because the line item is buried in 'standard processor fees'.",
      }}
      solution={{
        heading: "You bring your processor. We never touch the money.",
        body: "Each studio connects their own PayPal, Stripe or Razorpay account. When a member pays for a class pack, funds settle directly to your studio's payment account. YogaTeacher never holds the money, never takes a cut, never adds a platform fee. Your processor charges its standard rate (usually 1.9%–2.9% + a small fixed fee); that's all you pay.",
      }}
      bullets={[
        "PayPal, Stripe and Razorpay supported",
        "Your studio brings its own processor account",
        "Funds settle directly to your bank — we never hold money",
        "Zero platform transaction fee from YogaTeacher",
        "Members self-purchase from the public booking page",
        "Recurring subscriptions on PayPal, Stripe and Razorpay",
        "18 supported currencies",
        "Webhook-verified receipts (idempotent — never double-charge or miss a payment)",
        "Switch processor in Settings without losing data",
      ]}
      useCases={[
        {
          title: "US / EU studios",
          body: "Stripe for cards + Apple Pay + Google Pay. PayPal for the small but loyal PayPal-only segment. Razorpay only if you serve Indian rupees.",
        },
        {
          title: "Indian studios",
          body: "Razorpay for UPI + cards. PayPal as backup for international students. Lowest transaction fees of the three for INR.",
        },
        {
          title: "Multi-currency studios",
          body: "Set the studio currency in Settings; it flows through to the booking page and to the processor charge. Members see prices in your local currency.",
        },
      ]}
      integrationLinks={[
        { label: "Memberships", href: "/membership-management-software" },
        { label: "Booking", href: "/yoga-booking-software" },
        { label: "Pricing", href: "/pricing" },
      ]}
      faqs={[
        {
          question: "Does YogaTeacher charge a platform transaction fee?",
          answer:
            "No. Your payment processor (PayPal, Stripe or Razorpay) charges its standard rate — typically 1.9%–2.9% + a small fixed fee — directly to your account. YogaTeacher takes nothing on top.",
        },
        {
          question: "Which processor should I pick?",
          answer:
            "Stripe is the default recommendation for US/EU/UK/AU studios. PayPal is good for studios with international or PayPal-loyal members. Razorpay is the right choice for Indian studios charging in INR (UPI support, lowest INR fees).",
        },
        {
          question: "Can I use more than one processor?",
          answer:
            "One active processor at a time per studio. You can switch between PayPal, Stripe and Razorpay in Settings > Payments without losing any data; previous transactions stay attributed to the processor that handled them.",
        },
        {
          question: "How quickly do funds settle?",
          answer:
            "Per your processor's standard schedule. Stripe is typically 2 business days in the US, 7 days for new accounts. PayPal is instant to the PayPal balance, 1–2 business days to a linked bank. Razorpay is T+3 business days by default.",
        },
        {
          question: "What about chargebacks?",
          answer:
            "Handled by your processor directly — not through YogaTeacher. If a member disputes a charge, you respond via the Stripe/PayPal/Razorpay dashboard. YogaTeacher records the failed status if the chargeback succeeds.",
        },
        {
          question: "Are recurring subscriptions supported on all three?",
          answer:
            "Yes — PayPal Subscriptions, Stripe Subscriptions and Razorpay Subscriptions are all supported for monthly auto-renew memberships.",
        },
      ]}
    />
  );
}
