"use client";

import { Suspense } from "react";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { RegulationsAgentDashboard } from "@/components/dashboard/regulations-agent/regulations-agent-dashboard";
import { useDemoMode } from "@/components/demo/demo-mode-provider";
import { useFreighter } from "@/hooks/useFreighter";

function RegulationsAgentPageInner() {
  const { publicKey } = useFreighter();
  const { isDemo } = useDemoMode();
  const canView = isDemo || !!publicKey;

  return (
    <WorkspacePageShell
      breadcrumbs={workspaceHubBreadcrumbs("Regulations")}
      connectMessage="Connect your wallet to access Regulations."
    >
      {canView ? <RegulationsAgentDashboard /> : null}
    </WorkspacePageShell>
  );
}

export default function RegulationsAgentPage() {
  return (
    <Suspense fallback={null}>
      <RegulationsAgentPageInner />
    </Suspense>
  );
}
