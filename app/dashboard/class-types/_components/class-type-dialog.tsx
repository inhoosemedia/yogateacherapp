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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createClassType,
  deleteClassType,
  updateClassType,
} from "../actions";

type ClassType = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  defaultCapacity: number;
  color: string;
  active: boolean;
};

const COLORS = [
  "#d97706",
  "#dc2626",
  "#65a30d",
  "#0891b2",
  "#7c3aed",
  "#db2777",
  "#0d9488",
  "#525252",
];

export function ClassTypeDialog({
  mode,
  classType,
  children,
}: {
  mode: "create" | "edit";
  classType?: ClassType;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [name, setName] = useState(classType?.name ?? "");
  const [description, setDescription] = useState(classType?.description ?? "");
  const [duration, setDuration] = useState(
    String(classType?.durationMinutes ?? 60),
  );
  const [capacity, setCapacity] = useState(
    String(classType?.defaultCapacity ?? 15),
  );
  const [color, setColor] = useState(classType?.color ?? COLORS[0]);
  const [active, setActive] = useState(classType?.active ?? true);

  const submit = () =>
    start(async () => {
      try {
        const payload = {
          name,
          description,
          durationMinutes: parseInt(duration, 10),
          defaultCapacity: parseInt(capacity, 10),
          color,
          active,
        };
        if (mode === "create") {
          await createClassType(payload);
          toast.success("Class type added");
          setName("");
          setDescription("");
          setDuration("60");
          setCapacity("15");
          setColor(COLORS[0]);
          setActive(true);
        } else if (classType) {
          await updateClassType(classType.id, payload);
          toast.success("Class type updated");
        }
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });

  const remove = () =>
    start(async () => {
      if (!classType) return;
      try {
        await deleteClassType(classType.id);
        toast.success("Deleted");
        setOpen(false);
      } catch (e) {
        toast.error(
          e instanceof Error
            ? e.message
            : "Cannot delete: class type is in use",
        );
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add class type" : "Edit class type"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vinyasa Flow"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="240"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Default capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="500"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`size-7 rounded-full ring-offset-2 ${color === c ? "ring-2 ring-stone-900" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Active</Label>
            <Switch checked={active} onCheckedChange={setActive} />
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
