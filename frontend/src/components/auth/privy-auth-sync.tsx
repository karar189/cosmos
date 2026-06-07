"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useLoginTransition, loginRedirectDelay } from "@/components/auth/login-transition-provider";
import { isPrivyConfigured } from "@/lib/privy-config";
import {
  consumePostLoginRedirect,
  POST_LOGIN_REDIRECT_KEY,
} from "@/lib/privy-login-redirect";
import { clearLaunchSession, isInviteVerifiedInSession } from "@/lib/launch-auth";

/**
 * After Privy login, exchanges access token for ht_privy cookie, then redirects to dashboard.
 */
export function PrivyAuthSync() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, user, getAccessToken, logout } = usePrivy();
  const { startLoginTransition, endLoginTransition } = useLoginTransition();
  const syncingRef = useRef(false);
  const syncedPrivyIdRef = useRef<string | null>(null);

  const redirectAfterLogin = useCallback(
    async (target: string) => {
      startLoginTransition("Taking you to your dashboard…");
      await loginRedirectDelay();
      router.replace(target);
      endLoginTransition();
    },
    [router, startLoginTransition, endLoginTransition]
  );

  useEffect(() => {
    if (!isPrivyConfigured() || !ready) return;

    if (!authenticated || !user?.id) {
      syncedPrivyIdRef.current = null;
      endLoginTransition();
      return;
    }

    // Already synced for this user — dismiss overlay if still showing.
    if (syncedPrivyIdRef.current === user.id) {
      endLoginTransition();
      return;
    }

    void (async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      startLoginTransition("Signing you in…");

      try {
        const token = await getAccessToken();
        if (!token) {
          endLoginTransition();
          return;
        }

        const res = await fetch("/api/auth/privy/sync", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "same-origin",
        });

        if (!res.ok) {
          if (res.status === 401) await logout();
          endLoginTransition();
          return;
        }

        syncedPrivyIdRef.current = user.id;
        window.dispatchEvent(new Event("hypertron-session-synced"));

        const pending = consumePostLoginRedirect();
        if (pending) {
          await redirectAfterLogin(pending);
          return;
        }

        const onHome = pathname === "/" || pathname === "";
        if (onHome && isInviteVerifiedInSession()) {
          await redirectAfterLogin("/dashboard");
          return;
        }

        endLoginTransition();
      } catch {
        endLoginTransition();
      } finally {
        syncingRef.current = false;
      }
    })();
  }, [
    ready,
    authenticated,
    user?.id,
    getAccessToken,
    logout,
    pathname,
    router,
    startLoginTransition,
    endLoginTransition,
    redirectAfterLogin,
  ]);

  useEffect(() => {
    if (!isPrivyConfigured()) return;
    const onSignOut = () => {
      try {
        sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
        clearLaunchSession();
      } catch {
        // ignore
      }
      syncedPrivyIdRef.current = null;
      endLoginTransition();
      void logout();
    };
    window.addEventListener("hypertron-sign-out", onSignOut);
    return () => window.removeEventListener("hypertron-sign-out", onSignOut);
  }, [logout, endLoginTransition]);

  return null;
}
