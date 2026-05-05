import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getPlatformConfig } from "@/lib/platform";
import { PricingForm } from "./_components/pricing-form";

export default async function AdminSettings() {
  const cfg = await getPlatformConfig();

  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader
        eyebrow="Platform"
        title="Pricing & currency"
        description="Controls the prices shown on the landing page and /billing across the platform."
      />

      <Card>
        <CardHeader>
          <CardTitle>Platform pricing</CardTitle>
          <CardDescription>
            Updates are visible across the public site within ~60 seconds (cache TTL).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingForm
            initial={{
              currency: cfg.currency,
              priceStudioCents: cfg.priceStudioCents,
              priceMultiCents: cfg.priceMultiCents,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Razorpay</CardTitle>
          <CardDescription>
            Subscription processing for the platform. These come from environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="RAZORPAY_KEY_ID" value={mask(process.env.RAZORPAY_KEY_ID)} />
          <Row label="RAZORPAY_KEY_SECRET" value={mask(process.env.RAZORPAY_KEY_SECRET)} />
          <Row label="RAZORPAY_PLAN_STUDIO" value={process.env.RAZORPAY_PLAN_STUDIO || "—"} />
          <Row label="RAZORPAY_PLAN_MULTI" value={process.env.RAZORPAY_PLAN_MULTI || "—"} />
          <Row label="RAZORPAY_WEBHOOK_SECRET" value={mask(process.env.RAZORPAY_WEBHOOK_SECRET)} />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}

function mask(v: string | undefined) {
  if (!v) return "Not set";
  if (v.length < 8) return "•".repeat(v.length);
  return `${v.slice(0, 4)}${"•".repeat(8)}${v.slice(-4)}`;
}
