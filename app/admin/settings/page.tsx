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
    </div>
  );
}
