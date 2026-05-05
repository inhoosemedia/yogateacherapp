"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export function AdminNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
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
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-foreground" />
            )}
            <item.icon
              className={cn(
                "size-4",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
