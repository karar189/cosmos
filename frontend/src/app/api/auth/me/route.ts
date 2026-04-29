import { NextRequest, NextResponse } from "next/server";
import { getDashboardWalletFromRequest } from "@/lib/dashboard-session";
import { getAuthSecret } from "@/lib/require-session-wallet";

export const dynamic = "force-dynamic";

/** GET /api/auth/me — returns { walletAddress } when session cookie is valid. */
export async function GET(req: NextRequest) {
  const secret = getAuthSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration: AUTH_SECRET is not set" },
      { status: 500 }
    );
  }
  const w = await getDashboardWalletFromRequest(req, secret);
  if (!w) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ walletAddress: w });
}
