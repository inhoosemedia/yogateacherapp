"use client";

import {
  CalcShell,
  NumberInput,
  ResultRow,
  fmt,
} from "@/components/seo/calc-shell";
import { useState } from "react";

export function LtvCalc() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(99);
  const [churn, setChurn] = useState(7);

  const churnRate = Math.max(churn / 100, 0.001);
  const lifetimeMonths = 1 / churnRate;
  const ltv = monthlyRevenue * lifetimeMonths;
  const maxCac = ltv / 3; // healthy LTV:CAC of 3:1

  const status =
    churn <= 5
      ? "excellent"
      : churn <= 10
        ? "typical"
        : "leaking";

  return (
    <CalcShell
      inputs={
        <>
          <NumberInput
            label="Average monthly revenue per member"
            hint="Blended across all your plans"
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
            prefix="$"
          />
          <NumberInput
            label="Monthly churn rate"
            hint="% of members who don't return next month"
            value={churn}
            onChange={setChurn}
            suffix="%"
            step="0.5"
          />
        </>
      }
      results={
        <>
          <ResultRow
            label="Lifetime value (LTV)"
            value={fmt.money(ltv)}
            emphasis
          />
          <ResultRow
            label="Average member lifetime"
            value={`${Math.round(lifetimeMonths)} mo`}
          />
          <ResultRow
            label="Max to spend acquiring 1 member"
            value={fmt.money(maxCac)}
          />
        </>
      }
      takeaway={
        status === "excellent" ? (
          <>
            <strong className="text-foreground">Excellent retention.</strong>{" "}
            5% or lower monthly churn is exceptional for boutique yoga.
            Spend confidently on acquisition.
          </>
        ) : status === "typical" ? (
          <>
            <strong className="text-foreground">Typical for boutique.</strong>{" "}
            6–10% churn is the boutique-yoga norm. Worth keeping a close
            eye on the cohort 30 days post-signup — that&apos;s where most
            leaks happen.
          </>
        ) : (
          <>
            <strong className="text-foreground">Leaking.</strong> Over 10%
            monthly churn caps LTV painfully. Audit the first 30 days post-
            signup; that&apos;s where the leak almost always starts.
          </>
        )
      }
      ctaTitle="Track real retention, not estimates"
      ctaBody="YogaTeacher reports your actual monthly retention cohort by cohort. Stop guessing."
    />
  );
}
