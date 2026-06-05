import { isProtectedAppPath } from "@/lib/protected-routes";

/** Routes that use the workspace hub shell instead of the legacy dashboard sidebar. */
export function usesWorkspaceHubShell(pathname: string | null): boolean {
  if (!pathname) return false;
  const base = pathname.split("?")[0] ?? pathname;
  return base === "/CreateWorkspace" || isProtectedAppPath(base);
}
