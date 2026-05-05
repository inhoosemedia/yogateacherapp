import { Breadcrumbs } from "./breadcrumbs";
import ModeToggle from "./mode-toggle";

export default function DashboardTopNav({
  studioName,
}: {
  studioName: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-4 border-b border-border bg-canvas/85 backdrop-blur-md px-6">
      <Breadcrumbs studioName={studioName} />
      <div className="ml-auto flex items-center gap-1">
        <ModeToggle />
      </div>
    </header>
  );
}
