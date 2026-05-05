"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { setBookingStatus } from "../actions";

type Row = {
  id: string;
  status: string;
  checkedInAt: Date | null;
  memberId: string;
  memberName: string;
  memberEmail: string | null;
};

export function Roster({ bookings }: { bookings: Row[] }) {
  const [pending, start] = useTransition();

  const change = (
    id: string,
    status: "booked" | "cancelled" | "attended" | "no_show",
  ) =>
    start(async () => {
      try {
        await setBookingStatus(id, status);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed");
      }
    });

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-stone-500">
        No bookings yet.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs uppercase text-stone-500 border-b">
        <tr>
          <th className="px-6 py-3 font-medium">Member</th>
          <th className="px-6 py-3 font-medium">Status</th>
          <th className="px-6 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-100">
        {bookings.map((b) => (
          <tr key={b.id}>
            <td className="px-6 py-3">
              <Link
                href={`/dashboard/members/${b.memberId}`}
                className="font-medium hover:text-amber-700"
              >
                {b.memberName}
              </Link>
              <div className="text-xs text-stone-400">
                {b.memberEmail || ""}
              </div>
            </td>
            <td className="px-6 py-3">
              <StatusBadge status={b.status} />
            </td>
            <td className="px-6 py-3 text-right">
              <div className="inline-flex gap-1">
                {b.status !== "attended" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => change(b.id, "attended")}
                  >
                    Check in
                  </Button>
                )}
                {b.status !== "no_show" &&
                  (b.status === "booked" || b.status === "attended") && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() => change(b.id, "no_show")}
                    >
                      No-show
                    </Button>
                  )}
                {b.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-700 hover:text-red-800"
                    disabled={pending}
                    onClick={() => change(b.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                )}
                {b.status === "cancelled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => change(b.id, "booked")}
                  >
                    Restore
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "attended")
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        Attended
      </Badge>
    );
  if (status === "booked")
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        Booked
      </Badge>
    );
  if (status === "no_show")
    return (
      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
        No-show
      </Badge>
    );
  return <Badge variant="secondary">Cancelled</Badge>;
}
