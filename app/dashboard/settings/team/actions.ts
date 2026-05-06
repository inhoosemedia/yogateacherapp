"use server";

import { db } from "@/db/drizzle";
import {
  instructor as instructorTable,
  studioInvite,
  studioMember,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { inviteTemplate, sendEmail } from "@/lib/email";
import { requireStudio } from "@/lib/studio";
import { addDays } from "date-fns";
import { and, eq, ne } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const INVITE_TTL_DAYS = 7;

function makeToken(): string {
  // Use nanoid with a slightly longer alphabet for invite tokens.
  return nanoid(32);
}

function inviteUrl(token: string): string {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${origin}/invite/${token}`;
}

export type InviteRole = "admin" | "staff" | "instructor";

export async function inviteTeamMember(input: {
  email: string;
  role: InviteRole;
  instructorId?: string; // optional — link the invite to an existing instructor row
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");
  const { studio } = await requireStudio();

  const email = input.email.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    throw new Error("Enter a valid email");
  if (!["admin", "staff", "instructor"].includes(input.role))
    throw new Error("Invalid role");

  // Block re-inviting someone already in the team.
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (existing) {
    const [already] = await db
      .select({ id: studioMember.id })
      .from(studioMember)
      .where(
        and(
          eq(studioMember.studioId, studio.id),
          eq(studioMember.userId, existing.id),
        ),
      )
      .limit(1);
    if (already) throw new Error("That person is already on your team");
  }

  // Cancel any existing pending invite for the same email/studio so we don't
  // accumulate stale rows.
  await db
    .delete(studioInvite)
    .where(
      and(
        eq(studioInvite.studioId, studio.id),
        eq(studioInvite.email, email),
      ),
    );

  const token = makeToken();
  const expiresAt = addDays(new Date(), INVITE_TTL_DAYS);
  const inviteId = nanoid();

  // For instructor invites, optionally link to an instructor record. If none
  // was supplied, create one so the invitee shows up in the instructors list
  // immediately (will be linked on accept).
  let instructorId = input.instructorId ?? null;
  if (input.role === "instructor" && !instructorId) {
    instructorId = nanoid();
    await db.insert(instructorTable).values({
      id: instructorId,
      studioId: studio.id,
      fullName: email.split("@")[0] ?? "New instructor",
      email,
      active: true,
    });
  }

  await db.insert(studioInvite).values({
    id: inviteId,
    studioId: studio.id,
    email,
    role: input.role,
    instructorId,
    invitedByUserId: session.user.id,
    token,
    expiresAt,
  });

  const tpl = inviteTemplate({
    studioName: studio.name,
    inviterName: session.user.name || session.user.email,
    role: input.role,
    acceptUrl: inviteUrl(token),
  });
  const result = await sendEmail({
    studioId: studio.id,
    type: "invite",
    to: email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });
  if (!result.ok) {
    // Don't fail the invite — the owner can resend or copy link manually.
    console.warn("Invite email failed:", result.error);
  }

  revalidatePath("/dashboard/settings/team");
  return {
    inviteId,
    link: inviteUrl(token),
    emailed: result.ok,
    emailError: result.ok ? null : result.error ?? "Email send failed",
  };
}

export async function revokeInvite(inviteId: string) {
  const { studio } = await requireStudio();
  await db
    .delete(studioInvite)
    .where(
      and(
        eq(studioInvite.id, inviteId),
        eq(studioInvite.studioId, studio.id),
      ),
    );
  revalidatePath("/dashboard/settings/team");
}

export async function removeTeamMember(memberRowId: string) {
  const { studio, userId } = await requireStudio();
  // Don't let owner remove themselves.
  await db
    .delete(studioMember)
    .where(
      and(
        eq(studioMember.id, memberRowId),
        eq(studioMember.studioId, studio.id),
        ne(studioMember.userId, userId),
      ),
    );
  revalidatePath("/dashboard/settings/team");
}
