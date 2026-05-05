import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { instructor, scheduledClass } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { IconMail, IconPhone, IconUserCircle } from "@tabler/icons-react";
import { desc, eq, sql } from "drizzle-orm";
import { InstructorDialog } from "./_components/instructor-dialog";

export default async function InstructorsPage() {
  const { studio } = await requireStudio();
  const rows = await db
    .select({
      id: instructor.id,
      fullName: instructor.fullName,
      email: instructor.email,
      phone: instructor.phone,
      bio: instructor.bio,
      active: instructor.active,
      taught: sql<number>`(
        select count(*)::int from ${scheduledClass}
        where ${scheduledClass.instructorId} = ${instructor.id}
      )`,
    })
    .from(instructor)
    .where(eq(instructor.studioId, studio.id))
    .orderBy(desc(instructor.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Team"
        title="Instructors"
        description="Your teaching team. Assign instructors to classes and track their schedule."
        actions={
          <InstructorDialog mode="create">
            <Button>Add instructor</Button>
          </InstructorDialog>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconUserCircle className="size-5" />}
              title="No instructors yet"
              description="Add the people who teach at your studio to assign them to classes."
              action={
                <InstructorDialog mode="create">
                  <Button>Add your first instructor</Button>
                </InstructorDialog>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((i) => (
            <div
              key={i.id}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <InitialsAvatar name={i.fullName} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl truncate">
                    {i.fullName}
                  </h3>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {i.taught} {i.taught === 1 ? "class" : "classes"} taught
                  </div>
                </div>
                {!i.active && (
                  <Badge className="bg-stone-100 text-stone-600 border-stone-200">
                    Inactive
                  </Badge>
                )}
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {i.email && (
                  <div className="inline-flex items-center gap-2">
                    <IconMail className="size-3.5" />
                    <span className="text-foreground/80 truncate">
                      {i.email}
                    </span>
                  </div>
                )}
                {i.phone && (
                  <div className="inline-flex items-center gap-2">
                    <IconPhone className="size-3.5" />
                    <span className="text-foreground/80">{i.phone}</span>
                  </div>
                )}
              </div>
              {i.bio && (
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-3">
                  {i.bio}
                </p>
              )}
              <div className="mt-5 pt-4 border-t border-border">
                <InstructorDialog
                  mode="edit"
                  instructor={{
                    id: i.id,
                    fullName: i.fullName,
                    email: i.email,
                    phone: i.phone,
                    bio: i.bio,
                    active: i.active,
                  }}
                >
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </InstructorDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
