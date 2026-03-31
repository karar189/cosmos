import { NextResponse } from "next/server";

export function middleware(_req: Request) {
  return NextResponse.next();
}

/**
 * Skip static assets and Next internals so dev HMR / chunks are never intercepted.
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
