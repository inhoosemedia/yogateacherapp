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
import { sendAdminTestEmail, updatePlatformApiKeys } from "../actions";

export type KeyMeta = {
  key: string;
  label: string;
  hint: string;
  secret: boolean;
  group: string;
};

export type KeyState = {
  source: "db" | "env" | "unset";
  hasValue: boolean;
  value: string | null;
};

type FormProps = {
  metas: KeyMeta[];
  initial: Record<string, KeyState>;
};

const GROUP_LABEL: Record<string, string> = {
  email: "Email (Resend)",
  razorpay: "Razorpay (platform billing)",
  stripe: "Stripe (platform billing)",
  platform: "Platform",
  ops: "Operations",
};

export function ApiKeysForm({ metas, initial }: FormProps) {
  const [pending, start] = useTransition();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const m of metas) {
      v[m.key] = initial[m.key]?.value ?? "";
    }
    return v;
  });
  const [secretsTouched, setSecretsTouched] = useState<Record<string, boolean>>(
    {},
  );
  const [testing, startTest] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      // Build the patch: for non-secrets always send the value (even if blank
      // → clears). For secrets, send the typed value if user touched the
      // field, otherwise the __keep__ sentinel preserves whatever's stored.
      const patch: Record<string, string> = {};
      for (const m of metas) {
        if (m.secret) {
          if (secretsTouched[m.key]) {
            patch[m.key] = values[m.key] ?? "";
          } else {
            patch[m.key] = "__keep__";
          }
        } else {
          patch[m.key] = values[m.key] ?? "";
        }
      }
      try {
        await updatePlatformApiKeys(patch);
        toast.success("API keys saved");
        setSecretsTouched({});
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  const sendTest = () =>
    startTest(async () => {
      const r = await sendAdminTestEmail();
      if (r.ok) toast.success("Test email sent — check your inbox");
      else toast.error(r.error ?? "Send failed");
    });

  // Group metas by group for nicer rendering
  const groups: Record<string, KeyMeta[]> = {};
  for (const m of metas) {
    (groups[m.group] ??= []).push(m);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {Object.entries(groups).map(([groupKey, groupMetas]) => (
        <section key={groupKey} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-display tracking-tight">
              {GROUP_LABEL[groupKey] ?? groupKey}
            </h3>
            {groupKey === "email" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={sendTest}
                disabled={testing}
                className="ml-auto h-7 text-xs"
              >
                {testing ? "Sending…" : "Send test email"}
              </Button>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            {groupMetas.map((m) => {
              const state = initial[m.key];
              const isSecret = m.secret;
              const hasSaved = state?.hasValue ?? false;
              const sourceLabel =
                state?.source === "db"
                  ? "saved in DB"
                  : state?.source === "env"
                    ? "from env var"
                    : "not set";
              return m.key === "platform_billing_provider" ? (
                <ProviderField
                  key={m.key}
                  meta={m}
                  value={values[m.key] ?? ""}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [m.key]: v }))
                  }
                  sourceLabel={sourceLabel}
                  disabled={pending}
                />
              ) : (
                <div key={m.key} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <Label htmlFor={m.key} className="text-sm">
                      {m.label}
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {sourceLabel}
                      {hasSaved && (
                        <span
                          className="ml-1.5 inline-block size-1.5 rounded-full bg-emerald-500 align-middle"
                          aria-label="set"
                        />
                      )}
                    </span>
                  </div>
                  <Input
                    id={m.key}
                    type={isSecret ? "password" : "text"}
                    value={
                      isSecret
                        ? secretsTouched[m.key]
                          ? values[m.key] ?? ""
                          : ""
                        : values[m.key] ?? ""
                    }
                    onChange={(e) => {
                      if (isSecret) {
                        setSecretsTouched((t) => ({ ...t, [m.key]: true }));
                      }
                      setValues((prev) => ({
                        ...prev,
                        [m.key]: e.target.value,
                      }));
                    }}
                    placeholder={
                      isSecret && hasSaved
                        ? "••••••••  (saved — type to replace)"
                        : ""
                    }
                    autoComplete="off"
                    spellCheck={false}
                    disabled={pending}
                  />
                  <p className="text-[11px] text-muted-foreground">{m.hint}</p>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save API keys"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Secrets are masked. Leave a secret field blank to keep the saved
          value. Empty an unmasked field to clear it (falls back to env).
        </span>
      </div>
    </form>
  );
}

function ProviderField({
  meta,
  value,
  onChange,
  sourceLabel,
  disabled,
}: {
  meta: KeyMeta;
  value: string;
  onChange: (v: string) => void;
  sourceLabel: string;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={meta.key} className="text-sm">
          {meta.label}
        </Label>
        <span className="text-[11px] text-muted-foreground">{sourceLabel}</span>
      </div>
      <Select
        value={value || "razorpay"}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id={meta.key}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="razorpay">Razorpay</SelectItem>
          <SelectItem value="stripe">Stripe</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-[11px] text-muted-foreground">{meta.hint}</p>
    </div>
  );
}
