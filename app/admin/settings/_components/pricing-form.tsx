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
import { updatePlatformConfig } from "../actions";

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AUD"];

export function PricingForm({
  initial,
}: {
  initial: {
    currency: string;
    priceStudioCents: number;
    priceMultiCents: number;
  };
}) {
  const [pending, start] = useTransition();
  const [currency, setCurrency] = useState(initial.currency);
  const [studio, setStudio] = useState(
    (initial.priceStudioCents / 100).toFixed(2),
  );
  const [multi, setMulti] = useState(
    (initial.priceMultiCents / 100).toFixed(2),
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      try {
        await updatePlatformConfig({
          currency,
          priceStudioCents: Math.round(parseFloat(studio) * 100),
          priceMultiCents: Math.round(parseFloat(multi) * 100),
        });
        toast.success("Platform pricing updated");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
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
        <p className="text-xs text-muted-foreground">
          Note: changing currency does not convert amounts. Update prices
          below to match the new currency.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studio">Studio plan / month</Label>
          <Input
            id="studio"
            type="number"
            step="0.01"
            min="0"
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="multi">Multi-studio plan / month</Label>
          <Input
            id="multi"
            type="number"
            step="0.01"
            min="0"
            value={multi}
            onChange={(e) => setMulti(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save pricing"}
      </Button>
    </form>
  );
}
