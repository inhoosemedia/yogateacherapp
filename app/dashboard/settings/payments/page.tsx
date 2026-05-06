import {
  Card,
  CardContent,
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
      keyId: studio.studioRazorpayKeyId,
      keySecret: studio.studioRazorpayKeySecret,
      webhookSecret: studio.studioRazorpayWebhookSecret,
    })
    .from(studio)
    .where(eq(studio.id, s.id))
    .limit(1);

  const origin = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain";
  const webhookUrl = `${origin}/api/webhooks/studio-razorpay`;
  const configured = Boolean(row?.keyId && row?.keySecret);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Studio"
        title="Member payments"
        description="Let members buy packages on your booking link. Funds settle directly to your Razorpay account — we never touch the money."
      />

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription className="leading-relaxed">
            1. Sign up free at{" "}
            <a
              href="https://dashboard.razorpay.com/signup"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              razorpay.com
            </a>{" "}
            and grab your Key ID + Secret from{" "}
            <em>Settings → API Keys</em>.{" "}
            <br />
            2. Paste them below.
            <br />
            3. In Razorpay, add a webhook pointing to{" "}
            <code className="text-xs px-1.5 py-0.5 rounded bg-secondary">
              {webhookUrl}
            </code>
            , subscribe to <strong>payment.captured</strong> +{" "}
            <strong>order.paid</strong>, copy the webhook secret here too.
            <br />
            4. Mark packages as &ldquo;Sell on public booking page&rdquo; — they
            show up at <code className="text-xs px-1.5 py-0.5 rounded bg-secondary">/book/{s.slug}/packages</code>.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Razorpay credentials{" "}
            <span
              className={
                "ml-2 inline-block size-2 rounded-full align-middle " +
                (configured ? "bg-emerald-500" : "bg-stone-300")
              }
            />
          </CardTitle>
          <CardDescription>
            {configured
              ? "Connected. You can safely rotate keys at any time."
              : "Not connected. Members can't buy packages online yet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsForm
            initial={{
              keyId: row?.keyId ?? "",
              hasSecret: Boolean(row?.keySecret),
              hasWebhookSecret: Boolean(row?.webhookSecret),
            }}
            webhookUrl={webhookUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
