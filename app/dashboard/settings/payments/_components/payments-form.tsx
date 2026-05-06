"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateStudioRazorpay } from "../../actions";

export function PaymentsForm({
  initial,
  webhookUrl,
}: {
  initial: { keyId: string; hasSecret: boolean; hasWebhookSecret: boolean };
  webhookUrl: string;
}) {
  const [pending, start] = useTransition();
  const [keyId, setKeyId] = useState(initial.keyId);
  const [keySecret, setKeySecret] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      try {
        // If user leaves a secret field blank, keep the existing value by
        // sending the placeholder mark; server clears on empty string only
        // when the user explicitly disables. To avoid wiping unintentionally
        // we send the current secret only when user typed something.
        await updateStudioRazorpay({
          keyId,
          keySecret: keySecret || (initial.hasSecret ? "__keep__" : ""),
          webhookSecret:
            webhookSecret || (initial.hasWebhookSecret ? "__keep__" : ""),
        });
        toast.success("Payment settings saved");
        setKeySecret("");
        setWebhookSecret("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="keyId">Key ID</Label>
        <Input
          id="keyId"
          value={keyId}
          onChange={(e) => setKeyId(e.target.value)}
          placeholder="rzp_test_xxxxxxxxxx"
          autoComplete="off"
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="keySecret">
          Key Secret{" "}
          {initial.hasSecret && (
            <span className="text-xs text-muted-foreground">
              (saved — leave blank to keep)
            </span>
          )}
        </Label>
        <Input
          id="keySecret"
          type="password"
          value={keySecret}
          onChange={(e) => setKeySecret(e.target.value)}
          placeholder={initial.hasSecret ? "••••••••" : "Razorpay key secret"}
          autoComplete="off"
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="webhookSecret">
          Webhook Secret{" "}
          {initial.hasWebhookSecret && (
            <span className="text-xs text-muted-foreground">
              (saved — leave blank to keep)
            </span>
          )}
        </Label>
        <Input
          id="webhookSecret"
          type="password"
          value={webhookSecret}
          onChange={(e) => setWebhookSecret(e.target.value)}
          placeholder={
            initial.hasWebhookSecret ? "••••••••" : "From Razorpay → Webhooks"
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
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
