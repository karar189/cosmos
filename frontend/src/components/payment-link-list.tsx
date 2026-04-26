"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, ExternalLink, RefreshCw, CheckCircle2, Clock, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExplorerTxUrl } from "@/lib/stellar-explorer";
import { fallbackPaymentLinks } from "@/data/fallback";

function truncate(str: string, head = 28, tail = 10) {
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
  const [copied, setCopied] = useState<string | null>(null);
  const [checking, setChecking] = useState<string | null>(null);
  const [statusHint, setStatusHint] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setError(null);
    setLoading(true);
    setLinks(fallbackPaymentLinks);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  async function checkStatus(linkId: string) {
    setChecking(linkId);
    setStatusHint(null);
    try {
      const res = await fetch(`/api/payment-link/${linkId}/status`);
      const data = await res.json();
      await fetchLinks();
      if (data.status === "pending" && data.hint) setStatusHint(data.hint);
    } catch { /* ignore */ }
    finally { setChecking(null); }
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <p className="text-sm font-medium text-white">Your payment links</p>
          <p className="text-xs text-white/35 mt-0.5">
            {loading ? "Loading…" : `${links.length} link${links.length !== 1 ? "s" : ""} · payments go to your verified balance`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchLinks}
          disabled={loading}
          className="h-8 gap-1.5 text-xs text-white/50 hover:text-white hover:bg-white/[0.06] border border-white/[0.07]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Body */}
      <div className="px-5 py-3">
        
        {statusHint && (
          <p className="text-white/40 text-xs rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 mb-3">
            {statusHint}
          </p>
        )}

        {!loading && links.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Link2 className="h-8 w-8 text-white/15" />
            <p className="text-sm text-white/30">No payment links yet.</p>
            <p className="text-xs text-white/20">Create one using the forms below.</p>
          </div>
        )}

        {links.length > 0 && (
          <ul className="divide-y divide-white/[0.05]">
            {links.map((link) => (
              <li key={link.id} className="py-3.5 flex flex-col gap-2">
                {/* Top row */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Amount */}
                  <span className="text-sm font-semibold text-white">
                    {link.amount ? `${link.amount} XLM` : "Any amount"}
                  </span>

                  {/* Status badge */}
                  {link.paidAt ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[11px] font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400/80 px-2 py-0.5 text-[11px] font-medium">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  )}

                  {/* Purpose / client */}
                  {link.purpose && (
                    <span className="text-white/35 text-xs">· {link.purpose}</span>
                  )}
                  {link.clientName && (
                    <span className="text-white/25 text-xs">({link.clientName})</span>
                  )}

                  {/* Check status — pushed right */}
                  <button
                    onClick={() => checkStatus(link.id)}
                    disabled={checking === link.id}
                    className="ml-auto text-[11px] text-white/30 hover:text-white/70 transition-colors disabled:opacity-50"
                  >
                    {checking === link.id ? "Checking…" : "Check status"}
                  </button>
                </div>

                {/* Bottom row — URL */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center gap-1 font-mono text-xs text-sky-300/80 transition-colors hover:text-sky-200"
                    title={link.url}
                  >
                    <span className="truncate">{truncate(link.url)}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                  </a>

                  <button
                    onClick={() => copyLink(link.url)}
                    title="Copy link"
                    className="ml-0.5 text-white/25 hover:text-white/60 transition-colors"
                  >
                    <Copy className={`h-3.5 w-3.5 ${copied === link.url ? "text-emerald-400" : ""}`} />
                  </button>

                  {link.paidAt && link.commitmentTxHash && (
                    <a
                      href={getExplorerTxUrl(link.commitmentTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[11px] text-sky-300/75 transition-colors hover:text-sky-200"
                    >
                      On-chain proof ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
