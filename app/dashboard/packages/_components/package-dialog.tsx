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
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createPackage, deletePackage, updatePackage } from "../actions";

type Kind = "drop_in" | "class_pack" | "unlimited";

type Pkg = {
  id: string;
  name: string;
  kind: Kind;
  credits: number | null;
  validityDays: number;
  priceCents: number;
  active: boolean;
  publiclyPurchasable?: boolean;
};

export function PackageDialog({
  mode,
  pkg,
  children,
}: {
  mode: "create" | "edit";
  pkg?: Pkg;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [name, setName] = useState(pkg?.name ?? "");
  const [kind, setKind] = useState<Kind>(pkg?.kind ?? "class_pack");
  const [credits, setCredits] = useState(String(pkg?.credits ?? 10));
  const [validityDays, setValidityDays] = useState(
    String(pkg?.validityDays ?? 30),
  );
  const [price, setPrice] = useState(
    pkg ? (pkg.priceCents / 100).toFixed(2) : "0",
  );
  const [active, setActive] = useState(pkg?.active ?? true);
  const [publiclyPurchasable, setPubliclyPurchasable] = useState(
    pkg?.publiclyPurchasable ?? false,
  );

  const submit = () =>
    start(async () => {
      try {
        const payload = {
          name,
          kind,
          credits: kind === "unlimited" ? null : parseInt(credits, 10),
          validityDays: parseInt(validityDays, 10),
          priceCents: Math.round(parseFloat(price || "0") * 100),
          active,
          publiclyPurchasable,
        };
        if (mode === "create") {
          await createPackage(payload);
          toast.success("Package created");
        } else if (pkg) {
          await updatePackage(pkg.id, payload);
          toast.success("Package updated");
        }
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });

  const remove = () =>
    start(async () => {
      if (!pkg) return;
      try {
        await deletePackage(pkg.id);
        toast.success("Deleted");
        setOpen(false);
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "Cannot delete: package in use",
        );
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add package" : "Edit package"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="10-class pack"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Kind</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as Kind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drop_in">Drop-in (single class)</SelectItem>
                <SelectItem value="class_pack">Class pack</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {kind !== "unlimited" && (
              <div className="space-y-2">
                <Label htmlFor="credits">Classes</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="validityDays">Valid (days)</Label>
              <Input
                id="validityDays"
                type="number"
                min="1"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Active</Label>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label>Sell on public booking page</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Visitors can buy this package via Razorpay (studio settings).
              </p>
            </div>
            <Switch
              checked={publiclyPurchasable}
              onCheckedChange={setPubliclyPurchasable}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          {mode === "edit" ? (
            <Button
              variant="outline"
              className="text-red-700 hover:text-red-800"
              onClick={remove}
              disabled={pending}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={pending || !name.trim()}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
