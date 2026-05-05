import { cn } from "@/lib/utils";
import Link from "next/link";

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon,
  href,
  accent = "default",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: { value: number; label?: string }; // %
  icon?: React.ReactNode;
  href?: string;
  accent?: "default" | "sage" | "terracotta" | "ochre";
  className?: string;
}) {
  const accents: Record<typeof accent, string> = {
    default: "bg-secondary/60 text-muted-foreground",
    sage: "bg-[color:var(--chart-1)]/10 text-[color:var(--chart-1)]",
    terracotta: "bg-[color:var(--chart-2)]/10 text-[color:var(--chart-2)]",
    ochre: "bg-[color:var(--chart-3)]/15 text-[color:var(--chart-3)]",
  };

  const inner = (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card p-5 transition-all",
        href && "hover:border-primary/30 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
          {label}
        </div>
        {icon && (
          <div
            className={cn(
              "size-8 rounded-lg flex items-center justify-center",
              accents[accent],
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-3xl tracking-tight">{value}</div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.value > 0
                ? "text-emerald-700"
                : trend.value < 0
                  ? "text-rose-700"
                  : "text-muted-foreground",
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}%{trend.label && ` ${trend.label}`}
          </span>
        )}
      </div>
      {hint && (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      )}
      {href && (
        <span className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-primary/20 transition" />
      )}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
