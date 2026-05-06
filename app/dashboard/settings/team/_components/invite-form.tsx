"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { inviteTeamMember, type InviteRole } from "../actions";

export function InviteForm() {
  const [pending, start] = useTransition();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("staff");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      try {
        const r = await inviteTeamMember({ email, role });
        if (r.emailed) {
          toast.success(`Invite sent to ${email}`);
        } else {
          toast.message("Invite created — copy the link below to share manually.", {
            description: r.link,
            duration: 10_000,
          });
        }
        setEmail("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  };

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-[1fr_180px_auto] gap-3 items-end">
      <div className="space-y-2">
        <Label htmlFor="invite-email">Email</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@example.com"
          autoComplete="off"
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label>Role</Label>
        <Select value={role} onValueChange={(v) => setRole(v as InviteRole)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff (front desk)</SelectItem>
            <SelectItem value="admin">Admin (full access)</SelectItem>
            <SelectItem value="instructor">Instructor (own classes)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={pending || !email.trim()}>
        {pending ? "Sending…" : "Send invite"}
      </Button>
    </form>
  );
}
