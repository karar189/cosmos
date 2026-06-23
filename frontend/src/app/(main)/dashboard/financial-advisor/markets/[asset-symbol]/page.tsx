"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import { useFreighter } from "@/hooks/useFreighter";
import { useMockDashboardData } from "@/components/demo/demo-mode-provider";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { FinancialAdvisorAssetDetail } from "@/components/dashboard/financial-advisor/financial-advisor-asset-detail";
import { WorkspaceOverviewContentSkeleton } from "@/components/dashboard/workspace-hub/hub-content-skeletons";
import { fallbackBusiness } from "@/data/fallback";
import { fetchAssetDetail } from "@/lib/financial-advisor/client";
import { withDemoPrefix, isDemoRoute } from "@/lib/demo-routes";
import { useWorkspacePageMeta } from "@/components/dashboard/workspace-hub/workspace-page-meta-context";

function AssetDetailContent() {
  const params = useParams();
  const pathname = usePathname();
  const demo = isDemoRoute(pathname);
  const symbol = typeof params.assetSymbol === "string" ? params.assetSymbol : "XLM";
  const { publicKey } = useFreighter();
  const useMock = useMockDashboardData();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      .then((p) => setBusinessId(typeof p?.businessId === "string" ? p.businessId.trim() : null))
      .catch(() => setBusinessId(null))
      .finally(() => setLoading(false));
  }, [publicKey, useMock]);

  useWorkspacePageMeta({
    breadcrumbs: [
      ...workspaceHubBreadcrumbs("Financial Advisor", pathname).slice(0, -1),
      { label: "Financial Advisor", href: withDemoPrefix("/dashboard/financial-advisor", demo) },
      { label: "Markets", href: withDemoPrefix("/dashboard/financial-advisor/markets", demo) },
      { label: symbol.toUpperCase(), current: true },
    ],
    title: symbol.toUpperCase(),
    subtitle: "Asset analysis",
  });

  const fetchAsset = useCallback(
    (sym: string) => {
      if (!businessId) return Promise.resolve(null);
      return fetchAssetDetail(businessId, sym);
    },
    [businessId]
  );

  const marketsHref = withDemoPrefix("/dashboard/financial-advisor/markets", demo);

  if (loading) {
    return <WorkspaceOverviewContentSkeleton />;
  }

  if (!businessId) {
    return <p className="text-sm text-slate-500">Connect your wallet to view asset analysis.</p>;
  }

  return <FinancialAdvisorAssetDetail symbol={symbol} marketsHref={marketsHref} fetchAsset={fetchAsset} />;
}

export default function FinancialAdvisorAssetPage() {
  const pathname = usePathname();

  return (
    <WorkspacePageShell breadcrumbs={workspaceHubBreadcrumbs("Asset", pathname)}>
      <Suspense fallback={<WorkspaceOverviewContentSkeleton />}>
        <AssetDetailContent />
      </Suspense>
    </WorkspacePageShell>
  );
}
