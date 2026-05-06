import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { studio, studioInvite, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { acceptInvite } from "./actions";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const [row] = await db
    .select({
      id: studioInvite.id,
      email: studioInvite.email,
      role: studioInvite.role,
      acceptedAt: studioInvite.acceptedAt,
      expiresAt: studioInvite.expiresAt,
      studioName: studio.name,
      inviterName: user.name,
    })
    .from(studioInvite)
    .innerJoin(studio, eq(studio.id, studioInvite.studioId))
    .innerJoin(user, eq(user.id, studioInvite.invitedByUserId))
    .where(eq(studioInvite.token, token))
    .limit(1);

  return (
    <div className="min-h-screen bg-canvas canvas-grain flex flex-col items-center justify-center p-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-10 font-display text-lg tracking-tight"
      >
        <span className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
          <BrandMark size={20} />
        </span>
        YogaTeacher
      </Link>

      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          {!row ? (
            <Invalid title="Invitation not found" message="This link is invalid or was revoked." />
          ) : row.acceptedAt ? (
            <Invalid
              title="Already accepted"
              message="This invitation has already been used. If you signed up, head back to your dashboard."
            />
          ) : new Date(row.expiresAt) < new Date() ? (
            <Invalid
              title="Invitation expired"
              message={`Ask the studio owner to send you a new invite to ${row.email}.`}
            />
          ) : !session ? (
            <SignInPrompt
              email={row.email}
              studioName={row.studioName}
              inviterName={row.inviterName}
              role={row.role}
              token={token}
            />
          ) : session.user.email.toLowerCase() !== row.email.toLowerCase() ? (
            <Invalid
              title="Wrong account"
              message={`This invite was sent to ${row.email}. You're signed in as ${session.user.email}. Sign out and use the right address.`}
            />
          ) : (
            <AcceptForm
              token={token}
              studioName={row.studioName}
              inviterName={row.inviterName}
              role={row.role}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Invalid({ title, message }: { title: string; message: string }) {
  return (
    <div className="text-center">
      <h1 className="font-display text-2xl tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      <Link href="/" className="text-sm text-primary hover:underline mt-6 inline-block">
        Go home →
      </Link>
    </div>
  );
}

function SignInPrompt({
  email,
  studioName,
  inviterName,
  role,
  token,
}: {
  email: string;
  studioName: string;
  inviterName: string;
  role: string;
  token: string;
}) {
  const returnTo = encodeURIComponent(`/invite/${token}`);
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Invitation
      </div>
      <h1 className="font-display text-3xl tracking-tight mt-1">
        You&apos;re invited to {studioName}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        <strong>{inviterName}</strong> invited <strong>{email}</strong> to join as <strong>{role}</strong>.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Sign in or create an account with <strong>{email}</strong> to accept.
      </p>
      <div className="mt-6 flex gap-2">
        <Link href={`/sign-up?returnTo=${returnTo}`}>
          <Button>Create account</Button>
        </Link>
        <Link href={`/sign-in?returnTo=${returnTo}`}>
          <Button variant="outline">Sign in</Button>
        </Link>
      </div>
    </div>
  );
}

function AcceptForm({
  token,
  studioName,
  inviterName,
  role,
}: {
  token: string;
  studioName: string;
  inviterName: string;
  role: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await acceptInvite(token);
      }}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Invitation
      </div>
      <h1 className="font-display text-3xl tracking-tight mt-1">
        Join {studioName}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        <strong>{inviterName}</strong> invited you to join as <strong>{role}</strong>.
      </p>
      <Button className="mt-6 w-full" size="lg">
        Accept invitation
      </Button>
    </form>
  );
}
