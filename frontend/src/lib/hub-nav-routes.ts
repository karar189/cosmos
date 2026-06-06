import type { HubBreadcrumb } from "@/components/dashboard/workspace-hub/workspace-hub-chrome";

export const HUB_NAV_PATHS = [
  "/dashboard",
  "/dashboard/templates",
  "/dashboard/billing",
  "/dashboard/account",
  "/dashboard/support",
] as const;

export type HubNavPath = (typeof HUB_NAV_PATHS)[number];

export function isHubNavRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const base = pathname.split("?")[0] ?? pathname;
  if (base === "/dashboard") return true;
  return HUB_NAV_PATHS.some((route) => route !== "/dashboard" && base.startsWith(route));
}

export type HubPageMeta = {
  breadcrumbs: HubBreadcrumb[];
  title?: string;
  subtitle?: string;
};

export function hubNavBreadcrumbs(page: string): HubBreadcrumb[] {
  return [
    { label: "Workspaces", href: "/dashboard" },
    { label: page, current: true },
  ];
}

const HUB_PAGE_DEFAULTS: Record<HubNavPath, HubPageMeta> = {
  "/dashboard": {
    breadcrumbs: [
      { label: "Overview", href: "/dashboard/overview" },
      { label: "Dashboard", current: true },
    ],
  },
  "/dashboard/templates": {
    breadcrumbs: hubNavBreadcrumbs("Templates"),
    title: "Templates",
    subtitle: "Pre-built workspace layouts tailored for Web3 companies.",
  },
  "/dashboard/billing": {
    breadcrumbs: hubNavBreadcrumbs("Billing & Plans"),
    title: "Billing & Plans",
    subtitle: "Manage your subscription, payment method, and invoices.",
  },
  "/dashboard/account": {
    breadcrumbs: hubNavBreadcrumbs("Settings"),
    title: "Settings",
    subtitle: "Manage your Hypertron account and preferences.",
  },
  "/dashboard/support": {
    breadcrumbs: hubNavBreadcrumbs("Support"),
    title: "Support",
    subtitle: "Get help, browse answers, or reach out to our team.",
  },
};

export function getDefaultHubPageMeta(pathname: string | null | undefined): HubPageMeta | null {
  if (!pathname) return null;
  const base = pathname.split("?")[0] ?? pathname;
  if (base === "/dashboard") return HUB_PAGE_DEFAULTS["/dashboard"];
  const match = HUB_NAV_PATHS.find(
    (route) => route !== "/dashboard" && base.startsWith(route)
  );
  return match ? HUB_PAGE_DEFAULTS[match] : null;
}

export type HubLoadingVariant = "workspaces" | "templates" | "billing" | "settings" | "support";

export function getHubLoadingVariant(pathname: string | null | undefined): HubLoadingVariant {
  const base = pathname?.split("?")[0] ?? "";
  if (base.startsWith("/dashboard/templates")) return "templates";
  if (base.startsWith("/dashboard/billing")) return "billing";
  if (base.startsWith("/dashboard/account")) return "settings";
  if (base.startsWith("/dashboard/support")) return "support";
  return "workspaces";
}
