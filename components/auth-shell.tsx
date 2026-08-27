import Image from "next/image";
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
            className="inline-flex items-center gap-2 mb-10 font-display text-lg tracking-tight"
          >
            <Image
              src="/logo.png"
              alt="YogaTeacher"
              width={36}
              height={36}
              className="size-9 rounded-full shadow-sm"
              priority
            />
            YogaTeacher
          </Link>
          {children}
        </div>
      </div>

      {/* Imagery side — calm studio photo with the brand statement overlaid */}
      <div className="relative hidden lg:flex items-end p-12 order-1 lg:order-2 text-white overflow-hidden">
        <Image
          src="/images/signin-studio.jpg"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        {/* legibility gradient so the text stays readable at the foot */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14210f]/92 via-[#14210f]/45 to-[#14210f]/10" />

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
