import { db } from "@/db/drizzle";
import { studioMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const COOKIE = "active_studio_id";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { studioId } = (await req.json().catch(() => ({}))) as {
    studioId?: string;
  };
  if (!studioId) {
    return NextResponse.json({ error: "studioId required" }, { status: 400 });
  }
  const [m] = await db
    .select({ id: studioMember.id })
    .from(studioMember)
    .where(
      and(
        eq(studioMember.userId, session.user.id),
        eq(studioMember.studioId, studioId),
      ),
    )
    .limit(1);
  if (!m) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  (await cookies()).set(COOKIE, studioId, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/dashboard");
  return NextResponse.json({ ok: true });
}
