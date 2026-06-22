"use client";

import {
  CalcShell,
  NumberInput,
  ResultRow,
  fmt,
} from "@/components/seo/calc-shell";
import { useState } from "react";

export function ReformerCalc() {
  const [beds, setBeds] = useState(8);
  const [classesPerDay, setClassesPerDay] = useState(6);
  const [daysOpen, setDaysOpen] = useState(6);
  const [pricePerSeat, setPricePerSeat] = useState(28);

  const seatsPerWeek = beds * classesPerDay * daysOpen;
  const weeklyAt100 = seatsPerWeek * pricePerSeat;
  const monthlyAt100 = weeklyAt100 * 4.33;
  const annualAt100 = weeklyAt100 * 50;
  const annualAt75 = annualAt100 * 0.75;
  const annualAt50 = annualAt100 * 0.5;

  return (
    <CalcShell
      inputs={
        <>
          <NumberInput
            label="Reformer beds"
            value={beds}
            onChange={setBeds}
          />
          <NumberInput
            label="Classes per day"
            value={classesPerDay}
            onChange={setClassesPerDay}
          />
          <NumberInput
            label="Days open per week"
            value={daysOpen}
            onChange={setDaysOpen}
            min={1}
          />
          <NumberInput
            label="Price per reformer seat"
            hint="Blended drop-in / pack-credit equivalent"
            value={pricePerSeat}
            onChange={setPricePerSeat}
            prefix="$"
          />
        </>
      }
      results={
        <>
          <ResultRow
            label="Annual revenue at 100%"
            value={fmt.money(annualAt100)}
            emphasis
          />
          <ResultRow
            label="Annual at 75% utilization"
            value={fmt.money(annualAt75)}
          />
          <ResultRow
            label="Annual at 50% utilization"
            value={fmt.money(annualAt50)}
          />
          <ResultRow
            label="Monthly at 100%"
            value={fmt.money(monthlyAt100)}
          />
        </>
      }
      takeaway={
        <>
          <strong className="text-foreground">Realistic target:</strong>{" "}
          aim for 60–75% utilization across the schedule. Anything higher
          means members can&apos;t book their preferred time and leak to
          a competitor. Lower means either too many classes, wrong times,
          or a pricing/marketing problem.
        </>
      }
      ctaTitle="Per-bed booking, live"
      ctaBody="YogaTeacher's reformer-class capacity bars show real-time bed availability on every class. No more guessing."
    />
  );
}
