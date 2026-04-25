import type { NextRequest } from "next/server";

const PRODUCTION_BASE = "https://www.hypertron.space";

/**
 * Base URL for absolute links (payment URLs, QR payloads).
 * When NEXT_PUBLIC_APP_URL is unset, uses the incoming request origin so
 * `next dev --experimental-https` matches (https://localhost:3000) and plain `next dev` still works (http://...).
 */
export function resolveAppBaseUrl(req: NextRequest): string {
  const rawBase =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  const isProductionOrMain =
    process.env.NODE_ENV === "production" || process.env.VERCEL_GIT_COMMIT_REF === "main";
  if (rawBase) {
    if (isProductionOrMain && (!rawBase || rawBase.includes("localhost"))) {
      return PRODUCTION_BASE;
    }
    return rawBase;
  }
  try {
    const u = new URL(req.url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "http://localhost:3000";
  }
}
