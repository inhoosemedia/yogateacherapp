import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { eq } from "drizzle-orm";
import { PaymentsForm } from "./_components/payments-form";

export default async function PaymentsPage() {
  const { studio: s } = await requireStudio();

  const [row] = await db
    .select({
      provider: studio.studioPaymentProvider,
      razorpayKeyId: studio.studioRazorpayKeyId,
      razorpayKeySecret: studio.studioRazorpayKeySecret,
      razorpayWebhookSecret: studio.studioRazorpayWebhookSecret,
      stripeSecretKey: studio.studioStripeSecretKey,
      stripePublishableKey: studio.studioStripePublishableKey,
      stripeWebhookSecret: studio.studioStripeWebhookSecret,
      paypalClientId: studio.studioPaypalClientId,
      paypalClientSecret: studio.studioPaypalClientSecret,
      paypalWebhookId: studio.studioPaypalWebhookId,
      paypalMode: studio.studioPaypalMode,
    })
    .from(studio)
    .where(eq(studio.id, s.id))
    .limit(1);

  const origin = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain";
  const razorpayWebhookUrl = `${origin}/api/webhooks/studio-razorpay`;
  const stripeWebhookUrl = `${origin}/api/webhooks/studio-stripe`;
  const paypalWebhookUrl = `${origin}/api/webhooks/studio-paypal`;

  const provider = (row?.provider ?? null) as
    | "paypal"
    | "razorpay"
    | "stripe"
    | null;
  const razorpayConfigured = Boolean(
    row?.razorpayKeyId && row?.razorpayKeySecret,
  );
  const stripeConfigured = Boolean(
    row?.stripeSecretKey && row?.stripePublishableKey,
  );
  const paypalConfigured = Boolean(
    row?.paypalClientId && row?.paypalClientSecret,
  );

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Studio"
        title="Member payments"
        description="Let members buy packages on your booking link. Pick a provider — funds settle directly to your account. PayPal is the default."
      />

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription className="leading-relaxed">
            Choose <strong>PayPal</strong> (recommended global default),{" "}
            <strong>Stripe</strong> (cards, ACH), or <strong>Razorpay</strong>{" "}
            (India / UPI). Sign up free at the provider, paste your keys below,
            add a webhook pointing back here. Mark packages as &ldquo;Sell on
            public booking page&rdquo; — they show up at{" "}
            <code className="text-xs px-1.5 py-0.5 rounded bg-secondary">
              /book/{s.slug}/packages
            </code>
            .
          </CardDescription>
        </CardHeader>
      </Card>

      <PaymentsForm
        initial={{
          provider,
          razorpayKeyId: row?.razorpayKeyId ?? "",
          hasRazorpaySecret: Boolean(row?.razorpayKeySecret),
          hasRazorpayWebhookSecret: Boolean(row?.razorpayWebhookSecret),
          stripePublishableKey: row?.stripePublishableKey ?? "",
          hasStripeSecret: Boolean(row?.stripeSecretKey),
          hasStripeWebhookSecret: Boolean(row?.stripeWebhookSecret),
          paypalClientId: row?.paypalClientId ?? "",
          paypalMode: (row?.paypalMode === "sandbox" ? "sandbox" : "live"),
          hasPaypalSecret: Boolean(row?.paypalClientSecret),
          hasPaypalWebhookId: Boolean(row?.paypalWebhookId),
          razorpayConfigured,
          stripeConfigured,
          paypalConfigured,
        }}
        razorpayWebhookUrl={razorpayWebhookUrl}
        stripeWebhookUrl={stripeWebhookUrl}
        paypalWebhookUrl={paypalWebhookUrl}
      />
    </div>
  );
}
