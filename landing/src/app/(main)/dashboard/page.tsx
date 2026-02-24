"use client";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePaymentLinkForm } from "@/components/create-payment-link-form";
import { PaymentLinkList } from "@/components/payment-link-list";
import { PayAnyAmountCard } from "@/components/pay-any-amount-card";
import { ZkCommitmentPool } from "@/components/zk-commitment-pool";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { WithdrawTab } from "@/components/dashboard/withdraw-tab";
import { OnboardingGate } from "@/components/onboarding/onboarding-gate";

const VALID_TABS = ["overview", "payment-links", "withdraw", "zk-pool"] as const;

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const defaultTab = tabFromUrl && VALID_TABS.includes(tabFromUrl as (typeof VALID_TABS)[number]) ? tabFromUrl : "overview";
  const { publicKey, connect, disconnect, isConnecting } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [receiveAddress, setReceiveAddress] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setBusinessId(null);
      setReceiveAddress(null);
      setBusinessError(null);
      return;
    }
    let cancelled = false;
    fetch("/api/business/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: publicKey }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.businessId) {
          setBusinessId(data.businessId);
          setReceiveAddress(data.receiveAddress ?? null);
        } else setBusinessError(data.error || "Could not load business");
      })
      .catch(() => {
        if (!cancelled) setBusinessError("Could not connect to backend");
      });
    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <p className="text-muted-foreground text-center">
          Connect your Stellar wallet to create payment links and manage payments.
        </p>
        <Button onClick={connect} disabled={isConnecting}>
          {isConnecting ? "Connecting…" : "Connect with Freighter"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <OnboardingGate when={!!publicKey} walletAddress={publicKey}>
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      </DashboardHeader>

      <DashboardMain>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage payment links, view revenue, and withdraw to your address.
            </p>
          </div>

        {businessError && (
          <p className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {businessError}. Ensure DATABASE_URL in .env is correct and run: npx prisma generate
          </p>
        )}

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-2">
            <TabsList className="h-auto w-auto rounded-lg bg-transparent p-0 gap-1">
              <TabsTrigger
                value="overview"
                className="rounded-lg px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="payment-links"
                className="rounded-lg px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Payment Links
              </TabsTrigger>
              <TabsTrigger
                value="withdraw"
                className="rounded-lg px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Withdraw
              </TabsTrigger>
              <TabsTrigger
                value="zk-pool"
                className="rounded-lg px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Secure vault
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <OverviewStats businessId={businessId} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
              <Card className="col-span-1 rounded-xl border-border lg:col-span-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Overview</CardTitle>
                  <CardDescription>Monthly received (XLM)</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <OverviewChart />
                </CardContent>
              </Card>
              <Card className="col-span-1 rounded-xl border-border lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent payments</CardTitle>
                  <CardDescription>
                    Latest payments to your links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPayments businessId={businessId} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment-links" className="space-y-4">
            {businessId && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <CreatePaymentLinkForm businessId={businessId} onCreated={() => {}} />
                  <PaymentLinkList businessId={businessId} />
                </div>
                <PayAnyAmountCard businessId={businessId} onCreated={() => {}} />
              </>
            )}
            {!businessId && !businessError && (
              <p className="text-muted-foreground">Loading…</p>
            )}
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            {businessId && (
              <WithdrawTab businessId={businessId} walletAddress={publicKey} receiveAddress={receiveAddress} />
            )}
            {!businessId && !businessError && (
              <p className="text-muted-foreground">Loading…</p>
            )}
          </TabsContent>

          <TabsContent value="zk-pool" className="space-y-4">
            <ZkCommitmentPool publicKey={publicKey} />
          </TabsContent>
        </Tabs>
        </div>
      </DashboardMain>
    </>
    </OnboardingGate>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
