"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

/**
 * Copy-to-clipboard control for the public booking-page link on the dashboard.
 * Shows a brief "Copied" confirmation.
 */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — no-op
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 h-8 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
    >
      {copied ? (
        <>
          <IconCheck className="size-3.5" /> Copied
        </>
      ) : (
        <>
          <IconCopy className="size-3.5" /> Copy link
        </>
      )}
    </button>
  );
}
