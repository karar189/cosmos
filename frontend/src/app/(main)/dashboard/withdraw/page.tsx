"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { WithdrawTab } from "@/components/dashboard/withdraw-tab";
import { fallbackBusiness } from "@/data/fallback";

export default function WithdrawPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [receiveAddress, setReceiveAddress] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!publicKey) { setBusinessId(null); return; }
    let cancelled = false;
    fetch("/api/business/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: publicKey }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.businessId) {
          setBusinessId(data.businessId);
          setReceiveAddress(data.receiveAddress ?? null);
          setBusinessError(null);
          setUsingFallback(false);
          return;
        }
        setBusinessId(fallbackBusiness.businessId);
        setReceiveAddress(fallbackBusiness.receiveAddress);
        setBusinessError(data.error || "Database unavailable");
        setUsingFallback(true);
      })
      .catch(() => {
        if (cancelled) return;
        setBusinessId(fallbackBusiness.businessId);
        setReceiveAddress(fallbackBusiness.receiveAddress);
        setBusinessError("Could not connect to backend");
        setUsingFallback(true);
      });
    return () => { cancelled = true; };
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-center text-sm">Connect your wallet to withdraw funds.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <DashboardMain>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Withdraw</h1>
          <p className="mt-1 text-sm text-white/40">Transfer funds to your Stellar address.</p>
        </div>

        {businessId ? (
          <WithdrawTab businessId={businessId} walletAddress={publicKey} receiveAddress={receiveAddress} />
        ) : !businessError ? (
          <p className="text-white/30 text-sm">Loading…</p>
        ) : null}
      </div>
    </DashboardMain>
  );
}
