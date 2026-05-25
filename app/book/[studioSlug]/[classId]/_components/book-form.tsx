"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackBooking } from "@/lib/gtag";
import {
  IconCheck,
  IconCircleCheck,
  IconHourglassHigh,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  publicBookClass,
  publicJoinWaitlist,
  type BookResult,
} from "../../actions";

export function BookForm({
  studioSlug,
  scheduledClassId,
  className,
  startsAt,
  initiallyFull = false,
}: {
  studioSlug: string;
  scheduledClassId: string;
  className: string;
  startsAt: Date;
  initiallyFull?: boolean;
}) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<BookResult | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"book" | "waitlist">(
    initiallyFull ? "waitlist" : "book",
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const payload = {
        studioSlug,
        scheduledClassId,
        fullName,
        email,
        phone,
      };
      const r =
        mode === "waitlist"
          ? await publicJoinWaitlist(payload)
          : await publicBookClass(payload);
      // If we tried to book and the class went full between page-load and
      // submit, switch to waitlist mode and tell the user.
      if (!r.ok && r.full) {
        setMode("waitlist");
        toast.message("That class just filled — add yourself to the waitlist?");
        return;
      }
      setResult(r);
      if (!r.ok) {
        toast.error(r.error);
      } else if (!r.waitlisted) {
        // Only count an actual booking as a conversion (not a waitlist join).
        trackBooking(className);
      }
    });
  };

  if (result?.ok && result.waitlisted) {
    return (
      <div className="text-center py-4">
        <div className="size-14 rounded-full bg-amber-50 ring-1 ring-amber-200 flex items-center justify-center mx-auto">
          <IconHourglassHigh className="size-7 text-amber-700" />
        </div>
        <h3 className="font-display text-2xl mt-5 tracking-tight">
          You&apos;re on the waitlist
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          We&apos;ll email you the moment a spot opens for{" "}
          <span className="text-foreground font-medium">{className}</span> on{" "}
          <span className="text-foreground font-medium">
            {new Date(startsAt).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          .
        </p>
        <div className="mt-6">
          <Link
            href={`/book/${studioSlug}`}
            className="text-sm text-primary hover:underline"
          >
            Browse other classes →
          </Link>
        </div>
      </div>
    );
  }

  if (result?.ok) {
    return (
      <div className="text-center py-4">
        <div className="size-14 rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mx-auto">
          <IconCircleCheck className="size-7 text-emerald-600" />
        </div>
        <h3 className="font-display text-2xl mt-5 tracking-tight">
          You&apos;re booked!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          See you at <span className="text-foreground font-medium">{className}</span>{" "}
          on{" "}
          <span className="text-foreground font-medium">
            {new Date(startsAt).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            at{" "}
            {new Date(startsAt).toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          .
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/70 text-xs text-muted-foreground">
          {result.usedCredit ? (
            <>
              <IconSparkles className="size-3.5 text-primary" />
              One credit used from your active package
            </>
          ) : (
            <>
              <IconCheck className="size-3.5 text-primary" />
              Pay at the studio when you arrive
            </>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          A confirmation email is on its way.
        </p>
        <div className="mt-6">
          <Link
            href={`/book/${studioSlug}`}
            className="text-sm text-primary hover:underline"
          >
            Book another class →
          </Link>
        </div>
      </div>
    );
  }

  const isWaitlist = mode === "waitlist";

  return (
    <form onSubmit={submit} className="space-y-4">
      {isWaitlist && (
        <div className="rounded-xl bg-amber-50/60 ring-1 ring-amber-200 p-3 flex items-start gap-3">
          <IconHourglassHigh className="size-4 text-amber-700 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-900">
            <div className="font-medium">This class is full.</div>
            <p className="text-xs text-amber-900/80 mt-0.5">
              Join the waitlist — we&apos;ll email you the moment a seat opens.
            </p>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          disabled={pending}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-muted-foreground/70">(optional)</span>
          </Label>
          <Input
            id="phone"
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
        size="lg"
        className="w-full"
        disabled={pending || !fullName.trim() || !email.trim()}
      >
        {pending
          ? isWaitlist
            ? "Joining…"
            : "Reserving…"
          : isWaitlist
            ? "Join the waitlist"
            : "Reserve my spot"}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        We&apos;ll match you with your existing membership if you&apos;ve been here
        before.
      </p>
    </form>
  );
}
