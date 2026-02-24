import { NextRequest, NextResponse } from "next/server";
import { getDailyIncomingPayments } from "@/lib/horizon";

const STELLAR_NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as "testnet" | "public";

/**
 * GET /api/transaction-analytics?walletAddress=G...&days=30
 * Returns daily payment counts (and totals) for the connected wallet from Stellar Horizon.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");
    const days = Math.min(90, Math.max(7, parseInt(searchParams.get("days") ?? "30", 10) || 30));

    if (!walletAddress?.trim() || walletAddress.length !== 56 || !walletAddress.startsWith("G")) {
      return NextResponse.json(
        { error: "Valid walletAddress (G...) query required" },
        { status: 400 }
      );
    }

    const daily = await getDailyIncomingPayments(walletAddress.trim(), STELLAR_NETWORK, {
      days,
      limit: 200,
    });

    return NextResponse.json({ daily, walletAddress: walletAddress.trim() });
  } catch (e) {
    console.error("Transaction analytics API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
