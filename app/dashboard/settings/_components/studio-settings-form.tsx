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
import { updateStudioSettings } from "../actions";

type Studio = {
  id: string;
  name: string;
  timezone: string;
  currency: string;
  logoUrl: string | null;
};

export function StudioSettingsForm({ studio }: { studio: Studio }) {
  const [pending, start] = useTransition();
  const [name, setName] = useState(studio.name);
  const [tz, setTz] = useState(studio.timezone);
  const [currency, setCurrency] = useState(studio.currency);
  const [logoUrl, setLogoUrl] = useState(studio.logoUrl ?? "");

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
              logoUrl,
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
      <div className="space-y-2">
        <Label htmlFor="logoUrl">
          Logo URL{" "}
          <span className="text-muted-foreground/70 font-normal">— optional</span>
        </Label>
        <Input
          id="logoUrl"
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://your-cdn.com/logo.png"
          autoComplete="off"
        />
        {logoUrl && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-muted-foreground">Preview:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Studio logo preview"
              className="size-10 rounded-md object-contain border border-border bg-card"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
              }}
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Shown on your dashboard sidebar and the public booking page. Use a
          square image (PNG/SVG) hosted somewhere public — your website,
          Cloudinary, Imgur, S3, etc.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={tz} onValueChange={setTz}>
            <SelectTrigger>
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
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
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
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
