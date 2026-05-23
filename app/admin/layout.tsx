import { SignOutButton } from "@/components/sign-out-button";
import { requireSuperAdmin } from "@/lib/admin";
import {
  IconBuildingStore,
  IconCoin,
  IconLayoutDashboard,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { ReactNode } from "react";
import { AdminNav } from "./_components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSuperAdmin();

  return (
    <div className="flex h-screen overflow-hidden w-full bg-canvas canvas-grain">
      <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-border bg-sidebar flex-col">
        <Link
          href="/admin"
          className="flex h-[60px] items-center gap-2.5 border-b border-border px-5"
        >
          <span className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center">
            <IconShield className="size-4" />
          </span>
          <div>
            <div className="font-display text-[15px] leading-tight">
              Super admin
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              YogaTeacher platform
            </div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-0.5">
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
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-[60px] items-center gap-4 border-b border-border bg-canvas/85 backdrop-blur-md px-6">
          <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-foreground text-background text-[10px] uppercase tracking-[0.16em] font-medium">
            <IconShield className="size-3" /> Super admin
          </span>
        </header>
        <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
