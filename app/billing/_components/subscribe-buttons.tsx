"use client";

import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function SubscribeButtons({
  tier,
  enabled,
  featured,
}: {
  tier: "studio" | "multi_studio";
  enabled: boolean;
  featured?: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const subscribe = () =>
    start(async () => {
      setError(null);
      try {
        const res = await fetch("/api/billing/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not start checkout");
        if (data.shortUrl) {
          window.location.href = data.shortUrl;
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed";
        setError(msg);
        toast.error(msg);
      }
    });

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        size="lg"
        variant={featured ? "default" : "outline"}
        onClick={subscribe}
        disabled={!enabled || pending}
      >
        {pending
          ? "Starting checkout…"
          : enabled
            ? "Subscribe"
            : "Coming soon"}
      </Button>
      {error && (
        <p className="text-xs text-rose-700 text-center">{error}</p>
      )}
    </div>
  );
}
