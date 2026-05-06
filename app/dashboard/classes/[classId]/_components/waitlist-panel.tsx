"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { removeFromWaitlist } from "../actions";

type Row = {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string | null;
  joinedAt: Date;
};

export function WaitlistPanel({ entries }: { entries: Row[] }) {
  const [pending, start] = useTransition();
  const remove = (id: string) =>
    start(async () => {
      try {
        await removeFromWaitlist(id);
        toast.success("Removed from waitlist");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });

  if (entries.length === 0) {
    return (
      <div className="px-6 py-6 text-sm text-muted-foreground">
        No one on the waitlist. When the class fills up, members can join from
        the public booking page — they&apos;ll be auto-promoted (and emailed) the
        moment a seat opens.
      </div>
    );
  }
  return (
    <ol className="divide-y divide-border">
      {entries.map((e, idx) => (
        <li
          key={e.id}
          className="px-6 py-3 flex items-center gap-3 text-sm"
        >
          <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold tabular-nums shrink-0">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/members/${e.memberId}`}
              className="font-medium hover:text-primary"
            >
              {e.memberName}
            </Link>
            {e.memberEmail && (
              <div className="text-xs text-muted-foreground">{e.memberEmail}</div>
            )}
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {new Date(e.joinedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => remove(e.id)}
          >
            Remove
          </Button>
        </li>
      ))}
    </ol>
  );
}
