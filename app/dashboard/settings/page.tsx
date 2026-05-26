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
import {
  IconBell,
  IconCreditCard,
  IconUsersGroup,
} from "@tabler/icons-react";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/change-password-form";
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

      <div className="grid sm:grid-cols-3 gap-3">
        <SettingsLink
          href="/dashboard/settings/team"
          icon={<IconUsersGroup className="size-4" />}
          title="Team & instructors"
          description="Invite admins, staff, and instructors."
        />
        <SettingsLink
          href="/dashboard/settings/notifications"
          icon={<IconBell className="size-4" />}
          title="Notifications"
          description="Email events for members."
        />
        <SettingsLink
          href="/dashboard/settings/payments"
          icon={<IconCreditCard className="size-4" />}
          title="Member payments"
          description="Razorpay for online package sales."
        />
      </div>

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
              logoUrl: studio.logoUrl,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Your YogaTeacher login. Change the password any time — sign in to
            other devices stays active unless you opt out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-foreground/90 space-y-1.5">
            <div>
              <span className="text-muted-foreground">Name: </span>
              {session.user.name}
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              {session.user.email}
            </div>
          </div>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-display text-base">{title}</div>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </Link>
  );
}
