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
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { bookMember } from "../actions";

type Eligible = {
  id: string;
  fullName: string;
  packageName: string | null;
  credits: number | null;
  expiresAt: Date | null;
};

export function BookMemberDialog({
  scheduledClassId,
  eligibleMembers,
  full,
}: {
  scheduledClassId: string;
  eligibleMembers: Eligible[];
  full: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return eligibleMembers.slice(0, 50);
    return eligibleMembers
      .filter((m) => m.fullName.toLowerCase().includes(needle))
      .slice(0, 50);
  }, [eligibleMembers, q]);

  const book = (memberId: string) =>
    start(async () => {
      try {
        await bookMember({ scheduledClassId, memberId });
        toast.success("Booked");
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Booking failed");
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={full}>{full ? "Full" : "Book a member"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a member</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <div className="max-h-72 overflow-y-auto -mx-6 px-6 divide-y divide-stone-100">
          {filtered.length === 0 ? (
            <div className="text-sm text-stone-500 py-6 text-center">
              No matching members.
            </div>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                disabled={pending}
                onClick={() => book(m.id)}
                className="w-full flex items-center justify-between py-3 text-left hover:bg-stone-50 -mx-6 px-6 transition-colors"
              >
                <div>
                  <div className="font-medium text-sm">{m.fullName}</div>
                  <div className="text-xs text-stone-500">
                    {m.packageName
                      ? `${m.packageName} · ${m.credits ?? "Unlimited"} left`
                      : "No active package"}
                  </div>
                </div>
                <span className="text-xs text-amber-700">Book →</span>
              </button>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
