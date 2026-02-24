import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PRODUCTION_BASE = "https://www.hypertron.space";
const rawBase =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const isProductionOrMain =
  process.env.NODE_ENV === "production" || process.env.VERCEL_GIT_COMMIT_REF === "main";
const BASE_URL =
  isProductionOrMain && (!rawBase || rawBase.includes("localhost"))
    ? PRODUCTION_BASE
    : rawBase;

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

    const events = links.map((l) => ({
      linkId: l.id,
      businessId: l.businessId,
      amount: l.amount,
      purpose: l.purpose ?? undefined,
      workflowStage: l.workflowStage ?? undefined,
      paidAt: l.paidAt?.toISOString() ?? undefined,
      commitmentId: l.commitmentTxHash ?? undefined,
      createdAt: l.createdAt.toISOString(),
      url: `${BASE_URL}/pay/${l.id}`,
    }));

    return NextResponse.json({ events });
  } catch (e) {
    console.error("Events list error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
