export type DashboardTheme = "dark" | "light";

export const DASHBOARD_THEME_STORAGE_KEY = "hypertron-dashboard-theme";
export const DASHBOARD_THEME_UPDATED_EVENT = "hypertron-dashboard-theme-updated";

export function getStoredDashboardTheme(): DashboardTheme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export function setStoredDashboardTheme(theme: DashboardTheme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent(DASHBOARD_THEME_UPDATED_EVENT, { detail: theme }));
}
