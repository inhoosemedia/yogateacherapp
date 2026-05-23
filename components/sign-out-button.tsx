"use client";

import { authClient } from "@/lib/auth-client";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Tiny sign-out trigger for places that need a plain text/icon link rather
 * than a dropdown. Uses Better-Auth's client which POSTs JSON — a raw HTML
 * <form action="/api/auth/sign-out" method="post"> sends form-urlencoded
 * which Better-Auth rejects with UNSUPPORTED_MEDIA_TYPE.
 */
export function SignOutButton({
  className,
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
                router.refresh();
              },
            },
          });
        })
      }
      className={
        className ??
        "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
      }
    >
      <IconLogout className="size-4" />
      {pending ? "Signing out…" : label}
    </button>
  );
}
