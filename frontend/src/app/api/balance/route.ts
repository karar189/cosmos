import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { requireBusinessOwnedBySession } from "@/lib/require-session-wallet";

export const dynamic = "force-dynamic";

/**
 * Phase 4: Virtual balance for a business.
 * GET /api/balance?businessId=...
 * Balance = sum of commitment amounts (paid links) minus amounts already withdrawn (used nullifiers).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    if (!businessId?.trim()) {
      return NextResponse.json(
        { error: "businessId query required" },
        { status: 400 }
      );
    }

    const bid = businessId.trim();
    const auth = await requireBusinessOwnedBySession(req, bid);
    if (auth instanceof NextResponse) return auth;

    // Nullifiers already used in completed withdrawals
    const completed = await db.withdrawal.findMany({
      where: { businessId: bid, status: "completed" },
      select: { nullifiers: true },
    });
    const usedNullifiers = new Set<string>(
      completed.flatMap((w) => w.nullifiers)
    );

    // Paid links with successful on-chain commit (same logic as withdraw)
    const paidLinks = await db.paymentLink.findMany({
      where: {
        businessId: bid,
        paidAt: { not: null },
        nullifier: { not: null },
        commitmentTxHash: { not: null },
      },
      select: { amount: true, nullifier: true },
    });

    let totalXlm = 0;
    const unspentAmounts: { amount: number; nullifier: string }[] = [];
    for (const link of paidLinks) {
      const n = link.nullifier!;
      if (usedNullifiers.has(n)) continue;
      const amt = parseFloat(link.amount ?? '');
      if (Number.isFinite(amt) && amt > 0) {
        totalXlm += amt;
        unspentAmounts.push({ amount: amt, nullifier: n });
      }
    }

    return NextResponse.json({
      businessId: bid,
      virtualBalanceXlm: totalXlm.toFixed(4),
      unspentCount: unspentAmounts.length,
    });
  } catch (e) {
    console.error("Balance API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
