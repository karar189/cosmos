import { NextRequest, NextResponse } from "next/server";
import { requireBusinessOwnedBySession } from "@/lib/require-session-wallet";
import { buildTreasurySnapshot } from "@/lib/financial-advisor/treasury-service";
import type { FaTimeRange } from "@/lib/financial-advisor/types";

export const dynamic = "force-dynamic";

const VALID_RANGES = new Set<FaTimeRange>(["1d", "7d", "30d", "90d", "all"]);

/**
 * GET /api/financial-advisor/treasury?businessId=...&range=30d
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId")?.trim();
    if (!businessId) {
      return NextResponse.json({ error: "businessId query required" }, { status: 400 });
    }

    const auth = await requireBusinessOwnedBySession(req, businessId);
    if (auth instanceof NextResponse) return auth;

    const rangeRaw = (searchParams.get("range") ?? "30d") as FaTimeRange;
    const range = VALID_RANGES.has(rangeRaw) ? rangeRaw : "30d";

    const snapshot = await buildTreasurySnapshot(businessId, range);
    return NextResponse.json(snapshot);
  } catch (e) {
    console.error("Financial advisor treasury error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
