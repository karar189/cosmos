"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { isPrivyConfigured } from "@/lib/privy-config";
import {
  consumePostLoginRedirect,
  POST_LOGIN_REDIRECT_KEY,
} from "@/lib/privy-login-redirect";
import { isInviteVerifiedInSession } from "@/lib/launch-auth";

/**
 * After Privy login, exchanges access token for ht_privy cookie, then redirects to dashboard.
 */
export function PrivyAuthSync() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, user, getAccessToken, logout } = usePrivy();
  const syncingRef = useRef(false);
  const syncedPrivyIdRef = useRef<string | null>(null);
  const redirectedRef = useRef(false);

  const redirectAfterLogin = (target: string) => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    router.replace(target);
  };

  useEffect(() => {
    if (!isPrivyConfigured() || !ready) return;

    if (!authenticated || !user?.id) {
      syncedPrivyIdRef.current = null;
      redirectedRef.current = false;
      return;
    }

    if (syncedPrivyIdRef.current === user.id && redirectedRef.current) return;

    void (async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      try {
        const token = await getAccessToken();
        if (!token) return;

        const res = await fetch("/api/auth/privy/sync", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "same-origin",
        });

        if (!res.ok) {
          if (res.status === 401) await logout();
          return;
        }

        syncedPrivyIdRef.current = user.id;

        const pending = consumePostLoginRedirect();
        if (pending) {
          redirectAfterLogin(pending);
          return;
        }

        // OAuth return often lands on `/` without the Launch dialog open
        const onHome = pathname === "/" || pathname === "";
        if (onHome && isInviteVerifiedInSession()) {
          redirectAfterLogin("/dashboard");
        }
      } catch {
        // ignore transient network errors
      } finally {
        syncingRef.current = false;
      }
    })();
  }, [ready, authenticated, user?.id, getAccessToken, logout, pathname, router]);

  useEffect(() => {
    if (!isPrivyConfigured()) return;
    const onSignOut = () => {
      try {
        sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
      } catch {
        // ignore
      }
      void logout();
    };
    window.addEventListener("hypertron-sign-out", onSignOut);
    return () => window.removeEventListener("hypertron-sign-out", onSignOut);
  }, [logout]);

  return null;
}
