"use client";

import {
  CalcShell,
  NumberInput,
  ResultRow,
  fmt,
} from "@/components/seo/calc-shell";
import { useState } from "react";

export function PackPriceCalc() {
  const [dropIn, setDropIn] = useState(22);
  const [packSize, setPackSize] = useState(10);
  const [discount, setDiscount] = useState(22);

  const undiscounted = dropIn * packSize;
  const packPrice = undiscounted * (1 - discount / 100);
  const perClass = packSize > 0 ? packPrice / packSize : 0;
  const savings = undiscounted - packPrice;
  const sweetSpot = discount >= 15 && discount <= 30;

  return (
    <CalcShell
      inputs={
        <>
          <NumberInput
            label="Drop-in class price"
            value={dropIn}
            onChange={setDropIn}
            prefix="$"
          />
          <NumberInput
            label="Pack size (classes)"
            value={packSize}
            onChange={setPackSize}
          />
          <NumberInput
            label="Discount %"
            hint="20–25% is typical for a 10-class pack"
            value={discount}
            onChange={setDiscount}
            suffix="%"
          />
        </>
      }
      results={
        <>
          <ResultRow
            label={`Price for ${packSize}-class pack`}
            value={fmt.money(packPrice)}
            emphasis
          />
          <ResultRow
            label="Effective price per class"
            value={fmt.money(perClass)}
          />
          <ResultRow
            label="Member savings vs drop-ins"
            value={fmt.money(savings)}
          />
          <ResultRow
            label="Discount given away"
            value={fmt.pct(discount)}
          />
        </>
      }
      takeaway={
        sweetSpot ? (
          <>
            <strong className="text-foreground">In the sweet spot.</strong>{" "}
            15–30% off a class pack is the range where members feel the deal
            without your margin going underwater.
          </>
        ) : discount < 15 ? (
          <>
            <strong className="text-foreground">Light discount.</strong>{" "}
            Under 15% off and most members will just buy drop-ins. Packs
            need to feel like a real reward for committing.
          </>
        ) : (
          <>
            <strong className="text-foreground">Heavy discount.</strong>{" "}
            Over 30% off and you&apos;re training your most-committed
            members to wait for the discount. Consider an annual unlimited
            instead.
          </>
        )
      }
      ctaTitle="Set up your packs once. Sell them forever."
      ctaBody="Define drop-ins, packs and memberships in YogaTeacher. Members buy and renew themselves."
    />
  );
}
