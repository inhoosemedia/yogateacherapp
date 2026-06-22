"use client";

import {
  CalcShell,
  NumberInput,
  ResultRow,
  fmt,
} from "@/components/seo/calc-shell";
import { useState } from "react";

export function BreakEvenCalc() {
  const [rent, setRent] = useState(3500);
  const [instructorPay, setInstructorPay] = useState(50);
  const [classesPerWeek, setClassesPerWeek] = useState(25);
  const [price, setPrice] = useState(22);
  const [capacity, setCapacity] = useState(18);

  const classesPerMonth = classesPerWeek * 4.33;
  const monthlyInstructorCost = classesPerMonth * instructorPay;
  const monthlyFixedCost = rent + monthlyInstructorCost;
  const breakEvenStudents = monthlyFixedCost / Math.max(price, 0.01);
  const studentsPerClass = breakEvenStudents / Math.max(classesPerMonth, 0.01);
  const fillRate =
    capacity > 0 ? (studentsPerClass / capacity) * 100 : 0;
  const healthy = fillRate > 0 && fillRate < 75;
  const stretched = fillRate >= 75 && fillRate <= 100;
  const impossible = fillRate > 100;

  return (
    <CalcShell
      inputs={
        <>
          <NumberInput
            label="Monthly rent + utilities"
            value={rent}
            onChange={setRent}
            prefix="$"
            step="100"
          />
          <NumberInput
            label="Instructor pay per class"
            value={instructorPay}
            onChange={setInstructorPay}
            prefix="$"
            step="5"
          />
          <NumberInput
            label="Classes per week"
            value={classesPerWeek}
            onChange={setClassesPerWeek}
          />
          <NumberInput
            label="Price per drop-in / class credit"
            value={price}
            onChange={setPrice}
            prefix="$"
          />
          <NumberInput
            label="Capacity per class"
            value={capacity}
            onChange={setCapacity}
          />
        </>
      }
      results={
        <>
          <ResultRow
            label="Monthly break-even revenue"
            value={fmt.money(monthlyFixedCost)}
            emphasis
          />
          <ResultRow
            label="Students needed / month"
            value={fmt.int(breakEvenStudents)}
          />
          <ResultRow
            label="Average students per class"
            value={fmt.int(studentsPerClass)}
          />
          <ResultRow
            label="Average fill rate needed"
            value={fmt.pct(fillRate)}
          />
        </>
      }
      takeaway={
        <>
          {healthy && (
            <>
              <strong className="text-foreground">Healthy.</strong> Under 75%
              average fill leaves you room for slow weeks, holidays, and
              instructor absences without losing money.
            </>
          )}
          {stretched && (
            <>
              <strong className="text-foreground">Stretched.</strong> Needing
              75-100% fill to break even leaves no margin for off-weeks.
              Raise prices, add a higher-revenue class type, or lower fixed
              costs.
            </>
          )}
          {impossible && (
            <>
              <strong className="text-foreground">Numbers don&apos;t work.</strong>{" "}
              You&apos;d need more than 100% of every class booked. Re-price,
              reduce instructor cost per class, or expand capacity.
            </>
          )}
        </>
      }
      ctaTitle="Stop guessing your fill rate"
      ctaBody="YogaTeacher shows your real per-class fill rate in the dashboard, live. Free 30-day trial."
    />
  );
}
