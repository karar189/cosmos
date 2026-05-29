"use client";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { useOnboardingUi } from "@/components/onboarding";
import { useAppSession } from "@/hooks/useAppSession";

function OverviewContent() {
  const router = useRouter();
  const { publicKey, connect, isConnecting } = useFreighter();
  const { isPrivy, loading: sessionLoading } = useAppSession();
  const { isOnboardingComplete, openOnboardingQuiz } = useOnboardingUi();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (sessionLoading) return;
    if (!publicKey && !isPrivy) {
      setBusinessId(null);
      setBusinessError(null);
      return;
    }

    setBusinessError(null);
    fetch("/api/business/profile", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof json?.error === "string" ? json.error : `Failed to load profile (${res.status})`
          );
        }
        return json as { businessId?: string };
      })
      .then((data) => {
        if (cancelled) return;
        if (typeof data.businessId === "string" && data.businessId.trim()) {
          setBusinessId(data.businessId.trim());
          setBusinessError(null);
          return;
        }
        setBusinessId(null);
        setBusinessError("Business profile not found for this wallet.");
      })
      .catch((e) => {
        if (cancelled) return;
        setBusinessId(null);
        setBusinessError(e instanceof Error ? e.message : "Could not load business profile");
      });

    return () => {
      cancelled = true;
    };
  }, [publicKey, sessionLoading, isPrivy]);

  if (!publicKey && !sessionLoading && !isPrivy) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          Connect your Stellar wallet to manage payments and track activity.
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

  const onboardingIncomplete = !!publicKey && !isOnboardingComplete;

  return (
    <DashboardMain>
      <div className="flex flex-col gap-8">
        <DashboardPageHeader
          eyebrow="Workspace"
          title="Overview"
          description="Your payment activity at a glance."
          end={
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/20 bg-white/[0.06] text-foreground hover:bg-white/10"
              onClick={() => router.push("/dashboard")}
            >
              All workspaces
            </Button>
          }
        />

        <OverviewStats businessId={businessId} onboardingIncomplete={onboardingIncomplete} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
          <div className="col-span-1 flex flex-col rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl lg:col-span-4">
            <div className="mb-5 space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Revenue
              </p>
              <p className="text-sm font-medium text-foreground">Monthly received (XLM)</p>
            </div>
            <OverviewChart businessId={businessId} onboardingIncomplete={onboardingIncomplete} />
          </div>

          <div className="col-span-1 flex flex-col rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl lg:col-span-3">
            <div className="mb-5 space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Activity
              </p>
              <p className="text-sm font-medium text-foreground">Recent payments</p>
              <p className="text-xs text-muted-foreground">Latest activity on your links</p>
            </div>
            <RecentPayments businessId={businessId} onboardingIncomplete={onboardingIncomplete} />
          </div>
        </div>
        {businessError && <p className="text-xs text-destructive">{businessError}</p>}
      </div>
    </DashboardMain>
  );
}

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
