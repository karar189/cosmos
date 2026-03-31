"use client";

import { useState } from "react";
import { Link2, Copy, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreatePaymentLinkFormProps {
  businessId: string;
  onCreated?: () => void;
}

export function CreatePaymentLinkForm({ businessId, onCreated }: CreatePaymentLinkFormProps) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [clientName, setClientName] = useState("");
  const [workflowStage, setWorkflowStage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    linkId: string;
    url: string;
    memo: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount.trim()) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          amount: amount.trim(),
          purpose: purpose.trim() || undefined,
          clientName: clientName.trim() || undefined,
          workflowStage: workflowStage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create link"); return; }
      setResult({ linkId: data.linkId, url: data.url, memo: data.memo });
      setAmount(""); setPurpose(""); setClientName(""); setWorkflowStage("");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    if (!result) return;
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08]">
          <Link2 className="h-4 w-4 text-white/60" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Create payment link</p>
          <p className="text-xs text-white/35 mt-0.5 leading-relaxed">
            Fixed amount with optional client details. Share the link to receive payment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Amount — prominent */}
        <div className="space-y-1.5">
          <Label htmlFor="amount" className="text-xs text-white/50">Amount (XLM) <span className="text-red-400">*</span></Label>
          <Input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100"
            required
            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/40 focus:ring-0 h-9"
          />
        </div>

        {/* Optional fields — 2 col */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="purpose" className="text-xs text-white/50">Purpose</Label>
            <Input
              id="purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Invoice #123"
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/40 focus:ring-0 h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clientName" className="text-xs text-white/50">Client name</Label>
            <Input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Acme Corp"
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/40 focus:ring-0 h-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="workflowStage" className="text-xs text-white/50">Workflow stage</Label>
          <Input
            id="workflowStage"
            type="text"
            value={workflowStage}
            onChange={(e) => setWorkflowStage(e.target.value)}
            placeholder="e.g. pending, signed, delivered"
            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/40 focus:ring-0 h-9 text-sm"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1] shadow-none mt-1"
        >
          {loading ? "Creating…" : "Create payment link"}
        </Button>
      </form>

      {/* Result */}
      {result && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5 space-y-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCheck className="h-4 w-4" />
            <span className="text-xs font-medium">Link created</span>
          </div>
          <p className="text-white/40 text-xs">
            Memo for client:{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-white/70 font-mono">{result.memo}</code>
          </p>
          <div className="flex items-center gap-2 min-w-0">
            <input
              readOnly
              value={result.url}
              className="flex-1 min-w-0 truncate rounded-md bg-white/[0.04] border border-white/[0.08] px-2.5 py-1.5 text-xs font-mono text-violet-400/80 outline-none"
            />
            <Button
              type="button"
              size="sm"
              onClick={copyLink}
              className={`shrink-0 h-8 text-xs border ${copied ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-white/[0.05] border-white/[0.1] text-white/60 hover:bg-white/[0.08]"}`}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
