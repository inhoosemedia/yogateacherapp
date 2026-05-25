"use client";

import { trackPurchase } from "@/lib/gtag";
import { IconCircleCheck, IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Fires once on mount when the page is rendered with ?paypal_order=… (the
 * return URL after a buyer approves on PayPal). POSTs to the capture endpoint
 * which finalises the order, then strips the query param so a refresh doesn't
 * re-trigger.
 */
export function PayPalCapture({
  studioSlug,
  orderId,
}: {
  studioSlug: string;
  orderId: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"capturing" | "done" | "error">(
    "capturing",
  );
  const [error, setError] = useState<string | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    (async () => {
      try {
        const r = await fetch("/api/checkout/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studioSlug, orderId }),
        });
        const data = await r.json();
        if (!r.ok) {
          setState("error");
          setError(data?.error ?? "Capture failed");
          return;
        }
        setState("done");
        // Fire the conversion. The capture endpoint doesn't return amount/
        // currency so we send the event without monetary details — Google
        // Ads still credits the conversion and can build audiences from it.
        trackPurchase({
          value: 0,
          currency: "USD",
          provider: "paypal",
          transactionId: orderId,
        });
        // Clean the URL so a refresh doesn't re-run capture
        router.replace(`/book/${studioSlug}/packages?paid=1`);
      } catch (e) {
        setState("error");
        setError(e instanceof Error ? e.message : "Network error");
      }
    })();
  }, [studioSlug, orderId, router]);

  if (state === "capturing") {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-sm flex items-start gap-3 mb-6">
        <IconLoader2 className="size-5 animate-spin text-primary mt-0.5 shrink-0" />
        <div>
          <div className="font-medium">Finalising your payment…</div>
          <p className="mt-0.5 text-muted-foreground text-xs">
            PayPal has approved the charge. We&apos;re activating your package now —
            don&apos;t close this tab.
          </p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 mb-6">
        <div className="font-medium">Couldn&apos;t finalise payment</div>
        <p className="mt-0.5 text-rose-800/90 text-xs">
          {error ?? "Try again — if you were charged, contact the studio."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 mb-6 flex items-start gap-3">
      <IconCircleCheck className="size-5 text-emerald-700 mt-0.5 shrink-0" />
      <div>
        <div className="font-medium">Payment captured</div>
        <p className="mt-0.5 text-emerald-800/90 text-xs">
          Your credits are activated. Head back to the schedule to book your
          first class.
        </p>
      </div>
    </div>
  );
}
