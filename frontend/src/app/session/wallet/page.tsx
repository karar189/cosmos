"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isConnected, requestAccess, signMessage } from "@stellar/freighter-api";
import { Button } from "@/components/ui/button";

function safeReturnUrl(raw: string | null): string {
  if (!raw || !raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//") || raw.includes("://")) return "/dashboard";
  return raw;
}

function WalletSessionInner() {
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));
  const reason = searchParams.get("reason");

  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFreighterHttpHint, setShowFreighterHttpHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { protocol, hostname } = window.location;
    const isLocal =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
    setShowFreighterHttpHint(protocol === "http:" && isLocal);
  }, []);

  const runFlow = useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatus("Connecting to Freighter…");
    try {
      const connected = await isConnected();
      if (!connected?.isConnected) {
        setError("Install the Freighter browser extension to continue.");
        setBusy(false);
        return;
      }

      const access = await requestAccess();
      if (access?.error || !access?.address) {
        setError(access?.error?.message ?? "Could not get wallet address.");
        setBusy(false);
        return;
      }
      const walletAddress = access.address;

      setStatus("Requesting sign-in challenge…");
      const chRes = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      const chJson = await chRes.json().catch(() => ({}));
      if (!chRes.ok) {
        setError(typeof chJson.error === "string" ? chJson.error : "Challenge failed.");
        setBusy(false);
        return;
      }
      const challengeId = chJson.challengeId as string;
      const message = chJson.message as string;
      if (!challengeId || !message) {
        setError("Invalid challenge response.");
        setBusy(false);
        return;
      }

      setStatus("Sign the message in Freighter to continue…");
      const signResult = await signMessage(message, { address: walletAddress });
      if (signResult?.error || signResult?.signedMessage == null) {
        setError(signResult?.error?.message ?? "Signing was cancelled or failed.");
        setBusy(false);
        return;
      }

      const rawSig = signResult.signedMessage;
      let signedMessageB64: string;
      if (typeof rawSig === "string") {
        signedMessageB64 = rawSig;
      } else if (rawSig instanceof Uint8Array) {
        let bin = "";
        for (let i = 0; i < rawSig.length; i += 1) bin += String.fromCharCode(rawSig[i]!);
        signedMessageB64 = btoa(bin);
      } else {
        setError("Unexpected signature format from wallet.");
        setBusy(false);
        return;
      }

      setStatus("Verifying signature…");
      const vRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          challengeId,
          walletAddress,
          signedMessage: signedMessageB64,
        }),
      });
      const vJson = await vRes.json().catch(() => ({}));
      if (!vRes.ok) {
        setError(typeof vJson.error === "string" ? vJson.error : "Verification failed.");
        setBusy(false);
        return;
      }

      try {
        localStorage.setItem("freighter_public_key", walletAddress);
        localStorage.removeItem("freighter_disconnected");
      } catch {
        /* ignore */
      }

      setStatus("Redirecting…");
      window.location.assign(returnUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }, [returnUrl]);

  useEffect(() => {
    if (reason === "config") {
      setError(
        "Dashboard sign-in is not configured (AUTH_SECRET). Add AUTH_SECRET to your environment and restart the dev server."
      );
    }
  }, [reason]);

  return (
    <div className="marketing-mono flex min-h-screen flex-col items-center justify-center bg-black px-4 text-zinc-100">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-950/80 p-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Sign in to Hypertron</h1>
        <p className="text-sm text-zinc-400">
          Prove you control your Stellar wallet by signing a one-time message. Your session is stored
          in a secure cookie after verification.
        </p>
        {showFreighterHttpHint ? (
          <p className="rounded-md border border-amber-500/25 bg-amber-950/35 px-3 py-2 text-left text-xs leading-relaxed text-amber-100/90">
            <span className="font-semibold text-amber-200">Local HTTP and Freighter:</span> Freighter only
            talks to HTTPS sites by default, so <code className="rounded bg-black/50 px-1">http://localhost</code>{" "}
            may show “not secure” or fail. Fix it by either allowing insecure sites in Freighter (Settings →
            Security → Advanced), or run{" "}
            <code className="rounded bg-black/50 px-1">npm run dev:https</code> and use the{" "}
            <code className="rounded bg-black/50 px-1">https://</code> URL.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        {status && !error ? <p className="text-sm text-zinc-400">{status}</p> : null}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            className="w-full"
            disabled={busy || reason === "config"}
            onClick={() => void runFlow()}
          >
            {busy ? "Working…" : "Connect wallet & sign in"}
          </Button>
          <Button variant="ghost" asChild className="w-full text-zinc-400">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function WalletSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
          Loading…
        </div>
      }
    >
      <WalletSessionInner />
    </Suspense>
  );
}
