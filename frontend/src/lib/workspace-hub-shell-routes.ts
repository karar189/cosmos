/** Routes that use the workspace hub shell (sidebar, mesh bg, light tokens). */
export const WORKSPACE_HUB_SHELL_PATHS = new Set([
  "/dashboard",
  "/dashboard/overview",
  "/dashboard/payment-links",
  "/dashboard/withdraw",
  "/dashboard/compliance-agent",
  "/dashboard/compliance-analysis",
  "/dashboard/rns",
  "/dashboard/settings",
  "/dashboard/documents",
]);

export function usesWorkspaceHubShell(pathname: string | null): boolean {
  if (!pathname) return false;
  const base = pathname.split("?")[0] ?? pathname;
  if (WORKSPACE_HUB_SHELL_PATHS.has(base)) return true;
  if (base.startsWith("/dashboard/payment-links")) return true;
  if (base.startsWith("/dashboard/documents/")) return true;
  return false;
}
