"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconBell,
  IconCalendarPlus,
  IconCash,
  IconChalkboard,
  IconChevronDown,
  IconCommand,
  IconPackage,
  IconPlus,
  IconRosette,
  IconSearch,
  IconUserCircle,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";

/**
 * The redesigned dashboard command bar: a global search field, a "+ Create"
 * quick-add menu, and a notifications bell — mirroring the studio command
 * centre in the product design.
 */

const CREATE_ITEMS = [
  { label: "Class", href: "/dashboard/classes", icon: IconCalendarPlus },
  { label: "Member", href: "/dashboard/members", icon: IconUserPlus },
  { label: "Membership", href: "/dashboard/memberships", icon: IconRosette },
  { label: "Package", href: "/dashboard/packages", icon: IconPackage },
  { label: "Payment", href: "/dashboard/payments", icon: IconCash },
  { label: "Instructor", href: "/dashboard/instructors", icon: IconUserCircle },
  { label: "Class type", href: "/dashboard/class-types", icon: IconChalkboard },
];

export function GlobalSearch() {
  return (
    <button
      type="button"
      className="group hidden md:flex items-center gap-2.5 h-9 min-w-[240px] lg:min-w-[320px] rounded-full border border-border bg-card/70 px-3.5 text-sm text-muted-foreground hover:border-primary/30 hover:bg-card transition-colors"
      aria-label="Search members, classes, payments"
    >
      <IconSearch className="size-4 shrink-0" />
      <span className="flex-1 text-left truncate">
        Search members, classes, payments…
      </span>
      <span className="hidden lg:inline-flex items-center gap-0.5 rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[11px] text-muted-foreground">
        <IconCommand className="size-3" />K
      </span>
    </button>
  );
}

export function NotificationsBell({ count = 3 }: { count?: number }) {
  return (
    <button
      type="button"
      className="relative flex size-9 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
      aria-label={`Notifications${count ? `, ${count} unread` : ""}`}
    >
      <IconBell className="size-[18px]" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[color:var(--chart-2)] px-1 text-[10px] font-semibold text-white ring-2 ring-canvas">
          {count}
        </span>
      )}
    </button>
  );
}

export function CreateMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 rounded-full bg-primary pl-3.5 pr-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <IconPlus className="size-4" />
          <span>Create</span>
          <IconChevronDown className="size-3.5 opacity-80" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Quick add
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CREATE_ITEMS.map((item) => (
          <Link key={item.label} href={item.href}>
            <DropdownMenuItem className="cursor-pointer">
              <item.icon className="size-4 text-muted-foreground" />
              {item.label}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
