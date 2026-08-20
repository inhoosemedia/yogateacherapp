import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconRosette,
  IconRepeat,
  IconInfinity,
  IconCoin,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function MembershipsPage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Recurring"
        title="Memberships"
        description="Recurring memberships and auto-renew subscriptions — steady, predictable income that renews itself each month."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconInfinity className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Plans
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Offer unlimited or class-capped monthly plans.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconRepeat className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Auto-renew
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Renewals happen on their own — no chasing cards.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCoin className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Predictable income
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            See recurring revenue you can count on each month.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconRosette className="size-5" />}
            title="Memberships are being set up"
            description="We're preparing recurring plans and auto-renewing subscriptions for your studio. They'll be ready for you here soon."
          />
        </CardContent>
      </Card>
    </div>
  );
}
