import type { HubBreadcrumb } from "@/components/dashboard/workspace-hub/workspace-hub-chrome";
import { isHubNavRoute } from "@/lib/hub-nav-routes";

export function isWorkspaceRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const base = pathname.split("?")[0] ?? pathname;
  if (!base.startsWith("/dashboard")) return false;
  return !isHubNavRoute(pathname);
}

export type WorkspaceLoadingVariant =
  | "overview"
  | "treasury"
  | "payments"
  | "generic";

const ROUTE_LABELS: Record<string, string> = {
  overview: "Overview",
  withdraw: "Withdraw",
  "payment-links": "Payment links",
  payments: "Payments",
  "compliance-agent": "Compliance",
  "compliance-analysis": "Risk Reports",
  rns: "Regulations",
  "document-vault": "Document Vault",
  settings: "Settings",
  onboarding: "Onboarding",
  "employee-management": "Contributors",
  workspace: "Workflows",
};

export function getWorkspaceLoadingVariant(pathname: string | null | undefined): WorkspaceLoadingVariant {
  const base = pathname?.split("?")[0] ?? "";
  if (base.startsWith("/dashboard/overview")) return "overview";
  if (base.startsWith("/dashboard/withdraw")) return "treasury";
  if (base.startsWith("/dashboard/payment-links") || base.startsWith("/dashboard/payments")) {
    return "payments";
  }
  return "generic";
}

export function workspaceHubBreadcrumbs(currentPage: string): HubBreadcrumb[] {
  return [
    { label: "Workspaces", href: "/dashboard" },
    { label: "Overview", href: "/dashboard/overview" },
    { label: currentPage, current: true },
  ];
}

export function getDefaultWorkspaceBreadcrumbs(pathname: string | null | undefined): HubBreadcrumb[] {
  const base = pathname?.split("?")[0] ?? "";
  const segment = base.split("/").filter(Boolean).pop() ?? "Workspace";
  const label =
    ROUTE_LABELS[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return workspaceHubBreadcrumbs(label);
}
