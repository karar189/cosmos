"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  WorkspaceHubTopChrome,
  type HubBreadcrumb,
} from "@/components/dashboard/workspace-hub/workspace-hub-chrome";
import { WorkspaceHubSidebar } from "@/components/dashboard/workspace-hub/workspace-hub-sidebar";
import {
  readCreateWorkspaceDraftLogo,
  templatesToWorkspaces,
  type WorkspaceCardModel,
} from "@/components/dashboard/workspace-hub/workspace-hub-main";
import { useFreighter } from "@/hooks/useFreighter";
import { useAppSession } from "@/hooks/useAppSession";
import { useOnboardingUi } from "@/components/onboarding";
import { loadSavedTemplates, type SavedTemplate } from "@/lib/my-templates-storage";
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

export function hubNavBreadcrumbs(page: string): HubBreadcrumb[] {
  return [
    { label: "Workspaces", href: "/dashboard" },
    { label: page, current: true },
  ];
}

type WorkspaceHubPageShellProps = {
  breadcrumbs: HubBreadcrumb[];
  title: string;
  subtitle?: string;
  children: ReactNode;
  connectMessage?: string;
};

export function WorkspaceHubPageShell({
  breadcrumbs,
  title,
  subtitle,
  children,
  connectMessage = "Sign in to view this page.",
}: WorkspaceHubPageShellProps) {
  const router = useRouter();
  const { publicKey, connect, disconnect, isConnecting } = useFreighter();
  const { isPrivy, loading: sessionLoading, privyUser } = useAppSession();
  const { openOnboardingQuiz } = useOnboardingUi();

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
    router.push(POST_SIGN_OUT_PATH);
  };

  if (!publicKey && !sessionLoading && !isPrivy) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#f5f0ff] to-[#eef4ff] px-4">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="max-w-xs text-center text-sm text-slate-600">{connectMessage}</p>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          {isConnecting ? "Connecting…" : "Connect with Freighter"}
        </Button>
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-slate-600">
          Back to workspaces
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <WorkspaceHubSidebar
        userName={displayName}
        userEmail={email}
        onCreateWorkspace={openOnboardingQuiz}
        onSignOut={handleSignOut}
      />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
        <WorkspaceHubTopChrome
          breadcrumbs={breadcrumbs}
          title={title}
          subtitle={subtitle}
          workspaces={workspaces}
        />
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">{children}</div>
      </div>
    </div>
  );
}
