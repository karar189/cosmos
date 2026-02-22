"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useFreighter } from "@/hooks/useFreighter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQRCode } from "next-qrcode";
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
  const linkId = typeof params.id === "string" ? params.id : "";
  const { Canvas: QRCanvas } = useQRCode();
  const [payPageUrl, setPayPageUrl] = useState("");
  useEffect(() => {
    if (linkId && typeof window !== "undefined")
      setPayPageUrl(`${window.location.origin}/pay/${linkId}`);
  }, [linkId]);

  const [fetchedLink, setFetchedLink] = useState<{
    amount: string;
    memo: string;
    destinationAddress: string;
  } | null>(null);

  useEffect(() => {
    if (!linkId || linkId.startsWith("pl_")) return;
    fetch(`/api/payment-link/${linkId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.amount != null && data?.destinationAddress) {
          setFetchedLink({
            amount: data.amount,
            memo: data.memo || "",
            destinationAddress: data.destinationAddress,
          });
        }
      })
      .catch(() => {});
  }, [linkId]);

  const amount =
    fetchedLink?.amount ?? searchParams.get("amount") ?? "—";
  const memo = fetchedLink?.memo ?? searchParams.get("memo") ?? "";
  const destination =
    fetchedLink?.destinationAddress ??
    searchParams.get("dest") ??
    (process.env.NEXT_PUBLIC_MERCHANT_RECIPIENT?.trim() || null);

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

    // Dark pool: get one-time opaque memo (hash) so on-chain only hash is visible
    let memoHashBase64: string | undefined;
    try {
      const amountPayload = String(amount).replace(/\s*XLM$/i, "").trim();
      const prepRes = await fetch(`/api/payment-link/${linkId}/prepare-pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPayload || undefined }),
      });
      const errBody = await prepRes.json().catch(() => ({}));
      if (prepRes.ok) {
        if (errBody.memoHashBase64) memoHashBase64 = errBody.memoHashBase64;
      } else {
        setPayError(
          typeof errBody?.error === "string"
            ? errBody.error
            : `Prepare payment failed (${prepRes.status})`
        );
        setPayStatus("error");
        return;
      }
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Prepare payment failed");
      setPayStatus("error");
      return;
    }

    const buildResult = await buildPaymentXdr({
      horizonUrl,
      networkPassphrase,
      sourcePublicKey: publicKey,
      destinationPublicKey: destination,
      amountXlm: String(amount),
      memo: memoHashBase64 ? undefined : (memo || undefined),
      memoHashBase64,
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
        {/* Don't show memo on pay page (dark pool: we use opaque hash) */}
        <p className="text-muted-foreground text-xs">ID: {params.id}</p>

        {payPageUrl && (
          <div className="flex flex-col items-center gap-2 py-2">
            <p className="text-muted-foreground text-sm">Scan to open link</p>
            <div className="rounded-lg border border-border bg-white p-2 inline-block">
              <QRCanvas
                text={payPageUrl}
                options={{ errorCorrectionLevel: "M", width: 180 }}
              />
            </div>
          </div>
        )}

        <p className="text-muted-foreground text-sm font-medium">Pay with Stellar wallet</p>
        {!publicKey && (
          <Button onClick={connect} disabled={isConnecting} className="mt-2 w-full">
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
