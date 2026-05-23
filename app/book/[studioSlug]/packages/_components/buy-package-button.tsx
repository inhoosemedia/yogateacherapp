"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler?: (resp: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
  }) => void;
  modal?: { ondismiss?: () => void };
};

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

async function ensureRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BuyPackageButton({
  studioSlug,
  packageId,
  packageName,
  priceLabel,
  enabled,
  provider,
}: {
  studioSlug: string;
  packageId: string;
  packageName: string;
  priceLabel: string;
  enabled: boolean;
  provider: "paypal" | "razorpay" | "stripe" | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const submitRazorpay = async () => {
    const loaded = await ensureRazorpay();
    if (!loaded) {
      toast.error("Couldn't load Razorpay. Try again.");
      return;
    }
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studioSlug, packageId, fullName, email, phone }),
    });
    const data = await r.json();
    if (!r.ok) {
      toast.error(data?.error ?? "Could not start checkout");
      return;
    }
    const rp = new window.Razorpay!({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: data.studioName,
      description: data.packageName,
      order_id: data.orderId,
      prefill: { name: fullName, email, contact: phone },
      theme: { color: "#3f5141" },
      handler: () => {
        setDone(true);
        toast.success("Payment successful — your package is ready!");
      },
      modal: { ondismiss: () => {} },
    });
    rp.open();
  };

  const submitStripe = async () => {
    const r = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studioSlug, packageId, fullName, email, phone }),
    });
    const data = await r.json();
    if (!r.ok || !data.url) {
      toast.error(data?.error ?? "Could not start checkout");
      return;
    }
    window.location.href = data.url;
  };

  const submitPayPal = async () => {
    const r = await fetch("/api/checkout/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studioSlug, packageId, fullName, email, phone }),
    });
    const data = await r.json();
    if (!r.ok || !data.approveUrl) {
      toast.error(data?.error ?? "Could not start checkout");
      return;
    }
    // PayPal redirect — the public packages page reads ?paypal_order=<id> on
    // return and POSTs to /api/checkout/paypal/capture to finalise.
    window.location.href = data.approveUrl;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      try {
        if (provider === "paypal") {
          await submitPayPal();
        } else if (provider === "stripe") {
          await submitStripe();
        } else {
          await submitRazorpay();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Payment failed");
      }
    });
  };

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
        <div className="font-medium">Purchase complete ✓</div>
        <p className="text-xs mt-0.5 text-emerald-800/90">
          Your credits are active. Head back to the schedule and book a class.
        </p>
      </div>
    );
  }

  const providerName =
    provider === "paypal"
      ? "PayPal"
      : provider === "stripe"
        ? "Stripe"
        : "Razorpay";

  return (
    <>
      <Button
        className="w-full"
        disabled={!enabled}
        onClick={() => setOpen(true)}
      >
        {enabled ? `Buy · ${priceLabel}` : "Pay at the studio"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy {packageName}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            We&apos;ll create your account and activate the package as soon as
            payment succeeds.
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-name">Full name</Label>
              <Input
                id="buy-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                disabled={pending}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="buy-email">Email</Label>
                <Input
                  id="buy-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={pending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buy-phone">Phone</Label>
                <Input
                  id="buy-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  disabled={pending}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={pending || !fullName.trim() || !email.trim()}
            >
              {pending ? "Loading…" : `Pay ${priceLabel}`}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Secured by {providerName} · payment goes directly to the studio.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
