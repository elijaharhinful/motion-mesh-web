import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication (any role)
const AUTH_REQUIRED_PREFIXES = ["/account", "/generate", "/checkout"];
// Routes that require the CREATOR role
const CREATOR_ONLY_PREFIXES = ["/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We cannot read the Zustand store (client-only) in middleware.
  // Instead we rely on a lightweight auth cookie that the app sets after login.
  const authCookie = request.cookies.get("mm_authed")?.value;

  const needsAuth =
    AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    CREATOR_ONLY_PREFIXES.some((p) => pathname.startsWith(p));

  if (needsAuth && !authCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/generate/:path*",
    "/checkout/:path*",
    "/dashboard/:path*",
  ],
};
