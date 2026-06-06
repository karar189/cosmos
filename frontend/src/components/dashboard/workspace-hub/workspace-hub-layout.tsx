"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { WorkspaceHubTopChrome } from "@/components/dashboard/workspace-hub/workspace-hub-chrome";
import { WorkspaceHubSidebar } from "@/components/dashboard/workspace-hub/workspace-hub-sidebar";
import {
  HubPageMetaProvider,
  useHubPageMetaContext,
} from "@/components/dashboard/workspace-hub/hub-page-meta-context";
import {
  readCreateWorkspaceDraftLogo,
  templatesToWorkspaces,
  type WorkspaceCardModel,
} from "@/components/dashboard/workspace-hub/workspace-hub-model";
import { useFreighter } from "@/hooks/useFreighter";
import { useAppSession } from "@/hooks/useAppSession";
import { CreateWorkspaceNavProvider } from "@/components/dashboard/workspace-hub/use-create-workspace-nav";
import { loadSavedTemplates, type SavedTemplate } from "@/lib/my-templates-storage";
import { getDefaultHubPageMeta } from "@/lib/hub-nav-routes";
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

function WorkspaceHubLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { publicKey, disconnect } = useFreighter();
  const { isPrivy, loading: sessionLoading, isAuthenticated, privyUser } = useAppSession();
  const { meta: pageMeta } = useHubPageMetaContext() ?? { meta: null };

  const [workspaces, setWorkspaces] = useState<WorkspaceCardModel[]>([]);
  const [profileName, setProfileName] = useState("");

  const loadWorkspaces = useCallback(async () => {
    try {
      const [templates, profileRes] = await Promise.all([
        fetchWorkspaceTemplates(publicKey),
        fetch("/api/business/profile", { credentials: "same-origin" }).then((r) =>
          r.ok ? r.json() : null
        ),
      ]);

      const profile = profileRes as { name?: string } | null;
      if (profile?.name) setProfileName(String(profile.name));
      setWorkspaces(
        templatesToWorkspaces(templates, { logoUrl: readCreateWorkspaceDraftLogo() })
      );
    } catch {
      setWorkspaces([]);
    }
  }, [publicKey]);

  useEffect(() => {
    if (sessionLoading) return;
    if (!publicKey && !isPrivy) return;
    void loadWorkspaces();
  }, [sessionLoading, publicKey, isPrivy, loadWorkspaces]);

  const displayName =
    profileName.trim() ||
    privyUser?.name?.trim() ||
    (publicKey ? "Wallet User" : "there");

  const email =
    privyUser?.email?.trim() ||
    (publicKey ? `${publicKey.slice(0, 6)}…${publicKey.slice(-4)}` : "");

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    window.dispatchEvent(new Event("hypertron-sign-out"));
    disconnect();
    window.location.assign(POST_SIGN_OUT_PATH);
  };

  const chromeMeta = pageMeta ?? getDefaultHubPageMeta(pathname);

  if (sessionLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <WorkspaceHubSidebar
        userName={displayName}
        userEmail={email}
        onSignOut={handleSignOut}
      />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
        {chromeMeta ? (
          <WorkspaceHubTopChrome
            breadcrumbs={chromeMeta.breadcrumbs}
            title={chromeMeta.title}
            subtitle={chromeMeta.subtitle}
            workspaces={workspaces}
          />
        ) : null}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">{children}</div>
      </div>
    </div>
  );
}

export function WorkspaceHubLayout({ children }: { children: ReactNode }) {
  return (
    <HubPageMetaProvider>
      <CreateWorkspaceNavProvider>
        <WorkspaceHubLayoutInner>{children}</WorkspaceHubLayoutInner>
      </CreateWorkspaceNavProvider>
    </HubPageMetaProvider>
  );
}
