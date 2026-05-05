import { auth } from "@/lib/auth";
import { getActiveStudio } from "@/lib/studio";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardTopNav from "./_components/navbar";
import DashboardSideBar from "./_components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?returnTo=/dashboard");

  const studio = await getActiveStudio(session.user.id);
  if (!studio) redirect("/onboarding");

  return (
    <div className="flex h-screen overflow-hidden w-full bg-canvas canvas-grain">
      <DashboardSideBar studioName={studio.name} />
      <main className="flex-1 overflow-y-auto">
        <DashboardTopNav studioName={studio.name} />
        <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
