"use server";

import { db } from "@/db/drizzle";
import {
  instructor as instructorTable,
  studio,
  studioInvite,
  studioMember,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const ACTIVE_STUDIO_COOKIE = "active_studio_id";

export async function acceptInvite(token: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Sign in first");

  const [invite] = await db
    .select()
    .from(studioInvite)
    .where(eq(studioInvite.token, token))
    .limit(1);
  if (!invite) throw new Error("Invitation not found");
  if (invite.acceptedAt) throw new Error("Invitation has already been used");
  if (new Date(invite.expiresAt) < new Date())
    throw new Error("Invitation has expired");

  // Email match (case-insensitive). Better-Auth always lowercases.
  if (
    invite.email.toLowerCase() !== session.user.email.toLowerCase()
  ) {
    throw new Error(
      `This invite is for ${invite.email}. Sign in with that account.`,
    );
  }

  const [s] = await db
    .select()
    .from(studio)
    .where(eq(studio.id, invite.studioId))
    .limit(1);
  if (!s) throw new Error("Studio not found");

  // Idempotent: if they're already a member, just bump their role if higher.
  const [existing] = await db
    .select()
    .from(studioMember)
    .where(
      and(
        eq(studioMember.studioId, invite.studioId),
        eq(studioMember.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!existing) {
    await db.insert(studioMember).values({
      id: nanoid(),
      studioId: invite.studioId,
      userId: session.user.id,
      role: invite.role,
    });
  } else if (existing.role === "staff" && invite.role !== "staff") {
    // Upgrade role if invite is more privileged
    await db
      .update(studioMember)
      .set({ role: invite.role })
      .where(eq(studioMember.id, existing.id));
  }

  // For instructor invites, link the instructor record to the user.
  if (invite.role === "instructor" && invite.instructorId) {
    await db
      .update(instructorTable)
      .set({ userId: session.user.id })
      .where(
        and(
          eq(instructorTable.id, invite.instructorId),
          eq(instructorTable.studioId, invite.studioId),
        ),
      );
  }

  await db
    .update(studioInvite)
    .set({ acceptedAt: new Date() })
    .where(eq(studioInvite.id, invite.id));

  // Set the active studio so they land in the right tenant.
  (await cookies()).set(ACTIVE_STUDIO_COOKIE, invite.studioId, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  if (invite.role === "instructor") {
    redirect("/instructor");
  }
  redirect("/dashboard");
}
