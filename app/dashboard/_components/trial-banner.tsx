import { IconAlertCircle, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export function TrialBanner({ daysLeft }: { daysLeft: number }) {
  const urgent = daysLeft <= 3;
  return (
    <div
      className={
        "border-b px-6 py-3 flex items-center justify-between gap-4 flex-wrap " +
        (urgent
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-secondary/60 border-border text-foreground/85")
      }
    >
      <div className="flex items-center gap-2 text-sm">
        <IconAlertCircle className="size-4" />
        <span>
          {daysLeft === 0
            ? "Your free trial ends today."
            : daysLeft === 1
              ? "Your free trial ends tomorrow."
              : `${daysLeft} days left in your free trial.`}
        </span>
      </div>
      <Link
        href="/billing"
        className="text-sm font-medium inline-flex items-center gap-1 hover:underline"
      >
        Choose a plan <IconArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
