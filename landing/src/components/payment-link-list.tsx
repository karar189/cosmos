"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface PaymentLinkItem {
  id: string;
  url: string;
  amount: string;
  purpose: string | null;
  clientName: string | null;
  workflowStage: string | null;
  linkMemo: string;
  paidAt: string | null;
  paymentTxHash: string | null;
  createdAt: string;
}

interface PaymentLinkListProps {
  businessId: string;
}

export function PaymentLinkList({ businessId }: PaymentLinkListProps) {
  const [links, setLinks] = useState<PaymentLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/payment-link?businessId=${encodeURIComponent(businessId)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load links");
        return;
      }
      setLinks(data.links ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const [statusHint, setStatusHint] = useState<string | null>(null);

  async function checkStatus(linkId: string) {
    setStatusHint(null);
    try {
      const res = await fetch(`/api/payment-link/${linkId}/status`);
      const data = await res.json();
      await fetchLinks();
      if (data.status === "pending" && data.hint) setStatusHint(data.hint);
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="py-6">
          <p className="text-muted-foreground text-sm">Loading your payment links…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Your payment links</CardTitle>
        <CardDescription>
          When a client pays via the link, funds go to the privacy pool. You see proof you were paid (amount, Paid ✔) — we never show your client’s wallet address. Use “Check status” to refresh.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-destructive text-sm">{error}</p>}
        {statusHint && (
          <p className="text-muted-foreground text-xs rounded-lg border border-border bg-muted/50 p-2">
            {statusHint}
          </p>
        )}
        {links.length === 0 ? (
          <p className="text-muted-foreground text-sm">No payment links yet. Create one above.</p>
        ) : (
          <ul className="space-y-3">
            {links.map((link) => (
              <li
                key={link.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3 text-sm"
              >
                <span className="font-medium">{link.amount} XLM</span>
                {link.purpose && <span className="text-muted-foreground">— {link.purpose}</span>}
                {link.clientName && (
                  <span className="text-muted-foreground">({link.clientName})</span>
                )}
                {link.workflowStage && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{link.workflowStage}</span>
                )}
                {link.paidAt ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">Paid ✓</span>
                ) : (
                  <span className="text-muted-foreground">Pending</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => checkStatus(link.id)}
                  className="ml-auto"
                >
                  Check status
                </Button>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs break-all hover:underline w-full"
                >
                  {link.url}
                </a>
                <span className="text-muted-foreground text-xs">ID: {link.id}</span>
              </li>
            ))}
          </ul>
        )}
        <Button variant="outline" size="sm" onClick={fetchLinks}>
          Refresh list
        </Button>
      </CardContent>
    </Card>
  );
}
