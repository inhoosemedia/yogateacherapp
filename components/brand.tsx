import { cn } from "@/lib/utils";

/**
 * BrandMark — the YogaTeacher lotus. A line-art blooming lotus, five petals
 * fanning from a single base point. Renders monochrome in currentColor so it
 * sits on any background; scales 16px → 256px.
 */
export function BrandMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={cn("inline-block rounded-full object-contain", className)}
      aria-hidden
    />
  );
}

/**
 * BrandLogo — mark + wordmark, used in headers and auth screens.
 */
export function BrandLogo({
  size = "md",
  href,
  className,
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}) {
  const dims = {
    sm: { mark: 22, text: "text-base" },
    md: { mark: 28, text: "text-lg" },
    lg: { mark: 36, text: "text-2xl" },
  }[size];

  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display tracking-tight",
        dims.text,
        className,
      )}
    >
      <BrandMark size={dims.mark + 8} className="shadow-sm" />
      <span>YogaTeacher</span>
    </span>
  );

  if (href) {
    // Caller can wrap in Link if they need; default is a plain <a>
    return (
      <a href={href} className="inline-flex">
        {inner}
      </a>
    );
  }
  return inner;
}

/**
 * LeafSprig — a delicate botanical line drawing used as a calm decorative
 * accent in the dashboard (sidebar foot, empty corners). Purely ornamental.
 */
export function LeafSprig({
  className,
  size = 120,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      className={cn("inline-block", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* main stem */}
      <path d="M30 128C33 108 40 92 48 78C55 66 60 54 61 42" />
      {/* a leaf, drawn as an outline + midrib, placed along the stem */}
      {[
        { x: 61, y: 42, r: -18, s: 1 },
        { x: 52, y: 58, r: 205, s: 0.9 },
        { x: 55, y: 55, r: 20, s: 0.85 },
        { x: 45, y: 72, r: 200, s: 0.8 },
        { x: 48, y: 70, r: 35, s: 0.75 },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <path d="M0 0C10 -6 26 -8 40 2C26 12 10 10 0 0Z" />
          <path d="M2 1C14 0 28 1 38 2" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

export const BRAND = {
  name: "YogaTeacher",
  domain: "yogateacherapp.com",
  url: "https://yogateacherapp.com",
  tagline: "The yoga teacher's app",
  description:
    "Mindbody for the rest of us. Members, classes, packages and bookings — in one calm app for solo yoga teachers and boutique studios.",
};
