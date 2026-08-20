import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconSpeakerphone,
  IconSparkles,
  IconCalendarStats,
  IconHeartHandshake,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Growth"
        title="Marketing"
        description="Promote classes, fill empty spots and win back lapsed members — gentle nudges that keep your studio full."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconSparkles className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Promote classes
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Spotlight new sessions to the right members.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendarStats className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Fill empty spots
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Turn quiet classes into full rooms with timely offers.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconHeartHandshake className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Win-back
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Reconnect with members who&apos;ve drifted away.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconSpeakerphone className="size-5" />}
            title="Marketing tools are being set up"
            description="We're preparing simple campaigns to promote classes and re-engage members. They'll be ready for you here soon."
          />
        </CardContent>
      </Card>
    </div>
  );
}
