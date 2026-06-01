import { isProtectedAppPath } from "@/lib/protected-routes";

/** Routes that use the workspace hub shell (sidebar, mesh bg, light tokens). */
export function usesWorkspaceHubShell(pathname: string | null): boolean {
  return isProtectedAppPath(pathname);
}
