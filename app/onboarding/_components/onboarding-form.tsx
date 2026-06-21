"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_OPTIONS, TIMEZONE_OPTIONS } from "@/lib/format";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createStudio } from "../actions";

export function OnboardingForm({ nextPath }: { nextPath?: string }) {
  const [pending, start] = useTransition();
  const [tz, setTz] = useState("America/New_York");
  const [currency, setCurrency] = useState("USD");

  const buyMode = nextPath?.startsWith("/billing");

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        fd.set("timezone", tz);
        fd.set("currency", currency);
        if (nextPath) fd.set("next", nextPath);
        start(async () => {
          try {
            await createStudio(fd);
          } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            // Next redirects throw — only surface real errors
            if (!msg.includes("NEXT_REDIRECT")) toast.error(msg);
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Studio name</Label>
        <Input id="name" name="name" required placeholder="Sunrise Yoga" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={tz} onValueChange={setTz}>
            <SelectTrigger id="timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {TIMEZONE_OPTIONS.map((group) => (
                <SelectGroup key={group.group}>
                  <SelectLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {group.group}
                  </SelectLabel>
                  {group.zones.map((z) => (
                    <SelectItem key={z.value} value={z.value}>
                      {z.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {CURRENCY_OPTIONS.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? "Creating studio…"
          : buyMode
            ? "Create studio + continue to checkout"
            : "Create studio"}
      </Button>
    </form>
  );
}
