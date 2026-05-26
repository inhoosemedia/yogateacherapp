import ModeToggle from "@/app/dashboard/_components/mode-toggle";
import { BrandMark } from "@/components/brand";
import { SignOutButton } from "@/components/sign-out-button";
import { requireInstructor } from "@/lib/instructor";
import { IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";
import { ReactNode } from "react";

export default async function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const ctx = await requireInstructor();

  return (
    <div className="min-h-screen bg-canvas canvas-grain">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/instructor"
            className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
          >
            <BrandMark size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg leading-tight truncate">
              {ctx.studioName}
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Instructor portal
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <IconUserCircle className="size-4" />
            <span>{ctx.fullName}</span>
          </div>
          <ModeToggle />
          <SignOutButton className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5" />
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
