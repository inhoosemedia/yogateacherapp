"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Persistent bottom CTA on mobile only. Shows after 600px of scroll (so it
// doesn't fight the hero's primary buttons). Always offers the fastest
// path to revenue. Dismissable via "✕" — choice is preserved in
// localStorage, so we never re-show on the same device.

const STORAGE_KEY = "yt:mobile-cta-dismissed";

export function StickyMobileCta({
  primaryHref = "/sign-up",
  primaryLabel = "Start free",
  secondaryHref = "/pricing",
  secondaryLabel = "Subscribe now",
}: {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") return;
    } catch {
      // localStorage blocked — that's fine, show the bar
    }
    setDismissed(false);
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={
        "md:hidden fixed bottom-3 inset-x-3 z-40 transition-all duration-300 " +
        (visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none")
      }
    >
      <div className="bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 px-4 py-3 flex items-center gap-2">
        <Link
          href={primaryHref}
          className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl bg-primary-foreground text-primary"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="text-sm font-medium px-3 py-2.5 rounded-xl border border-primary-foreground/25"
        >
          {secondaryLabel}
        </Link>
        <button
          aria-label="Dismiss"
          onClick={() => {
            try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
            setDismissed(true);
          }}
          className="size-7 rounded-full flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
