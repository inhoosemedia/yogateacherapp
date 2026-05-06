import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { studioInvite, studioMember, user } from "@/db/schema";
import { getFromAddress, isEmailConfigured } from "@/lib/email";
import { requireStudio } from "@/lib/studio";
import { and, asc, eq } from "drizzle-orm";
import { InviteForm } from "./_components/invite-form";
import {
  CopyLinkButton,
  RemoveMemberButton,
  RevokeButton,
} from "./_components/invite-actions";

export default async function TeamPage() {
  const { studio, userId } = await requireStudio();

  const members = await db
    .select({
      rowId: studioMember.id,
      userId: studioMember.userId,
      role: studioMember.role,
      joinedAt: studioMember.createdAt,
      name: user.name,
      email: user.email,
    })
    .from(studioMember)
    .innerJoin(user, eq(user.id, studioMember.userId))
    .where(eq(studioMember.studioId, studio.id))
    .orderBy(asc(studioMember.createdAt));

  const invites = await db
    .select()
    .from(studioInvite)
    .where(
      and(
        eq(studioInvite.studioId, studio.id),
      ),
    )
    .orderBy(asc(studioInvite.createdAt));

  const pending = invites.filter((i) => !i.acceptedAt);
  const origin =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Studio"
        title="Team & instructors"
        description="Invite teammates and instructors. Each gets their own login with role-scoped access."
      />

      {!(await isEmailConfigured()) ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-medium">Email isn&apos;t configured yet</div>
          <p className="mt-1 text-amber-800/90">
            Set <code className="text-xs px-1.5 py-0.5 rounded bg-amber-100">RESEND_API_KEY</code>{" "}
            in your env to email invites. Until then, you can still create invites
            and copy the link manually.
          </p>
        </div>
      ) : !(await usesVerifiedDomain()) ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-medium">
            Heads up — invites can only be emailed to your own address until you
            verify a domain in Resend
          </div>
          <p className="mt-1 text-amber-800/90 leading-relaxed">
            Your <code className="text-xs px-1.5 py-0.5 rounded bg-amber-100">RESEND_FROM_EMAIL</code>{" "}
            is using <code className="text-xs px-1.5 py-0.5 rounded bg-amber-100">onboarding@resend.dev</code>{" "}
            which Resend restricts to the address you signed up with. To email
            invites (and reminders / confirmations) to real members:{" "}
            <ol className="list-decimal ml-5 mt-2 space-y-0.5">
              <li>
                Add a domain at{" "}
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  resend.com/domains
                </a>{" "}
                (5–10 min, needs DNS access).
              </li>
              <li>
                Once verified, set{" "}
                <code className="text-xs px-1.5 py-0.5 rounded bg-amber-100">
                  RESEND_FROM_EMAIL=&quot;YogaTeacher &lt;hello@yourdomain.com&gt;&quot;
                </code>{" "}
                in Vercel env and redeploy.
              </li>
            </ol>
            Until then, every invite is still saved — use{" "}
            <strong>Copy link</strong> below to share manually.
          </p>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Invite a team member</CardTitle>
          <CardDescription>
            Admins can manage everything. Staff can run the front desk (check-ins,
            roster). Instructors only see their own classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>{members.length} on the team</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {members.map((m) => (
              <li
                key={m.rowId}
                className="px-6 py-3.5 flex items-center gap-3"
              >
                <InitialsAvatar name={m.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </div>
                <RoleBadge role={m.role} />
                {m.userId !== userId && m.role !== "owner" && (
                  <RemoveMemberButton memberRowId={m.rowId} />
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending invites</CardTitle>
            <CardDescription>
              These haven&apos;t been accepted yet. Each link is valid for 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {pending.map((i) => {
                const link = `${origin}/invite/${i.token}`;
                const expired = new Date(i.expiresAt) < new Date();
                return (
                  <li
                    key={i.id}
                    className="px-6 py-3.5 flex items-center gap-3 flex-wrap"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <div className="font-medium">{i.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Expires{" "}
                        {new Date(i.expiresAt).toLocaleDateString()}
                        {expired && (
                          <span className="ml-2 text-rose-700">· expired</span>
                        )}
                      </div>
                    </div>
                    <RoleBadge role={i.role} />
                    <CopyLinkButton link={link} />
                    <RevokeButton inviteId={i.id} />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Returns true if the configured From address is *not* the resend.dev
// shared sandbox (which Resend restricts to the sender's own address).
async function usesVerifiedDomain(): Promise<boolean> {
  const from = await getFromAddress();
  return !/onboarding@resend\.dev/i.test(from);
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    owner: "bg-foreground text-background border-foreground",
    admin: "bg-primary/15 text-primary border-primary/30",
    staff: "bg-emerald-50 text-emerald-700 border-emerald-200",
    instructor: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <Badge
      className={
        styles[role] ?? "bg-stone-100 text-stone-600 border-stone-200"
      }
    >
      {role}
    </Badge>
  );
}
