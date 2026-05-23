"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [revokeOthers, setRevokeOthers] = useState(true);

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (next !== confirm) {
      toast.error("New passwords don't match");
      return;
    }
    setLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: revokeOthers,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Couldn't update password");
      return;
    }
    toast.success("Password updated");
    reset();
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => setOpen(true)}
      >
        Change password
      </Button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3"
    >
      <div className="space-y-2">
        <Label htmlFor="cur-pw">Current password</Label>
        <Input
          id="cur-pw"
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="new-pw">New password</Label>
          <Input
            id="new-pw"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-pw">Confirm new password</Label>
          <Input
            id="confirm-pw"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
        <input
          type="checkbox"
          checked={revokeOthers}
          onChange={(e) => setRevokeOthers(e.target.checked)}
          className="size-3.5"
        />
        Sign me out of other devices
      </label>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={loading || !current || !next}>
          {loading ? "Updating…" : "Update password"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
