import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconCalendarMonth,
  IconClock,
  IconLayoutGrid,
  IconUsers,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Schedule"
        title="Calendar"
        description="A month view of every class and appointment across your studio — all in one calm, glanceable place."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconLayoutGrid className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Month view
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            See every class laid out across the weeks at a glance.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconClock className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Day &amp; week
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Zoom into a single day to spot gaps and overlaps.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconUsers className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Per instructor
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Filter by teacher to see who is on the mat and when.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconCalendarMonth className="size-5" />}
            title="Your calendar is being set up"
            description="We're wiring your classes and appointments into a single monthly view. It will appear here shortly — nothing you need to do."
          />
        </CardContent>
      </Card>
    </div>
  );
}
