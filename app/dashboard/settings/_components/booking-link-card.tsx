"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconQrcode,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function BookingLinkCard({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = origin ? `${origin}/book/${slug}` : `/book/${slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Booking link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Share this link via WhatsApp, Instagram, SMS or your website. Members
        book themselves — they don&apos;t need an account.
      </p>
      <div className="flex gap-2">
        <Input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="font-mono text-xs"
        />
        <Button
          type="button"
          variant="outline"
          onClick={copy}
          className="shrink-0"
        >
          {copied ? (
            <>
              <IconCheck className="size-4" /> Copied
            </>
          ) : (
            <>
              <IconCopy className="size-4" /> Copy
            </>
          )}
        </Button>
      </div>
      <div className="flex gap-2">
        <Link href={`/book/${slug}`} target="_blank">
          <Button variant="outline" size="sm">
            <IconExternalLink className="size-4" />
            Open public schedule
          </Button>
        </Link>
        <a
          href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Button variant="outline" size="sm">
            <IconQrcode className="size-4" />
            QR code
          </Button>
        </a>
      </div>
    </div>
  );
}
