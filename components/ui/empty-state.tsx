import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className,
      )}
    >
      {icon && (
        <div className="size-14 rounded-2xl bg-secondary/80 ring-1 ring-border flex items-center justify-center text-muted-foreground mb-5">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-medium">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
