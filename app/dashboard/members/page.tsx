import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { member } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { IconUsers } from "@tabler/icons-react";
import { desc, eq } from "drizzle-orm";
import { MemberDialog } from "./_components/member-dialog";
import { MembersTable } from "./_components/members-table";

export default async function MembersPage() {
  const { studio } = await requireStudio();
  const rows = await db
    .select()
    .from(member)
    .where(eq(member.studioId, studio.id))
    .orderBy(desc(member.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Roster"
        title="Members"
        description="Track contact info, packages, attendance and notes for every student."
        actions={
          <MemberDialog mode="create">
            <Button>Add member</Button>
          </MemberDialog>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconUsers className="size-5" />}
              title="No members yet"
              description="Build your roster — add members to start booking, selling packages and tracking attendance."
              action={
                <MemberDialog mode="create">
                  <Button>Add your first member</Button>
                </MemberDialog>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <MembersTable
          rows={rows.map((r) => ({
            id: r.id,
            fullName: r.fullName,
            email: r.email,
            phone: r.phone,
            status: r.status,
            joinedAt: r.joinedAt,
          }))}
        />
      )}
    </div>
  );
}
