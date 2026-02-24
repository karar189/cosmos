"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getExplorerTxUrl } from "@/lib/stellar-explorer";

function truncate(str: string, head = 8, tail = 6) {
  if (str.length <= head + tail + 3) return str;
  return `${str.slice(0, head)}…${str.slice(-tail)}`;
}

export interface PaymentLinkItem {
  id: string;
  url: string;
  amount: string | null;
  purpose: string | null;
  clientName: string | null;
  workflowStage: string | null;
  linkMemo: string;
  paidAt: string | null;
  paymentTxHash: string | null;
  commitmentTxHash: string | null;
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
        setError(data.error || `Failed to load links (${res.status})`);
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
      <Card className="w-full max-w-2xl lg:max-w-none">
        <CardContent className="py-6">
          <p className="text-muted-foreground text-sm">Loading your payment links…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl lg:max-w-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Your payment links</CardTitle>
          <CardDescription>
            Payments to these links go to your verified balance. Client identity stays private.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLinks} className="shrink-0">
          <RefreshCw className="h-4 w-4 mr-1.5" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        {error && <p className="text-destructive text-sm">{error}</p>}
        {statusHint && (
          <p className="text-muted-foreground text-xs rounded-lg border border-border bg-muted/50 p-2">
            {statusHint}
          </p>
        )}
        {links.length === 0 ? (
          <p className="text-muted-foreground text-sm">No payment links yet. Create one in the form to the left.</p>
        ) : (
          <div className="max-h-[50vh] min-h-0 overflow-y-auto rounded-md border border-border pr-1">
            <ul className="space-y-3 py-1">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="rounded-lg border border-border p-3 text-sm space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-base">
                      {link.amount ? `${link.amount} XLM` : "Any amount"}
                    </span>
                    {link.paidAt ? (
                      <span className="rounded-full bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 text-xs font-medium">
                        Paid
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-xs font-medium">
                        Pending
                      </span>
                    )}
                    {link.purpose && (
                      <span className="text-muted-foreground text-xs">— {link.purpose}</span>
                    )}
                    {link.clientName && (
                      <span className="text-muted-foreground text-xs">({link.clientName})</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => checkStatus(link.id)}
                      className="ml-auto h-7 text-xs"
                    >
                      Check status
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs font-mono hover:underline inline-flex items-center gap-1 max-w-full min-w-0"
                      title={link.url}
                    >
                      <span className="truncate">{truncate(link.url, 32, 12)}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => navigator.clipboard.writeText(link.url)}
                      title="Copy link"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {link.paidAt && link.commitmentTxHash && (
                      <a
                        href={getExplorerTxUrl(link.commitmentTxHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        On-chain proof
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
