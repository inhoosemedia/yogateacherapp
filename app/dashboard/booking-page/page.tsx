import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireStudio } from "@/lib/studio";
import {
  IconWorldWww,
  IconLink,
  IconPalette,
  IconDeviceMobile,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function BookingPagePage() {
  await requireStudio();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Public"
        title="Booking Page"
        description="Your public self-service booking page and its link — where students find your classes and reserve their own spot."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconLink className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Shareable link
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            One tidy link to drop in your bio, emails and posts.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconPalette className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Your branding
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Your logo and colours, so it feels like your studio.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconDeviceMobile className="size-4" />
            <span className="text-[11px] uppercase tracking-[0.14em]">
              Self-service
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Members book and pay themselves, on any device.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconWorldWww className="size-5" />}
            title="Your booking page is being set up"
            description="We're preparing your public, self-service booking page. Once it's live, your shareable link will appear right here."
          />
        </CardContent>
      </Card>
    </div>
  );
}
