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
import { USE_MOCK_DASHBOARD_DATA, fallbackBusiness } from "@/data/fallback";
import { useOnboardingUi } from "@/components/onboarding";

function DashboardContent() {
  const router = useRouter();
  const { publicKey, connect, isConnecting } = useFreighter();
  const { isOnboardingComplete, openOnboardingQuiz } = useOnboardingUi();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBusinessId(null);
      setBusinessError(null);
      setUsingFallback(false);
      return;
    }

    if (USE_MOCK_DASHBOARD_DATA) {
      setBusinessId(fallbackBusiness.businessId);
      setBusinessError(null);
      setUsingFallback(true);
      return;
    }
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
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
          onClick={() => router.push("/")}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          Back to home
        </Button>
      </div>
    );
  }

  const onboardingIncomplete = !!publicKey && !isOnboardingComplete;

  return (
    <DashboardMain>
          <div className="flex flex-col gap-8">
            <DashboardPageHeader
              eyebrow="Dashboard"
              title="Overview"
              description="Your payment activity at a glance."
              end={
                onboardingIncomplete ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/[0.06] text-foreground hover:bg-white/10"
                    onClick={openOnboardingQuiz}
                  >
                    Take onboarding quiz
                  </Button>
                ) : undefined
              }
            />

            {/* Stat cards */}
            <OverviewStats businessId={businessId} onboardingIncomplete={onboardingIncomplete} />

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
              <div className="col-span-1 flex flex-col rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl lg:col-span-4">
                <div className="mb-5 space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Revenue</p>
                  <p className="text-sm font-medium text-foreground">Monthly received (XLM)</p>
                </div>
                <OverviewChart onboardingIncomplete={onboardingIncomplete} />
              </div>

              <div className="col-span-1 flex flex-col rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl lg:col-span-3">
                <div className="mb-5 space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Activity</p>
                  <p className="text-sm font-medium text-foreground">Recent payments</p>
                  <p className="text-xs text-muted-foreground">Latest activity on your links</p>
                </div>
                <RecentPayments businessId={businessId} onboardingIncomplete={onboardingIncomplete} />
              </div>
            </div>
          </div>
        </DashboardMain>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
