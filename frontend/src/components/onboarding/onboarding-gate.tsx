"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

type BusinessProfileResponse = {
  name?: string;
  businessNature?: string;
  selectedWidgets?: string[];
  selectedTier?: string | null;
  complianceForm?: unknown;
};

function isProfileComplete(profile: BusinessProfileResponse | null): boolean {
  if (!profile) return false;
  const nameOk = typeof profile.name === "string" && profile.name.trim().length > 0;
  const tierOk =
    typeof profile.selectedTier === "string" && profile.selectedTier.trim().length > 0;
  if (nameOk && tierOk) return true;
  const natureOk =
    typeof profile.businessNature === "string" && profile.businessNature.trim().length > 0;
  const widgetsOk =
    Array.isArray(profile.selectedWidgets) && profile.selectedWidgets.length > 0;
  const hasComplianceForm =
    typeof profile.complianceForm === "object" && profile.complianceForm !== null;
  return nameOk && (natureOk || widgetsOk || hasComplianceForm);
}

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
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const walletOk =
    !!walletAddress &&
    walletAddress.length === 56 &&
    walletAddress.startsWith("G");

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

  const refreshProfileCompletion = useCallback(() => {
    if (!mounted || !when || !walletOk || !walletAddress) {
      setProfileLoading(false);
      setProfileComplete(true);
      return;
    }
    setProfileLoading(true);
    fetch(`/api/business/profile?walletAddress=${encodeURIComponent(walletAddress.trim())}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BusinessProfileResponse | null) => {
        setProfileComplete(isProfileComplete(data));
      })
      .catch(() => {
        setProfileComplete(false);
      })
      .finally(() => setProfileLoading(false));
  }, [mounted, walletAddress, walletOk, when]);

  useEffect(() => {
    refreshProfileCompletion();
  }, [refreshProfileCompletion]);

  useEffect(() => {
    const onProfileUpdated = () => refreshProfileCompletion();
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, [refreshProfileCompletion]);

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
      refreshProfileCompletion();
      if (profileComplete) {
        return;
      }
      persistDismiss();
    },
    [persistDismiss, profileComplete, refreshProfileCompletion]
  );

  const showModal =
    mounted &&
    when &&
    walletOk &&
    (manualOpen || (!profileLoading && !profileComplete && !dismissed));

  const isOnboardingComplete = useMemo(() => {
    if (!when || !walletOk || !walletAddress) return true;
    if (!mounted) return false;
    if (profileLoading) return false;
    return profileComplete;
  }, [when, walletOk, walletAddress, mounted, profileComplete, profileLoading]);

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
