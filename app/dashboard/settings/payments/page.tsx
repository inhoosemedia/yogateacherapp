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
    })
    .from(studio)
    .where(eq(studio.id, s.id))
    .limit(1);

  const origin = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain";
  const razorpayWebhookUrl = `${origin}/api/webhooks/studio-razorpay`;
  const stripeWebhookUrl = `${origin}/api/webhooks/studio-stripe`;

  const provider = (row?.provider ?? null) as
    | "razorpay"
    | "stripe"
    | null;
  const razorpayConfigured = Boolean(
    row?.razorpayKeyId && row?.razorpayKeySecret,
  );
  const stripeConfigured = Boolean(
    row?.stripeSecretKey && row?.stripePublishableKey,
  );

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Studio"
        title="Member payments"
        description="Let members buy packages on your booking link. Pick a provider — funds settle directly to your account."
      />

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription className="leading-relaxed">
            Choose <strong>Razorpay</strong> (best for India / UPI) or{" "}
            <strong>Stripe</strong> (global, cards). Sign up free at the
            provider, paste your keys below, add a webhook pointing back here.
            Mark packages as &ldquo;Sell on public booking page&rdquo; — they
            show up at{" "}
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
          razorpayConfigured,
          stripeConfigured,
        }}
        razorpayWebhookUrl={razorpayWebhookUrl}
        stripeWebhookUrl={stripeWebhookUrl}
      />
    </div>
  );
}
