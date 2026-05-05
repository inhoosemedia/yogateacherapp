import Link from "next/link";

export function AuthShell({
  side,
  children,
}: {
  side: { eyebrow: string; title: string; quote?: string; quoteBy?: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-canvas canvas-grain">
      {/* Form side */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-16 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-10 font-display text-lg"
          >
            <span className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-base shadow-sm">
              ॐ
            </span>
            Asana
          </Link>
          {children}
        </div>
      </div>

      {/* Imagery side */}
      <div className="relative hidden lg:flex items-end p-12 order-1 lg:order-2 bg-gradient-to-br from-primary via-primary to-[#2c3a2e] text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)",
            }}
          />
        </div>
        {/* abstract sun & horizon */}
        <svg
          viewBox="0 0 600 400"
          className="absolute right-0 top-0 h-full w-full opacity-[0.18]"
          aria-hidden
        >
          <defs>
            <radialGradient id="sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="450" cy="180" r="120" fill="url(#sun)" />
          <circle cx="450" cy="180" r="48" fill="white" opacity="0.5" />
        </svg>

        <div className="relative max-w-lg space-y-6">
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-80">
            {side.eyebrow}
          </div>
          <h2 className="font-display text-5xl leading-[1.05] tracking-tight">
            {side.title}
          </h2>
          {side.quote && (
            <blockquote className="border-l-2 border-white/40 pl-4 text-base/relaxed opacity-90 italic">
              &ldquo;{side.quote}&rdquo;
              {side.quoteBy && (
                <footer className="mt-2 text-xs not-italic opacity-70">
                  — {side.quoteBy}
                </footer>
              )}
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
