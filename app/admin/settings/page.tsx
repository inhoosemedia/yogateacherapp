import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getPlatformConfig } from "@/lib/platform";
import {
  PLATFORM_KEYS,
  PLATFORM_KEY_LIST,
  getKeyStatuses,
} from "@/lib/secrets";
import { IconExternalLink } from "@tabler/icons-react";
import {
  ApiKeysForm,
  type KeyMeta,
} from "./_components/api-keys-form";
import { PricingForm } from "./_components/pricing-form";

export default async function AdminSettings() {
  const cfg = await getPlatformConfig();
  const statuses = await getKeyStatuses();
  const metas: KeyMeta[] = PLATFORM_KEY_LIST.map((k) => ({
    key: k,
    label: PLATFORM_KEYS[k].label,
    hint: PLATFORM_KEYS[k].hint,
    secret: PLATFORM_KEYS[k].secret,
    group: PLATFORM_KEYS[k].group,
  }));

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="Platform"
        title="Platform settings"
        description="Pricing shown on the public site, and the API keys that power email + payments."
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
          <CardTitle>API keys</CardTitle>
          <CardDescription>
            Stored in <code className="text-xs px-1 py-0.5 rounded bg-secondary">platform_setting</code>{" "}
            (DB) and read at request time, with environment variables as a fallback.
            Saved secrets show as <code className="text-xs px-1 py-0.5 rounded bg-secondary">••••••••</code> —
            leave them blank to keep the saved value, or type a new value to rotate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeysForm metas={metas} initial={statuses} />
        </CardContent>
      </Card>

      <GoogleAnalyticsCard />
    </div>
  );
}

function GoogleAnalyticsCard() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const signupConv = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_CONVERSION;
  const looksLikeGA4 = id?.startsWith("G-");
  const looksLikeAds = id?.startsWith("AW-");
  const dashboardUrl = looksLikeGA4
    ? "https://analytics.google.com/analytics/web/"
    : "https://ads.google.com/aw/conversions";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Google Analytics / Ads
          <span
            className={
              "ml-2 inline-block size-2 rounded-full " +
              (id ? "bg-emerald-500" : "bg-stone-300")
            }
            aria-label={id ? "Tracking ID configured" : "No tracking ID"}
          />
        </CardTitle>
        <CardDescription>
          gtag.js loads on every public page when an ID is set. Conversion
          events fire from sign-up (and other actions as you add them).
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <Row
          label="Tracking ID"
          value={id ? id : "Not set — add NEXT_PUBLIC_GOOGLE_ADS_ID env var"}
          mono
        />
        <Row
          label="Detected type"
          value={
            looksLikeGA4
              ? "GA4 property"
              : looksLikeAds
                ? "Google Ads account"
                : id
                  ? "Unknown — should start with G- or AW-"
                  : "—"
          }
        />
        <Row
          label="Sign-up conversion"
          value={
            signupConv
              ? signupConv
              : "Not set — add NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_CONVERSION"
          }
          mono
        />
        {id && (
          <div className="pt-2 flex flex-wrap gap-2">
            <a
              href={dashboardUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Open {looksLikeGA4 ? "Google Analytics" : "Google Ads"}
              <IconExternalLink className="size-3.5" />
            </a>
            <a
              href={`https://tagassistant.google.com/?id=${encodeURIComponent(id)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Test in Tag Assistant
              <IconExternalLink className="size-3.5" />
            </a>
          </div>
        )}
        <p className="text-xs text-muted-foreground pt-2">
          Tracking ID is a public env var (the <code className="text-[11px] px-1 py-0.5 rounded bg-secondary">NEXT_PUBLIC_</code>{" "}
          prefix means it ends up in the browser bundle, which is fine — gtag
          IDs are not secret). Change it in Vercel → Project Settings → Environment Variables.
        </p>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground text-xs uppercase tracking-[0.12em]">
        {label}
      </span>
      <span
        className={
          (mono ? "font-mono text-[11px]" : "text-sm") + " text-right truncate"
        }
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
