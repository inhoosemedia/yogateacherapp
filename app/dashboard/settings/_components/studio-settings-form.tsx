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
import { updateStudioSettings } from "../actions";

type Studio = {
  id: string;
  name: string;
  timezone: string;
  currency: string;
};

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Australia/Sydney",
];
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AUD"];

export function StudioSettingsForm({ studio }: { studio: Studio }) {
  const [pending, start] = useTransition();
  const [name, setName] = useState(studio.name);
  const [tz, setTz] = useState(studio.timezone);
  const [currency, setCurrency] = useState(studio.currency);

  return (
    <form
      className="space-y-4"
      action={() =>
        start(async () => {
          try {
            await updateStudioSettings({
              id: studio.id,
              name,
              timezone: tz,
              currency,
            });
            toast.success("Studio updated");
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Update failed");
          }
        })
      }
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={tz} onValueChange={setTz}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
