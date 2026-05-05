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
};

const ACTIVE_STUDIO_COOKIE = "active_studio_id";

/**
 * Returns the user's active studio (the one stored in cookie, falling back
 * to their first studio membership). Returns null if user has no studios.
 */
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

/**
 * Server-action helper: get the current user, their active studio, and assert
 * the user is a member. Redirects to sign-in / onboarding as needed.
 */
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

/**
 * Verify the given studio belongs to the user — for use in mutating actions
 * where the studio id is supplied (e.g. switching).
 */
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
