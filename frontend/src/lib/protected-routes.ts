/** Server/client: paths that require a Privy or wallet dashboard session. */
export function isProtectedAppPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const base = pathname.split("?")[0] ?? pathname;
  return base.startsWith("/dashboard") || base.startsWith("/regintel");
}
