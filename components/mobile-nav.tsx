"use client";

import { BrandMark } from "@/components/brand";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Slide-in drawer for small viewports. Wraps the same nav children the
 * desktop sidebar uses so we don't duplicate the nav list. Hidden at lg+
 * because the static sidebar is visible there.
 */
export function MobileNav({
  studioName,
  eyebrow = "Studio",
  children,
}: {
  studioName: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on route change so tapping a link in the drawer closes it.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center size-9 rounded-lg hover:bg-secondary/60 transition-colors"
      >
        <IconMenu2 className="size-5" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-hidden
      />

      {/* Sliding panel */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-screen w-[280px] max-w-[85vw] bg-sidebar border-r border-border flex flex-col transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-[60px] items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm shrink-0">
              <BrandMark size={18} />
            </span>
            <div className="min-w-0">
              <div className="font-display text-[15px] leading-tight truncate">
                {studioName}
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {eyebrow}
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="size-8 rounded-lg hover:bg-secondary/60 flex items-center justify-center"
          >
            <IconX className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">{children}</div>
      </aside>
    </>
  );
}
