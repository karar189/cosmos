import { NextRequest, NextResponse } from "next/server";
import { requireBusinessOwnedBySession } from "@/lib/require-session-wallet";
import { buildAssetDetail } from "@/lib/financial-advisor/treasury-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/financial-advisor/markets/[symbol]?businessId=...
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId")?.trim();
    if (!businessId) {
      return NextResponse.json({ error: "businessId query required" }, { status: 400 });
    }

    const auth = await requireBusinessOwnedBySession(req, businessId);
    if (auth instanceof NextResponse) return auth;

    const detail = await buildAssetDetail(businessId, symbol);
    if (!detail) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (e) {
    console.error("Financial advisor asset detail error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
