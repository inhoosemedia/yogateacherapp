import {
  IconCalendarMonth,
  IconCash,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

export function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xl ring-1 ring-black/[0.04]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary/50">
        <span className="size-2.5 rounded-full bg-rose-300/70" />
        <span className="size-2.5 rounded-full bg-amber-300/70" />
        <span className="size-2.5 rounded-full bg-emerald-300/70" />
        <div className="ml-3 text-[10px] text-muted-foreground tracking-wide">
          asana.app / dashboard
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-border bg-sidebar p-3 hidden sm:block">
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
              ॐ
            </span>
            <span className="font-display text-sm">Sunrise Yoga</span>
          </div>
          <div className="mt-4 space-y-0.5">
            <NavItem active>Overview</NavItem>
            <NavItem>Members</NavItem>
            <NavItem>Classes</NavItem>
          </div>
          <div className="mt-4 px-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Library
          </div>
          <div className="mt-1 space-y-0.5">
            <NavItem>Class types</NavItem>
            <NavItem>Instructors</NavItem>
            <NavItem>Packages</NavItem>
          </div>
        </aside>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Tuesday, May 5
            </div>
            <div className="font-display text-xl mt-1">
              Good morning,{" "}
              <span className="italic text-primary">Sunrise Yoga</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Stat icon={<IconUsers className="size-3" />} label="Members" value="248" />
            <Stat icon={<IconUserCheck className="size-3" />} label="Active" value="186" />
            <Stat icon={<IconCalendarMonth className="size-3" />} label="Today" value="6" />
            <Stat icon={<IconCash className="size-3" />} label="MTD" value="₹4.2L" />
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="text-[11px] font-medium">
                Today&apos;s schedule
              </div>
              <div className="text-[9px] text-muted-foreground">
                6 classes · 92 booked
              </div>
            </div>
            <ul className="divide-y divide-border text-[11px]">
              <ScheduleRow time="6:30" pm="am" name="Sunrise Vinyasa" who="Priya" booked={18} cap={20} color="#d97706" />
              <ScheduleRow time="9:00" pm="am" name="Hatha Slow Flow" who="Arjun" booked={12} cap={15} color="#0891b2" />
              <ScheduleRow time="12:30" pm="pm" name="Lunchtime Yin" who="Maya" booked={8} cap={12} color="#7c3aed" />
              <ScheduleRow time="6:00" pm="pm" name="Power Vinyasa" who="Priya" booked={20} cap={20} color="#d97706" full />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] " +
        (active
          ? "bg-secondary font-medium relative"
          : "text-muted-foreground")
      }
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-[2px] bg-primary rounded-r" />
      )}
      <span className="size-1.5 rounded-full bg-current opacity-30" />
      {children}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
      <div className="flex items-center gap-1 text-[8px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-display text-base mt-1">{value}</div>
    </div>
  );
}

function ScheduleRow({
  time,
  pm,
  name,
  who,
  booked,
  cap,
  color,
  full,
}: {
  time: string;
  pm: string;
  name: string;
  who: string;
  booked: number;
  cap: number;
  color: string;
  full?: boolean;
}) {
  const pct = (booked / cap) * 100;
  return (
    <li className="px-4 py-2 flex items-center gap-3">
      <div className="w-9">
        <div className="font-display text-[11px] tabular-nums leading-none">
          {time}
        </div>
        <div className="text-[8px] uppercase text-muted-foreground mt-0.5">
          {pm}
        </div>
      </div>
      <span
        className="w-0.5 h-7 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{name}</div>
        <div className="text-[9px] text-muted-foreground">{who}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-medium tabular-nums">
          {booked}/{cap}
        </div>
        <div className="w-12 h-0.5 rounded-full bg-secondary mt-1 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {full && (
        <span className="text-[8px] uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">
          full
        </span>
      )}
    </li>
  );
}

