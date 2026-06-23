"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { FinancialAdvisorMarkets } from "@/components/dashboard/financial-advisor/financial-advisor-markets";
import { WorkspaceOverviewContentSkeleton } from "@/components/dashboard/workspace-hub/hub-content-skeletons";
import { fetchMarkets } from "@/lib/financial-advisor/client";
import { withDemoPrefix, isDemoRoute } from "@/lib/demo-routes";
import { useWorkspacePageMeta } from "@/components/dashboard/workspace-hub/workspace-page-meta-context";

function MarketsContent() {
  const pathname = usePathname();
  const demo = isDemoRoute(pathname);

  useWorkspacePageMeta({
    breadcrumbs: [
      ...workspaceHubBreadcrumbs("Financial Advisor", pathname).slice(0, -1),
      { label: "Financial Advisor", href: withDemoPrefix("/dashboard/financial-advisor", demo) },
      { label: "Markets", current: true },
    ],
    title: "Stellar Markets",
    subtitle: "Track Stellar assets and market movements",
  });

  const base = withDemoPrefix("/dashboard/financial-advisor", demo);

  return (
    <FinancialAdvisorMarkets
      advisorHref={base}
      assetHref={(symbol) => `${base}/markets/${encodeURIComponent(symbol)}`}
      fetchMarkets={fetchMarkets}
    />
  );
}

export default function FinancialAdvisorMarketsPage() {
  const pathname = usePathname();

  return (
    <WorkspacePageShell breadcrumbs={workspaceHubBreadcrumbs("Markets", pathname)}>
      <Suspense fallback={<WorkspaceOverviewContentSkeleton />}>
        <MarketsContent />
      </Suspense>
    </WorkspacePageShell>
  );
}
