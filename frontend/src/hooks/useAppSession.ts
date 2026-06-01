"use client";

import { useCallback, useEffect, useState } from "react";

export type MeResponse =
  | { auth: "wallet"; walletAddress: string }
  | {
      auth: "privy";
      user: { id: string; privyId: string; email: string | null; name: string | null };
    };

export function useAppSession() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetch("/api/auth/me", { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) {
          setData(null);
          return null;
        }
        const json = (await res.json()) as MeResponse;
        setData(json);
        return json;
      })
      .catch(() => {
        setData(null);
        return null;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isAuthenticated = !!data;
  const isPrivy = data?.auth === "privy";
  const isWalletSession = data?.auth === "wallet";

  return {
    data,
    loading,
    refresh,
    isAuthenticated,
    isPrivy,
    isWalletSession,
    privyUser: data?.auth === "privy" ? data.user : null,
    walletAddress: data?.auth === "wallet" ? data.walletAddress : null,
  };
}
