"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useFreighter } from "@/hooks/useFreighter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  buildPaymentXdr,
  submitSignedTransaction,
  getHorizonUrl,
  getNetworkPassphrase,
  type StellarNetwork,
} from "@/lib/stellar-payment";

const STELLAR_NETWORK: StellarNetwork =
  (process.env.NEXT_PUBLIC_STELLAR_NETWORK as StellarNetwork) || "testnet";

export default function PayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { publicKey, connect, isConnecting } = useFreighter();
  const amount = searchParams.get("amount") || "—";
  const memo = searchParams.get("memo") || "";
  const destination = searchParams.get("dest") || (process.env.NEXT_PUBLIC_MERCHANT_RECIPIENT?.trim() || null);

  const [payStatus, setPayStatus] = useState<"idle" | "building" | "signing" | "submitting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const canPay = publicKey && destination && amount && amount !== "—" && payStatus === "idle";

  async function handlePay() {
    if (!publicKey || !destination || !amount || amount === "—") return;
    setPayError(null);
    setPayStatus("building");

    const horizonUrl = getHorizonUrl(STELLAR_NETWORK);
    const networkPassphrase = getNetworkPassphrase(STELLAR_NETWORK);

    const buildResult = await buildPaymentXdr({
      horizonUrl,
      networkPassphrase,
      sourcePublicKey: publicKey,
      destinationPublicKey: destination,
      amountXlm: String(amount),
      memo: memo || undefined,
    });

    if (!buildResult.success) {
      setPayError(buildResult.error);
      setPayStatus("error");
      return;
    }

    setPayStatus("signing");
    const Freighter = (await import("@stellar/freighter-api")).default;
    const signResult = await Freighter.signTransaction(buildResult.xdr, {
      networkPassphrase,
      address: publicKey,
    });

    if (signResult?.error || !signResult?.signedTxXdr) {
      setPayError(signResult?.error?.message ?? "Wallet declined or signing failed");
      setPayStatus("error");
      return;
    }

    setPayStatus("submitting");
    const submitResult = await submitSignedTransaction(
      horizonUrl,
      networkPassphrase,
      signResult.signedTxXdr
    );

    if (submitResult.success) {
      setTxHash(submitResult.txHash);
      setPayStatus("success");
    } else {
      setPayError(submitResult.error);
      setPayStatus("error");
    }
  }

  const explorerUrl =
    STELLAR_NETWORK === "testnet"
      ? `https://stellar.expert/explorer/testnet/tx/${txHash}`
      : `https://stellar.expert/explorer/public/tx/${txHash}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="rounded-xl border border-border bg-card p-8 max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">Payment link</h1>
        <p className="text-muted-foreground">
          Amount: <strong className="text-foreground">{amount}</strong> XLM
        </p>
        {memo && (
          <p className="text-muted-foreground text-sm">Memo: {memo}</p>
        )}
        <p className="text-muted-foreground text-xs">ID: {params.id}</p>

        {!publicKey && (
          <Button onClick={connect} disabled={isConnecting} className="mt-4 w-full">
            {isConnecting ? "Connecting…" : "Connect wallet to pay"}
          </Button>
        )}

        {publicKey && !destination && (
          <p className="text-muted-foreground text-sm mt-4">
            This link has no recipient. Use a link created from the dashboard (with recipient), or set <code className="rounded bg-muted px-1">NEXT_PUBLIC_MERCHANT_RECIPIENT</code> in .env.
          </p>
        )}

        {canPay && (
          <Button onClick={handlePay} className="mt-4 w-full">
            Pay {amount} XLM
          </Button>
        )}

        {(payStatus === "building" || payStatus === "signing" || payStatus === "submitting") && (
          <p className="text-muted-foreground text-sm mt-4">
            {payStatus === "building" && "Building transaction…"}
            {payStatus === "signing" && "Confirm in Freighter…"}
            {payStatus === "submitting" && "Submitting…"}
          </p>
        )}

        {payStatus === "success" && txHash && (
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-green-600 dark:text-green-400 font-medium">Payment sent</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm break-all hover:underline block"
            >
              View transaction
            </a>
          </div>
        )}

        {payStatus === "error" && payError && (
          <p className="text-destructive text-sm mt-4">{payError}</p>
        )}
      </div>
    </main>
  );
}
