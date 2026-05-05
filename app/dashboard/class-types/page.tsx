import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { classType, scheduledClass } from "@/db/schema";
import { requireStudio } from "@/lib/studio";
import { IconChalkboard, IconClock, IconUsers } from "@tabler/icons-react";
import { desc, eq, sql } from "drizzle-orm";
import { ClassTypeDialog } from "./_components/class-type-dialog";

export default async function ClassTypesPage() {
  const { studio } = await requireStudio();
  const rows = await db
    .select({
      id: classType.id,
      name: classType.name,
      description: classType.description,
      durationMinutes: classType.durationMinutes,
      defaultCapacity: classType.defaultCapacity,
      color: classType.color,
      active: classType.active,
      scheduled: sql<number>`(
        select count(*)::int from ${scheduledClass}
        where ${scheduledClass.classTypeId} = ${classType.id}
      )`,
    })
    .from(classType)
    .where(eq(classType.studioId, studio.id))
    .orderBy(desc(classType.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Library"
        title="Class types"
        description="Templates for the kinds of classes you teach. Set duration, default capacity and color."
        actions={
          <ClassTypeDialog mode="create">
            <Button>Add class type</Button>
          </ClassTypeDialog>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconChalkboard className="size-5" />}
              title="No class types yet"
              description="Add Hatha, Vinyasa, Yin… or whatever your studio teaches."
              action={
                <ClassTypeDialog mode="create">
                  <Button>Add your first class type</Button>
                </ClassTypeDialog>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((c) => (
            <div
              key={c.id}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all"
            >
              <div
                className="h-20 relative"
                style={{
                  background: `linear-gradient(135deg, ${c.color}20, ${c.color}05)`,
                }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{ backgroundColor: c.color }}
                />
                {!c.active && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-stone-100 text-stone-600 border-stone-200">
                      Inactive
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-display text-xl">{c.name}</h3>
                  {c.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <IconClock className="size-3.5" />
                    {c.durationMinutes} min
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="inline-flex items-center gap-1">
                    <IconUsers className="size-3.5" />
                    cap {c.defaultCapacity}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{c.scheduled} scheduled</span>
                </div>
                <div className="pt-2">
                  <ClassTypeDialog
                    mode="edit"
                    classType={{
                      id: c.id,
                      name: c.name,
                      description: c.description,
                      durationMinutes: c.durationMinutes,
                      defaultCapacity: c.defaultCapacity,
                      color: c.color,
                      active: c.active,
                    }}
                  >
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </ClassTypeDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
