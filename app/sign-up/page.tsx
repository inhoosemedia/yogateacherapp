"use client";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function SignUpContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Allow only same-origin paths to prevent open-redirect.
  const rawReturn = searchParams.get("returnTo") ?? "";
  const returnTo = rawReturn.startsWith("/") ? rawReturn : "/onboarding";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: returnTo,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Sign up failed");
      return;
    }
    router.push(returnTo);
    router.refresh();
  };

  return (
    <AuthShell
      side={{
        eyebrow: "Free to start",
        title: "Run your studio with one calm tool.",
        quote:
          "Members, classes, instructors and packages — beautifully organised, never noisy.",
      }}
    >
      <div className="space-y-2 mb-8">
        <h1 className="font-display text-3xl tracking-tight">
          Create your studio
        </h1>
        <p className="text-muted-foreground text-sm">
          Free to start. No credit card required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">
            At least 8 characters.
          </p>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account?{" "}
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

export default function SignUp() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
}
