/** Session flag set after valid invite code on the home Launch flow. */
export const INVITE_VERIFIED_KEY = "hypertron_invite_verified";

export const LAUNCH_QUERY_PARAM = "launch";

export function safeReturnUrl(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw || !raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.includes("://")) return fallback;
  return raw;
}

/** Home URL that opens the Launch invite + sign-in dialog. */
export function homeLaunchPath(returnUrl?: string): string {
  const params = new URLSearchParams({ [LAUNCH_QUERY_PARAM]: "1" });
  if (returnUrl?.trim()) {
    params.set("returnUrl", safeReturnUrl(returnUrl.trim()));
  }
  return `/?${params.toString()}`;
}

export function isInviteVerifiedInSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INVITE_VERIFIED_KEY) === "1";
  } catch {
    return false;
  }
}
