import { MobileNav } from "@/components/mobile-nav";
import { Breadcrumbs } from "./breadcrumbs";
import ModeToggle from "./mode-toggle";
import { DashboardNavBody } from "./sidebar";
import { StudioSwitcher } from "./studio-switcher";
import { CreateMenu, GlobalSearch, NotificationsBell } from "./topbar-actions";

type Studio = { id: string; name: string; role: string };

export default function DashboardTopNav({
  studioName,
  logoUrl,
  active,
  studios,
}: {
  studioName: string;
  logoUrl?: string | null;
  active?: { id: string; name: string };
  studios?: Studio[];
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-3 border-b border-border bg-canvas/85 backdrop-blur-md px-4 sm:px-6">
      <MobileNav studioName={studioName} logoUrl={logoUrl ?? null}>
        <DashboardNavBody />
      </MobileNav>
      <div className="lg:hidden">
        <Breadcrumbs studioName={studioName} />
      </div>
      <div className="hidden lg:block">
        <GlobalSearch />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {active && studios && studios.length > 1 && (
          <StudioSwitcher active={active} options={studios} />
        )}
        <ModeToggle />
        <NotificationsBell />
        <CreateMenu />
      </div>
    </header>
  );
}
