import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseDashboardSessionToken, DASHBOARD_SESSION_COOKIE } from "@/lib/dashboard-session";

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/regintel");
}

/**
 * Dashboard and RegIntel app areas require a valid signed-in session cookie
 * (SEP-53 verify flow). Unauthenticated users are sent to sign the challenge.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    const u = new URL("/session/wallet", req.url);
    u.searchParams.set("reason", "config");
    u.searchParams.set("returnUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(u);
  }

  const raw = req.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;
  if (!raw) {
    const u = new URL("/session/wallet", req.url);
    u.searchParams.set("returnUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(u);
  }

  const parsed = await parseDashboardSessionToken(raw, secret);
  if (!parsed) {
    const u = new URL("/session/wallet", req.url);
    u.searchParams.set("returnUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(u);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
