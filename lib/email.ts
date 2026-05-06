import "server-only";

import { db } from "@/db/drizzle";
import { notificationLog } from "@/db/schema";
import { nanoid } from "nanoid";
import { Resend } from "resend";

let cached: Resend | null = null;
function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export type NotificationType =
  | "booking_confirmation"
  | "booking_cancelled"
  | "class_reminder"
  | "waitlist_promoted"
  | "invite"
  | "test";

type SendInput = {
  studioId?: string | null;
  type: NotificationType;
  to: string;
  subject: string;
  html: string;
  text?: string;
  bookingId?: string;
  scheduledClassId?: string;
  memberId?: string;
};

const FROM_FALLBACK = "YogaTeacher <onboarding@resend.dev>";

export async function sendEmail(input: SendInput): Promise<{
  ok: boolean;
  error?: string;
}> {
  const resend = getResend();
  if (!resend) {
    await logRow(input, "failed", "RESEND_API_KEY not configured");
    return { ok: false, error: "Email is not configured" };
  }

  const from = process.env.RESEND_FROM_EMAIL || FROM_FALLBACK;
  try {
    const { error } = await resend.emails.send({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    if (error) {
      await logRow(input, "failed", error.message);
      return { ok: false, error: error.message };
    }
    await logRow(input, "sent", null);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Send failed";
    await logRow(input, "failed", msg);
    return { ok: false, error: msg };
  }
}

async function logRow(
  input: SendInput,
  status: "sent" | "failed",
  error: string | null,
) {
  try {
    await db.insert(notificationLog).values({
      id: nanoid(),
      studioId: input.studioId ?? null,
      type: input.type,
      recipientEmail: input.to,
      subject: input.subject,
      status,
      error,
      bookingId: input.bookingId ?? null,
      scheduledClassId: input.scheduledClassId ?? null,
      memberId: input.memberId ?? null,
    });
  } catch (e) {
    // Never let logging failures break the caller.
    console.error("notification_log insert failed", e);
  }
}

// ─── Templates ───────────────────────────────────────────────────────
// All templates render a calm cream/sage email matching the brand.

function shell(opts: {
  studioName: string;
  preheader?: string;
  body: string;
}): string {
  const { studioName, preheader = "", body } = opts;
  return `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f7f3ec;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#222;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>` : ""}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;padding:32px 16px;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;background:#ffffff;border-radius:18px;border:1px solid #ece5d8;box-shadow:0 1px 0 rgba(0,0,0,0.02);">
      <tr><td style="padding:28px 32px 18px;border-bottom:1px solid #efe8da;">
        <table width="100%"><tr>
          <td><div style="display:inline-flex;align-items:center;gap:10px;">
            <div style="width:34px;height:34px;border-radius:9px;background:#3f5141;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:16px;">Y</div>
            <span style="font-size:18px;font-weight:600;letter-spacing:-0.01em;">${escape(studioName)}</span>
          </div></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 32px 32px;">${body}</td></tr>
      <tr><td style="padding:18px 32px;border-top:1px solid #efe8da;color:#9a9183;font-size:12px;line-height:1.55;">
        Sent by <strong style="color:#5a5448;">${escape(studioName)}</strong> via YogaTeacher.<br/>
        Powered by <a href="https://yogateacherapp.com" style="color:#3f5141;text-decoration:none;">YogaTeacher</a>.
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDateTime(d: Date | string): string {
  const dt = new Date(d);
  return (
    dt.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
}

export function bookingConfirmationTemplate(opts: {
  studioName: string;
  memberName: string;
  className: string;
  startsAt: Date;
  location: string | null;
  instructorName: string | null;
  bookingUrl?: string;
  usedCredit: boolean;
}): { subject: string; html: string; text: string } {
  const subject = `You're booked for ${opts.className}`;
  const body = `
    <h1 style="font-size:26px;font-weight:600;letter-spacing:-0.02em;margin:0 0 6px;">You're on the mat 🌿</h1>
    <p style="margin:0 0 18px;color:#5a5448;font-size:15px;line-height:1.6;">Hi ${escape(opts.memberName)}, your spot is reserved.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;border:1px solid #ece5d8;border-radius:12px;padding:18px 20px;margin:0 0 18px;">
      <tr><td style="font-size:13px;color:#9a9183;text-transform:uppercase;letter-spacing:0.12em;padding-bottom:6px;">Class</td></tr>
      <tr><td style="font-size:20px;font-weight:600;padding-bottom:12px;">${escape(opts.className)}</td></tr>
      <tr><td style="font-size:14px;color:#5a5448;padding-bottom:4px;">📅 ${escape(fmtDateTime(opts.startsAt))}</td></tr>
      ${opts.instructorName ? `<tr><td style="font-size:14px;color:#5a5448;padding-bottom:4px;">🧘 ${escape(opts.instructorName)}</td></tr>` : ""}
      ${opts.location ? `<tr><td style="font-size:14px;color:#5a5448;">📍 ${escape(opts.location)}</td></tr>` : ""}
    </table>
    <p style="margin:0 0 14px;color:#5a5448;font-size:14px;line-height:1.6;">
      ${opts.usedCredit ? "One credit was used from your active package." : "If you have a package, your credit will be applied. Otherwise pay at the studio when you arrive."}
    </p>
    ${opts.bookingUrl ? `<p style="margin:18px 0 0;"><a href="${opts.bookingUrl}" style="display:inline-block;padding:10px 18px;background:#3f5141;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;">View class</a></p>` : ""}
  `;
  const text = `Hi ${opts.memberName}, you're booked for ${opts.className} on ${fmtDateTime(opts.startsAt)}.${opts.location ? ` Location: ${opts.location}.` : ""}${opts.instructorName ? ` Instructor: ${opts.instructorName}.` : ""}`;
  return {
    subject,
    html: shell({
      studioName: opts.studioName,
      preheader: `${opts.className} · ${fmtDateTime(opts.startsAt)}`,
      body,
    }),
    text,
  };
}

export function bookingCancelledTemplate(opts: {
  studioName: string;
  memberName: string;
  className: string;
  startsAt: Date;
  reason?: string;
  refunded?: boolean;
}): { subject: string; html: string; text: string } {
  const subject = `Cancelled: ${opts.className}`;
  const body = `
    <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:0 0 6px;">Your booking was cancelled</h1>
    <p style="margin:0 0 18px;color:#5a5448;font-size:15px;line-height:1.6;">Hi ${escape(opts.memberName)}, we wanted to let you know:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf3f1;border:1px solid #f3d9d3;border-radius:12px;padding:18px 20px;margin:0 0 18px;">
      <tr><td style="font-size:18px;font-weight:600;padding-bottom:6px;">${escape(opts.className)}</td></tr>
      <tr><td style="font-size:14px;color:#7a3a32;">${escape(fmtDateTime(opts.startsAt))} — cancelled</td></tr>
    </table>
    ${opts.reason ? `<p style="margin:0 0 12px;color:#5a5448;font-size:14px;line-height:1.6;">${escape(opts.reason)}</p>` : ""}
    ${opts.refunded ? `<p style="margin:0 0 12px;color:#3f5141;font-size:14px;line-height:1.6;">✓ Your credit has been refunded back to your package.</p>` : ""}
    <p style="margin:0;color:#5a5448;font-size:14px;line-height:1.6;">Browse other upcoming classes anytime — we'd love to see you on the mat.</p>
  `;
  const text = `Your booking for ${opts.className} on ${fmtDateTime(opts.startsAt)} has been cancelled.${opts.refunded ? " Your credit was refunded." : ""}`;
  return {
    subject,
    html: shell({ studioName: opts.studioName, body }),
    text,
  };
}

export function classReminderTemplate(opts: {
  studioName: string;
  memberName: string;
  className: string;
  startsAt: Date;
  location: string | null;
  instructorName: string | null;
}): { subject: string; html: string; text: string } {
  const subject = `Tomorrow: ${opts.className}`;
  const body = `
    <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:0 0 6px;">See you tomorrow 🧘</h1>
    <p style="margin:0 0 18px;color:#5a5448;font-size:15px;line-height:1.6;">Hi ${escape(opts.memberName)}, a gentle reminder you're booked for:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;border:1px solid #ece5d8;border-radius:12px;padding:18px 20px;margin:0 0 18px;">
      <tr><td style="font-size:20px;font-weight:600;padding-bottom:8px;">${escape(opts.className)}</td></tr>
      <tr><td style="font-size:14px;color:#5a5448;padding-bottom:4px;">📅 ${escape(fmtDateTime(opts.startsAt))}</td></tr>
      ${opts.instructorName ? `<tr><td style="font-size:14px;color:#5a5448;padding-bottom:4px;">🧘 ${escape(opts.instructorName)}</td></tr>` : ""}
      ${opts.location ? `<tr><td style="font-size:14px;color:#5a5448;">📍 ${escape(opts.location)}</td></tr>` : ""}
    </table>
    <p style="margin:0;color:#5a5448;font-size:14px;line-height:1.6;">Arrive 5–10 minutes early to settle in. Hydrate, breathe, and bring your favourite mat.</p>
  `;
  const text = `Reminder: you're booked for ${opts.className} on ${fmtDateTime(opts.startsAt)}.`;
  return {
    subject,
    html: shell({
      studioName: opts.studioName,
      preheader: `Reminder · ${fmtDateTime(opts.startsAt)}`,
      body,
    }),
    text,
  };
}

export function waitlistPromotedTemplate(opts: {
  studioName: string;
  memberName: string;
  className: string;
  startsAt: Date;
  location: string | null;
  instructorName: string | null;
  bookingUrl?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Spot opened up — you're in for ${opts.className}`;
  const body = `
    <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:0 0 6px;">Good news ✨</h1>
    <p style="margin:0 0 18px;color:#5a5448;font-size:15px;line-height:1.6;">Hi ${escape(opts.memberName)}, a spot opened up and you're now booked from the waitlist.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;border:1px solid #ece5d8;border-radius:12px;padding:18px 20px;margin:0 0 18px;">
      <tr><td style="font-size:20px;font-weight:600;padding-bottom:8px;">${escape(opts.className)}</td></tr>
      <tr><td style="font-size:14px;color:#5a5448;padding-bottom:4px;">📅 ${escape(fmtDateTime(opts.startsAt))}</td></tr>
      ${opts.instructorName ? `<tr><td style="font-size:14px;color:#5a5448;padding-bottom:4px;">🧘 ${escape(opts.instructorName)}</td></tr>` : ""}
      ${opts.location ? `<tr><td style="font-size:14px;color:#5a5448;">📍 ${escape(opts.location)}</td></tr>` : ""}
    </table>
    <p style="margin:0 0 12px;color:#5a5448;font-size:14px;line-height:1.6;">If you can no longer make it, please cancel so we can offer the spot to the next person on the waitlist.</p>
    ${opts.bookingUrl ? `<p style="margin:18px 0 0;"><a href="${opts.bookingUrl}" style="display:inline-block;padding:10px 18px;background:#3f5141;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px;">View class</a></p>` : ""}
  `;
  const text = `Good news, you're off the waitlist! You're now booked for ${opts.className} on ${fmtDateTime(opts.startsAt)}.`;
  return {
    subject,
    html: shell({ studioName: opts.studioName, body }),
    text,
  };
}

export function inviteTemplate(opts: {
  studioName: string;
  inviterName: string;
  role: string;
  acceptUrl: string;
}): { subject: string; html: string; text: string } {
  const niceRole =
    opts.role === "instructor"
      ? "instructor"
      : opts.role === "admin"
        ? "studio admin"
        : "team member";
  const subject = `${opts.inviterName} invited you to ${opts.studioName} as ${niceRole}`;
  const body = `
    <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:0 0 6px;">You're invited 👋</h1>
    <p style="margin:0 0 18px;color:#5a5448;font-size:15px;line-height:1.6;">
      <strong>${escape(opts.inviterName)}</strong> invited you to join
      <strong>${escape(opts.studioName)}</strong> as a ${escape(niceRole)} on YogaTeacher.
    </p>
    <p style="margin:0 0 22px;"><a href="${opts.acceptUrl}" style="display:inline-block;padding:12px 22px;background:#3f5141;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;font-size:15px;">Accept invitation</a></p>
    <p style="margin:0;color:#9a9183;font-size:13px;line-height:1.55;">This link is valid for 7 days. If you weren't expecting this, you can ignore this email.</p>
  `;
  const text = `${opts.inviterName} invited you to ${opts.studioName} as ${niceRole}. Accept here: ${opts.acceptUrl}`;
  return {
    subject,
    html: shell({ studioName: opts.studioName, body }),
    text,
  };
}

export function testEmailTemplate(opts: {
  studioName: string;
}): { subject: string; html: string; text: string } {
  const subject = `Test email from ${opts.studioName}`;
  const body = `
    <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:0 0 6px;">It works 🎉</h1>
    <p style="margin:0;color:#5a5448;font-size:15px;line-height:1.6;">Your Resend integration is configured and working. Booking confirmations, cancellations, and reminders will reach your members from now on.</p>
  `;
  return {
    subject,
    html: shell({ studioName: opts.studioName, body }),
    text: "Your YogaTeacher email integration is working.",
  };
}

// ─── Notification preferences ────────────────────────────────────────
export type NotificationPrefs = {
  bookingConfirmation: boolean;
  bookingCancelled: boolean;
  classReminder: boolean;
  waitlistPromoted: boolean;
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  bookingConfirmation: true,
  bookingCancelled: true,
  classReminder: true,
  waitlistPromoted: true,
};

export function parseNotificationPrefs(raw: unknown): NotificationPrefs {
  if (!raw || typeof raw !== "object") return DEFAULT_NOTIFICATION_PREFS;
  const r = raw as Record<string, unknown>;
  return {
    bookingConfirmation: r.bookingConfirmation !== false,
    bookingCancelled: r.bookingCancelled !== false,
    classReminder: r.classReminder !== false,
    waitlistPromoted: r.waitlistPromoted !== false,
  };
}
