import { IconCheck } from "@tabler/icons-react";

export function PackagesPreview() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xl ring-1 ring-black/[0.04]">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary/50">
        <span className="size-2.5 rounded-full bg-rose-300/70" />
        <span className="size-2.5 rounded-full bg-amber-300/70" />
        <span className="size-2.5 rounded-full bg-emerald-300/70" />
        <div className="ml-3 text-[10px] text-muted-foreground tracking-wide">
          yogateacherapp.com / packages
        </div>
      </div>
      <div className="p-5">
        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          Pricing
        </div>
        <div className="font-display text-xl mt-0.5">Packages</div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Pkg
            label="Drop-in"
            name="Single class"
            price="$45"
            features={["1 class", "Valid 7 days"]}
          />
          <Pkg
            featured
            label="Class pack"
            name="10-class pack"
            price="$397"
            features={["10 classes", "Valid 60 days", "Auto credits"]}
          />
          <Pkg
            label="Unlimited"
            name="Monthly"
            price="$149"
            features={["Unlimited", "Valid 30 days"]}
          />
        </div>
      </div>
    </div>
  );
}

function Pkg({
  label,
  name,
  price,
  features,
  featured,
}: {
  label: string;
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={
        "rounded-lg p-3 border " +
        (featured
          ? "bg-gradient-to-br from-primary/10 via-card to-card border-primary/30"
          : "bg-card border-border")
      }
    >
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-medium text-[11px] mt-0.5">{name}</div>
      <div className="font-display text-xl mt-2">{price}</div>
      <ul className="mt-2 space-y-1 text-[9px]">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-1.5">
            <IconCheck className="size-2.5 text-primary" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
