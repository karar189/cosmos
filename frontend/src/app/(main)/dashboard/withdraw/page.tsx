"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useFreighter } from "@/hooks/useFreighter";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { WithdrawTab } from "@/components/dashboard/withdraw-tab";
import { USE_MOCK_DASHBOARD_DATA, fallbackBusiness } from "@/data/fallback";

export default function WithdrawPage() {
  const { publicKey } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [receiveAddress, setReceiveAddress] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (USE_MOCK_DASHBOARD_DATA) {
      setBusinessId(fallbackBusiness.businessId);
      setReceiveAddress(fallbackBusiness.receiveAddress);
      setBusinessError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setBusinessError(null);

    fetch("/api/business/profile", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof json?.error === "string" ? json.error : `Failed to load profile (${res.status})`
          );
        }
        return json as { businessId?: string; receiveAddress?: string };
      })
      .then((data) => {
        if (cancelled) return;
        if (typeof data.businessId === "string" && data.businessId.trim()) {
          setBusinessId(data.businessId.trim());
          setReceiveAddress(
            typeof data.receiveAddress === "string" ? data.receiveAddress.trim() : null
          );
          setBusinessError(null);
          return;
        }
        setBusinessId(null);
        setBusinessError("Business profile not found.");
      })
      .catch((e) => {
        if (cancelled) return;
        setBusinessId(null);
        setBusinessError(e instanceof Error ? e.message : "Could not load business profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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

        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading treasury…
          </div>
        ) : businessId ? (
          <WithdrawTab
            businessId={businessId}
            walletAddress={publicKey ?? ""}
            receiveAddress={receiveAddress}
          />
        ) : (
          <p className="text-sm text-destructive">{businessError ?? "Unable to load treasury."}</p>
        )}
      </div>
    </WorkspacePageShell>
  );
}
