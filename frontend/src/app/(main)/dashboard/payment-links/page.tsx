"use client";

import { useState, useEffect } from "react";
import { useFreighter } from "@/hooks/useFreighter";
import { PaymentsCollectPage } from "@/components/dashboard/payments/payments-collect-page";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { WorkspacePaymentsContentSkeleton } from "@/components/dashboard/workspace-hub/hub-content-skeletons";
import { USE_MOCK_DASHBOARD_DATA, fallbackBusiness } from "@/data/fallback";

export default function PaymentLinksPage() {
  const { publicKey } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (USE_MOCK_DASHBOARD_DATA) {
      setBusinessId(fallbackBusiness.businessId);
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
        return json as { businessId?: string };
      })
      .then((data) => {
        if (cancelled) return;
        if (typeof data.businessId === "string" && data.businessId.trim()) {
          setBusinessId(data.businessId.trim());
          setBusinessError(null);
          return;
        }
        setBusinessId(null);
        setBusinessError("Business profile not found. Complete onboarding to create payment links.");
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
      breadcrumbs={workspaceHubBreadcrumbs("Payment links")}
      connectMessage="Connect your wallet to manage payment links."
    >
      {loading ? (
        <WorkspacePaymentsContentSkeleton />
      ) : businessId ? (
        <PaymentsCollectPage businessId={businessId} />
      ) : (
        <p className="text-sm text-destructive">{businessError ?? "Unable to load payments."}</p>
      )}
    </WorkspacePageShell>
  );
}
