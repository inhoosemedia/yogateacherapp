"use client";

import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  dashboard: "Overview",
  members: "Members",
  classes: "Classes",
  "class-types": "Class types",
  instructors: "Instructors",
  packages: "Packages",
  settings: "Settings",
};

export function Breadcrumbs({ studioName }: { studioName: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  // /dashboard => just studio name
  if (parts.length === 1 && parts[0] === "dashboard") {
    return (
      <div className="font-display text-[15px] tracking-tight">
        {studioName}
      </div>
    );
  }

  const crumbs: { href: string; label: string }[] = [];
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    const label =
      LABELS[part] ??
      part
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .slice(0, 24);
    crumbs.push({ href: acc, label });
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={c.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <IconChevronRight className="size-3.5 text-muted-foreground/60" />
            )}
            {last ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <Link
                href={c.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
