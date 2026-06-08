import { isProtectedAppPath } from "@/lib/protected-routes";
import { isDemoRoute, stripDemoPrefix } from "@/lib/demo-routes";

/** Routes that use the workspace hub shell instead of the legacy dashboard sidebar. */
export function usesWorkspaceHubShell(pathname: string | null): boolean {
  if (!pathname) return false;
  const base = pathname.split("?")[0] ?? pathname;
  if (base === "/CreateWorkspace") return true;
  if (isDemoRoute(base)) return base.startsWith("/demo/dashboard");
  return isProtectedAppPath(base);
}

export function normalizeAppPathname(pathname: string | null | undefined): string {
  if (!pathname) return "";
  const base = pathname.split("?")[0] ?? pathname;
  return isDemoRoute(base) ? stripDemoPrefix(base) : base;
}
