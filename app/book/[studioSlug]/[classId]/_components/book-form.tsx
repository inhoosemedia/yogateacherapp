"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconCheck, IconCircleCheck, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { publicBookClass, type BookResult } from "../../actions";

export function BookForm({
  studioSlug,
  scheduledClassId,
  className,
  startsAt,
}: {
  studioSlug: string;
  scheduledClassId: string;
  className: string;
  startsAt: Date;
}) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<BookResult | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await publicBookClass({
        studioSlug,
        scheduledClassId,
        fullName,
        email,
        phone,
      });
      setResult(r);
      if (!r.ok) toast.error(r.error);
    });
  };

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

  return (
    <form onSubmit={submit} className="space-y-4">
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
        {pending ? "Reserving…" : "Reserve my spot"}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        We&apos;ll match you with your existing membership if you&apos;ve been here
        before.
      </p>
    </form>
  );
}
