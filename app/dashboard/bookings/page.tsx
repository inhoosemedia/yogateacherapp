import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconClipboardList,
  IconHourglass,
  IconTicket,
  IconX,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Front desk"
        title="Bookings"
        description="Every booking, waitlist and cancellation in one place — so you always know who's coming to the mat."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTicket className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Confirmed
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            See who&apos;s booked into each upcoming class.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconHourglass className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Waitlist
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Promote members automatically as spots free up.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconX className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Cancellations
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Track late cancels and no-shows without the guesswork.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconClipboardList className="size-5" />}
            title="Bookings are being set up"
            description="We're bringing confirmations, waitlists and cancellations together into one tidy list. It will show up here soon."
          />
        </CardContent>
      </Card>
    </div>
  );
}
