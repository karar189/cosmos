"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import { CreatePaymentLinkForm } from "@/components/create-payment-link-form";
import { PaymentLinkList } from "@/components/payment-link-list";
import { PayAnyAmountCard } from "@/components/pay-any-amount-card";

export default function PaymentLinksPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!publicKey) {
      setBusinessId(null);
      setBusinessError(null);
      return;
    }

    setBusinessError(null);
    fetch(`/api/business/profile?walletAddress=${encodeURIComponent(publicKey.trim())}`)
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
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-center text-sm">Connect your wallet to manage payment links.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <DashboardMain>
      <div className="flex flex-col gap-8">
        <DashboardPageHeader
          eyebrow="Payments"
          title="Payment links"
          description="Create and manage your Stellar payment links."
        />

        {businessId ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <PayAnyAmountCard businessId={businessId} onCreated={() => {}} />
              <CreatePaymentLinkForm businessId={businessId} onCreated={() => {}} />
            </div>
            <PaymentLinkList businessId={businessId} />
          </div>
        ) : !businessError ? (
          <p className="text-white/30 text-sm">Loading…</p>
        ) : (
          <p className="text-destructive text-sm">{businessError}</p>
        )}
      </div>
    </DashboardMain>
  );
}
