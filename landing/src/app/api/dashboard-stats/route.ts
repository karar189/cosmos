import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

/**
 * Phase 3: Dashboard stats for overview cards.
 * GET /api/dashboard-stats?businessId=...
 * Returns totalReceived (sum of paid amounts), linkCount, completed, pending.
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

    const [links, paidLinks] = await Promise.all([
      db.paymentLink.findMany({
        where: { businessId: bid },
        select: { id: true, paidAt: true, amount: true },
      }),
      db.paymentLink.findMany({
        where: { businessId: bid, paidAt: { not: null } },
        select: { amount: true },
      }),
    ]);

    const completed = paidLinks.length;
    const pending = links.length - completed;
    let totalReceived = 0;
    for (const p of paidLinks) {
      const amt = parseFloat(p.amount);
      if (Number.isFinite(amt)) totalReceived += amt;
    }

    return NextResponse.json({
      businessId: bid,
      totalReceivedXlm: totalReceived.toFixed(4),
      linkCount: links.length,
      completed,
      pending,
    });
  } catch (e) {
    console.error("Dashboard stats error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
