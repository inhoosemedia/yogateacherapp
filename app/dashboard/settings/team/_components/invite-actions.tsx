"use client";

import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { revokeInvite, removeTeamMember } from "../actions";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          toast.success("Link copied");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Could not copy");
        }
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}

export function RevokeButton({ inviteId }: { inviteId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="outline"
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          try {
            await revokeInvite(inviteId);
            toast.success("Invite revoked");
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed");
          }
        })
      }
    >
      Revoke
    </Button>
  );
}

export function RemoveMemberButton({ memberRowId }: { memberRowId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="outline"
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Remove this team member from the studio?")) return;
        start(async () => {
          try {
            await removeTeamMember(memberRowId);
            toast.success("Removed");
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed");
          }
        });
      }}
    >
      Remove
    </Button>
  );
}
