"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconCircleCheck } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  setActiveProvider,
  updateStudioPayPal,
  updateStudioRazorpay,
  updateStudioStripe,
} from "../../actions";

type Provider = "paypal" | "razorpay" | "stripe" | null;
type Tab = "paypal" | "razorpay" | "stripe";

type Props = {
  initial: {
    provider: Provider;
    razorpayKeyId: string;
    hasRazorpaySecret: boolean;
    hasRazorpayWebhookSecret: boolean;
    stripePublishableKey: string;
    hasStripeSecret: boolean;
    hasStripeWebhookSecret: boolean;
    paypalClientId: string;
    paypalMode: "live" | "sandbox";
    hasPaypalSecret: boolean;
    hasPaypalWebhookId: boolean;
    razorpayConfigured: boolean;
    stripeConfigured: boolean;
    paypalConfigured: boolean;
  };
  razorpayWebhookUrl: string;
  stripeWebhookUrl: string;
  paypalWebhookUrl: string;
};

const PROVIDER_LABEL: Record<Tab, string> = {
  paypal: "PayPal",
  razorpay: "Razorpay",
  stripe: "Stripe",
};

export function PaymentsForm({
  initial,
  razorpayWebhookUrl,
  stripeWebhookUrl,
  paypalWebhookUrl,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(
    initial.provider ?? "paypal",
  );
  const [provider, setProvider] = useState<Provider>(initial.provider);

  const [pending, start] = useTransition();
  const switchActive = (next: Tab) =>
    start(async () => {
      try {
        await setActiveProvider(next);
        setProvider(next);
        toast.success(
          `Members will now check out via ${PROVIDER_LABEL[next]}`,
        );
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            Active provider
            {provider && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <IconCircleCheck className="size-3" />
                {PROVIDER_LABEL[provider]}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Switch which provider runs the public-booking checkout. PayPal is
            the recommended default for a global audience.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 flex-wrap">
          <Button
            variant={provider === "paypal" ? "default" : "outline"}
            size="sm"
            disabled={pending || !initial.paypalConfigured}
            onClick={() => switchActive("paypal")}
            title={
              !initial.paypalConfigured ? "Configure PayPal below first" : ""
            }
          >
            Use PayPal
          </Button>
          <Button
            variant={provider === "stripe" ? "default" : "outline"}
            size="sm"
            disabled={pending || !initial.stripeConfigured}
            onClick={() => switchActive("stripe")}
            title={
              !initial.stripeConfigured ? "Configure Stripe below first" : ""
            }
          >
            Use Stripe
          </Button>
          <Button
            variant={provider === "razorpay" ? "default" : "outline"}
            size="sm"
            disabled={pending || !initial.razorpayConfigured}
            onClick={() => switchActive("razorpay")}
            title={
              !initial.razorpayConfigured
                ? "Configure Razorpay below first"
                : ""
            }
          >
            Use Razorpay
          </Button>
          {!provider && (
            <span className="text-xs text-muted-foreground ml-2">
              Configure one provider below, then activate it.
            </span>
          )}
        </CardContent>
      </Card>

      <div className="inline-flex items-center gap-1 bg-secondary/60 rounded-full p-1 mt-6 flex-wrap">
        <TabBtn
          active={activeTab === "paypal"}
          configured={initial.paypalConfigured}
          onClick={() => setActiveTab("paypal")}
          label="PayPal"
        />
        <TabBtn
          active={activeTab === "stripe"}
          configured={initial.stripeConfigured}
          onClick={() => setActiveTab("stripe")}
          label="Stripe"
        />
        <TabBtn
          active={activeTab === "razorpay"}
          configured={initial.razorpayConfigured}
          onClick={() => setActiveTab("razorpay")}
          label="Razorpay"
        />
      </div>

      <div className="mt-4">
        {activeTab === "paypal" && (
          <PayPalCard initial={initial} webhookUrl={paypalWebhookUrl} />
        )}
        {activeTab === "razorpay" && (
          <RazorpayCard initial={initial} webhookUrl={razorpayWebhookUrl} />
        )}
        {activeTab === "stripe" && (
          <StripeCard initial={initial} webhookUrl={stripeWebhookUrl} />
        )}
      </div>
    </>
  );
}

function TabBtn({
  active,
  configured,
  onClick,
  label,
}: {
  active: boolean;
  configured: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "px-3 py-1 text-xs rounded-full transition-colors " +
        (active
          ? "bg-card text-foreground shadow-xs ring-1 ring-border"
          : "text-muted-foreground hover:text-foreground")
      }
    >
      {label} {configured && "✓"}
    </button>
  );
}

function PayPalCard({
  initial,
  webhookUrl,
}: {
  initial: Props["initial"];
  webhookUrl: string;
}) {
  const [pending, start] = useTransition();
  const [clientId, setClientId] = useState(initial.paypalClientId);
  const [clientSecret, setClientSecret] = useState("");
  const [webhookId, setWebhookId] = useState("");
  const [mode, setMode] = useState<"live" | "sandbox">(initial.paypalMode);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      try {
        await updateStudioPayPal({
          clientId,
          clientSecret:
            clientSecret || (initial.hasPaypalSecret ? "__keep__" : ""),
          webhookId:
            webhookId || (initial.hasPaypalWebhookId ? "__keep__" : ""),
          mode,
        });
        toast.success("PayPal settings saved");
        setClientSecret("");
        setWebhookId("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          PayPal credentials{" "}
          <span
            className={
              "ml-2 inline-block size-2 rounded-full align-middle " +
              (initial.paypalConfigured ? "bg-emerald-500" : "bg-stone-300")
            }
          />
        </CardTitle>
        <CardDescription>
          Sign up at{" "}
          <a
            href="https://developer.paypal.com/dashboard/applications/live"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            developer.paypal.com
          </a>{" "}
          → Apps & Credentials → create a REST app. Sandbox creds live under
          the &ldquo;Sandbox&rdquo; tab; toggle the mode below to match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pp-clientId">Client ID</Label>
              <Input
                id="pp-clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="ASXXXXXXXXXXXXXXXXXX"
                autoComplete="off"
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pp-mode">Mode</Label>
              <Select
                value={mode}
                onValueChange={(v) => setMode(v as "live" | "sandbox")}
                disabled={pending}
              >
                <SelectTrigger id="pp-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-secret">
              Client Secret{" "}
              {initial.hasPaypalSecret && (
                <span className="text-xs text-muted-foreground">
                  (saved — leave blank to keep)
                </span>
              )}
            </Label>
            <Input
              id="pp-secret"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder={
                initial.hasPaypalSecret ? "••••••••" : "PayPal client secret"
              }
              autoComplete="off"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-webhookId">
              Webhook ID{" "}
              {initial.hasPaypalWebhookId && (
                <span className="text-xs text-muted-foreground">
                  (saved — leave blank to keep)
                </span>
              )}
            </Label>
            <Input
              id="pp-webhookId"
              type="password"
              value={webhookId}
              onChange={(e) => setWebhookId(e.target.value)}
              placeholder={
                initial.hasPaypalWebhookId ? "••••••••" : "From PayPal → Webhooks"
              }
              autoComplete="off"
              disabled={pending}
            />
            <p className="text-xs text-muted-foreground">
              Add a webhook in PayPal pointing at{" "}
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-secondary">
                {webhookUrl}
              </code>{" "}
              and subscribe to <strong>PAYMENT.CAPTURE.COMPLETED</strong>. The
              webhook ID is shown on the webhook detail page.
            </p>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save PayPal settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RazorpayCard({
  initial,
  webhookUrl,
}: {
  initial: Props["initial"];
  webhookUrl: string;
}) {
  const [pending, start] = useTransition();
  const [keyId, setKeyId] = useState(initial.razorpayKeyId);
  const [keySecret, setKeySecret] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      try {
        await updateStudioRazorpay({
          keyId,
          keySecret: keySecret || (initial.hasRazorpaySecret ? "__keep__" : ""),
          webhookSecret:
            webhookSecret ||
            (initial.hasRazorpayWebhookSecret ? "__keep__" : ""),
        });
        toast.success("Razorpay settings saved");
        setKeySecret("");
        setWebhookSecret("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Razorpay credentials{" "}
          <span
            className={
              "ml-2 inline-block size-2 rounded-full align-middle " +
              (initial.razorpayConfigured ? "bg-emerald-500" : "bg-stone-300")
            }
          />
        </CardTitle>
        <CardDescription>
          Sign up at{" "}
          <a
            href="https://dashboard.razorpay.com/signup"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            razorpay.com
          </a>{" "}
          → Settings → API Keys.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rzp-keyId">Key ID</Label>
            <Input
              id="rzp-keyId"
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="rzp_test_xxxxxxxxxx"
              autoComplete="off"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rzp-keySecret">
              Key Secret{" "}
              {initial.hasRazorpaySecret && (
                <span className="text-xs text-muted-foreground">
                  (saved — leave blank to keep)
                </span>
              )}
            </Label>
            <Input
              id="rzp-keySecret"
              type="password"
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              placeholder={
                initial.hasRazorpaySecret ? "••••••••" : "Razorpay key secret"
              }
              autoComplete="off"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rzp-webhookSecret">
              Webhook Secret{" "}
              {initial.hasRazorpayWebhookSecret && (
                <span className="text-xs text-muted-foreground">
                  (saved — leave blank to keep)
                </span>
              )}
            </Label>
            <Input
              id="rzp-webhookSecret"
              type="password"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              placeholder={
                initial.hasRazorpayWebhookSecret
                  ? "••••••••"
                  : "From Razorpay → Webhooks"
              }
              autoComplete="off"
              disabled={pending}
            />
            <p className="text-xs text-muted-foreground">
              Add a webhook in Razorpay pointing at{" "}
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-secondary">
                {webhookUrl}
              </code>{" "}
              and subscribe to <strong>payment.captured</strong> +{" "}
              <strong>order.paid</strong>.
            </p>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save Razorpay settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function StripeCard({
  initial,
  webhookUrl,
}: {
  initial: Props["initial"];
  webhookUrl: string;
}) {
  const [pending, start] = useTransition();
  const [publishableKey, setPublishableKey] = useState(
    initial.stripePublishableKey,
  );
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      try {
        await updateStudioStripe({
          publishableKey,
          secretKey: secretKey || (initial.hasStripeSecret ? "__keep__" : ""),
          webhookSecret:
            webhookSecret ||
            (initial.hasStripeWebhookSecret ? "__keep__" : ""),
        });
        toast.success("Stripe settings saved");
        setSecretKey("");
        setWebhookSecret("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Stripe credentials{" "}
          <span
            className={
              "ml-2 inline-block size-2 rounded-full align-middle " +
              (initial.stripeConfigured ? "bg-emerald-500" : "bg-stone-300")
            }
          />
        </CardTitle>
        <CardDescription>
          Sign up at{" "}
          <a
            href="https://dashboard.stripe.com/register"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            stripe.com
          </a>{" "}
          → Developers → API keys.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-pk">Publishable key</Label>
            <Input
              id="stripe-pk"
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              placeholder="pk_live_… or pk_test_…"
              autoComplete="off"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-sk">
              Secret key{" "}
              {initial.hasStripeSecret && (
                <span className="text-xs text-muted-foreground">
                  (saved — leave blank to keep)
                </span>
              )}
            </Label>
            <Input
              id="stripe-sk"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder={
                initial.hasStripeSecret ? "••••••••" : "sk_live_… or sk_test_…"
              }
              autoComplete="off"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-whsec">
              Webhook signing secret{" "}
              {initial.hasStripeWebhookSecret && (
                <span className="text-xs text-muted-foreground">
                  (saved — leave blank to keep)
                </span>
              )}
            </Label>
            <Input
              id="stripe-whsec"
              type="password"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              placeholder={
                initial.hasStripeWebhookSecret ? "••••••••" : "whsec_…"
              }
              autoComplete="off"
              disabled={pending}
            />
            <p className="text-xs text-muted-foreground">
              Add a webhook endpoint in Stripe pointing at{" "}
              <code className="text-[11px] px-1.5 py-0.5 rounded bg-secondary">
                {webhookUrl}
              </code>{" "}
              and subscribe to <strong>checkout.session.completed</strong>.
            </p>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save Stripe settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
