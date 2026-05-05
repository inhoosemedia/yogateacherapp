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
  createInstructor,
  deleteInstructor,
  updateInstructor,
} from "../actions";

type Instructor = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  active: boolean;
};

export function InstructorDialog({
  mode,
  instructor,
  children,
}: {
  mode: "create" | "edit";
  instructor?: Instructor;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [fullName, setFullName] = useState(instructor?.fullName ?? "");
  const [email, setEmail] = useState(instructor?.email ?? "");
  const [phone, setPhone] = useState(instructor?.phone ?? "");
  const [bio, setBio] = useState(instructor?.bio ?? "");
  const [active, setActive] = useState(instructor?.active ?? true);

  const submit = () =>
    start(async () => {
      try {
        if (mode === "create") {
          await createInstructor({ fullName, email, phone, bio, active });
          toast.success("Instructor added");
          setFullName("");
          setEmail("");
          setPhone("");
          setBio("");
          setActive(true);
        } else if (instructor) {
          await updateInstructor(instructor.id, {
            fullName,
            email,
            phone,
            bio,
            active,
          });
          toast.success("Instructor updated");
        }
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });

  const remove = () =>
    start(async () => {
      if (!instructor) return;
      try {
        await deleteInstructor(instructor.id);
        toast.success("Instructor deleted");
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed");
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add instructor" : "Edit instructor"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="text-sm font-medium">Active</div>
              <p className="text-xs text-stone-500">
                Inactive instructors are hidden from class assignment.
              </p>
            </div>
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
            <Button onClick={submit} disabled={pending || !fullName.trim()}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
