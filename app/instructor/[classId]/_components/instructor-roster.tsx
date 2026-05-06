"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { instructorSetBookingStatus } from "../../actions";

type Row = {
  id: string;
  status: string;
  checkedInAt: Date | null;
  memberId: string;
  memberName: string;
  memberEmail: string | null;
};

export function InstructorRoster({ bookings }: { bookings: Row[] }) {
  const [pending, start] = useTransition();

  const change = (
    id: string,
    status: "booked" | "cancelled" | "attended" | "no_show",
  ) =>
    start(async () => {
      try {
        await instructorSetBookingStatus(id, status);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Update failed");
      }
    });

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        No bookings yet.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs uppercase text-muted-foreground border-b">
        <tr>
          <th className="px-6 py-3 font-medium">Member</th>
          <th className="px-6 py-3 font-medium">Status</th>
          <th className="px-6 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {bookings.map((b) => (
          <tr key={b.id}>
            <td className="px-6 py-3">
              <div className="font-medium">{b.memberName}</div>
              <div className="text-xs text-muted-foreground">
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
                {(b.status === "booked" || b.status === "attended") && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => change(b.id, "no_show")}
                  >
                    No-show
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
