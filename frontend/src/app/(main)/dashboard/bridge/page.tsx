"use client";

import { Suspense } from "react";
import { BridgePageContent } from "@/components/dashboard/bridge/bridge-page";
import { useWorkspacePageMeta } from "@/components/dashboard/workspace-hub/workspace-page-meta-context";
import { useDemoMode } from "@/components/demo/demo-mode-provider";

function BridgePageInner() {
  const { demoPath } = useDemoMode();

  useWorkspacePageMeta({
    breadcrumbs: [
      { label: "Workspaces", href: demoPath("/dashboard") },
      { label: "Bridge", current: true },
    ],
  });

  return <BridgePageContent />;
}

export default function BridgePage() {
  return (
    <Suspense fallback={null}>
      <BridgePageInner />
    </Suspense>
  );
}
