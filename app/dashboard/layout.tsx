import { auth } from "@/lib/auth";
import { getInstructorContext } from "@/lib/instructor";
import {
  getActiveStudio,
  listMembershipsForUser,
  studioHasAccess,
  trialDaysRemaining,
} from "@/lib/studio";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardTopNav from "./_components/navbar";
import DashboardSideBar from "./_components/sidebar";
import { TrialBanner } from "./_components/trial-banner";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?returnTo=/dashboard");

  const studio = await getActiveStudio(session.user.id);
  if (!studio) redirect("/onboarding");
  // Instructors only get the instructor portal — but only redirect when their
  // instructor record actually exists, otherwise we'd loop.
  if (studio.role === "instructor") {
    const insCtx = await getInstructorContext();
    if (insCtx) redirect("/instructor");
  }
  if (!studioHasAccess(studio)) redirect("/billing");

  const memberships = await listMembershipsForUser(session.user.id);

  const daysLeft =
    studio.subscriptionStatus === "trialing"
      ? trialDaysRemaining(studio)
      : null;

  return (
    <div className="flex h-screen overflow-hidden w-full bg-canvas canvas-grain">
      <DashboardSideBar studioName={studio.name} logoUrl={studio.logoUrl} />
      <main className="flex-1 overflow-y-auto">
        <DashboardTopNav
          studioName={studio.name}
          logoUrl={studio.logoUrl}
          active={{ id: studio.id, name: studio.name }}
          studios={memberships}
        />
        {daysLeft !== null && daysLeft <= 7 && (
          <TrialBanner daysLeft={daysLeft} />
        )}
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
