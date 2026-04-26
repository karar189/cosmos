"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOnboardingCompleted } from "./onboarding-modal";
import { BusinessOnboardingModal } from "./business-onboarding-modal";

function onboardingModalDismissedKey(wallet: string): string {
  return `onboarding_modal_dismissed:${wallet.trim().toUpperCase()}`;
}

type OnboardingGateProps = {
  children: React.ReactNode;
  /** Open onboarding modal only when this is true (e.g. wallet connected). */
  when?: boolean;
  /** Wallet address (G...) used for wallet-scoped onboarding completion checks. */
  walletAddress?: string | null;
};

export type OnboardingUiContextValue = {
  /** True when a valid wallet is connected and onboarding quiz is completed for that wallet. */
  isOnboardingComplete: boolean;
  /** Opens the business onboarding modal (clears “dismissed” for this wallet). */
  openOnboardingQuiz: () => void;
};

const OnboardingUiContext = createContext<OnboardingUiContextValue | null>(null);

export function useOnboardingUi(): OnboardingUiContextValue {
  const ctx = useContext(OnboardingUiContext);
  if (!ctx) {
    throw new Error("useOnboardingUi must be used within OnboardingGate");
  }
  return ctx;
}

export function OnboardingGate({ children, when = true, walletAddress }: OnboardingGateProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  /** Bumps when the modal closes after completion so we re-read localStorage and hide the modal. */
  const [closeTick, setCloseTick] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!walletAddress || walletAddress.length !== 56 || !walletAddress.startsWith("G")) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(sessionStorage.getItem(onboardingModalDismissedKey(walletAddress)) === "1");
    } catch {
      setDismissed(false);
    }
  }, [walletAddress]);

  const persistDismiss = useCallback(() => {
    if (!walletAddress) return;
    try {
      sessionStorage.setItem(onboardingModalDismissedKey(walletAddress), "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }, [walletAddress]);

  const openOnboardingQuiz = useCallback(() => {
    if (!walletAddress || walletAddress.length !== 56 || !walletAddress.startsWith("G")) return;
    try {
      sessionStorage.removeItem(onboardingModalDismissedKey(walletAddress));
    } catch {
      // ignore
    }
    setDismissed(false);
    setManualOpen(true);
  }, [walletAddress]);

  const handleModalOpenChange = useCallback(
    (next: boolean) => {
      if (next) return;
      setManualOpen(false);
      if (walletAddress && getOnboardingCompleted(walletAddress)) {
        setCloseTick((t) => t + 1);
        return;
      }
      persistDismiss();
    },
    [persistDismiss, walletAddress]
  );

  const walletOk =
    !!walletAddress &&
    walletAddress.length === 56 &&
    walletAddress.startsWith("G");

  const showModal =
    mounted &&
    when &&
    walletOk &&
    !getOnboardingCompleted(walletAddress) &&
    (!dismissed || manualOpen);

  const isOnboardingComplete = useMemo(() => {
    void closeTick;
    if (!when || !walletOk || !walletAddress) return true;
    if (!mounted) return false;
    return getOnboardingCompleted(walletAddress);
  }, [when, walletOk, walletAddress, mounted, closeTick]);

  const uiValue = useMemo<OnboardingUiContextValue>(
    () => ({
      isOnboardingComplete,
      openOnboardingQuiz,
    }),
    [isOnboardingComplete, openOnboardingQuiz]
  );

  return (
    <OnboardingUiContext.Provider value={uiValue}>
      {children}
      <BusinessOnboardingModal
        open={showModal}
        onOpenChange={handleModalOpenChange}
        walletAddress={walletAddress ?? null}
      />
    </OnboardingUiContext.Provider>
  );
}
