import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getDashboardWalletFromRequest } from "@/lib/dashboard-session";

export function getAuthSecret(): string | null {
  return process.env.AUTH_SECRET?.trim() ?? null;
}

/** Returns session Stellar address or a 401/500 NextResponse. */
export async function requireSessionWallet(req: NextRequest): Promise<string | NextResponse> {
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
  return w;
}

/** Ensures `businessId` belongs to the signed-in wallet. */
export async function requireBusinessOwnedBySession(
  req: NextRequest,
  businessId: string
): Promise<{ wallet: string } | NextResponse> {
  const sw = await requireSessionWallet(req);
  if (sw instanceof NextResponse) return sw;
  const bid = businessId.trim();
  if (!bid) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }
  const business = await db.business.findFirst({
    where: { id: bid, walletAddress: sw },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { wallet: sw };
}
