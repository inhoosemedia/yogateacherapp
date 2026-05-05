import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { studioMember, user } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export default async function AdminUsers() {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      createdAt: user.createdAt,
      studioCount: sql<number>`(
        select count(*)::int from ${studioMember} where ${studioMember.userId} = ${user.id}
      )`,
    })
    .from(user)
    .orderBy(desc(user.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform"
        title="Users"
        description={`${rows.length} ${rows.length === 1 ? "account" : "accounts"} registered.`}
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Studios</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={u.name} size="sm" />
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 tabular-nums">{u.studioCount}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5">
                    {u.isSuperAdmin ? (
                      <Badge className="bg-foreground text-background border-foreground">
                        Super admin
                      </Badge>
                    ) : (
                      <Badge className="bg-stone-100 text-stone-600 border-stone-200">
                        Studio owner
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
