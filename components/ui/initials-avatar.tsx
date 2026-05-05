import { cn } from "@/lib/utils";

const PALETTE = [
  // pairs of (bg, text) — soft, warm tones
  ["bg-stone-200 text-stone-700", "from-stone-200 to-stone-100"],
  ["bg-amber-100 text-amber-800", "from-amber-100 to-amber-50"],
  ["bg-emerald-100 text-emerald-800", "from-emerald-100 to-emerald-50"],
  ["bg-rose-100 text-rose-800", "from-rose-100 to-rose-50"],
  ["bg-sky-100 text-sky-800", "from-sky-100 to-sky-50"],
  ["bg-violet-100 text-violet-800", "from-violet-100 to-violet-50"],
  ["bg-orange-100 text-orange-800", "from-orange-100 to-orange-50"],
  ["bg-teal-100 text-teal-800", "from-teal-100 to-teal-50"],
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const SIZE = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
};

export function InitialsAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const idx = hash(name) % PALETTE.length;
  const [bg] = PALETTE[idx];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium tracking-tight ring-1 ring-black/[0.04]",
        SIZE[size],
        bg,
        className,
      )}
      aria-hidden
    >
      {initials(name) || "·"}
    </span>
  );
}
