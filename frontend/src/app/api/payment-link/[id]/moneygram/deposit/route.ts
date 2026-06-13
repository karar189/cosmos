import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getExpectedPaymentDestination } from "@/lib/payment-destination";
import { isLinkExpired } from "@/lib/payment-link-fields";
import { isMoneyGramSandboxEnabled } from "@/lib/moneygram/config";
import { initiateMoneyGramDeposit } from "@/lib/moneygram/server";
import { normalizePaymentAssetCode } from "@/lib/stellar-assets";

function parseAmount(raw: unknown): string | null {
  const value = typeof raw === "string" ? raw.trim() : String(raw ?? "").trim();
  if (!value || !/^\d+(\.\d+)?$/.test(value)) return null;
  const n = parseFloat(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return value;
}

/**
 * Start a MoneyGram SEP-24 deposit (sandbox / testnet).
 * POST /api/payment-link/[id]/moneygram/deposit
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isMoneyGramSandboxEnabled()) {
      return NextResponse.json(
        {
          error:
            "MoneyGram sandbox is not enabled. Set MONEYGRAM_AUTH_SECRET on testnet (register at developer.moneygram.com).",
        },
        { status: 503 }
      );
    }

    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const kycName = typeof body.kycName === "string" ? body.kycName.trim() : "";
    const kycEmail = typeof body.kycEmail === "string" ? body.kycEmail.trim() : "";
    const amountFromBody = parseAmount(body.amount);

    if (!kycName) {
      return NextResponse.json({ error: "Name is required for on-ramp KYC." }, { status: 400 });
    }
    if (!kycEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kycEmail)) {
      return NextResponse.json({ error: "Valid email is required for on-ramp KYC." }, { status: 400 });
    }

    const link = await db.paymentLink.findUnique({ where: { id } });
    if (!link) {
      return NextResponse.json({ error: "Payment link not found" }, { status: 404 });
    }
    if (isLinkExpired(link.expiresAt)) {
      return NextResponse.json({ error: "This payment link has expired" }, { status: 410 });
    }
    if (link.paidAt) {
      return NextResponse.json({ error: "This payment link is already paid." }, { status: 409 });
    }

    const currency = normalizePaymentAssetCode(link.currency);
    if (currency !== "USDC") {
      return NextResponse.json(
        { error: "MoneyGram sandbox on-ramp supports USDC only." },
        { status: 400 }
      );
    }

    const fixedAmount = link.amount != null ? String(link.amount).trim() : "";
    const amount = fixedAmount || amountFromBody;
    if (!amount) {
      return NextResponse.json({ error: "Enter a valid payment amount." }, { status: 400 });
    }
    if (fixedAmount && amountFromBody && parseFloat(amountFromBody) !== parseFloat(fixedAmount)) {
      return NextResponse.json({ error: "Amount must match the payment link." }, { status: 400 });
    }

    const destinationAccount = getExpectedPaymentDestination(link.destinationAddress);
    if (!destinationAccount) {
      return NextResponse.json(
        { error: "Payment destination is not configured for this link." },
        { status: 503 }
      );
    }

    const session = await initiateMoneyGramDeposit({
      linkId: link.id,
      destinationAccount,
      linkMemo: link.linkMemo,
      amount,
      kycName,
      kycEmail,
    });

    return NextResponse.json({
      url: session.url,
      transactionId: session.transactionId,
      sandbox: true,
    });
  } catch (e) {
    console.error("MoneyGram deposit error:", e);
    const message =
      e instanceof Error ? e.message : "Failed to start MoneyGram deposit session";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
