import { createAuthClient } from "better-auth/react";

// Use current origin in the browser (no port mismatch), fall back to env on the
// server (or during build) so SSR helpers still work.
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL;

export const authClient = createAuthClient({ baseURL });
