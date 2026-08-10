import { NextRequest, NextResponse } from "next/server";
import { isMoneyGramSandboxEnabled } from "@/lib/moneygram/config";
import { getMoneyGramTransactionStatus } from "@/lib/moneygram/server";

/**
 * Poll MoneyGram SEP-24 transaction status (sandbox).
 * GET /api/payment-link/[id]/moneygram/status?transactionId=...
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isMoneyGramSandboxEnabled()) {
      return NextResponse.json(
        { error: "MoneyGram sandbox is not enabled." },
        { status: 503 }
      );
    }

    const { id } = await context.params;
    const transactionId = req.nextUrl.searchParams.get("transactionId")?.trim();
    if (!transactionId) {
      return NextResponse.json({ error: "transactionId query param required" }, { status: 400 });
    }

    const transaction = await getMoneyGramTransactionStatus({
      linkId: id,
      transactionId,
    });

    return NextResponse.json({ transaction, sandbox: true });
  } catch (e) {
    console.error("MoneyGram status error:", e);
    const message =
      e instanceof Error ? e.message : "Failed to fetch MoneyGram transaction status";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
