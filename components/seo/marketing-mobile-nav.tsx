"use client";

import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Burger menu for the marketing site on mobile. The existing MobileNav
// is for the authed dashboard — different surface, different links.
// This one exposes the public nav (Yoga, Pilates, vs Mindbody, Pricing,
// Free tools, Blog, Customers, plus the auth CTAs).

const LINKS = [
  { href: "/yoga-studio-software", label: "Yoga studio software" },
  { href: "/pilates-studio-software", label: "Pilates studio software" },
  { href: "/vs-mindbody", label: "vs Mindbody" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tools", label: "Free tools" },
  { href: "/blog", label: "Blog" },
  { href: "/customers", label: "Customer stories" },
];

export function MarketingMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open.
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
        className="md:hidden inline-flex items-center justify-center size-9 rounded-lg hover:bg-secondary/60 transition-colors"
      >
        <IconMenu2 className="size-5" />
      </button>

      <div
        onClick={() => setOpen(false)}
        className={
          "md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        aria-hidden
      />

      <aside
        className={
          "md:hidden fixed top-0 right-0 z-50 h-screen w-[300px] max-w-[88vw] bg-canvas border-l border-border flex flex-col transition-transform duration-200 ease-out " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <span className="font-display text-lg tracking-tight">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="size-9 rounded-lg hover:bg-secondary/60 flex items-center justify-center"
          >
            <IconX className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {LINKS.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "block px-5 py-3 text-base transition-colors " +
                  (active
                    ? "text-primary font-medium bg-primary/5 border-l-2 border-primary"
                    : "text-foreground/85 hover:bg-secondary/40")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-5 space-y-3">
          <Link
            href="/sign-up"
            className="block w-full text-center bg-primary text-primary-foreground rounded-lg py-3 font-medium shadow-md shadow-primary/15"
          >
            Start free trial
          </Link>
          <Link
            href="/sign-in"
            className="block w-full text-center border border-border rounded-lg py-3 font-medium"
          >
            Sign in
          </Link>
        </div>
      </aside>
    </>
  );
}
