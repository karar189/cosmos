"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import { WithdrawTab } from "@/components/dashboard/withdraw-tab";
import { USE_MOCK_DASHBOARD_DATA, fallbackBusiness } from "@/data/fallback";

export default function WithdrawPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [receiveAddress, setReceiveAddress] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBusinessId(null);
      setBusinessError(null);
      setUsingFallback(false);
      return;
    }

    if (USE_MOCK_DASHBOARD_DATA) {
      setBusinessId(fallbackBusiness.businessId);
      setReceiveAddress(fallbackBusiness.receiveAddress);
      setBusinessError(null);
      setUsingFallback(true);
      return;
    }
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
        <DashboardPageHeader
          eyebrow="Treasury"
          title="Withdraw"
          description="Transfer settled funds to your Stellar receive address."
        />

        {businessId ? (
          <WithdrawTab businessId={businessId} walletAddress={publicKey} receiveAddress={receiveAddress} />
        ) : !businessError ? (
          <p className="text-white/30 text-sm">Loading…</p>
        ) : null}
      </div>
    </DashboardMain>
  );
}
