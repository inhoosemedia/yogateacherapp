import "server-only";

import { db } from "@/db/drizzle";
import { instructor, studio } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type InstructorContext = {
  userId: string;
  instructorId: string;
  fullName: string;
  studioId: string;
  studioName: string;
  studioSlug: string;
  studioCurrency: string;
};

export async function getInstructorContext(): Promise<InstructorContext | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [row] = await db
    .select({
      instructorId: instructor.id,
      fullName: instructor.fullName,
      studioId: studio.id,
      studioName: studio.name,
      studioSlug: studio.slug,
      studioCurrency: studio.currency,
    })
    .from(instructor)
    .innerJoin(studio, eq(studio.id, instructor.studioId))
    .where(eq(instructor.userId, session.user.id))
    .limit(1);

  if (!row) return null;
  return {
    userId: session.user.id,
    instructorId: row.instructorId,
    fullName: row.fullName,
    studioId: row.studioId,
    studioName: row.studioName,
    studioSlug: row.studioSlug,
    studioCurrency: row.studioCurrency,
  };
}

/**
 * Resolve the signed-in user's instructor record. Used by the /instructor portal.
 * If no instructor record is linked, throws a redirect-style error to /sign-in
 * (rather than back to /dashboard which would loop for instructor-role members
 * without a linked instructor row).
 */
export async function requireInstructor(): Promise<InstructorContext> {
  const ctx = await getInstructorContext();
  if (!ctx) {
    redirect("/sign-in?returnTo=/instructor");
  }
  return ctx;
}
