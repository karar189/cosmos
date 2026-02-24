"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getExplorerTxUrl } from "@/lib/stellar-explorer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WithdrawTabProps {
  businessId: string;
  /** Connected wallet address (G...); used as default recipient. */
  walletAddress: string | null;
  receiveAddress: string | null;
}

export function WithdrawTab({ businessId, walletAddress, receiveAddress }: WithdrawTabProps) {
  const [balance, setBalance] = useState<{ virtualBalanceXlm: string; unspentCount: number } | null>(null);
  const [withdrawals, setWithdrawals] = useState<{ id: string; amount: string; recipientAddress: string; status: string; payoutTxHash: string | null; contractTxHash: string | null; createdAt: string }[]>([]);
  const [amount, setAmount] = useState("");
  const defaultRecipient = walletAddress ?? receiveAddress ?? "";
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch(`/api/balance?businessId=${encodeURIComponent(businessId)}`);
      const data = await res.json();
      if (res.ok) setBalance({ virtualBalanceXlm: data.virtualBalanceXlm ?? "0", unspentCount: data.unspentCount ?? 0 });
    } catch {
      setBalance(null);
    }
  }, [businessId]);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await fetch(`/api/withdraw?businessId=${encodeURIComponent(businessId)}`);
      const data = await res.json();
      if (res.ok) setWithdrawals(data.withdrawals ?? []);
    } catch {
      setWithdrawals([]);
    }
  }, [businessId]);

  useEffect(() => {
    setRecipient(walletAddress ?? receiveAddress ?? "");
  }, [walletAddress, receiveAddress]);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([fetchBalance(), fetchWithdrawals()]).finally(() => setLoading(false));
  }, [businessId, fetchBalance, fetchWithdrawals]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const amt = amount.trim();
    if (!amt || parseFloat(amt) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          amount: amt,
          recipientAddress: recipient.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setSuccess(
        data.payoutTxHash
          ? `Withdrawal complete ✔ Amount sent: ${data.amount} XLM. Transaction: ${data.payoutTxHash}`
          : `Withdrawal complete ✔ ${data.amount ?? amt} XLM sent.`
      );
      setAmount("");
      await fetchBalance();
      await fetchWithdrawals();
    } catch {
      setError("Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="py-6">
          <p className="text-muted-foreground text-sm">Loading balance…</p>
        </CardContent>
      </Card>
    );
  }

  const balanceNum = balance ? parseFloat(balance.virtualBalanceXlm) : 0;

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Verified balance</CardTitle>
          <CardDescription>
            Funds added to your private balance. Withdraw sends from our secure vault to your Stellar address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{balance?.virtualBalanceXlm ?? "0"} XLM</p>
          <p className="text-xs text-muted-foreground mt-1">
            🔒 Collected funds are securely pooled — individual client wallets are never exposed.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {balance?.unspentCount ?? 0} payment(s) available to withdraw
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw funds</CardTitle>
          <CardDescription>
            ⛓️ Hypertron reroutes funds privately through our secure vault before delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (XLM)</Label>
              <Input
                id="withdraw-amount"
                type="text"
                inputMode="decimal"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-recipient">Recipient (G...)</Label>
              <Input
                id="withdraw-recipient"
                type="text"
                placeholder={defaultRecipient || "G..."}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-background font-mono text-sm"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
            <Button type="submit" disabled={submitting || balanceNum <= 0}>
              {submitting ? "Withdrawal processing…" : "Confirm withdrawal"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal history</CardTitle>
          <CardDescription>Recent withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <p className="text-muted-foreground text-sm">No withdrawals yet.</p>
          ) : (
            <ul className="space-y-2">
              {withdrawals.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3 text-sm">
                  <span className="font-medium">{w.amount} XLM</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {w.status === "completed" ? "Withdrawal complete" : w.status === "pending" ? "Withdrawal processing" : w.status}
                  </span>
                  {(w.payoutTxHash || w.contractTxHash) && (
                    <span className="flex items-center gap-2">
                      {w.contractTxHash && (
                        <a
                          href={getExplorerTxUrl(w.contractTxHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs hover:underline"
                        >
                          Contract
                        </a>
                      )}
                      {w.payoutTxHash && (
                        <a
                          href={getExplorerTxUrl(w.payoutTxHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs hover:underline"
                        >
                          Payout
                        </a>
                      )}
                    </span>
                  )}
                  <span className="text-muted-foreground text-xs">
                    {new Date(w.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
