import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { member, scheduledClass, studio, user } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export default async function AdminStudios() {
  const rows = await db
    .select({
      id: studio.id,
      name: studio.name,
      slug: studio.slug,
      currency: studio.currency,
      subscriptionStatus: studio.subscriptionStatus,
      trialEndsAt: studio.trialEndsAt,
      planTier: studio.planTier,
      createdAt: studio.createdAt,
      ownerName: user.name,
      ownerEmail: user.email,
      memberCount: sql<number>`(
        select count(*)::int from ${member} where ${member.studioId} = ${studio.id}
      )`,
      classCount: sql<number>`(
        select count(*)::int from ${scheduledClass} where ${scheduledClass.studioId} = ${studio.id}
      )`,
    })
    .from(studio)
    .innerJoin(user, eq(user.id, studio.ownerUserId))
    .orderBy(desc(studio.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform"
        title="Studios"
        description={`${rows.length} ${rows.length === 1 ? "studio" : "studios"} across the platform.`}
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-3 font-medium">Studio</th>
                <th className="px-6 py-3 font-medium">Owner</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Members</th>
                <th className="px-6 py-3 font-medium">Classes</th>
                <th className="px-6 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No studios yet.
                  </td>
                </tr>
              ) : (
                rows.map((s) => {
                  const trialActive =
                    s.subscriptionStatus === "trialing" &&
                    new Date(s.trialEndsAt) > new Date();
                  return (
                    <tr key={s.id}>
                      <td className="px-6 py-3.5">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          /book/{s.slug} · {s.currency}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="text-foreground">{s.ownerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.ownerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <SubStatusBadge
                          status={s.subscriptionStatus}
                          trialActive={trialActive}
                        />
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {s.subscriptionStatus === "trialing" &&
                            (trialActive
                              ? `Trial ends ${new Date(s.trialEndsAt).toLocaleDateString()}`
                              : `Expired ${new Date(s.trialEndsAt).toLocaleDateString()}`)}
                          {s.planTier && s.subscriptionStatus === "active" && (
                            <span>{s.planTier.replace("_", " ")} plan</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 tabular-nums">{s.memberCount}</td>
                      <td className="px-6 py-3.5 tabular-nums">{s.classCount}</td>
                      <td className="px-6 py-3.5 text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function SubStatusBadge({
  status,
  trialActive,
}: {
  status: string;
  trialActive: boolean;
}) {
  if (status === "active")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Active
      </Badge>
    );
  if (status === "trialing" && trialActive)
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
        <span className="size-1.5 rounded-full bg-amber-500" />
        Trialing
      </Badge>
    );
  if (status === "trialing")
    return (
      <Badge className="bg-rose-50 text-rose-700 border-rose-200">
        Trial expired
      </Badge>
    );
  return (
    <Badge className="bg-stone-100 text-stone-600 border-stone-200">
      {status}
    </Badge>
  );
}
