"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createStudio } from "../actions";

export function OnboardingForm() {
  const [pending, start] = useTransition();
  const [tz, setTz] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        fd.set("timezone", tz);
        fd.set("currency", currency);
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={tz} onValueChange={setTz}>
            <SelectTrigger id="timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Kolkata">Asia / Kolkata</SelectItem>
              <SelectItem value="America/New_York">America / New York</SelectItem>
              <SelectItem value="America/Los_Angeles">America / Los Angeles</SelectItem>
              <SelectItem value="Europe/London">Europe / London</SelectItem>
              <SelectItem value="Europe/Berlin">Europe / Berlin</SelectItem>
              <SelectItem value="Australia/Sydney">Australia / Sydney</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR ₹</SelectItem>
              <SelectItem value="USD">USD $</SelectItem>
              <SelectItem value="EUR">EUR €</SelectItem>
              <SelectItem value="GBP">GBP £</SelectItem>
              <SelectItem value="AUD">AUD $</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating studio…" : "Create studio"}
      </Button>
    </form>
  );
}
