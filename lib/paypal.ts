import "server-only";

import { getSecret } from "@/lib/secrets";

/**
 * Lightweight PayPal REST helpers. Avoids the heavy @paypal/* SDKs — we only
 * need 5 endpoints (token, create-order, capture-order, verify-webhook,
 * create-subscription). Used for both studio-direct member payments AND the
 * platform-level subscription billing.
 */

export type PayPalCreds = {
  clientId: string;
  clientSecret: string;
  mode: "live" | "sandbox";
};

function apiBase(mode: "live" | "sandbox"): string {
  return mode === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

/** OAuth client-credentials token. Returns access_token + expiry. */
async function fetchToken(creds: PayPalCreds): Promise<string> {
  const basic = Buffer.from(
    `${creds.clientId}:${creds.clientSecret}`,
  ).toString("base64");
  const r = await fetch(`${apiBase(creds.mode)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`PayPal token fetch failed (${r.status}): ${t.slice(0, 200)}`);
  }
  const j = (await r.json()) as { access_token: string };
  return j.access_token;
}

/** Create a PayPal order for a one-off member-package purchase. */
export async function createPayPalOrder(
  creds: PayPalCreds,
  input: {
    amountCents: number;
    currency: string;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    customId: string; // we embed studio_id:package_id:email for the webhook
  },
): Promise<{ id: string; approveUrl: string }> {
  const token = await fetchToken(creds);
  const amount = (input.amountCents / 100).toFixed(2);
  const r = await fetch(`${apiBase(creds.mode)}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: input.customId,
          description: input.description.slice(0, 127),
          amount: { currency_code: input.currency, value: amount },
        },
      ],
      application_context: {
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
        user_action: "PAY_NOW",
      },
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`PayPal create-order failed (${r.status}): ${t.slice(0, 300)}`);
  }
  const j = (await r.json()) as {
    id: string;
    links: { rel: string; href: string }[];
  };
  const approve = j.links.find((l) => l.rel === "approve");
  if (!approve) throw new Error("PayPal create-order: missing approve link");
  return { id: j.id, approveUrl: approve.href };
}

/** Capture a previously-approved PayPal order. */
export async function capturePayPalOrder(
  creds: PayPalCreds,
  orderId: string,
): Promise<{
  status: string;
  captureId: string | null;
  customId: string | null;
}> {
  const token = await fetchToken(creds);
  const r = await fetch(
    `${apiBase(creds.mode)}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!r.ok) {
    const t = await r.text();
    // 422 / "ORDER_ALREADY_CAPTURED" can happen on retry — surface but still parse.
    throw new Error(`PayPal capture failed (${r.status}): ${t.slice(0, 300)}`);
  }
  const j = (await r.json()) as {
    status: string;
    purchase_units?: {
      custom_id?: string;
      payments?: { captures?: { id: string; custom_id?: string }[] };
    }[];
  };
  const cap = j.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    status: j.status,
    captureId: cap?.id ?? null,
    customId: cap?.custom_id ?? j.purchase_units?.[0]?.custom_id ?? null,
  };
}

/**
 * Verify a webhook event signature against the registered webhook ID using
 * PayPal's verify-webhook-signature API.
 */
export async function verifyPayPalWebhook(input: {
  creds: PayPalCreds;
  webhookId: string;
  headers: Headers;
  rawBody: string;
}): Promise<boolean> {
  const h = (k: string) => input.headers.get(k) ?? "";
  const body = {
    auth_algo: h("paypal-auth-algo"),
    cert_url: h("paypal-cert-url"),
    transmission_id: h("paypal-transmission-id"),
    transmission_sig: h("paypal-transmission-sig"),
    transmission_time: h("paypal-transmission-time"),
    webhook_id: input.webhookId,
    webhook_event: JSON.parse(input.rawBody),
  };
  const token = await fetchToken(input.creds);
  const r = await fetch(
    `${apiBase(input.creds.mode)}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!r.ok) return false;
  const j = (await r.json()) as { verification_status?: string };
  return j.verification_status === "SUCCESS";
}

/** Create a PayPal subscription (used by platform billing). */
export async function createPayPalSubscription(
  creds: PayPalCreds,
  input: {
    planId: string;
    returnUrl: string;
    cancelUrl: string;
    customId: string;
    subscriberEmail?: string;
  },
): Promise<{ id: string; approveUrl: string }> {
  const token = await fetchToken(creds);
  const r = await fetch(`${apiBase(creds.mode)}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: input.planId,
      custom_id: input.customId,
      subscriber: input.subscriberEmail
        ? { email_address: input.subscriberEmail }
        : undefined,
      application_context: {
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
        user_action: "SUBSCRIBE_NOW",
      },
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(
      `PayPal create-subscription failed (${r.status}): ${t.slice(0, 300)}`,
    );
  }
  const j = (await r.json()) as {
    id: string;
    links: { rel: string; href: string }[];
  };
  const approve = j.links.find((l) => l.rel === "approve");
  if (!approve) throw new Error("PayPal subscription: missing approve link");
  return { id: j.id, approveUrl: approve.href };
}

/** Resolve platform-level PayPal credentials from secrets / env. */
export async function getPlatformPayPalCreds(): Promise<PayPalCreds | null> {
  const clientId = await getSecret("paypal_client_id");
  const clientSecret = await getSecret("paypal_client_secret");
  if (!clientId || !clientSecret) return null;
  const mode = (await getSecret("paypal_mode"))?.toLowerCase() === "sandbox"
    ? "sandbox"
    : "live";
  return { clientId, clientSecret, mode };
}

/** Resolve studio-direct PayPal credentials from a studio row. */
export function studioPayPalCreds(s: {
  studioPaypalClientId: string | null;
  studioPaypalClientSecret: string | null;
  studioPaypalMode: string | null;
}): PayPalCreds | null {
  if (!s.studioPaypalClientId || !s.studioPaypalClientSecret) return null;
  return {
    clientId: s.studioPaypalClientId,
    clientSecret: s.studioPaypalClientSecret,
    mode: s.studioPaypalMode === "sandbox" ? "sandbox" : "live",
  };
}
