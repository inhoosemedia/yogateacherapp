"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconCircleCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type Option = { id: string; name: string; role: string };

export function StudioSwitcher({
  active,
  options,
}: {
  active: { id: string; name: string };
  options: Option[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (options.length <= 1) return null;

  const switchTo = (studioId: string) => {
    if (studioId === active.id) return;
    start(async () => {
      const r = await fetch("/api/active-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studioId }),
      });
      if (!r.ok) {
        toast.error("Could not switch studio");
        return;
      }
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={pending}>
          {active.name}
          <IconChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Switch studio
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((o) => (
          <DropdownMenuItem
            key={o.id}
            onClick={() => switchTo(o.id)}
            className="flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="truncate">{o.name}</div>
              <div className="text-[11px] text-muted-foreground capitalize">
                {o.role}
              </div>
            </div>
            {o.id === active.id && (
              <IconCircleCheck className="size-4 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
