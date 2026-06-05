"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  WorkspaceHubShellBar,
  type HubBreadcrumb,
} from "@/components/dashboard/workspace-hub/workspace-hub-chrome";
import { WorkspaceOverviewSidebar } from "@/components/dashboard/workspace-hub/workspace-overview-sidebar";
import {
  readCreateWorkspaceDraftLogo,
  templatesToWorkspaces,
  type WorkspaceCardModel,
} from "@/components/dashboard/workspace-hub/workspace-hub-main";
import { useFreighter } from "@/hooks/useFreighter";
import { useAppSession } from "@/hooks/useAppSession";
import { loadSavedTemplates, type SavedTemplate } from "@/lib/my-templates-storage";
import {
  getWorkspaceTierState,
  WORKSPACE_TIER_UPDATED_EVENT,
} from "@/lib/workspace-tier-context";
import { POST_SIGN_OUT_PATH } from "@/lib/launch-auth";

async function fetchWorkspaceTemplates(publicKey: string | null): Promise<SavedTemplate[]> {
  try {
    const res = await fetch("/api/templates", { cache: "no-store", credentials: "same-origin" });
    if (res.ok) {
      const json = (await res.json()) as { templates?: SavedTemplate[] };
      if (Array.isArray(json.templates)) return json.templates;
    }
  } catch {
    /* fall through */
  }
  return loadSavedTemplates(publicKey);
}

export function workspaceHubBreadcrumbs(currentPage: string): HubBreadcrumb[] {
  return [
    { label: "Workspaces", href: "/dashboard" },
    { label: "Overview", href: "/dashboard/overview" },
    { label: currentPage, current: true },
  ];
}

type WorkspacePageShellProps = {
  breadcrumbs: HubBreadcrumb[];
  children: ReactNode;
  /** Shown in sidebar workspace switcher when tier state is missing */
  workspaceName?: string;
  connectMessage?: string;
};

export function WorkspacePageShell({
  breadcrumbs,
  children,
  workspaceName: workspaceNameProp,
  connectMessage = "Connect your wallet to continue.",
}: WorkspacePageShellProps) {
  const router = useRouter();
  const { publicKey, connect, disconnect, isConnecting } = useFreighter();
  const { isPrivy, loading: sessionLoading, privyUser } = useAppSession();

  const [workspaces, setWorkspaces] = useState<WorkspaceCardModel[]>([]);
  const [workspaceName, setWorkspaceName] = useState(workspaceNameProp?.trim() || "Workspace");
  const [profileName, setProfileName] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [templates, profileRes] = await Promise.all([
        fetchWorkspaceTemplates(publicKey),
        fetch("/api/business/profile", { credentials: "same-origin" }).then((r) =>
          r.ok ? r.json() : null
        ),
      ]);

      const profile = profileRes as { name?: string; activeTemplate?: { businessName?: string; name?: string } } | null;
      if (profile?.name) setProfileName(String(profile.name));

      const tpl = profile?.activeTemplate;
      if (tpl && typeof tpl.businessName === "string" && tpl.businessName.trim()) {
        setWorkspaceName(tpl.businessName.trim());
      } else if (tpl && typeof tpl.name === "string" && tpl.name.trim()) {
        setWorkspaceName(tpl.name.trim());
      } else if (workspaceNameProp?.trim()) {
        setWorkspaceName(workspaceNameProp.trim());
      }

      setWorkspaces(
        templatesToWorkspaces(templates, { logoUrl: readCreateWorkspaceDraftLogo() })
      );
    } catch {
      setWorkspaces([]);
    }
  }, [publicKey, workspaceNameProp]);

  useEffect(() => {
    const syncTier = () => {
      const state = getWorkspaceTierState();
      if (state?.businessName?.trim()) setWorkspaceName(state.businessName.trim());
    };
    syncTier();
    window.addEventListener(WORKSPACE_TIER_UPDATED_EVENT, syncTier);
    return () => window.removeEventListener(WORKSPACE_TIER_UPDATED_EVENT, syncTier);
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    if (!publicKey && !isPrivy) return;
    void loadData();
  }, [sessionLoading, publicKey, isPrivy, loadData]);

  const displayName =
    profileName.trim() ||
    privyUser?.name?.trim() ||
    (publicKey ? "Wallet User" : "User");

  const email =
    privyUser?.email?.trim() ||
    (publicKey ? `${publicKey.slice(0, 6)}…${publicKey.slice(-4)}` : "");

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    window.dispatchEvent(new Event("hypertron-sign-out"));
    disconnect();
    router.push(POST_SIGN_OUT_PATH);
  };

  if (!publicKey && !sessionLoading && !isPrivy) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-transparent px-4">
        <p className="max-w-xs text-center text-sm text-neutral-600">{connectMessage}</p>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          {isConnecting ? "Connecting…" : "Connect with Freighter"}
        </Button>
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-neutral-600">
          Back to workspaces
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <WorkspaceOverviewSidebar
        userName={displayName}
        userEmail={email}
        workspaceName={workspaceName}
        onSignOut={handleSignOut}
      />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
        <WorkspaceHubShellBar breadcrumbs={breadcrumbs} workspaces={workspaces} />
        <div className="flex-1 overflow-y-auto">
          <div className="workspace-hub-page-content w-full px-5 pb-8 pt-4 lg:px-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
