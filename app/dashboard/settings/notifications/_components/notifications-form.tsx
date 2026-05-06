"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateNotificationPrefs } from "../../actions";

type Prefs = {
  bookingConfirmation: boolean;
  bookingCancelled: boolean;
  classReminder: boolean;
  waitlistPromoted: boolean;
};

const ROWS: { key: keyof Prefs; title: string; description: string }[] = [
  {
    key: "bookingConfirmation",
    title: "Booking confirmation",
    description:
      "Sent when a member books a class (admin booking or public link).",
  },
  {
    key: "bookingCancelled",
    title: "Booking cancellation",
    description:
      "Sent when a booking is cancelled — by the studio or because the class was cancelled.",
  },
  {
    key: "classReminder",
    title: "24-hour reminder",
    description: "Friendly nudge the day before the class. Cron-driven.",
  },
  {
    key: "waitlistPromoted",
    title: "Waitlist promoted",
    description:
      "Sent when a member moves off the waitlist into a real booking.",
  },
];

export function NotificationsForm({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [pending, start] = useTransition();

  const set = (key: keyof Prefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    start(async () => {
      try {
        await updateNotificationPrefs(next);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
        setPrefs(prefs); // rollback
      }
    });
  };

  return (
    <div className="space-y-3">
      {ROWS.map((r) => (
        <div
          key={r.key}
          className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
        >
          <div className="min-w-0">
            <Label className="text-sm font-medium">{r.title}</Label>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {r.description}
            </p>
          </div>
          <Switch
            disabled={pending}
            checked={prefs[r.key]}
            onCheckedChange={(v) => set(r.key, v)}
          />
        </div>
      ))}
    </div>
  );
}
