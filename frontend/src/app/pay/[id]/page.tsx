"use client";

import { useParams, useSearchParams } from "next/navigation";
import { getNetwork, signTransaction } from "@stellar/freighter-api";
import { useFreighter } from "@/hooks/useFreighter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useQRCode } from "next-qrcode";
import {
  buildPaymentXdr,
  submitSignedTransaction,
  getHorizonUrl,
  getNetworkPassphrase,
  type StellarNetwork,
} from "@/lib/stellar-payment";
import { getExplorerTxUrl, STELLAR_NETWORK } from "@/lib/stellar-explorer";

function stellarNetworkLabel(network: StellarNetwork): string {
  return network === "public" ? "Public Mainnet" : "Testnet";
}

function stellarNetworkFromName(name?: string): StellarNetwork | null {
  const normalized = (name || "").trim().toLowerCase();
  if (!normalized) return null;
  if (normalized.includes("public") || normalized.includes("mainnet")) return "public";
  if (normalized.includes("testnet")) return "testnet";
  return null;
}

function stellarNetworkFromPassphrase(passphrase?: string): StellarNetwork | null {
  const normalized = (passphrase || "").trim();
  if (!normalized) return null;
  if (normalized === getNetworkPassphrase("public")) return "public";
  if (normalized === getNetworkPassphrase("testnet")) return "testnet";
  return null;
}

export default function PayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { publicKey, connect, isConnecting } = useFreighter();
  const linkId = typeof params.id === "string" ? params.id : "";
  const { Canvas: QRCanvas } = useQRCode();
  const [kycName, setKycName] = useState("");
  const [kycEmail, setKycEmail] = useState("");
  const kycComplete =
    kycName.trim().length > 0 &&
    kycEmail.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kycEmail.trim());
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
        if (data?.destinationAddress) {
          setFetchedLink({
            amount: data.amount != null ? String(data.amount) : "",
            memo: data.memo || "",
            destinationAddress: data.destinationAddress,
          });
        }
      })
      .catch(() => {});
  }, [linkId]);

  const [customAmount, setCustomAmount] = useState("");
  const isAnyAmountLink = fetchedLink && (fetchedLink.amount === "" || fetchedLink.amount == null);
  const amount =
    isAnyAmountLink
      ? (customAmount || searchParams.get("amount") || "—").trim()
      : (fetchedLink?.amount ?? searchParams.get("amount") ?? "—");
  const memo = fetchedLink?.memo ?? searchParams.get("memo") ?? "";
  const destination =
    fetchedLink?.destinationAddress ??
    searchParams.get("dest") ??
    (process.env.NEXT_PUBLIC_MERCHANT_RECIPIENT?.trim() || null);

  const [payStatus, setPayStatus] = useState<"idle" | "building" | "signing" | "submitting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const canPay =
    publicKey &&
    destination &&
    amount &&
    amount !== "—" &&
    (payStatus === "idle" || payStatus === "error");

  async function handlePay() {
    if (!publicKey || !destination || !amount || amount === "—") return;
    setPayError(null);
    setPayStatus("building");

    const configuredNetwork = STELLAR_NETWORK;
    const walletNetworkRes = await getNetwork().catch(() => null);
    const walletNetwork =
      stellarNetworkFromPassphrase(walletNetworkRes?.networkPassphrase) ??
      stellarNetworkFromName(walletNetworkRes?.network);

    if (walletNetwork && walletNetwork !== configuredNetwork) {
      setPayError(
        `This payment link uses ${stellarNetworkLabel(configuredNetwork)}, but Freighter is on ${stellarNetworkLabel(walletNetwork)}. Please switch Freighter to ${stellarNetworkLabel(configuredNetwork)} and try again.`
      );
      setPayStatus("error");
      return;
    }

    const horizonUrl = getHorizonUrl(configuredNetwork);
    const networkPassphrase = getNetworkPassphrase(configuredNetwork);

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
      if (/not found/i.test(buildResult.error)) {
        setPayError(
          `Account not found on ${stellarNetworkLabel(configuredNetwork)}. Make sure your Freighter account is funded on ${stellarNetworkLabel(configuredNetwork)} and try again.`
        );
      } else {
        setPayError(buildResult.error);
      }
      setPayStatus("error");
      return;
    }

    setPayStatus("signing");
    const signResult = await signTransaction(buildResult.xdr, {
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

  const explorerUrl = getExplorerTxUrl(txHash);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Left: payment info + QR */}
        <div className="rounded-xl border border-border bg-card p-8 w-full text-center space-y-4">
          <h1 className="text-xl font-semibold text-foreground">Payment link</h1>
          {isAnyAmountLink ? (
            <div className="space-y-2 text-left">
              <Label htmlFor="pay-amount" className="text-muted-foreground">Amount (XLM)</Label>
              <Input
                id="pay-amount"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 10 or 2.5"
                value={customAmount || searchParams.get("amount") || ""}
                onChange={(e) => setCustomAmount(e.target.value.trim())}
                className="bg-background"
              />
            </div>
          ) : (
            <p className="text-muted-foreground">
              Amount: <strong className="text-foreground">{amount}</strong> XLM
            </p>
          )}
          <p className="text-muted-foreground text-xs">ID: {params.id}</p>

          {payPageUrl && (
            <div className="flex flex-col items-center gap-2 py-2">
              <p className="text-muted-foreground text-sm">Scan to open link</p>
              <div
                className={`relative rounded-lg border border-border bg-white p-2 inline-block transition-all duration-300 ${
                  kycComplete ? "" : "select-none"
                }`}
              >
                <div
                  className={
                    kycComplete
                      ? ""
                      : "blur-md pointer-events-none"
                  }
                >
                  <QRCanvas
                    text={payPageUrl}
                    options={{ errorCorrectionLevel: "M", width: 180 }}
                  />
                </div>
                {!kycComplete && (
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm"
                    title="Complete the payment KYC to proceed"
                  >
                    <p className="text-sm font-medium text-muted-foreground text-center px-4">
                      Complete the payment KYC to proceed
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-muted-foreground text-sm font-medium">Pay with Stellar wallet</p>
          <p className="text-muted-foreground text-xs">
            Network: {stellarNetworkLabel(STELLAR_NETWORK)}
          </p>
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
              {payStatus === "error" ? `Retry payment (${amount} XLM)` : `Pay ${amount} XLM`}
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

        {/* Right: KYC form */}
        <div className="rounded-xl border border-border bg-card p-8 w-full space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Payment KYC</h2>
          <p className="text-muted-foreground text-sm">
            Enter your name and email to verify your identity before paying.
          </p>
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="pay-kyc-name">Name</Label>
              <Input
                id="pay-kyc-name"
                type="text"
                placeholder="Your name"
                value={kycName}
                onChange={(e) => setKycName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-kyc-email">Email</Label>
              <Input
                id="pay-kyc-email"
                type="email"
                placeholder="you@example.com"
                value={kycEmail}
                onChange={(e) => setKycEmail(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          {kycComplete && (
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
              ✓ KYC complete — you can scan the QR or pay below.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
