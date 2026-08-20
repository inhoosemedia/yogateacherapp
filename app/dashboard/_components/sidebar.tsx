"use client";

import { BrandMark, LeafSprig } from "@/components/brand";
import UserProfile from "@/components/user-profile";
import { cn } from "@/lib/utils";
import {
  IconBolt,
  IconCalendarMonth,
  IconChalkboard,
  IconChartBar,
  IconClipboardList,
  IconCreditCard,
  IconHelpCircle,
  IconLayoutDashboard,
  IconMessageCircle,
  IconPackage,
  IconRosette,
  IconSpeakerphone,
  IconUserCircle,
  IconUsers,
  IconWorldWww,
  IconYoga,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
};

const MAIN: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: IconLayoutDashboard },
  { label: "Calendar", href: "/dashboard/calendar", icon: IconCalendarMonth },
  { label: "Bookings", href: "/dashboard/bookings", icon: IconClipboardList },
  { label: "Members", href: "/dashboard/members", icon: IconUsers },
  { label: "Classes", href: "/dashboard/classes", icon: IconYoga },
  { label: "Payments", href: "/dashboard/payments", icon: IconCreditCard },
  { label: "Messages", href: "/dashboard/messages", icon: IconMessageCircle, badge: 3 },
];

const GROW: NavItem[] = [
  { label: "Marketing", href: "/dashboard/marketing", icon: IconSpeakerphone },
  { label: "Automations", href: "/dashboard/automations", icon: IconBolt },
  { label: "Booking Page", href: "/dashboard/booking-page", icon: IconWorldWww },
];

const INSIGHTS: NavItem[] = [
  { label: "Reports", href: "/dashboard/reports", icon: IconChartBar },
];

const MANAGE: NavItem[] = [
  { label: "Instructors", href: "/dashboard/instructors", icon: IconUserCircle },
  { label: "Packages", href: "/dashboard/packages", icon: IconPackage },
  { label: "Memberships", href: "/dashboard/memberships", icon: IconRosette },
  { label: "Class Types", href: "/dashboard/class-types", icon: IconChalkboard },
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
      <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto">
        <NavGroup items={MAIN} isActive={isActive} />
        <NavGroup label="Grow" items={GROW} isActive={isActive} />
        <NavGroup label="Insights" items={INSIGHTS} isActive={isActive} />
        <NavGroup label="Manage" items={MANAGE} isActive={isActive} />
      </nav>

      <div className="relative border-t border-border p-3 mt-2">
        {/* calm botanical accent behind the account row */}
        <LeafSprig
          size={92}
          className="pointer-events-none absolute -bottom-3 -left-1 text-primary/[0.07]"
        />
        <div className="relative">
          <UserProfile />
          <Link
            href="/dashboard/settings"
            className={cn(
              "mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/dashboard/settings"
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <IconHelpCircle className="size-4" />
            Help &amp; Support
          </Link>
        </div>
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
            className="size-9 rounded-full object-contain bg-card shadow-sm"
          />
        ) : (
          <span className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm ring-1 ring-primary/20">
            <BrandMark size={20} />
          </span>
        )}
        <div className="min-w-0">
          <div className="font-display text-[16px] leading-tight truncate">
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
  label,
  items,
  isActive,
}: {
  label?: string;
  items: NavItem[];
  isActive: (href: string) => boolean;
}) {
  return (
    <div>
      {label && (
        <div className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
          {label}
        </div>
      )}
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
                  "size-4 shrink-0",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="ml-auto inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
