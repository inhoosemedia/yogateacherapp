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
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn("inline-block", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      {/* centre petal */}
      <path d="M16 27C13 21 13 13 16 7C19 13 19 21 16 27Z" />
      {/* inner side petals */}
      <path d="M16 27C11 23.5 8.2 17.5 8.7 11.5C13 13.5 15.6 19.5 16 27Z" />
      <path d="M16 27C21 23.5 23.8 17.5 23.3 11.5C19 13.5 16.4 19.5 16 27Z" />
      {/* outer side petals */}
      <path d="M16 27C9.5 26 4.8 22 3.7 16.7C8.4 15.9 13.2 20 16 27Z" />
      <path d="M16 27C22.5 26 27.2 22 28.3 16.7C23.6 15.9 18.8 20 16 27Z" />
    </svg>
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
      <span
        className={cn(
          "rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm",
        )}
        style={{
          width: dims.mark + 8,
          height: dims.mark + 8,
        }}
      >
        <BrandMark size={dims.mark - 6} />
      </span>
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
