import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconBolt,
  IconBellRinging,
  IconReceipt2,
  IconRefresh,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Autopilot"
        title="Automations"
        description="Automatic reminders, receipts and re-engagement flows — the quiet work that runs itself while you teach."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconBellRinging className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Reminders
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Nudge members before class so fewer spots go unused.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconReceipt2 className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Receipts
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Send tidy confirmations the moment a payment lands.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconRefresh className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Re-engagement
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Reach out automatically when a member goes quiet.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconBolt className="size-5" />}
            title="Automations are being set up"
            description="We're building flows that handle reminders, receipts and follow-ups for you. Once ready, they'll run quietly in the background."
          />
        </CardContent>
      </Card>
    </div>
  );
}
