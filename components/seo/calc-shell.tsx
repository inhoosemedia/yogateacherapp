"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight, IconCalculator } from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";

// Shared calculator scaffold — every /tools/* page wraps its inputs +
// results in this. Keeps the design language consistent and removes
// boilerplate from each tool.

export function CalcShell({
  inputs,
  results,
  takeaway,
  ctaTitle = "Built into YogaTeacher",
  ctaBody = "Your studio's actual numbers, live in your dashboard. Try YogaTeacher free for 30 days.",
}: {
  inputs: ReactNode;
  results: ReactNode;
  takeaway?: ReactNode;
  ctaTitle?: string;
  ctaBody?: string;
}) {
  return (
    <>
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
              <IconCalculator className="size-3.5" />
              Inputs
            </div>
            <div className="space-y-5">{inputs}</div>
          </div>
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/[0.04] to-card p-7 shadow-sm">
            <div className="text-[11px] uppercase tracking-[0.18em] text-primary/80 mb-4">
              Result
            </div>
            <div className="space-y-5">{results}</div>
            {takeaway && (
              <div className="mt-6 pt-6 border-t border-primary/15 text-sm text-muted-foreground leading-relaxed">
                {takeaway}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-12 border-t border-border/60">
        <div className="max-w-4xl mx-auto rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 text-center shadow-xl shadow-primary/15">
          <div className="text-[11px] uppercase tracking-[0.24em] opacity-80 mb-3">
            From back-of-envelope to live dashboard
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight !text-primary-foreground">
            {ctaTitle}
          </h2>
          <p className="mt-4 opacity-90 max-w-xl mx-auto">{ctaBody}</p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="!bg-primary-foreground !text-primary hover:!bg-primary-foreground/95 gap-2 cta-lift"
              >
                Start free trial
                <IconArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground hover:!bg-primary-foreground/8 cta-lift"
              >
                See pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Reusable input + result primitives ──────────────────────────────────

export function NumberInput({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  step = "1",
  min,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  min?: number;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-foreground mb-1">{label}</div>
      {hint && (
        <div className="text-xs text-muted-foreground mb-2">{hint}</div>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          step={step}
          min={min}
          inputMode="decimal"
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            onChange(Number.isNaN(n) ? 0 : n);
          }}
          className={
            "w-full bg-canvas border border-border rounded-lg px-3 py-2.5 text-base font-medium tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40 transition " +
            (prefix ? "pl-7 " : "") +
            (suffix ? "pr-12 " : "")
          }
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function ResultRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        "flex items-baseline justify-between gap-4 " +
        (emphasis ? "" : "border-b border-border/40 pb-3")
      }
    >
      <span
        className={
          emphasis
            ? "text-sm uppercase tracking-[0.18em] text-primary/80"
            : "text-sm text-muted-foreground"
        }
      >
        {label}
      </span>
      <span
        className={
          "font-display tabular-nums tracking-tight " +
          (emphasis
            ? "text-4xl md:text-5xl text-primary"
            : "text-2xl text-foreground")
        }
      >
        {value}
      </span>
    </div>
  );
}

export const fmt = {
  money: (n: number, ccy = "$") =>
    Number.isFinite(n)
      ? `${ccy}${Math.round(n).toLocaleString()}`
      : `${ccy}0`,
  pct: (n: number) =>
    Number.isFinite(n) ? `${Math.round(n * 10) / 10}%` : "0%",
  int: (n: number) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString() : "0",
};
