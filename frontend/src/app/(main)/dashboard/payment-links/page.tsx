"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { CreatePaymentLinkForm } from "@/components/create-payment-link-form";
import { PaymentLinkList } from "@/components/payment-link-list";
import { PayAnyAmountCard } from "@/components/pay-any-amount-card";
import { fallbackBusiness } from "@/data/fallback";

export default function PaymentLinksPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!publicKey) { setBusinessId(null); return; }
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
          setBusinessError(null);
          setUsingFallback(false);
          return;
        }
        setBusinessId(fallbackBusiness.businessId);
        setBusinessError(data.error || "Database unavailable");
        setUsingFallback(true);
      })
      .catch(() => {
        if (cancelled) return;
        setBusinessId(fallbackBusiness.businessId);
        setBusinessError("Could not connect to backend");
        setUsingFallback(true);
      });
    return () => { cancelled = true; };
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
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payment Links</h1>
          <p className="mt-1 text-sm text-white/40">Create and manage your Stellar payment links.</p>
        </div>

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
