"use client";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { OnboardingGate } from "@/components/onboarding/onboarding-gate";

function DashboardContent() {
  const router = useRouter();
  const { publicKey, connect, isConnecting } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) { setBusinessId(null); setBusinessError(null); return; }
    let cancelled = false;
    fetch("/api/business/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: publicKey }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.businessId) setBusinessId(data.businessId);
        else setBusinessError(data.error || "Could not load business");
      })
      .catch(() => { if (!cancelled) setBusinessError("Could not connect to backend"); });
    return () => { cancelled = true; };
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Connect your Stellar wallet to manage payments and track activity.
        </p>
        <Button onClick={connect} disabled={isConnecting} className="mt-2">
          {isConnecting ? "Connecting…" : "Connect with Freighter"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <OnboardingGate when={!!publicKey} walletAddress={publicKey}>
      <>
        <DashboardMain>
          <div className="flex flex-col gap-8">
            {/* Page heading */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
              <p className="mt-1 text-sm text-muted-foreground">Your payment activity at a glance.</p>
            </div>

            {businessError && (
              <p className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {businessError}. Ensure DATABASE_URL in .env is correct and run: npx prisma generate
              </p>
            )}

            {/* Stat cards */}
            <OverviewStats businessId={businessId} />

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <div className="col-span-1 lg:col-span-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="mb-4">
                  <p className="text-sm font-medium">Revenue</p>
                  <p className="text-xs text-white/30 mt-0.5">Monthly received (XLM)</p>
                </div>
                <OverviewChart />
              </div>

              <div className="col-span-1 lg:col-span-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="mb-4">
                  <p className="text-sm font-medium">Recent payments</p>
                  <p className="text-xs text-white/30 mt-0.5">Latest activity on your links</p>
                </div>
                <RecentPayments businessId={businessId} />
              </div>
            </div>
          </div>
        </DashboardMain>
      </>
    </OnboardingGate>
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
