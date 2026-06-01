"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkspaceHubSidebar } from "@/components/dashboard/workspace-hub/workspace-hub-sidebar";
import {
  WorkspaceHubMain,
  templatesToWorkspaces,
} from "@/components/dashboard/workspace-hub/workspace-hub-main";
import { useFreighter } from "@/hooks/useFreighter";
import { useAppSession } from "@/hooks/useAppSession";
import { useOnboardingUi } from "@/components/onboarding";
import { loadSavedTemplates, type SavedTemplate } from "@/lib/my-templates-storage";
import type { WorkspaceCardModel } from "@/components/dashboard/workspace-hub/workspace-hub-main";
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

function WorkspaceHubContent() {
  const router = useRouter();
  const { publicKey, connect, disconnect, isConnecting } = useFreighter();
  const { isPrivy, loading: sessionLoading, privyUser } = useAppSession();
  const { openOnboardingQuiz } = useOnboardingUi();

  const [workspaces, setWorkspaces] = useState<WorkspaceCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");

  const loadWorkspaces = useCallback(async () => {
    setLoading(true);
    try {
      const [templates, profileRes] = await Promise.all([
        fetchWorkspaceTemplates(publicKey),
        fetch("/api/business/profile", { credentials: "same-origin" }).then((r) =>
          r.ok ? r.json() : null
        ),
      ]);

      const profile = profileRes as { name?: string } | null;
      if (profile?.name) setProfileName(String(profile.name));

      setWorkspaces(templatesToWorkspaces(templates));
    } catch {
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (sessionLoading) return;
    if (!publicKey && !isPrivy) {
      setLoading(false);
      setWorkspaces([]);
      return;
    }
    void loadWorkspaces();
  }, [sessionLoading, publicKey, isPrivy, loadWorkspaces]);

  useEffect(() => {
    const onProfileUpdated = () => void loadWorkspaces();
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, [loadWorkspaces]);

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
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Hypertron</h1>
        <p className="max-w-xs text-center text-sm text-slate-600">
          Sign in to view and manage your workspaces.
        </p>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="rounded-lg bg-violet-600 text-white hover:bg-violet-700"
        >
          {isConnecting ? "Connecting…" : "Connect with Freighter"}
        </Button>
        <Button variant="ghost" onClick={() => router.push("/")} className="text-slate-600">
          Back to home
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
      <WorkspaceHubMain
        userName={displayName}
        workspaces={workspaces}
        loading={loading || sessionLoading}
        onCreateWorkspace={openOnboardingQuiz}
      />
    </div>
  );
}

export default function WorkspaceHubPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-transparent">
          <p className="text-sm text-slate-600">Loading workspaces…</p>
        </div>
      }
    >
      <WorkspaceHubContent />
    </Suspense>
  );
}
