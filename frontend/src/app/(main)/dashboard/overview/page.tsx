"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { WorkspaceOverviewDashboard } from "@/components/dashboard/workspace-overview/workspace-overview-dashboard";
import { useAppSession } from "@/hooks/useAppSession";
import {
  getWorkspaceTierState,
  WORKSPACE_TIER_UPDATED_EVENT,
} from "@/lib/workspace-tier-context";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return (name.trim()[0] ?? "U").toUpperCase();
}

function OverviewContent() {
  const router = useRouter();
  const { publicKey, connect, isConnecting } = useFreighter();
  const { isPrivy, loading: sessionLoading, privyUser } = useAppSession();
  const [workspaceName, setWorkspaceName] = useState("Workspace");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const syncTier = () => {
      const state = getWorkspaceTierState();
      if (state?.businessName?.trim()) {
        setWorkspaceName(state.businessName.trim());
      }
    };
    syncTier();
    window.addEventListener(WORKSPACE_TIER_UPDATED_EVENT, syncTier);
    return () => window.removeEventListener(WORKSPACE_TIER_UPDATED_EVENT, syncTier);
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    if (!publicKey && !isPrivy) return;

    fetch("/api/business/profile", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.name === "string" && data.name.trim()) {
          setProfileName(data.name.trim());
        }
        const tpl = data?.activeTemplate;
        if (tpl && typeof tpl.businessName === "string" && tpl.businessName.trim()) {
          setWorkspaceName(tpl.businessName.trim());
        } else if (tpl && typeof tpl.name === "string" && tpl.name.trim()) {
          setWorkspaceName(tpl.name.trim());
        }
      })
      .catch(() => {});
  }, [publicKey, sessionLoading, isPrivy]);

  const displayName =
    profileName ||
    privyUser?.name?.trim() ||
    (publicKey ? `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}` : "User");

  if (!publicKey && !sessionLoading && !isPrivy) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          Connect your Stellar wallet to open a workspace.
        </p>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="mt-2 rounded-full bg-foreground px-8 py-3 text-base font-semibold text-background hover:opacity-90"
        >
          {isConnecting ? "Connecting…" : "Connect with Freighter"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          Back to workspaces
        </Button>
      </div>
    );
  }

  return (
    <DashboardMain fluid className="max-w-[1600px] pb-8">
      <WorkspaceOverviewDashboard
        workspaceName={workspaceName}
        userName={displayName}
        userInitials={initialsFromName(displayName)}
      />
    </DashboardMain>
  );
}

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading workspace…</p>
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
