import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { db } from "@/db/drizzle";
import {
  booking,
  classType,
  member,
  memberPackage,
  package_,
  scheduledClass,
} from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { requireStudio } from "@/lib/studio";
import {
  IconArrowLeft,
  IconCalendarMonth,
  IconMail,
  IconPackage,
  IconPhone,
} from "@tabler/icons-react";
import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberDialog } from "../_components/member-dialog";
import { AssignPackageDialog } from "./_components/assign-package-dialog";
import { DeleteMemberButton } from "./_components/delete-member-button";

export default async function MemberDetail({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const { studio } = await requireStudio();

  const [m] = await db
    .select()
    .from(member)
    .where(and(eq(member.id, memberId), eq(member.studioId, studio.id)))
    .limit(1);

  if (!m) notFound();

  const packs = await db
    .select({
      id: memberPackage.id,
      creditsRemaining: memberPackage.creditsRemaining,
      expiresAt: memberPackage.expiresAt,
      status: memberPackage.status,
      pricePaidCents: memberPackage.pricePaidCents,
      packageName: package_.name,
      packageKind: package_.kind,
    })
    .from(memberPackage)
    .innerJoin(package_, eq(package_.id, memberPackage.packageId))
    .where(eq(memberPackage.memberId, memberId))
    .orderBy(desc(memberPackage.createdAt));

  const allPackages = await db
    .select()
    .from(package_)
    .where(and(eq(package_.studioId, studio.id), eq(package_.active, true)));

  const bookings = await db
    .select({
      id: booking.id,
      status: booking.status,
      checkedInAt: booking.checkedInAt,
      startsAt: scheduledClass.startsAt,
      classId: scheduledClass.id,
      className: classType.name,
      classColor: classType.color,
    })
    .from(booking)
    .innerJoin(
      scheduledClass,
      eq(scheduledClass.id, booking.scheduledClassId),
    )
    .innerJoin(classType, eq(classType.id, scheduledClass.classTypeId))
    .where(eq(booking.memberId, memberId))
    .orderBy(desc(scheduledClass.startsAt))
    .limit(20);

  const activePack = packs.find(
    (p) => p.status === "active" && new Date(p.expiresAt) > new Date(),
  );
  const totalSpend = packs.reduce((acc, p) => acc + p.pricePaidCents, 0);
  const attended = bookings.filter((b) => b.status === "attended").length;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/members"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <IconArrowLeft className="size-4" />
        All members
      </Link>

      <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-card to-card overflow-hidden">
        <div className="p-8 flex items-start gap-6 flex-wrap">
          <InitialsAvatar name={m.fullName} size="xl" />
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={m.status} />
              <span className="text-xs text-muted-foreground">
                · joined{" "}
                {new Date(m.joinedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="font-display text-4xl tracking-tight">
              {m.fullName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 flex-wrap">
              {m.email && (
                <span className="inline-flex items-center gap-1.5">
                  <IconMail className="size-3.5" />
                  {m.email}
                </span>
              )}
              {m.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <IconPhone className="size-3.5" />
                  {m.phone}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <MemberDialog
              mode="edit"
              member={{
                id: m.id,
                fullName: m.fullName,
                email: m.email,
                phone: m.phone,
                status: m.status,
                notes: m.notes,
              }}
            >
              <Button variant="outline">Edit</Button>
            </MemberDialog>
            <DeleteMemberButton memberId={m.id} />
          </div>
        </div>

        <div className="border-t border-border/70 grid grid-cols-3 divide-x divide-border/70 bg-card">
          <Vital
            icon={<IconPackage className="size-4" />}
            label="Active package"
            value={activePack ? activePack.packageName : "None"}
            sub={
              activePack
                ? `${activePack.creditsRemaining ?? "Unlimited"} ${activePack.creditsRemaining === 1 ? "credit" : "credits"} left`
                : ""
            }
          />
          <Vital
            icon={<IconCalendarMonth className="size-4" />}
            label="Classes attended"
            value={String(attended)}
            sub={`${bookings.length} bookings · last 20`}
          />
          <Vital
            icon={null}
            label="Lifetime spend"
            value={formatMoney(totalSpend, studio.currency)}
            sub={`${packs.length} ${packs.length === 1 ? "package" : "packages"}`}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle className="text-base">Packages</CardTitle>
              <AssignPackageDialog
                memberId={m.id}
                packages={allPackages.map((p) => ({
                  id: p.id,
                  name: p.name,
                  kind: p.kind,
                  credits: p.credits,
                  validityDays: p.validityDays,
                  priceCents: p.priceCents,
                  currency: p.currency,
                }))}
              />
            </CardHeader>
            <CardContent className="p-0">
              {packs.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No packages yet. Assign one to start booking classes.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {packs.map((p) => {
                    const expired = new Date(p.expiresAt) < new Date();
                    return (
                      <li
                        key={p.id}
                        className="px-6 py-4 flex items-center gap-4 flex-wrap"
                      >
                        <div className="flex-1 min-w-[200px]">
                          <div className="font-medium">{p.packageName}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {p.packageKind.replace("_", " ")} ·{" "}
                            {formatMoney(p.pricePaidCents, studio.currency)}{" "}
                            paid
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-display text-xl tabular-nums">
                            {p.creditsRemaining ?? "∞"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            credits left
                          </div>
                        </div>
                        <div className="text-sm text-right min-w-[100px]">
                          <div
                            className={
                              expired
                                ? "text-rose-700 font-medium"
                                : "text-foreground"
                            }
                          >
                            {new Date(p.expiresAt).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric", year: "numeric" },
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {expired ? "Expired" : "Expires"}
                          </div>
                        </div>
                        <Badge
                          className={
                            p.status === "active" && !expired
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-stone-100 text-stone-600 border-stone-200"
                          }
                        >
                          {expired ? "expired" : p.status}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Recent bookings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {bookings.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No bookings yet.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {bookings.map((b) => (
                    <li key={b.id}>
                      <Link
                        href={`/dashboard/classes/${b.classId}`}
                        className="flex items-center gap-4 px-6 py-3.5 hover:bg-secondary/40 transition-colors"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: b.classColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {b.className}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(b.startsAt).toLocaleString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <BookingBadge status={b.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/90 whitespace-pre-wrap py-4 leading-relaxed">
            {m.notes || (
              <span className="text-muted-foreground italic">
                No notes yet — useful for injuries, preferences, special
                instructions.
              </span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Vital({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-display text-2xl mt-1 truncate">{value}</div>
      {sub && (
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Active
      </Badge>
    );
  if (status === "paused")
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
        <span className="size-1.5 rounded-full bg-amber-500" />
        Paused
      </Badge>
    );
  return (
    <Badge className="bg-stone-100 text-stone-600 border-stone-200">
      Inactive
    </Badge>
  );
}

function BookingBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    attended: "bg-emerald-50 text-emerald-700 border-emerald-200",
    booked: "bg-amber-50 text-amber-700 border-amber-200",
    no_show: "bg-orange-50 text-orange-700 border-orange-200",
    cancelled: "bg-stone-100 text-stone-600 border-stone-200",
  };
  return (
    <Badge className={map[status] ?? "bg-stone-100 text-stone-600"}>
      {status.replace("_", " ")}
    </Badge>
  );
}
