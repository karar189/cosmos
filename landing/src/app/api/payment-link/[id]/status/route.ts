import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { findPaymentToAccountByMemo } from "@/lib/horizon";
import {
  executeCommit,
  hashToScalar,
} from "@/lib/soroban-commit-server";
import { randomBytes } from "crypto";

const STELLAR_NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as "testnet" | "public";

const PAYMENT_POOL_ADDRESS = (
  process.env.NEXT_PUBLIC_PAYMENT_POOL_ADDRESS?.trim() ||
  process.env.NEXT_PUBLIC_MERCHANT_RECIPIENT?.trim() ||
  ""
).trim();

function isValidStellarG(addr: string): boolean {
  const s = (addr || "").trim();
  return s.length === 56 && s.startsWith("G");
}

/** Check if this link has been paid; if so, add ZK commitment on-chain (Phase 2) and update link. */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const link = await db.paymentLink.findUnique({
      where: { id },
      include: { business: true },
    });
    if (!link) {
      return NextResponse.json({ error: "Payment link not found" }, { status: 404 });
    }

    if (link.paidAt && link.paymentTxHash) {
      return NextResponse.json({
        status: "paid" as const,
        paymentTxHash: link.paymentTxHash,
        paidAt: link.paidAt,
        commitmentTxHash: link.commitmentTxHash ?? undefined,
      });
    }

    let pool = PAYMENT_POOL_ADDRESS || link.destinationAddress?.trim() || "";
    if (!isValidStellarG(pool) && link.business?.receiveAddress) {
      const alt = link.business.receiveAddress.trim();
      if (isValidStellarG(alt)) pool = alt;
    }
    if (!pool) {
      return NextResponse.json({
        status: "pending" as const,
        hint: "Set a valid Stellar receive address (G..., 56 chars) in the dashboard and try again.",
      });
    }

    const found = await findPaymentToAccountByMemo(
      pool,
      link.linkMemo,
      STELLAR_NETWORK
    );
    if (!found) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[Payment status] No match yet. Pool:",
          pool.slice(0, 8) + "..." + pool.slice(-4),
          "| Memo:",
          link.linkMemo,
          "| Link ID:",
          id
        );
      }
      const destHint = pool ? `${pool.slice(0, 8)}...${pool.slice(-4)}` : "(not set)";
      return NextResponse.json({
        status: "pending" as const,
        hint: `No payment found to ${destHint} with memo "${link.linkMemo}". Wait 10–20 sec for the ledger and Horizon to update, then click Check status again.`,
        destination: pool,
        memo: link.linkMemo,
        network: STELLAR_NETWORK,
      });
    }

    const payerAddress = found.sourceAccount || "";
    const nonce = randomBytes(16).toString("hex");
    const secret = hashToScalar(payerAddress, link.businessId, link.amount);
    const nullifier = hashToScalar(nonce, link.id);

    const commitResult = await executeCommit(secret, nullifier, STELLAR_NETWORK);

    if (!commitResult.success) {
      console.error("Commit failed for link", id, commitResult.error);
      await db.paymentLink.update({
        where: { id },
        data: {
          paidAt: new Date(),
          paymentTxHash: found.txHash,
          payerAddress: payerAddress || undefined,
          nonce,
          nullifier: nullifier.toString(),
        },
      });
      return NextResponse.json({
        status: "paid" as const,
        paymentTxHash: found.txHash,
        paidAt: new Date().toISOString(),
        commitmentError: commitResult.error,
      });
    }

    await db.paymentLink.update({
      where: { id },
      data: {
        paidAt: new Date(),
        paymentTxHash: found.txHash,
        payerAddress: payerAddress || undefined,
        nonce,
        nullifier: nullifier.toString(),
        commitmentTxHash: commitResult.commitmentTxHash,
      },
    });
    return NextResponse.json({
      status: "paid" as const,
      paymentTxHash: found.txHash,
      paidAt: new Date().toISOString(),
      commitmentTxHash: commitResult.commitmentTxHash,
    });
  } catch (e) {
    console.error("Payment link status error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
