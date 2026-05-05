import "server-only";
import { db } from "@/db/drizzle";
import { platformSetting } from "@/db/schema";
import { unstable_cache } from "next/cache";

const DEFAULTS = {
  currency: "USD",
  price_studio_cents: "2900",
  price_multi_cents: "7900",
};

export type PlatformConfig = {
  currency: string;
  priceStudioCents: number;
  priceMultiCents: number;
};

async function loadConfig(): Promise<PlatformConfig> {
  const rows = await db.select().from(platformSetting);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    currency: map.get("currency") ?? DEFAULTS.currency,
    priceStudioCents: parseInt(
      map.get("price_studio_cents") ?? DEFAULTS.price_studio_cents,
      10,
    ),
    priceMultiCents: parseInt(
      map.get("price_multi_cents") ?? DEFAULTS.price_multi_cents,
      10,
    ),
  };
}

// Cache for 60s — admin updates revalidate via revalidateTag
export const getPlatformConfig = unstable_cache(loadConfig, ["platform-config"], {
  revalidate: 60,
  tags: ["platform-config"],
});
