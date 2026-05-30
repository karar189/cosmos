"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
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

  return (
    <WorkspacePageShell
      breadcrumbs={workspaceHubBreadcrumbs("Withdraw")}
      connectMessage="Connect your wallet to withdraw funds."
    >
      <div className="flex flex-col gap-8">
        <DashboardPageHeader
          variant="hub"
          eyebrow="Treasury"
          title="Withdraw"
          description="Transfer settled funds to your Stellar receive address."
        />

        {!publicKey ? null : businessId ? (
          <WithdrawTab businessId={businessId} walletAddress={publicKey} receiveAddress={receiveAddress} />
        ) : !businessError ? (
          <p className="text-sm text-neutral-500">Loading…</p>
        ) : null}
      </div>
    </WorkspacePageShell>
  );
}
