import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How YogaTeacher (yogateacherapp.com) collects, uses, and protects your information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-canvas canvas-grain">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <Card>
          <CardContent className="p-8 md:p-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              YogaTeacher · yogateacherapp.com
            </div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Last updated: 25 May 2026
            </p>

            <div className="space-y-8 text-foreground/90 leading-relaxed">
              <section>
                <p>
                  This Privacy Policy explains how{" "}
                  <strong>Yoga Teacher App</strong> (operating{" "}
                  <a
                    href="https://www.yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    yogateacherapp.com
                  </a>
                  , &ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>
                  ,&rdquo; or &ldquo;<strong>YogaTeacher</strong>&rdquo;)
                  collects, uses, and shares information when you visit the site,
                  create a studio, book a class, or pay for a package. By using
                  the service you agree to the practices described here.
                </p>
              </section>

              <Section title="1. Who we are">
                <p>
                  YogaTeacher is a software-as-a-service platform that lets yoga
                  studios and independent teachers manage members, classes,
                  packages and bookings. The platform is operated by Inhoose
                  Media. Questions: write to{" "}
                  <a
                    href="mailto:hello@yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    hello@yogateacherapp.com
                  </a>
                  .
                </p>
              </Section>

              <Section title="2. Information we collect">
                <p>We collect only what is necessary to run the service:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    <strong>Account data:</strong> name, email, hashed password,
                    studio name, time zone, currency, studio logo URL (if set).
                  </li>
                  <li>
                    <strong>Operational data:</strong> classes you schedule,
                    members you add (name, email, phone, notes you write),
                    packages you create, bookings, attendance, waitlist entries.
                  </li>
                  <li>
                    <strong>Payment data:</strong> if you charge members or pay
                    for the platform subscription, our payment processors
                    (PayPal, Stripe, Razorpay) handle card and bank details
                    directly — we only store the transaction reference, amount,
                    currency, and processor IDs. We never see your card number.
                  </li>
                  <li>
                    <strong>Communications:</strong> emails we send via Resend
                    (booking confirmations, reminders, invitations, password
                    resets). The recipient address and subject are logged for
                    troubleshooting.
                  </li>
                  <li>
                    <strong>Server logs:</strong> standard request logs (IP
                    address, user agent, path, status code) for security and
                    debugging. Retained ≤ 30 days.
                  </li>
                  <li>
                    <strong>Analytics:</strong> if Google Ads / Analytics is
                    configured, gtag.js sets standard analytics cookies for
                    audience measurement and conversion tracking.
                  </li>
                </ul>
              </Section>

              <Section title="3. How we use information">
                <ul className="list-disc ml-6 space-y-1">
                  <li>To run the platform — store your studio data and serve it back to you.</li>
                  <li>
                    To send transactional emails you would expect: booking
                    confirmations, class reminders, password resets, invitations.
                    You can disable individual events at{" "}
                    <em>Settings → Notifications</em>.
                  </li>
                  <li>
                    To process payments via your chosen processor (PayPal,
                    Stripe, Razorpay).
                  </li>
                  <li>
                    To measure how the public landing page performs (anonymous,
                    aggregate).
                  </li>
                  <li>
                    To investigate abuse, fraud, or violations of the Terms.
                  </li>
                </ul>
                <p className="mt-3">
                  We do <strong>not</strong> sell your information. We do{" "}
                  <strong>not</strong> share it with advertisers beyond the
                  analytics processors named below.
                </p>
              </Section>

              <Section title="4. Processors and sub-processors">
                <p>
                  We use the following processors to run YogaTeacher. Each
                  processes data on our behalf under their own terms:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    <strong>Neon</strong> — Postgres database hosting (EU-West-2).
                  </li>
                  <li>
                    <strong>Vercel</strong> — application hosting, request logs.
                  </li>
                  <li>
                    <strong>Better-Auth</strong> — authentication library running
                    on our own servers (no external service).
                  </li>
                  <li>
                    <strong>Resend</strong> — transactional email delivery.
                  </li>
                  <li>
                    <strong>PayPal, Stripe, Razorpay</strong> — payment
                    processors. The studio owner chooses which provider to use;
                    funds settle directly to the studio&apos;s account, not ours.
                  </li>
                  <li>
                    <strong>Google Ads / Analytics</strong> — only when
                    configured by the platform operator. Used for traffic
                    measurement and ad conversion tracking on public pages.
                  </li>
                </ul>
              </Section>

              <Section title="5. Cookies and tracking">
                <p>
                  We set a session cookie when you sign in so we know who you
                  are on subsequent requests. We set an{" "}
                  <code className="text-xs px-1 py-0.5 rounded bg-secondary">
                    active_studio_id
                  </code>{" "}
                  cookie when you switch between studios. If Google
                  Ads/Analytics is configured, gtag.js sets standard analytics
                  cookies (typically <code>_ga</code>, <code>_gid</code>,{" "}
                  <code>_gat</code>). No third-party advertising cookies are set
                  by us beyond these.
                </p>
              </Section>

              <Section title="6. Security">
                <p>
                  Passwords are hashed with industry-standard algorithms
                  (Better-Auth&apos;s default). Data in transit is TLS-encrypted.
                  Payment credentials never touch our servers — they are entered
                  into the payment processor&apos;s checkout flow. We do not
                  store card numbers, CVVs, or bank account numbers.
                </p>
              </Section>

              <Section title="7. Your rights">
                <p>
                  Depending on where you live, you may have rights to access,
                  correct, export, or delete your personal data; to restrict or
                  object to processing; and to lodge a complaint with a data
                  protection authority. To exercise any of these, email{" "}
                  <a
                    href="mailto:hello@yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    hello@yogateacherapp.com
                  </a>{" "}
                  from the address associated with your account. We will respond
                  within 30 days.
                </p>
              </Section>

              <Section title="8. Data retention">
                <p>
                  Active account data is kept for the life of the studio. If you
                  delete your studio (Settings → Account → contact us), all
                  associated members, classes, bookings, and packages are
                  cascade-deleted within 30 days. Backups are purged within 90
                  days. Notification logs and server logs are kept ≤ 30 days.
                </p>
              </Section>

              <Section title="9. Children">
                <p>
                  YogaTeacher is not directed to children under 13 (or under 16
                  in the EEA). Studio owners are responsible for any data they
                  add about members under those ages on the studio&apos;s
                  behalf.
                </p>
              </Section>

              <Section title="10. International transfers">
                <p>
                  Our primary database is in Neon&apos;s EU-West-2 region.
                  Vercel and our processors may serve content from globally
                  distributed edges. Data is encrypted in transit and at rest.
                </p>
              </Section>

              <Section title="11. Changes">
                <p>
                  We may update this policy from time to time. Material changes
                  will be announced in the dashboard or by email at least 14 days
                  before they take effect.
                </p>
              </Section>

              <Section title="12. Contact">
                <p>
                  <strong>Yoga Teacher App</strong> by Inhoose Media
                  <br />
                  <a
                    href="mailto:hello@yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    hello@yogateacherapp.com
                  </a>
                  <br />
                  <a
                    href="https://www.yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    yogateacherapp.com
                  </a>
                </p>
              </Section>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl tracking-tight mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
