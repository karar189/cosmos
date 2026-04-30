import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getExpectedPaymentDestination } from "@/lib/payment-destination";

/** Get a payment link by id (for pay page and attribution). When relayer is set, return relayer so clients pay relayer (backend forwards to pool). Otherwise pool address. */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const link = await db.paymentLink.findUnique({
      where: { id },
    });
    if (!link) {
      return NextResponse.json({ error: "Payment link not found" }, { status: 404 });
    }
    const destinationAddress = getExpectedPaymentDestination(link.destinationAddress);
    return NextResponse.json({
      id: link.id,
      amount: link.amount,
      memo: link.linkMemo,
      destinationAddress,
      purpose: link.purpose,
      clientName: link.clientName,
      workflowStage: link.workflowStage,
      paidAt: link.paidAt,
      paymentTxHash: link.paymentTxHash,
    });
  } catch (e) {
    console.error("Payment link get error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
