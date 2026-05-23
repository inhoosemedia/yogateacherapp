"use client";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { IconCircleCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Better-Auth's request-password-reset endpoint returns success
    // regardless of whether the email exists — so we don't leak account
    // existence. We mirror that on the UI.
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Couldn't send reset email");
      return;
    }
    setSent(true);
  };

  return (
    <AuthShell
      side={{
        eyebrow: "Account recovery",
        title: "Lost your password? No drama.",
        quote:
          "Drop your email — we'll send a one-hour link to set a new one.",
      }}
    >
      {sent ? (
        <div className="text-center space-y-5">
          <div className="size-14 rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mx-auto">
            <IconCircleCheck className="size-7 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl tracking-tight">
              Check your inbox
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If <strong className="text-foreground">{email}</strong> matches an
              account, a reset link is on its way. The link is valid for one
              hour.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t get it? Check spam, or{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-primary hover:underline"
            >
              try a different address
            </button>
            .
          </p>
          <div>
            <Link
              href="/sign-in"
              className="text-sm text-primary hover:underline"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-8">
            <h1 className="font-display text-3xl tracking-tight">
              Forgot your password?
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter the email you signed up with and we&apos;ll email you a
              reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !email.trim()}
            >
              {loading ? "Sending link…" : "Send reset link"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
