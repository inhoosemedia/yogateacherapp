import { Breadcrumbs } from "./breadcrumbs";
import ModeToggle from "./mode-toggle";
import { StudioSwitcher } from "./studio-switcher";

type Studio = { id: string; name: string; role: string };

export default function DashboardTopNav({
  studioName,
  active,
  studios,
}: {
  studioName: string;
  active?: { id: string; name: string };
  studios?: Studio[];
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-4 border-b border-border bg-canvas/85 backdrop-blur-md px-6">
      <Breadcrumbs studioName={studioName} />
      <div className="ml-auto flex items-center gap-2">
        {active && studios && studios.length > 1 && (
          <StudioSwitcher active={active} options={studios} />
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
