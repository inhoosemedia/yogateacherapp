import "server-only";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireSuperAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?returnTo=/admin");
  const [u] = await db
    .select({ isSuperAdmin: user.isSuperAdmin })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  if (!u?.isSuperAdmin) redirect("/dashboard");
  return { userId: session.user.id, email: session.user.email };
}
