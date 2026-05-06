"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { sendTestEmail } from "../../actions";

export function TestEmailButton({ enabled }: { enabled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="outline"
      disabled={pending || !enabled}
      onClick={() =>
        start(async () => {
          const r = await sendTestEmail();
          if (r.ok) toast.success("Test email sent — check your inbox");
          else toast.error(r.error ?? "Could not send");
        })
      }
    >
      {pending ? "Sending…" : "Send a test email"}
    </Button>
  );
}
