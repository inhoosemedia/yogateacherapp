import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { db } from "@/db/drizzle";
import { memberPackage, package_ } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { requireStudio } from "@/lib/studio";
import { IconCheck, IconPackage } from "@tabler/icons-react";
import { desc, eq, sql } from "drizzle-orm";
import { PackageDialog } from "./_components/package-dialog";

export default async function PackagesPage() {
  const { studio } = await requireStudio();
  const rows = await db
    .select({
      id: package_.id,
      name: package_.name,
      kind: package_.kind,
      credits: package_.credits,
      validityDays: package_.validityDays,
      priceCents: package_.priceCents,
      currency: package_.currency,
      active: package_.active,
      sold: sql<number>`(
        select count(*)::int from ${memberPackage}
        where ${memberPackage.packageId} = ${package_.id}
      )`,
    })
    .from(package_)
    .where(eq(package_.studioId, studio.id))
    .orderBy(desc(package_.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pricing"
        title="Packages"
        description="Drop-ins, class packs, and unlimited memberships you sell to members."
        actions={
          <PackageDialog mode="create">
            <Button>Add package</Button>
          </PackageDialog>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconPackage className="size-5" />}
              title="No packages yet"
              description="Create a few packages — a drop-in, a class pack, and maybe an unlimited monthly."
              action={
                <PackageDialog mode="create">
                  <Button>Create your first package</Button>
                </PackageDialog>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((p) => (
            <PricingCard key={p.id} pkg={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PricingCard({
  pkg,
}: {
  pkg: {
    id: string;
    name: string;
    kind: string;
    credits: number | null;
    validityDays: number;
    priceCents: number;
    currency: string;
    active: boolean;
    sold: number;
  };
}) {
  const featured = pkg.kind === "unlimited";
  return (
    <div
      className={
        "relative rounded-2xl border p-6 transition-all hover:shadow-md " +
        (featured
          ? "bg-gradient-to-br from-primary/[0.06] via-card to-card border-primary/30"
          : "bg-card border-border")
      }
    >
      {featured && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] uppercase tracking-[0.16em] text-primary font-medium">
            Most flexible
          </span>
        </div>
      )}
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground capitalize">
          {pkg.kind.replace("_", " ")}
        </div>
        <div className="font-display text-2xl">{pkg.name}</div>
      </div>
      <div className="mt-5 flex items-baseline gap-1">
        <div className="font-display text-4xl tracking-tight">
          {formatMoney(pkg.priceCents, pkg.currency)}
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-sm">
        <Bullet>
          {pkg.credits === null
            ? "Unlimited classes"
            : `${pkg.credits} ${pkg.credits === 1 ? "class" : "classes"}`}
        </Bullet>
        <Bullet>Valid {pkg.validityDays} days</Bullet>
        <Bullet>Auto-decrements on booking</Bullet>
        <Bullet>Refunded credit on cancel</Bullet>
      </ul>

      <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {pkg.sold} sold ·{" "}
          <span className={pkg.active ? "text-emerald-700" : "text-muted-foreground"}>
            {pkg.active ? "Active" : "Inactive"}
          </span>
        </div>
        <PackageDialog
          mode="edit"
          pkg={{
            id: pkg.id,
            name: pkg.name,
            kind: pkg.kind as "drop_in" | "class_pack" | "unlimited",
            credits: pkg.credits,
            validityDays: pkg.validityDays,
            priceCents: pkg.priceCents,
            active: pkg.active,
          }}
        >
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </PackageDialog>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
        <IconCheck className="size-2.5 text-primary" />
      </span>
      <span className="text-foreground/90">{children}</span>
    </li>
  );
}
