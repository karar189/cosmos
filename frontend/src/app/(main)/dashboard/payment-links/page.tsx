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
import { USE_MOCK_DASHBOARD_DATA, fallbackBusiness } from "@/data/fallback";

export default function PaymentLinksPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();
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
        ) : null}
      </div>
    </DashboardMain>
  );
}
