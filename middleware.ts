import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (sessionCookie && ["/sign-in", "/sign-up"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const protectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/instructor");

  if (!sessionCookie && protectedPath) {
    return NextResponse.redirect(
      new URL(`/sign-in?returnTo=${encodeURIComponent(pathname)}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/billing/:path*",
    "/admin/:path*",
    "/instructor/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
