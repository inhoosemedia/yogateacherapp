"use client";

import {
  CalcShell,
  NumberInput,
  ResultRow,
  fmt,
} from "@/components/seo/calc-shell";
import { useState } from "react";

export function RetentionCalc() {
  const [active, setActive] = useState(120);
  const [returned, setReturned] = useState(96);

  const retention = active > 0 ? (returned / active) * 100 : 0;
  const churn = 100 - retention;

  const tier =
    retention >= 90
      ? "elite"
      : retention >= 80
        ? "established"
        : retention >= 70
          ? "growing"
          : "leaking";

  return (
    <CalcShell
      inputs={
        <>
          <NumberInput
            label="Members active last month"
            value={active}
            onChange={setActive}
          />
          <NumberInput
            label="…of those, members who returned this month"
            value={returned}
            onChange={setReturned}
          />
        </>
      }
      results={
        <>
          <ResultRow
            label="Retention rate"
            value={fmt.pct(retention)}
            emphasis
          />
          <ResultRow label="Churn rate" value={fmt.pct(churn)} />
        </>
      }
      takeaway={
        tier === "elite" ? (
          <>
            <strong className="text-foreground">Elite tier.</strong> 90%+
            monthly retention is rare in boutique fitness. Whatever
            you&apos;re doing — community, instructor quality,
            programming — bottle it.
          </>
        ) : tier === "established" ? (
          <>
            <strong className="text-foreground">Established studio.</strong>{" "}
            80–90% is where most healthy boutique studios live. Focus the
            next quarter on the 10–20% who left — what happened in their
            last 14 days?
          </>
        ) : tier === "growing" ? (
          <>
            <strong className="text-foreground">In growth phase.</strong>{" "}
            70–80% is common in year 1–2. Audit the 30-day post-signup
            window — most leaks start in those first three weeks.
          </>
        ) : (
          <>
            <strong className="text-foreground">Leaky bucket.</strong>{" "}
            Below 70% monthly retention, acquisition spend won&apos;t pay
            back. Fix the leak before pouring in more new members.
          </>
        )
      }
      ctaTitle="Track retention without a spreadsheet"
      ctaBody="YogaTeacher reports retention by cohort, by package type, by instructor. Stop guessing why members leave."
    />
  );
}
