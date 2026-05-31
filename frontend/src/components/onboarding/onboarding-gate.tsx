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

function onboardingModalDismissedKey(scopeKey: string): string {
  return `onboarding_modal_dismissed:${scopeKey.trim()}`;
}

type OnboardingGateProps = {
  children: React.ReactNode;
  /** Open onboarding modal when app session is ready (Privy or wallet). */
  when?: boolean;
  /** Disable automatic legacy modal display on routes with a dedicated onboarding UI. */
  autoOpen?: boolean;
  /** Stellar G... when Freighter is connected (optional with Privy). */
  walletAddress?: string | null;
  /** Stable key for dismiss/completion storage (wallet G... or Privy app user id). */
  scopeKey?: string | null;
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

export function OnboardingGate({
  children,
  when = true,
  autoOpen = true,
  walletAddress,
  scopeKey,
}: OnboardingGateProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const walletOk =
    !!walletAddress &&
    walletAddress.length === 56 &&
    walletAddress.startsWith("G");

  const storageKey = (scopeKey?.trim() || walletAddress?.trim() || "").trim();
  const scopeOk = storageKey.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!scopeOk) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(sessionStorage.getItem(onboardingModalDismissedKey(storageKey)) === "1");
    } catch {
      setDismissed(false);
    }
  }, [storageKey, scopeOk]);

  const persistDismiss = useCallback(() => {
    if (!scopeOk) return;
    try {
      sessionStorage.setItem(onboardingModalDismissedKey(storageKey), "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }, [storageKey, scopeOk]);

  const refreshProfileCompletion = useCallback(() => {
    if (!mounted || !when || !scopeOk) {
      setProfileLoading(false);
      setProfileComplete(true);
      return;
    }
    setProfileLoading(true);
    fetch("/api/business/profile", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BusinessProfileResponse | null) => {
        setProfileComplete(isProfileComplete(data));
      })
      .catch(() => {
        setProfileComplete(false);
      })
      .finally(() => setProfileLoading(false));
  }, [mounted, scopeOk, when]);

  useEffect(() => {
    refreshProfileCompletion();
  }, [refreshProfileCompletion]);

  useEffect(() => {
    const onProfileUpdated = () => refreshProfileCompletion();
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, [refreshProfileCompletion]);

  const openOnboardingQuiz = useCallback(() => {
    if (!scopeOk) return;
    try {
      sessionStorage.removeItem(onboardingModalDismissedKey(storageKey));
    } catch {
      // ignore
    }
    setDismissed(false);
    setManualOpen(true);
  }, [storageKey, scopeOk]);

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
    scopeOk &&
    (manualOpen || (autoOpen && !profileLoading && !profileComplete && !dismissed));

  const isOnboardingComplete = useMemo(() => {
    if (!when || !scopeOk) return true;
    if (!mounted) return false;
    if (profileLoading) return false;
    return profileComplete;
  }, [when, scopeOk, mounted, profileComplete, profileLoading]);

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
        scopeKey={storageKey || null}
      />
    </OnboardingUiContext.Provider>
  );
}
