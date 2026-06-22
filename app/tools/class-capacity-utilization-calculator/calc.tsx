"use client";

import {
  CalcShell,
  NumberInput,
  ResultRow,
  fmt,
} from "@/components/seo/calc-shell";
import { useState } from "react";

export function UtilizationCalc() {
  const [classesPerWeek, setClassesPerWeek] = useState(20);
  const [capacityPerClass, setCapacityPerClass] = useState(18);
  const [averageBooked, setAverageBooked] = useState(11);
  const [classPrice, setClassPrice] = useState(22);

  const utilization =
    capacityPerClass > 0 ? (averageBooked / capacityPerClass) * 100 : 0;
  const emptySpotsPerClass = Math.max(capacityPerClass - averageBooked, 0);
  const emptySpotsPerWeek = emptySpotsPerClass * classesPerWeek;
  const lostPerWeek = emptySpotsPerWeek * classPrice;
  const lostPerYear = lostPerWeek * 50;

  const status =
    utilization < 60
      ? "low"
      : utilization <= 80
        ? "healthy"
        : "ceiling";

  return (
    <CalcShell
      inputs={
        <>
          <NumberInput
            label="Classes per week (this type)"
            value={classesPerWeek}
            onChange={setClassesPerWeek}
          />
          <NumberInput
            label="Capacity per class"
            value={capacityPerClass}
            onChange={setCapacityPerClass}
          />
          <NumberInput
            label="Average students per class"
            value={averageBooked}
            onChange={setAverageBooked}
          />
          <NumberInput
            label="Class price (drop-in equivalent)"
            value={classPrice}
            onChange={setClassPrice}
            prefix="$"
          />
        </>
      }
      results={
        <>
          <ResultRow
            label="Utilization rate"
            value={fmt.pct(utilization)}
            emphasis
          />
          <ResultRow
            label="Empty spots / week"
            value={fmt.int(emptySpotsPerWeek)}
          />
          <ResultRow
            label="Revenue left on table / week"
            value={fmt.money(lostPerWeek)}
          />
          <ResultRow
            label="…per year (50 active weeks)"
            value={fmt.money(lostPerYear)}
          />
        </>
      }
      takeaway={
        status === "low" ? (
          <>
            <strong className="text-foreground">Underused.</strong> Below
            60% average fill, the question is usually: wrong class times,
            wrong price, or too many concurrent classes? Cut the slowest
            slot before adding new ones.
          </>
        ) : status === "healthy" ? (
          <>
            <strong className="text-foreground">Healthy.</strong> 60–80%
            average fill is the boutique-yoga sweet spot. Members find a
            spot, you sleep well.
          </>
        ) : (
          <>
            <strong className="text-foreground">At ceiling.</strong>{" "}
            Consistently over 80% means members are getting locked out of
            their preferred times. Add a parallel class, raise prices, or
            both — before they leave for a less-full competitor.
          </>
        )
      }
      ctaTitle="Capacity, live, per class"
      ctaBody="YogaTeacher's schedule shows real-time fill rate on every class. Bookings, capacity and revenue — connected."
    />
  );
}
