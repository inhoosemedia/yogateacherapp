import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { IconChevronRight, IconSearch } from "@tabler/icons-react";

const MEMBERS = [
  { name: "Anita Rao", email: "anita@example.com", status: "active", joined: "Apr 12, 2026" },
  { name: "Vikram Singh", email: "vikram@example.com", status: "active", joined: "Mar 04, 2026" },
  { name: "Maya Krishnan", email: "maya@example.com", status: "active", joined: "Feb 22, 2026" },
  { name: "Rahul Iyer", email: "rahul@example.com", status: "paused", joined: "Feb 18, 2026" },
  { name: "Sneha Patel", email: "sneha@example.com", status: "active", joined: "Jan 30, 2026" },
];

export function MembersPreview() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xl ring-1 ring-black/[0.04]">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary/50">
        <span className="size-2.5 rounded-full bg-rose-300/70" />
        <span className="size-2.5 rounded-full bg-amber-300/70" />
        <span className="size-2.5 rounded-full bg-emerald-300/70" />
        <div className="ml-3 text-[10px] text-muted-foreground tracking-wide">
          yogateacherapp.com / members
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Roster
            </div>
            <div className="font-display text-xl mt-0.5">Members</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
              <div className="pl-7 pr-3 py-1.5 rounded-md border border-border bg-card text-[10px] text-muted-foreground w-44">
                Search…
              </div>
            </div>
            <div className="inline-flex items-center gap-0.5 bg-secondary/60 rounded-full p-0.5">
              <span className="px-2 py-0.5 text-[9px] rounded-full bg-card font-medium ring-1 ring-border">
                All
              </span>
              <span className="px-2 py-0.5 text-[9px] rounded-full text-muted-foreground">
                Active
              </span>
              <span className="px-2 py-0.5 text-[9px] rounded-full text-muted-foreground">
                Paused
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_80px_30px] gap-3 px-4 py-2 text-[8px] uppercase tracking-[0.12em] text-muted-foreground border-b border-border bg-secondary/30">
            <div>Member</div>
            <div className="hidden sm:block">Joined</div>
            <div>Status</div>
            <div />
          </div>
          {MEMBERS.map((m) => (
            <div
              key={m.name}
              className="grid grid-cols-[1fr_120px_80px_30px] gap-3 items-center px-4 py-2.5 border-t border-border first:border-t-0 hover:bg-secondary/40"
            >
              <div className="flex items-center gap-2 min-w-0">
                <InitialsAvatar name={m.name} size="xs" />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium truncate">
                    {m.name}
                  </div>
                  <div className="text-[9px] text-muted-foreground truncate">
                    {m.email}
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground hidden sm:block">
                {m.joined}
              </div>
              <div>
                {m.status === "active" ? (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-1.5 py-0.5">
                    <span className="size-1 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-1.5 py-0.5">
                    <span className="size-1 rounded-full bg-amber-500" />
                    Paused
                  </span>
                )}
              </div>
              <IconChevronRight className="size-3 text-muted-foreground/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
