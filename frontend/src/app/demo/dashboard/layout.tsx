"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DemoBanner } from "@/components/demo/demo-banner";
import { isHubNavRoute } from "@/lib/hub-nav-routes";
import { isWorkspaceRoute } from "@/lib/workspace-nav-routes";
import { WorkspaceHubLayout } from "@/components/dashboard/workspace-hub/workspace-hub-layout";
import { WorkspaceLayout } from "@/components/dashboard/workspace-hub/workspace-layout";

export default function DemoDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const banner = <DemoBanner className="mb-4 w-full" />;

  if (isHubNavRoute(pathname)) {
    return (
      <WorkspaceHubLayout topSlot={banner}>{children}</WorkspaceHubLayout>
    );
  }

  if (isWorkspaceRoute(pathname)) {
    return <WorkspaceLayout topSlot={banner}>{children}</WorkspaceLayout>;
  }

  return (
    <>
      <div className="px-5 pt-4 lg:px-6">
        {banner}
      </div>
      {children}
    </>
  );
}
