"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { cn } from "@/lib/utils";
import { IconChevronRight, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Row = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: string;
  joinedAt: Date;
};

const STATUSES = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "inactive", label: "Inactive" },
];

export function MembersTable({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!needle) return true;
      return (
        r.fullName.toLowerCase().includes(needle) ||
        r.email?.toLowerCase().includes(needle) ||
        r.phone?.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full sm:w-80">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="pl-9"
          />
        </div>
        <div className="inline-flex items-center gap-1 bg-secondary/60 rounded-full p-1">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                status === s.id
                  ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border bg-secondary/30">
            <tr>
              <th className="px-6 py-3 font-medium">Member</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">Contact</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">Joined</th>
              <th className="px-6 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  {q || status !== "all"
                    ? "No members match your filters."
                    : "No members yet."}
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="group">
                  <td className="px-6 py-3.5">
                    <Link
                      href={`/dashboard/members/${m.id}`}
                      className="flex items-center gap-3"
                    >
                      <InitialsAvatar name={m.fullName} size="sm" />
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {m.fullName}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground hidden md:table-cell">
                    <div className="text-foreground/80">{m.email || "—"}</div>
                    {m.phone && (
                      <div className="text-xs text-muted-foreground/80">
                        {m.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground hidden md:table-cell">
                    {new Date(m.joinedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/dashboard/members/${m.id}`}
                      className="inline-flex items-center text-muted-foreground/60 group-hover:text-primary transition-colors"
                    >
                      <IconChevronRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} of {rows.length}{" "}
        {rows.length === 1 ? "member" : "members"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Active
      </Badge>
    );
  if (status === "paused")
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
        <span className="size-1.5 rounded-full bg-amber-500" />
        Paused
      </Badge>
    );
  return (
    <Badge className="bg-stone-100 text-stone-600 border-stone-200">
      <span className="size-1.5 rounded-full bg-stone-400" />
      Inactive
    </Badge>
  );
}
