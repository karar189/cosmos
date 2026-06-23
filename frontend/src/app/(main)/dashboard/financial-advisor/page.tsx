"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFreighter } from "@/hooks/useFreighter";
import { useMockDashboardData } from "@/components/demo/demo-mode-provider";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { FinancialAdvisorDashboard } from "@/components/dashboard/financial-advisor/financial-advisor-dashboard";
import { WorkspaceOverviewContentSkeleton } from "@/components/dashboard/workspace-hub/hub-content-skeletons";
import { fallbackBusiness } from "@/data/fallback";
import { fetchTreasurySnapshot } from "@/lib/financial-advisor/client";
import { withDemoPrefix, isDemoRoute } from "@/lib/demo-routes";
import { useWorkspacePageMeta } from "@/components/dashboard/workspace-hub/workspace-page-meta-context";

function FinancialAdvisorContent() {
  const pathname = usePathname();
  const demo = isDemoRoute(pathname);
  const { publicKey } = useFreighter();
  const useMock = useMockDashboardData();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useWorkspacePageMeta({
    breadcrumbs: workspaceHubBreadcrumbs("Financial Advisor", pathname),
    title: "Financial Advisor",
    subtitle: "Treasury intelligence and market insights",
  });

  useEffect(() => {
    if (useMock) {
      setBusinessId(fallbackBusiness.businessId);
      setLoading(false);
      return;
    }
    if (!publicKey) {
      setLoading(false);
      return;
    }
    fetch("/api/business/profile", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        setBusinessId(typeof p?.businessId === "string" ? p.businessId.trim() : null);
      })
      .catch(() => setBusinessId(null))
      .finally(() => setLoading(false));
  }, [publicKey, useMock]);

  const base = withDemoPrefix("/dashboard/financial-advisor", demo);
  const marketsHref = `${base}/markets`;
  const assetHref = (symbol: string) => `${base}/markets/${encodeURIComponent(symbol)}`;

  if (loading) {
    return <WorkspaceOverviewContentSkeleton />;
  }

  if (!businessId) {
    return (
      <p className="text-sm text-slate-500">Connect your wallet and complete onboarding to use Financial Advisor.</p>
    );
  }

  return (
    <FinancialAdvisorDashboard
      businessId={businessId}
      marketsHref={marketsHref}
      assetHref={assetHref}
      fetchTreasury={fetchTreasurySnapshot}
    />
  );
}

export default function FinancialAdvisorPage() {
  const pathname = usePathname();

  return (
    <WorkspacePageShell breadcrumbs={workspaceHubBreadcrumbs("Financial Advisor", pathname)}>
      <Suspense fallback={<WorkspaceOverviewContentSkeleton />}>
        <FinancialAdvisorContent />
      </Suspense>
    </WorkspacePageShell>
  );
}
