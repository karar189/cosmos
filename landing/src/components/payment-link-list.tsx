"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface PaymentLinkItem {
  id: string;
  amount: string;
  memo: string | null;
  destinationAddress: string;
  createdAt: string;
}

interface PaymentLinkListProps {
  creatorPublicKey: string;
  refreshTrigger?: number;
}

export function PaymentLinkList({ creatorPublicKey, refreshTrigger = 0 }: PaymentLinkListProps) {
  const [links, setLinks] = useState<PaymentLinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payment-link?creator=${encodeURIComponent(creatorPublicKey)}`);
      const data = await res.json();
      if (data.links) setLinks(data.links);
    } catch {
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, [creatorPublicKey]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks, refreshTrigger]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading your payment links…</p>;
  }

  if (links.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No payment links yet. Create one above.
      </p>
    );
  }

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "";

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-3 max-w-2xl">
      <h2 className="text-lg font-medium text-foreground">Your payment links</h2>
      <ul className="space-y-2">
        {links.map((pl) => {
          const url = `${baseUrl}/pay/${pl.id}?amount=${encodeURIComponent(pl.amount)}${pl.memo ? `&memo=${encodeURIComponent(pl.memo)}` : ""}`;
          return (
            <li
              key={pl.id}
              className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm"
            >
              <span className="font-medium">{pl.amount} XLM</span>
              {pl.memo && <span className="text-muted-foreground">· {pl.memo}</span>}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary truncate max-w-[200px] hover:underline"
              >
                {url}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard?.writeText(url)}
              >
                Copy
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
