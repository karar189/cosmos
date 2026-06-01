"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSession } from "@/hooks/useAppSession";
import { homeLaunchPath } from "@/lib/launch-auth";
import { isProtectedAppPath } from "@/lib/protected-routes";

type ProtectedRouteGuardProps = {
  children: ReactNode;
};

/**
 * Client-side backstop: redirect unauthenticated users away from dashboard/regintel.
 * Middleware handles the first paint; this catches expired sessions and client navigations.
 */
export function ProtectedRouteGuard({ children }: ProtectedRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, loading } = useAppSession();
  const protectedPath = isProtectedAppPath(pathname);

  useEffect(() => {
    if (!protectedPath || loading || session) return;
    router.replace(homeLaunchPath(pathname ?? "/dashboard"));
  }, [protectedPath, loading, session, pathname, router]);

  if (protectedPath && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
        <p className="text-sm text-slate-500">Checking session…</p>
      </div>
    );
  }

  if (protectedPath && !session) {
    return null;
  }

  return <>{children}</>;
}
