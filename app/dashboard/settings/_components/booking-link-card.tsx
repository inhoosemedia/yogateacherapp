"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconQrcode,
} from "@tabler/icons-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function BookingLinkCard({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

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

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) {
      toast.error("Couldn't render QR code");
      return;
    }
    const link = document.createElement("a");
    link.download = `${slug}-booking-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR code downloaded");
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
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setQrOpen(true)}
        >
          <IconQrcode className="size-4" />
          QR code
        </Button>
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Booking link QR code</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Print and put it on your studio door, or screenshot for Instagram.
          </p>
          <div
            ref={qrRef}
            className="flex items-center justify-center bg-white rounded-xl p-6 ring-1 ring-border"
          >
            {origin && (
              <QRCodeCanvas
                value={url}
                size={256}
                bgColor="#ffffff"
                fgColor="#3f5141"
                level="M"
                includeMargin
              />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setQrOpen(false)}>
              Close
            </Button>
            <Button onClick={downloadQr}>Download PNG</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
