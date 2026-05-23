type Event = {
  day: number; // 0..6
  startMin: number; // minutes from 6am
  duration: number;
  name: string;
  color: string;
  who?: string;
};

const EVENTS: Event[] = [
  { day: 0, startMin: 30, duration: 60, name: "Sunrise Vinyasa", who: "Priya", color: "#d97706" },
  { day: 0, startMin: 12 * 60, duration: 75, name: "Hatha", who: "Arjun", color: "#0891b2" },
  { day: 1, startMin: 30, duration: 60, name: "Sunrise Vinyasa", who: "Priya", color: "#d97706" },
  { day: 1, startMin: 6 * 60 + 30, duration: 60, name: "Yin", who: "Maya", color: "#7c3aed" },
  { day: 1, startMin: 12 * 60, duration: 60, name: "Power Flow", who: "Priya", color: "#d97706" },
  { day: 2, startMin: 30, duration: 60, name: "Sunrise Vinyasa", who: "Priya", color: "#d97706" },
  { day: 2, startMin: 4 * 60, duration: 75, name: "Restorative", who: "Maya", color: "#0891b2" },
  { day: 2, startMin: 12 * 60, duration: 60, name: "Power Flow", who: "Arjun", color: "#d97706" },
  { day: 3, startMin: 12 * 60, duration: 60, name: "Hatha Slow", who: "Arjun", color: "#0891b2" },
  { day: 3, startMin: 6 * 60 + 30, duration: 90, name: "Yin & Sound", who: "Maya", color: "#7c3aed" },
  { day: 4, startMin: 30, duration: 60, name: "Sunrise Vinyasa", who: "Priya", color: "#d97706" },
  { day: 4, startMin: 12 * 60, duration: 60, name: "Power Flow", who: "Priya", color: "#d97706" },
  { day: 5, startMin: 3 * 60, duration: 75, name: "Weekend Hatha", who: "Arjun", color: "#0891b2" },
  { day: 5, startMin: 5 * 60, duration: 90, name: "Yin & Sound", who: "Maya", color: "#7c3aed" },
  { day: 6, startMin: 4 * 60, duration: 60, name: "Family Yoga", who: "Priya", color: "#d97706" },
];

const HOURS = ["6", "7", "8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_INDEX = 1;
const PX_PER_HOUR = 38;

export function WeekCalendarPreview() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xl ring-1 ring-black/[0.04]">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary/50">
        <span className="size-2.5 rounded-full bg-rose-300/70" />
        <span className="size-2.5 rounded-full bg-amber-300/70" />
        <span className="size-2.5 rounded-full bg-emerald-300/70" />
        <div className="ml-3 text-[10px] text-muted-foreground tracking-wide">
          yogateacherapp.com / classes
        </div>
        <div className="ml-auto inline-flex items-center gap-1 bg-card rounded-full p-0.5 ring-1 ring-border">
          <span className="px-2 py-0.5 text-[9px] rounded-full bg-secondary font-medium">
            Week
          </span>
          <span className="px-2 py-0.5 text-[9px] rounded-full text-muted-foreground">
            List
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-lg">May 5 – 11</div>
          <div className="text-[10px] text-muted-foreground">
            16 classes this week
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-[40px_repeat(7,_minmax(0,_1fr))] border-b border-border bg-secondary/30">
            <div />
            {DAYS.map((d, i) => (
              <div
                key={d}
                className="p-2 text-center border-l border-border"
              >
                <div className="text-[8px] uppercase tracking-wider text-muted-foreground">
                  {d}
                </div>
                <div
                  className={
                    "font-display text-sm mt-0.5 " +
                    (i === TODAY_INDEX ? "text-primary" : "")
                  }
                >
                  {5 + i}
                </div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div
            className="relative grid grid-cols-[40px_repeat(7,_minmax(0,_1fr))]"
            style={{ height: HOURS.length * PX_PER_HOUR }}
          >
            {/* hour labels */}
            <div className="border-r border-border">
              {HOURS.map((h, i) => (
                <div
                  key={i}
                  className="text-[8px] text-muted-foreground/70 text-right pr-1.5 -mt-1"
                  style={{ height: PX_PER_HOUR }}
                >
                  {h}
                </div>
              ))}
            </div>

            {DAYS.map((_, di) => (
              <div
                key={di}
                className="relative border-l border-border"
              >
                {HOURS.map((_, hi) => (
                  <div
                    key={hi}
                    className="border-t border-border/60"
                    style={{ height: PX_PER_HOUR }}
                  />
                ))}
                {EVENTS.filter((e) => e.day === di).map((e, ei) => {
                  const top = (e.startMin / 60) * PX_PER_HOUR;
                  const height = (e.duration / 60) * PX_PER_HOUR;
                  return (
                    <div
                      key={ei}
                      className="absolute left-0.5 right-0.5 rounded p-1 text-[8px] overflow-hidden ring-1 ring-border bg-card shadow-sm"
                      style={{
                        top,
                        height,
                        borderLeft: `2px solid ${e.color}`,
                      }}
                    >
                      <div className="font-medium leading-tight truncate">
                        {e.name}
                      </div>
                      {height > 28 && (
                        <div className="text-muted-foreground text-[7px]">
                          {e.who}
                        </div>
                      )}
                    </div>
                  );
                })}
                {di === TODAY_INDEX && (
                  <div
                    className="absolute left-0 right-0 z-10"
                    style={{ top: PX_PER_HOUR * 4 + 6 }}
                  >
                    <div className="h-[1.5px] bg-primary/80" />
                    <div className="absolute -left-0.5 -top-0.5 size-1.5 rounded-full bg-primary pulse-ring" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
