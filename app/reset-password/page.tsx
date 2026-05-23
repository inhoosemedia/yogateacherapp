"use client";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { IconCircleCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const tokenMissing = !token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Reset failed");
      return;
    }
    setDone(true);
    // Auto-redirect to sign in after 2.5 seconds
    setTimeout(() => router.push("/sign-in"), 2500);
  };

  if (tokenMissing) {
    return (
      <AuthShell
        side={{
          eyebrow: "Account recovery",
          title: "This link is incomplete.",
        }}
      >
        <div className="space-y-4">
          <h1 className="font-display text-2xl tracking-tight">
            Invalid reset link
          </h1>
          <p className="text-sm text-muted-foreground">
            The reset link didn&apos;t include a token. The link may have been
            truncated by your email client — try copy-pasting it directly, or
            request a new one.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/forgot-password">
              <Button>Request new link</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Back to sign in</Button>
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell
        side={{
          eyebrow: "All set",
          title: "Welcome back.",
        }}
      >
        <div className="text-center space-y-5">
          <div className="size-14 rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mx-auto">
            <IconCircleCheck className="size-7 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl tracking-tight">
              Password updated
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your new password — redirecting…
            </p>
          </div>
          <Link
            href="/sign-in"
            className="inline-block text-sm text-primary hover:underline"
          >
            Go to sign in →
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      side={{
        eyebrow: "Account recovery",
        title: "Choose a new password.",
        quote:
          "We never see your old password — just pick a new one.",
      }}
    >
      <div className="space-y-2 mb-8">
        <h1 className="font-display text-3xl tracking-tight">
          Set a new password
        </h1>
        <p className="text-muted-foreground text-sm">
          At least 8 characters. Make it strong.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading || !password || !confirm}
        >
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        Decided you remembered it after all?{" "}
        <Link
          href="/sign-in"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
