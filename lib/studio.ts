import { db } from "@/db/drizzle";
import { studio, studioMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ActiveStudio = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  currency: string;
  role: string;
  trialEndsAt: Date;
  subscriptionStatus: string;
  planTier: string | null;
  subscriptionCurrentPeriodEnd: Date | null;
  logoUrl: string | null;
};

const ACTIVE_STUDIO_COOKIE = "active_studio_id";

export async function getActiveStudio(
  userId: string,
): Promise<ActiveStudio | null> {
  const memberships = await db
    .select({
      id: studio.id,
      name: studio.name,
      slug: studio.slug,
      timezone: studio.timezone,
      currency: studio.currency,
      role: studioMember.role,
      trialEndsAt: studio.trialEndsAt,
      subscriptionStatus: studio.subscriptionStatus,
      planTier: studio.planTier,
      subscriptionCurrentPeriodEnd: studio.subscriptionCurrentPeriodEnd,
      logoUrl: studio.logoUrl,
    })
    .from(studioMember)
    .innerJoin(studio, eq(studio.id, studioMember.studioId))
    .where(eq(studioMember.userId, userId));

  if (memberships.length === 0) return null;

  const cookieHeader = (await headers()).get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`${ACTIVE_STUDIO_COOKIE}=([^;]+)`),
  );
  const cookieStudioId = match?.[1];
  const found = cookieStudioId
    ? memberships.find((m) => m.id === cookieStudioId)
    : null;
  return found ?? memberships[0];
}

export async function requireStudio(): Promise<{
  userId: string;
  studio: ActiveStudio;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const active = await getActiveStudio(session.user.id);
  if (!active) redirect("/onboarding");
  return { userId: session.user.id, studio: active };
}

export async function listMembershipsForUser(
  userId: string,
): Promise<{ id: string; name: string; role: string }[]> {
  return db
    .select({
      id: studio.id,
      name: studio.name,
      role: studioMember.role,
    })
    .from(studioMember)
    .innerJoin(studio, eq(studio.id, studioMember.studioId))
    .where(eq(studioMember.userId, userId));
}

export async function assertMembership(userId: string, studioId: string) {
  const [row] = await db
    .select({ id: studioMember.id })
    .from(studioMember)
    .where(
      and(
        eq(studioMember.userId, userId),
        eq(studioMember.studioId, studioId),
      ),
    )
    .limit(1);
  if (!row) throw new Error("Not a member of this studio");
}

/**
 * Studios can use the dashboard if:
 *  - they're in their trial window, OR
 *  - they have an active subscription
 */
export function studioHasAccess(s: ActiveStudio): boolean {
  if (s.subscriptionStatus === "active") return true;
  if (s.subscriptionStatus === "trialing" && s.trialEndsAt > new Date())
    return true;
  return false;
}

export function trialDaysRemaining(s: ActiveStudio): number {
  const ms = s.trialEndsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}
