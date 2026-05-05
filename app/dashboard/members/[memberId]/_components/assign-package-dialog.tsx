"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { assignPackageToMember } from "../../../packages/actions";

type Pkg = {
  id: string;
  name: string;
  kind: string;
  credits: number | null;
  validityDays: number;
  priceCents: number;
  currency: string;
};

export function AssignPackageDialog({
  memberId,
  packages,
}: {
  memberId: string;
  packages: Pkg[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [packageId, setPackageId] = useState<string>(packages[0]?.id ?? "");
  const [pricePaid, setPricePaid] = useState<string>(
    packages[0] ? (packages[0].priceCents / 100).toFixed(2) : "0",
  );

  const selected = useMemo(
    () => packages.find((p) => p.id === packageId),
    [packageId, packages],
  );

  if (packages.length === 0) {
    return (
      <Link href="/dashboard/packages">
        <Button variant="outline" size="sm">
          Create packages first
        </Button>
      </Link>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Assign package</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign package</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Package</Label>
            <Select
              value={packageId}
              onValueChange={(v) => {
                setPackageId(v);
                const p = packages.find((x) => x.id === v);
                if (p) setPricePaid((p.priceCents / 100).toFixed(2));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {packages.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.kind.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selected && (
              <p className="text-xs text-stone-500">
                {selected.credits ?? "Unlimited"} credits · valid{" "}
                {selected.validityDays} days
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price paid</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={pending || !packageId}
            onClick={() =>
              start(async () => {
                try {
                  await assignPackageToMember({
                    memberId,
                    packageId,
                    pricePaidCents: Math.round(
                      parseFloat(pricePaid || "0") * 100,
                    ),
                  });
                  toast.success("Package assigned");
                  setOpen(false);
                } catch (e) {
                  toast.error(
                    e instanceof Error ? e.message : "Assign failed",
                  );
                }
              })
            }
          >
            {pending ? "Assigning…" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
