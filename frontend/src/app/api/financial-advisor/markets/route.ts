import { NextResponse } from "next/server";
import { buildMarketsResponse } from "@/lib/financial-advisor/treasury-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/financial-advisor/markets
 */
export async function GET() {
  try {
    const markets = await buildMarketsResponse();
    return NextResponse.json(markets);
  } catch (e) {
    console.error("Financial advisor markets error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
