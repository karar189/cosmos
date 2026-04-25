import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { resolveAppBaseUrl } from "@/lib/app-base-url";

export const dynamic = "force-dynamic";

/**
 * Phase 3: Per-business event stream. Returns only safe fields — no client/payer address, no pool balance.
 * GET /api/events?businessId=...
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId query required" }, { status: 400 });
    }

    const links = await db.paymentLink.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        businessId: true,
        amount: true,
        purpose: true,
        workflowStage: true,
        paidAt: true,
        commitmentTxHash: true,
        createdAt: true,
      },
    });

    const baseUrl = resolveAppBaseUrl(req);
    const events = links.map((l) => ({
      linkId: l.id,
      businessId: l.businessId,
      amount: l.amount,
      purpose: l.purpose ?? undefined,
      workflowStage: l.workflowStage ?? undefined,
      paidAt: l.paidAt?.toISOString() ?? undefined,
      commitmentId: l.commitmentTxHash ?? undefined,
      createdAt: l.createdAt.toISOString(),
      url: `${baseUrl}/pay/${l.id}`,
    }));

    return NextResponse.json({ events });
  } catch (e) {
    console.error("Events list error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
