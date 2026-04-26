"use client";

import { useState } from "react";
import { QrCode, Copy, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "next-qrcode";

interface PayAnyAmountCardProps {
  businessId: string;
  onCreated?: () => void;
}

export function PayAnyAmountCard({ businessId, onCreated }: PayAnyAmountCardProps) {
  const { Canvas: QRCanvas } = useQRCode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; linkId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, flexibleAmount: true }),
      });
      const data = await res.json();
      if (!res.ok) { setError("Could not create a live pay-any-amount link right now."); return; }
      setResult({ url: data.url, linkId: data.linkId });
      onCreated?.();
    } catch (err) {
      setError("Could not create a live pay-any-amount link right now.");
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 border border-violet-500/20">
          <QrCode className="h-4 w-4 text-violet-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Pay any amount</p>
          <p className="text-xs text-white/35 mt-0.5 leading-relaxed">
            One reusable link — clients pay any amount they choose. Private and shareable.
          </p>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {!result ? (
        <Button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white border-0"
        >
          {loading ? "Creating…" : "Create & show QR"}
        </Button>
      ) : (
        <div className="flex flex-col gap-4">
          {/* QR */}
          <div className="flex justify-center">
            <div className="rounded-xl border border-white/[0.08] bg-white p-3 shadow-lg shadow-black/30">
              <QRCanvas
                text={result.url}
                options={{ errorCorrectionLevel: "M", width: 180 }}
              />
            </div>
          </div>

          {/* URL row */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 min-w-0">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-xs font-mono text-violet-400/80 hover:text-violet-300 transition-colors min-w-0"
            >
              {result.url}
            </a>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-white/25 hover:text-white/60 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className={`flex-1 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white text-xs ${copied ? "text-emerald-400 border-emerald-500/30" : ""}`}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              {copied ? "Copied!" : "Copy link"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setResult(null)}
              className="text-white/30 hover:text-white/60 hover:bg-white/[0.04] text-xs px-3"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
