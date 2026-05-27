"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DASHBOARD_THEME_UPDATED_EVENT,
  getStoredDashboardTheme,
  setStoredDashboardTheme,
  type DashboardTheme,
} from "@/lib/dashboard-theme";

type DashboardThemeContextValue = {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  isReady: boolean;
};

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null);

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DashboardTheme>("dark");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setThemeState(getStoredDashboardTheme());
    setIsReady(true);

    const onThemeUpdated = (event: Event) => {
      const next = (event as CustomEvent<DashboardTheme>).detail;
      if (next === "light" || next === "dark") {
        setThemeState(next);
      }
    };

    window.addEventListener(DASHBOARD_THEME_UPDATED_EVENT, onThemeUpdated);
    return () => window.removeEventListener(DASHBOARD_THEME_UPDATED_EVENT, onThemeUpdated);
  }, []);

  const setTheme = useCallback((next: DashboardTheme) => {
    setStoredDashboardTheme(next);
    setThemeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, isReady }),
    [theme, setTheme, isReady]
  );

  return (
    <DashboardThemeContext.Provider value={value}>{children}</DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) {
    throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  }
  return ctx;
}
