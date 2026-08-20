import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconMessageCircle,
  IconInbox,
  IconSend,
  IconUsers,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Conversations"
        title="Messages"
        description="Message members and reply to their questions — a warm, personal line between your studio and your students."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconInbox className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Shared inbox
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every member question lands in one calm inbox.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconSend className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Quick replies
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Answer in a tap with saved, on-brand responses.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconUsers className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Broadcasts
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Reach a whole class or your full roster at once.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconMessageCircle className="size-5" />}
            title="Messaging is being set up"
            description="We're opening a direct line between you and your members. Conversations will appear here once it's ready."
          />
        </CardContent>
      </Card>
    </div>
  );
}
