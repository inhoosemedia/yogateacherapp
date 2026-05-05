import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { studio as studioTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getActiveStudio } from "@/lib/studio";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookingLinkCard } from "./_components/booking-link-card";
import { StudioSettingsForm } from "./_components/studio-settings-form";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const studio = await getActiveStudio(session.user.id);
  if (!studio) redirect("/onboarding");

  const [s] = await db
    .select({ slug: studioTable.slug })
    .from(studioTable)
    .where(eq(studioTable.id, studio.id))
    .limit(1);

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Studio"
        title="Settings"
        description="Manage your studio name, currency, timezone, and the public booking link."
      />

      <Card>
        <CardHeader>
          <CardTitle>Public booking link</CardTitle>
          <CardDescription>
            Where members go to book themselves into a class.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingLinkCard slug={s?.slug ?? studio.slug} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Studio</CardTitle>
          <CardDescription>
            Used across the dashboard, public schedule, and member emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudioSettingsForm
            studio={{
              id: studio.id,
              name: studio.name,
              timezone: studio.timezone,
              currency: studio.currency,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/90 space-y-1.5">
          <div>
            <span className="text-muted-foreground">Name: </span>
            {session.user.name}
          </div>
          <div>
            <span className="text-muted-foreground">Email: </span>
            {session.user.email}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
