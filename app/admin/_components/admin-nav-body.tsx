"use client";

import { SignOutButton } from "@/components/sign-out-button";
import {
  IconBuildingStore,
  IconCoin,
  IconLayoutDashboard,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { AdminNav } from "./admin-nav";

/**
 * Body of the super-admin nav — reused by the static desktop sidebar AND the
 * mobile drawer in <MobileNav>. The drawer renders its own header, so we
 * leave that out here.
 */
export function AdminNavBody() {
  return (
    <>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <AdminNav
          items={[
            {
              label: "Overview",
              href: "/admin",
              icon: <IconLayoutDashboard className="size-4" />,
            },
            {
              label: "Studios",
              href: "/admin/studios",
              icon: <IconBuildingStore className="size-4" />,
            },
            {
              label: "Users",
              href: "/admin/users",
              icon: <IconUsers className="size-4" />,
            },
            {
              label: "Pricing & currency",
              href: "/admin/settings",
              icon: <IconCoin className="size-4" />,
            },
          ]}
        />
      </nav>
      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
        >
          <IconLayoutDashboard className="size-4" />
          Back to my studio
        </Link>
        <SignOutButton />
      </div>
    </>
  );
}
