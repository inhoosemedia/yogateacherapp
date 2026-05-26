"use client";

import { BrandMark } from "@/components/brand";
import UserProfile from "@/components/user-profile";
import { cn } from "@/lib/utils";
import {
  IconCalendarMonth,
  IconChalkboard,
  IconChartBar,
  IconLayoutDashboard,
  IconPackage,
  IconSettings,
  IconUserCircle,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY = [
  { label: "Overview", href: "/dashboard", icon: IconLayoutDashboard },
  { label: "Members", href: "/dashboard/members", icon: IconUsers },
  { label: "Classes", href: "/dashboard/classes", icon: IconCalendarMonth },
  { label: "Reports", href: "/dashboard/reports", icon: IconChartBar },
];

const LIBRARY = [
  { label: "Class types", href: "/dashboard/class-types", icon: IconChalkboard },
  { label: "Instructors", href: "/dashboard/instructors", icon: IconUserCircle },
  { label: "Packages", href: "/dashboard/packages", icon: IconPackage },
  { label: "Team", href: "/dashboard/settings/team", icon: IconUsersGroup },
];

/**
 * Body of the dashboard nav — used by both the static desktop sidebar
 * (DashboardSideBar) and the MobileNav drawer. The drawer renders its own
 * header, so we don't include the studio-name link here.
 */
export function DashboardNavBody() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <nav className="flex-1 px-3 py-1 space-y-6 overflow-y-auto">
        <NavGroup items={PRIMARY} isActive={isActive} />
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
            Library
          </div>
          <NavGroup items={LIBRARY} isActive={isActive} />
        </div>
      </nav>

      <div className="border-t border-border p-3 mt-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors mb-1",
            pathname === "/dashboard/settings"
              ? "bg-secondary text-foreground font-medium"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
          )}
        >
          <IconSettings className="size-4" />
          Settings
        </Link>
        <UserProfile />
      </div>
    </>
  );
}

export default function DashboardSideBar({
  studioName,
  logoUrl,
}: {
  studioName: string;
  logoUrl?: string | null;
}) {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-border bg-sidebar flex-col">
      <Link
        href="/dashboard"
        className="flex h-[60px] items-center gap-2.5 border-b border-border px-5 group"
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={studioName}
            className="size-8 rounded-lg object-contain bg-card shadow-sm"
          />
        ) : (
          <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <BrandMark size={18} />
          </span>
        )}
        <div className="min-w-0">
          <div className="font-display text-[15px] leading-tight truncate">
            {studioName}
          </div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Studio
          </div>
        </div>
      </Link>
      <DashboardNavBody />
    </aside>
  );
}

function NavGroup({
  items,
  isActive,
}: {
  items: { label: string; href: string; icon: React.ElementType }[];
  isActive: (href: string) => boolean;
}) {
  return (
    <div className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
            )}
            <item.icon
              className={cn(
                "size-4",
                active ? "text-primary" : "text-muted-foreground",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
