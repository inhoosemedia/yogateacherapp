import { db } from "@/db/drizzle";
import { account, session, user, verification } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

// Build the trusted-origins list. NEXT_PUBLIC_APP_URL is the canonical one;
// we also accept its non-www counterpart and any extras from
// EXTRA_TRUSTED_ORIGINS (comma-separated) so domain changes don't break auth.
function trustedOrigins(): string[] {
  const out = new Set<string>();
  const canonical = process.env.NEXT_PUBLIC_APP_URL;
  if (canonical) {
    out.add(canonical);
    // Add the apex/www counterpart automatically.
    try {
      const u = new URL(canonical);
      if (u.hostname.startsWith("www.")) {
        out.add(`${u.protocol}//${u.hostname.slice(4)}`);
      } else {
        out.add(`${u.protocol}//www.${u.hostname}`);
      }
    } catch {
      /* ignore bad URL */
    }
  }
  for (const extra of (process.env.EXTRA_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)) {
    out.add(extra);
  }
  // Local dev fallback
  if (process.env.NODE_ENV !== "production") {
    out.add("http://localhost:3000");
    out.add("http://localhost:3100");
  }
  return Array.from(out);
}

export const auth = betterAuth({
  trustedOrigins: trustedOrigins(),
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  socialProviders: process.env.GOOGLE_CLIENT_ID
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  plugins: [nextCookies()],
});
