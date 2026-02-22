"use client";

import { useState, useEffect } from "react";
import { OnboardingModal, getOnboardingCompleted, type OnboardingData } from "./onboarding-modal";

type OnboardingGateProps = {
  children: React.ReactNode;
  /** Show modal only when this is true (e.g. wallet connected). Omit to show on first visit regardless. */
  when?: boolean;
  /** Wallet address (G...) to save profile to DB when onboarding completes. */
  walletAddress?: string | null;
  onComplete?: (data: OnboardingData) => void;
};

export function OnboardingGate({ children, when = true, walletAddress, onComplete }: OnboardingGateProps) {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !when) return;
    const completed = getOnboardingCompleted();
    if (!completed) {
      setShowModal(true);
    }
  }, [mounted, when]);

  const handleComplete = (data: OnboardingData) => {
    onComplete?.(data);
    setShowModal(false);
  };

  return (
    <>
      {children}
      <OnboardingModal
        open={showModal}
        onOpenChange={setShowModal}
        onComplete={handleComplete}
        walletAddress={walletAddress ?? undefined}
      />
    </>
  );
}
