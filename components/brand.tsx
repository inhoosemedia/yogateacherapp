import { cn } from "@/lib/utils";

/**
 * BrandMark — a calm, abstract logo for YogaTeacher.
 * Sun (small filled circle) above a horizon (two lines) — yoga-coded
 * without being literal. Renders monochrome, scales 16px → 256px.
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
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="16" cy="11" r="4" fill="currentColor" stroke="none" />
      <line x1="6" y1="20" x2="26" y2="20" />
      <line x1="9" y1="25" x2="23" y2="25" opacity="0.55" />
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

export const BRAND = {
  name: "YogaTeacher",
  domain: "yogateacherapp.com",
  url: "https://yogateacherapp.com",
  tagline: "The yoga teacher's app",
  description:
    "Mindbody for the rest of us. Members, classes, packages and bookings — in one calm app for solo yoga teachers and boutique studios.",
};
