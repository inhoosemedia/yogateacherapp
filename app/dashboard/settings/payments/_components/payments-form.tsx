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
import { IconCircleCheck } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  setActiveProvider,
  updateStudioRazorpay,
  updateStudioStripe,
} from "../../actions";

type Provider = "razorpay" | "stripe" | null;

type Props = {
  initial: {
    provider: Provider;
    razorpayKeyId: string;
    hasRazorpaySecret: boolean;
    hasRazorpayWebhookSecret: boolean;
    stripePublishableKey: string;
    hasStripeSecret: boolean;
    hasStripeWebhookSecret: boolean;
    razorpayConfigured: boolean;
    stripeConfigured: boolean;
  };
  razorpayWebhookUrl: string;
  stripeWebhookUrl: string;
};

export function PaymentsForm({ initial, razorpayWebhookUrl, stripeWebhookUrl }: Props) {
  const [activeTab, setActiveTab] = useState<"razorpay" | "stripe">(
    initial.provider === "stripe" ? "stripe" : "razorpay",
  );
  const [provider, setProvider] = useState<Provider>(initial.provider);

  const [pending, start] = useTransition();
  const switchActive = (next: "razorpay" | "stripe") =>
    start(async () => {
      try {
        await setActiveProvider(next);
        setProvider(next);
        toast.success(
          `Members will now check out via ${next === "stripe" ? "Stripe" : "Razorpay"}`,
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
                {provider === "stripe" ? "Stripe" : "Razorpay"}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Switch which provider runs the public-booking checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 flex-wrap">
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
          {!provider && (
            <span className="text-xs text-muted-foreground ml-2">
              Configure one provider below, then activate it.
            </span>
          )}
        </CardContent>
      </Card>

      <div className="inline-flex items-center gap-1 bg-secondary/60 rounded-full p-1 mt-6">
        <button
          onClick={() => setActiveTab("razorpay")}
          className={
            "px-3 py-1 text-xs rounded-full transition-colors " +
            (activeTab === "razorpay"
              ? "bg-card text-foreground shadow-xs ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          Razorpay {initial.razorpayConfigured && "✓"}
        </button>
        <button
          onClick={() => setActiveTab("stripe")}
          className={
            "px-3 py-1 text-xs rounded-full transition-colors " +
            (activeTab === "stripe"
              ? "bg-card text-foreground shadow-xs ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          Stripe {initial.stripeConfigured && "✓"}
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "razorpay" ? (
          <RazorpayCard
            initial={initial}
            webhookUrl={razorpayWebhookUrl}
          />
        ) : (
          <StripeCard initial={initial} webhookUrl={stripeWebhookUrl} />
        )}
      </div>
    </>
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
