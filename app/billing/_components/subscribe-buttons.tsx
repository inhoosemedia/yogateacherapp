"use client";

import { Button } from "@/components/ui/button";
import { trackSubscription } from "@/lib/gtag";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function SubscribeButtons({
  tier,
  enabled,
  featured,
  autoFire,
}: {
  tier: "studio" | "multi_studio";
  enabled: boolean;
  featured?: boolean;
  /** If true, fire the subscribe request automatically on mount. Used by the
   * "subscribe immediately" path arriving at /billing?subscribe=studio. */
  autoFire?: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const firedRef = useRef(false);

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
          trackSubscription(tier);
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

  // Auto-fire when arriving via /pricing → /sign-up → /onboarding →
  // /billing?subscribe=tier flow. One shot only; the ref guards StrictMode
  // double-invoke and the fact that React 19 is happy to re-run effects on
  // search-param changes.
  useEffect(() => {
    if (autoFire && enabled && !firedRef.current) {
      firedRef.current = true;
      subscribe();
    }
    // subscribe is intentionally excluded from deps — it's recreated each
    // render and we only want this effect to run on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFire, enabled]);

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
          : autoFire && enabled
            ? "Continuing to checkout…"
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
