"use client";

import { Suspense } from "react";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { RiskAgentDashboard } from "@/components/dashboard/risk-agent/risk-agent-dashboard";
import { useDemoMode } from "@/components/demo/demo-mode-provider";
import { useFreighter } from "@/hooks/useFreighter";

function RiskAgentPageInner() {
  const { publicKey } = useFreighter();
  const { isDemo } = useDemoMode();
  const canView = isDemo || !!publicKey;

  return (
    <WorkspacePageShell
      breadcrumbs={workspaceHubBreadcrumbs("Risk Report")}
      connectMessage="Connect your wallet to access Risk Report."
    >
      {canView ? <RiskAgentDashboard /> : null}
    </WorkspacePageShell>
  );
}

export default function RiskAgentPage() {
  return (
    <Suspense fallback={null}>
      <RiskAgentPageInner />
    </Suspense>
  );
}
