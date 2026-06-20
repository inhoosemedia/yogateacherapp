"use client";

import { useEffect, useRef } from "react";

// Scroll reveal. Children fade up when crossing 15% of viewport. Uses
// IntersectionObserver, falls back to instant-visible if unsupported.
// Respects prefers-reduced-motion via globals.css.

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function RevealOnScroll({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("is-visible"), delay);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </div>
  );
}
