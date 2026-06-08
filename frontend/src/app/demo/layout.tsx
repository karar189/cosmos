"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardThemeProvider } from "@/components/dashboard/dashboard-theme-provider";
import { DemoBanner } from "@/components/demo/demo-banner";
import { DemoModeProvider } from "@/components/demo/demo-mode-provider";
import { DemoAppSessionProvider } from "@/components/auth/app-session-provider";
import { cn } from "@/utils";
import { usesWorkspaceHubShell } from "@/lib/workspace-hub-shell-routes";

function DemoLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hubShell = usesWorkspaceHubShell(pathname);

  return (
    <div
      className={cn(
        hubShell ? "workspace-hub-root" : "marketing-mono dashboard-gradient-bg",
        "font-default relative min-h-screen antialiased text-slate-900"
      )}
    >
      {!hubShell ? (
        <div className="border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <DemoBanner />
        </div>
      ) : null}
      {children}
    </div>
  );
}

export default function DemoRootLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardThemeProvider>
      <DemoModeProvider forcedDemo>
        <DemoAppSessionProvider>
          <DemoLayoutInner>{children}</DemoLayoutInner>
        </DemoAppSessionProvider>
      </DemoModeProvider>
    </DashboardThemeProvider>
  );
}
