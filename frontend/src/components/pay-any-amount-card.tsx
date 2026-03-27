"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  async function handleCreate() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          flexibleAmount: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create link");
        return;
      }
      setResult({ url: data.url, linkId: data.linkId });
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Pay any amount (QR link)</CardTitle>
        <CardDescription>
          One link and QR you can share with anyone. They open it and pay you any amount — no fixed amount. Private and reusable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-destructive text-sm">{error}</p>}
        {!result ? (
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating…" : "Create & show QR"}
          </Button>
        ) : (
          <div className="space-y-4 pt-2 border-t border-border">
            <p className="text-sm font-medium text-foreground">Share this QR or link</p>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-lg border border-border bg-white p-3">
                <QRCanvas
                  text={result.url}
                  options={{ errorCorrectionLevel: "M", width: 200 }}
                />
              </div>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm break-all hover:underline text-center"
              >
                {result.url}
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(result.url)}
              >
                Copy link
              </Button>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setResult(null)}>
              Create another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
