import { BrandMark } from "@/components/brand";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getActiveStudio } from "@/lib/studio";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./_components/onboarding-form";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const existing = await getActiveStudio(session.user.id);
  if (existing) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-canvas canvas-grain flex flex-col items-center justify-center p-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-10 font-display text-lg tracking-tight"
      >
        <span className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
          <BrandMark size={20} />
        </span>
        YogaTeacher
      </Link>

      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Welcome, {session.user.name.split(" ")[0]}
          </div>
          <h1 className="font-display text-3xl tracking-tight mb-2">
            Let&apos;s set up your studio
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            A few details and you&apos;re in. You can edit these later in
            settings.
          </p>
          <OnboardingForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        This takes about 30 seconds.
      </p>
    </div>
  );
}
