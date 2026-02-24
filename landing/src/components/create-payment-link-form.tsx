"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      if (!res.ok) {
        setError(data.error || "Failed to create link");
        return;
      }
      setResult({ linkId: data.linkId, url: data.url, memo: data.memo });
      setAmount("");
      setPurpose("");
      setClientName("");
      setWorkflowStage("");
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
        <CardTitle>Create payment link</CardTitle>
        <CardDescription>
          Set an amount and optional details. Share the link — payments go to your vault and are attributed to this link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (XLM)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose (optional)</Label>
            <Input
              id="purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Invoice #123"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientName">Client name (optional)</Label>
            <Input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workflowStage">Workflow stage (optional)</Label>
            <Input
              id="workflowStage"
              type="text"
              value={workflowStage}
              onChange={(e) => setWorkflowStage(e.target.value)}
              placeholder="e.g. pending, signed, delivered"
              className="bg-background"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create payment link"}
          </Button>
        </form>
        {result && (
          <div className="pt-4 border-t border-border space-y-3">
            <p className="text-sm font-medium text-foreground">Link created</p>
            <p className="text-muted-foreground text-xs">
              Memo (client must include when paying): <code className="rounded bg-muted px-1">{result.memo}</code>
            </p>
            <div className="flex items-center gap-2 min-w-0">
              <Input
                readOnly
                value={result.url}
                className="font-mono text-xs bg-muted/50 flex-1 min-w-0 truncate"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(result.url)}
                className="shrink-0"
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
