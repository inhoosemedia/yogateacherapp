export function SunDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden
      fill="none"
    >
      <defs>
        <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="200" fill="url(#sun-grad)" />
      <circle cx="200" cy="200" r="80" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function GrainOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.4] mix-blend-multiply pointer-events-none"
      aria-hidden
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix values="0 0 0 0 0.11  0 0 0 0 0.10  0 0 0 0 0.09  0 0 0 0.18 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

export function LotusDots({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = 100 + Math.cos(angle) * 70;
        const y = 100 + Math.sin(angle) * 70;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="currentColor"
            opacity={0.2 + (i % 4) * 0.15}
          />
        );
      })}
      <circle cx="100" cy="100" r="6" fill="currentColor" />
    </svg>
  );
}

export function SoftBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden>
      <defs>
        <radialGradient id="blob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="300" cy="300" rx="280" ry="220" fill="url(#blob)" />
    </svg>
  );
}
