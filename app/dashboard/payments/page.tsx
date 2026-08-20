import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconCreditCard,
  IconReceipt,
  IconAlertTriangle,
  IconWallet,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Money"
        title="Payments"
        description="Track payments, failed charges and outstanding balances — a clear picture of what's come in and what's still owed."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconReceipt className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Received
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every successful charge, itemised and searchable.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconAlertTriangle className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Failed charges
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Spot declined cards early and recover the revenue.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconWallet className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Outstanding
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Keep tabs on balances still due from members.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconCreditCard className="size-5" />}
            title="Payments are being set up"
            description="We're connecting your charges, refunds and balances into one ledger. Your payment history will appear here shortly."
          />
        </CardContent>
      </Card>
    </div>
  );
}
