"use client";

import { useState, useEffect } from "react";
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
import { ZkCommitmentPool } from "@/components/zk-commitment-pool";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { WithdrawTab } from "@/components/dashboard/withdraw-tab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingGate } from "@/components/onboarding/onboarding-gate";

export default function DashboardPage() {
  const router = useRouter();
  const { publicKey, connect, disconnect, isConnecting } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [receiveAddress, setReceiveAddress] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [receiveAddressInput, setReceiveAddressInput] = useState("");
  const [receiveAddressSaving, setReceiveAddressSaving] = useState(false);
  const [receiveAddressError, setReceiveAddressError] = useState<string | null>(null);

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
          setReceiveAddressInput(data.receiveAddress ?? "");
        } else setBusinessError(data.error || "Could not load business");
      })
      .catch(() => {
        if (!cancelled) setBusinessError("Could not connect to backend");
      });
    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  async function saveReceiveAddress() {
    if (!publicKey || !receiveAddressInput.trim()) return;
    setReceiveAddressError(null);
    setReceiveAddressSaving(true);
    try {
      const res = await fetch("/api/business/link", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: publicKey,
          receiveAddress: receiveAddressInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReceiveAddressError(data.error || "Failed to save");
        return;
      }
      setReceiveAddress(data.receiveAddress ?? null);
      setReceiveAddressInput(data.receiveAddress ?? "");
    } catch {
      setReceiveAddressError("Request failed");
    } finally {
      setReceiveAddressSaving(false);
    }
  }

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
    <OnboardingGate when={!!publicKey}>
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitch />
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      </DashboardHeader>

      <DashboardMain>
        <div className="mb-4 flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        </div>

        {businessError && (
          <p className="mb-4 rounded-lg border border-border bg-card p-3 text-sm text-destructive">
            {businessError}. Ensure DATABASE_URL in .env is correct and run: npx prisma generate
          </p>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payment-links">Payment Links</TabsTrigger>
              <TabsTrigger value="receive-address">Receive Address</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="zk-pool">ZK Pool</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <OverviewStats businessId={businessId} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue overview</CardTitle>
                  <CardDescription>Monthly received (XLM)</CardDescription>
                </CardHeader>
                <CardContent className="ps-2">
                  <OverviewChart />
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent payments</CardTitle>
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

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="payment-links" className="space-y-4">
            {businessId && (
              <>
                <CreatePaymentLinkForm businessId={businessId} onCreated={() => {}} />
                <PaymentLinkList businessId={businessId} />
              </>
            )}
            {!businessId && !businessError && (
              <p className="text-muted-foreground">Loading…</p>
            )}
          </TabsContent>

          <TabsContent value="receive-address" className="space-y-4">
            {businessId && (
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Receive address</CardTitle>
                  <CardDescription>
                    Stellar address (G...) where you receive payments. Payments from links will go here; memo identifies the link.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="receiveAddress">Your payment receive address</Label>
                    <Input
                      id="receiveAddress"
                      value={receiveAddressInput}
                      onChange={(e) => setReceiveAddressInput(e.target.value)}
                      placeholder="G..."
                      className="bg-background font-mono text-sm"
                    />
                  </div>
                  {receiveAddressError && (
                    <p className="text-sm text-destructive">{receiveAddressError}</p>
                  )}
                  <Button
                    type="button"
                    onClick={saveReceiveAddress}
                    disabled={
                      receiveAddressSaving ||
                      receiveAddressInput.trim().length < 56
                    }
                  >
                    {receiveAddressSaving ? "Saving…" : "Save receive address"}
                  </Button>
                  {receiveAddress && (
                    <p className="text-xs text-muted-foreground">
                      Saved. New payment links will use this address.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            {businessId && (
              <WithdrawTab businessId={businessId} receiveAddress={receiveAddress} />
            )}
            {!businessId && !businessError && (
              <p className="text-muted-foreground">Loading…</p>
            )}
          </TabsContent>

          <TabsContent value="zk-pool" className="space-y-4">
            <ZkCommitmentPool publicKey={publicKey} />
          </TabsContent>
        </Tabs>
      </DashboardMain>
    </>
    </OnboardingGate>
  );
}
