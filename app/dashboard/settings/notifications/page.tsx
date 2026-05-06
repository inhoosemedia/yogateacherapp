import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { notificationLog, studio } from "@/db/schema";
import {
  isEmailConfigured,
  parseNotificationPrefs,
} from "@/lib/email";
import { requireStudio } from "@/lib/studio";
import { desc, eq } from "drizzle-orm";
import { NotificationsForm } from "./_components/notifications-form";
import { TestEmailButton } from "./_components/test-email-button";

export default async function NotificationsPage() {
  const { studio: s } = await requireStudio();

  const [row] = await db
    .select({ notificationSettings: studio.notificationSettings })
    .from(studio)
    .where(eq(studio.id, s.id))
    .limit(1);
  const prefs = parseNotificationPrefs(row?.notificationSettings);

  const recent = await db
    .select()
    .from(notificationLog)
    .where(eq(notificationLog.studioId, s.id))
    .orderBy(desc(notificationLog.sentAt))
    .limit(20);

  const emailConfigured = isEmailConfigured();

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Studio"
        title="Notifications"
        description="Choose which transactional emails go out to your members."
      />

      {!emailConfigured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-medium">Email isn&apos;t configured yet</div>
          <p className="mt-1 text-amber-800/90">
            Add{" "}
            <code className="text-xs px-1.5 py-0.5 rounded bg-amber-100">
              RESEND_API_KEY
            </code>{" "}
            to your environment variables. Free tier is 3,000 emails/month — sign
            up at{" "}
            <a
              href="https://resend.com/signup"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              resend.com
            </a>
            . Until then, all emails are skipped silently.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Email events</CardTitle>
          <CardDescription>
            Toggles take effect immediately. We never send marketing — only the
            transactional emails listed below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsForm initial={prefs} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test your setup</CardTitle>
          <CardDescription>
            We&apos;ll send a quick test email to your account address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestEmailButton enabled={emailConfigured} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>
            The last 20 emails sent on your studio&apos;s behalf.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No emails sent yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="px-6 py-3 flex items-center gap-3 text-sm flex-wrap"
                >
                  <span
                    className={
                      "size-2 rounded-full shrink-0 " +
                      (r.status === "sent" ? "bg-emerald-500" : "bg-rose-500")
                    }
                  />
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium truncate">{r.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.recipientEmail} · {r.type.replace(/_/g, " ")}
                      {r.error && (
                        <span className="text-rose-700"> · {r.error}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(r.sentAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
