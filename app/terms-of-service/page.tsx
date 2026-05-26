import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for YogaTeacher (yogateacherapp.com).",
};

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              Last updated: 25 May 2026
            </p>

            <div className="space-y-8 text-foreground/90 leading-relaxed">
              <section>
                <p>
                  These Terms govern your use of{" "}
                  <strong>Yoga Teacher App</strong> at{" "}
                  <a
                    href="https://www.yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    yogateacherapp.com
                  </a>{" "}
                  (the &ldquo;<strong>Service</strong>&rdquo;), operated by
                  Inhoose Media (&ldquo;<strong>we</strong>,&rdquo; &ldquo;
                  <strong>us</strong>,&rdquo; &ldquo;
                  <strong>YogaTeacher</strong>&rdquo;). By creating an account,
                  scheduling a class, accepting an invitation, or paying for a
                  package, you agree to these Terms.
                </p>
              </section>

              <Section title="1. The Service">
                <p>
                  YogaTeacher is a software-as-a-service platform that lets
                  yoga studios and independent teachers run their day-to-day
                  business: members, classes, packages, public booking,
                  recurring schedules, instructor portal, waitlists,
                  transactional email, and member payments (via PayPal, Stripe,
                  or Razorpay). We don&apos;t teach yoga and we don&apos;t hold
                  member funds — payments settle directly from members to the
                  studio&apos;s own payment account.
                </p>
              </Section>

              <Section title="2. Accounts">
                <p>
                  You must provide accurate signup information and keep your
                  password secure. You are responsible for everything done under
                  your account. Studios may invite teammates and instructors;
                  invited users get role-scoped access (admin, staff, or
                  instructor) and are bound by these Terms.
                </p>
              </Section>

              <Section title="3. Free trial and subscriptions">
                <p>
                  New studios get a 30-day free trial with no card required.
                  After the trial, continued use requires an active
                  subscription via your chosen payment provider. Subscriptions
                  renew monthly until cancelled. Cancelling stops further
                  charges; access is retained until the end of the paid period.
                </p>
                <p>
                  Prices shown on the public site are exclusive of any local
                  taxes that may apply. We may change prices with at least 30
                  days&apos; notice; you can cancel before the new price takes
                  effect.
                </p>
              </Section>

              <Section title="4. Member payments (studio-direct)">
                <p>
                  If you enable online payment for packages, your members pay
                  the studio&apos;s own PayPal, Stripe, or Razorpay account.
                  We do not touch the funds and do not take a cut of member
                  payments. Refunds, chargebacks, and disputes are handled
                  between the studio, the member, and the payment provider —
                  YogaTeacher is not party to those transactions.
                </p>
              </Section>

              <Section title="5. Acceptable use">
                <p>You agree not to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Send spam or unsolicited bulk email through the platform.</li>
                  <li>
                    Upload data you don&apos;t have the right to (members&apos;
                    personal information beyond what your business needs, etc.).
                  </li>
                  <li>
                    Attempt to access other studios&apos; data, reverse-engineer
                    the platform, or probe for vulnerabilities.
                  </li>
                  <li>
                    Use the service for anything unlawful, infringing, or
                    fraudulent.
                  </li>
                </ul>
                <p className="mt-3">
                  We may suspend or terminate accounts that violate these rules.
                  Abuse reports:{" "}
                  <a
                    href="mailto:hello@yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    hello@yogateacherapp.com
                  </a>
                  .
                </p>
              </Section>

              <Section title="6. Your data">
                <p>
                  You retain ownership of all data you put into YogaTeacher
                  (members, classes, packages, notes, etc.). We use that data
                  only to run the service for you. CSV exports are available at
                  any time under <em>Members</em>, <em>Classes</em>, and{" "}
                  <em>Reports</em>. Deletion is handled per our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </Section>

              <Section title="7. Availability and changes">
                <p>
                  We aim for high availability but do not guarantee 100% uptime.
                  We may add, change, or remove features as the product evolves.
                  Material removals to paid features will be announced at least
                  30 days in advance.
                </p>
              </Section>

              <Section title="8. Disclaimers">
                <p>
                  The Service is provided &ldquo;as is&rdquo; without warranties
                  of any kind. We don&apos;t warrant that the Service will be
                  uninterrupted, error-free, or perfectly secure. Use of the
                  Service is at your own risk.
                </p>
              </Section>

              <Section title="9. Liability">
                <p>
                  To the maximum extent permitted by law, YogaTeacher, Inhoose
                  Media, and their suppliers will not be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages — including lost revenue or data — arising from your
                  use of the Service. Our total liability for any claim is
                  capped at the amount you paid us in the 12 months preceding
                  the claim (or, if you haven&apos;t paid us anything, US$50).
                </p>
              </Section>

              <Section title="10. Indemnity">
                <p>
                  You agree to indemnify and hold us harmless from claims
                  arising out of (a) your use of the Service in violation of
                  these Terms, (b) data you upload that infringes someone
                  else&apos;s rights, or (c) your dealings with your own
                  members, employees, or instructors.
                </p>
              </Section>

              <Section title="11. Termination">
                <p>
                  You can cancel any time by contacting{" "}
                  <a
                    href="mailto:hello@yogateacherapp.com"
                    className="text-primary hover:underline"
                  >
                    hello@yogateacherapp.com
                  </a>{" "}
                  or via your subscription portal. We may suspend or terminate
                  your account if you violate these Terms or fail to pay. On
                  termination, sections 6, 8, 9, 10, and 12 survive.
                </p>
              </Section>

              <Section title="12. Governing law">
                <p>
                  These Terms are governed by the laws of England and Wales.
                  Disputes will be resolved in the courts of that jurisdiction
                  unless local consumer-protection law gives you the right to
                  bring a claim in your country of residence.
                </p>
              </Section>

              <Section title="13. Contact">
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
