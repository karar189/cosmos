"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Wrench, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { saveTemplate, widgetsFromBundle } from "@/lib/my-templates-storage";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFreighter } from "@/hooks/useFreighter";
import { cn } from "@/utils";

type WidgetCategory = "remittance" | "fintech" | "bank" | "stablecoin" | "ngo" | "rwa" | "custom";

interface RecommendationsResponse {
  source: "openai" | "heuristic";
  business_profile: {
    inferred_categories: WidgetCategory[];
    confidence: number;
    rationale: string;
    assumptions: string[];
  };
  bundles: Array<{
    id: string;
    name: string;
    description: string;
    widgets: Array<{
      id: string;
      title: string;
      category: WidgetCategory;
      type: "chart" | "metric" | "table" | "alert";
      why: string;
      impact: { time_saved_hours_per_month: number; cost_savings_usd_per_month: number };
    }>;
    totals: {
      time_saved_hours_per_month: number;
      cost_savings_usd_per_month: number;
      roi_percent: number | null;
    };
  }>;
  notes: string[];
}

const BUSINESS_TYPE_PRESETS = [
  "Remittance company",
  "Fintech payments",
  "Bank / Neobank",
  "Stablecoin issuer",
  "NGO",
  "RWA platform",
];

function parseCsv(s: string) {
  return (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function toOptionalInt(s: string): number | undefined {
  const v = Number.parseInt((s || "").trim(), 10);
  return Number.isFinite(v) && v >= 0 ? v : undefined;
}

function toOptionalFloat(s: string): number | undefined {
  const v = Number.parseFloat((s || "").trim());
  return Number.isFinite(v) && v >= 0 ? v : undefined;
}

function formatUsd(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatHours(n: number) {
  return `${Math.round(n * 10) / 10}h/mo`;
}

export default function OnboardingComplianceMakerPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();

  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessTypeHint, setBusinessTypeHint] = useState("");
  const [geographies, setGeographies] = useState("");
  const [products, setProducts] = useState("");
  const [monthlyTransactions, setMonthlyTransactions] = useState("");
  const [avgTxnValue, setAvgTxnValue] = useState("");
  const [opsRate, setOpsRate] = useState("65");
  const [complianceRate, setComplianceRate] = useState("85");
  const [platformCost, setPlatformCost] = useState("");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<RecommendationsResponse | null>(null);

  const handleSubmit = async () => {
    setError("");
    setResponse(null);
    if (!businessName?.trim() || businessDescription.trim().length < 20) {
      setError("Add a business name and a description (at least 20 characters).");
      return;
    }
    const body = {
      business_name: businessName.trim(),
      business_description: businessDescription.trim(),
      business_type_hint: businessTypeHint.trim() || undefined,
      geographies: parseCsv(geographies),
      products: parseCsv(products),
      monthly_transactions: toOptionalInt(monthlyTransactions),
      avg_transaction_value_usd: toOptionalFloat(avgTxnValue),
      ops_hourly_rate_usd: toOptionalFloat(opsRate) ?? 65,
      compliance_hourly_rate_usd: toOptionalFloat(complianceRate) ?? 85,
      platform_cost_usd_per_month: toOptionalFloat(platformCost),
      constraints: constraints.trim() || undefined,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/agentic/widgets/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as RecommendationsResponse | { error?: string; detail?: unknown };
      if (!res.ok) {
        const msg =
          (data as { error?: string })?.error ||
          (typeof (data as { detail?: unknown })?.detail === "string"
            ? (data as { detail: string }).detail
            : "") ||
          `Request failed (${res.status})`;
        throw new Error(msg);
      }
      setResponse(data as RecommendationsResponse);
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Failed to generate recommendations.";
      const friendly = raw.toLowerCase().includes("failed to fetch")
        ? "Cannot reach the Compliance Maker backend. Start the Cosmos AI server on port 8001 and try again."
        : raw;
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Connect your wallet to view this page.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Onboarding · Compliance Maker</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect} disabled={isConnecting}>
            Disconnect
          </Button>
        </div>
      </DashboardHeader>
      <DashboardMain>
        <div className="mx-auto max-w-[1400px] space-y-6 px-4 pb-8">
          <div className="flex flex-col gap-2 border-b border-border pb-4">
            <h1 className="text-3xl font-bold tracking-tight">Compliance Maker</h1>
            <p className="text-muted-foreground">
              Describe your business and get the best widget combinations with quantified time + cost savings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[30%_1fr]">
            {/* Left: Business & Metrics form */}
            <div className="sticky top-20">
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold tracking-tight">Business & Metrics</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your business details and metrics to get widget combinations with time + cost savings.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Full-width: name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Business name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. StellarPayouts, Acme RWA Fund"
                      className="h-10 bg-background"
                    />
                  </div>

                  {/* Full-width: description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Business description <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      placeholder="What do you do, who are your customers, what do you want to monitor/optimize?"
                      rows={3}
                      className={cn(
                        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "min-h-[80px] resize-y"
                      )}
                    />
                  </div>

                  {/* Business type hint + presets in one block */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Business type hint</label>
                    <Input
                      value={businessTypeHint}
                      onChange={(e) => setBusinessTypeHint(e.target.value)}
                      placeholder="Pick a preset below, or type your own…"
                      className="h-10 bg-background"
                    />
                    <div>
                      <p className="mb-2 text-xs font-medium text-muted-foreground">Presets</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {BUSINESS_TYPE_PRESETS.map((label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setBusinessTypeHint(label)}
                            className={cn(
                              "rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors",
                              "hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
                              businessTypeHint === label && "border-primary/50 bg-primary/10 text-foreground"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setBusinessTypeHint("")}
                          className={cn(
                            "rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors",
                            "hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
                            !businessTypeHint && "border-primary/50 bg-primary/10 text-foreground"
                          )}
                          title="Custom"
                        >
                          Custom
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Two-column row: Geographies, Products */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Geographies (comma-separated)</label>
                      <Input
                        value={geographies}
                        onChange={(e) => setGeographies(e.target.value)}
                        placeholder="e.g. US, IN, PH"
                        className="h-10 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Products (comma-separated)</label>
                      <Input
                        value={products}
                        onChange={(e) => setProducts(e.target.value)}
                        placeholder="e.g. cross-border payouts, cards"
                        className="h-10 bg-background"
                      />
                    </div>
                  </div>

                  {/* Two-column row: Monthly txn, Avg value */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Monthly transactions</label>
                      <Input
                        value={monthlyTransactions}
                        onChange={(e) => setMonthlyTransactions(e.target.value)}
                        placeholder="e.g. 120000"
                        className="h-10 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Avg transaction value (USD)</label>
                      <Input
                        value={avgTxnValue}
                        onChange={(e) => setAvgTxnValue(e.target.value)}
                        placeholder="e.g. 120"
                        className="h-10 bg-background"
                      />
                    </div>
                  </div>

                  {/* Two-column row: Ops rate, Compliance rate */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Ops hourly rate (USD)</label>
                      <Input
                        value={opsRate}
                        onChange={(e) => setOpsRate(e.target.value)}
                        placeholder="e.g. 65"
                        className="h-10 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Compliance hourly rate (USD)</label>
                      <Input
                        value={complianceRate}
                        onChange={(e) => setComplianceRate(e.target.value)}
                        placeholder="e.g. 85"
                        className="h-10 bg-background"
                      />
                    </div>
                  </div>

                  {/* Full-width: Platform cost */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Platform cost (USD/month)</label>
                    <Input
                      value={platformCost}
                      onChange={(e) => setPlatformCost(e.target.value)}
                      placeholder="e.g. 2500"
                      className="h-10 bg-background"
                    />
                  </div>

                  {/* Full-width: Constraints */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Constraints</label>
                    <Input
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      placeholder="e.g. OFAC screening required, budget-conscious"
                      className="h-10 bg-background"
                    />
                  </div>
                </div>

                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

                <div className="mt-6 flex justify-end border-t border-border pt-5">
                  <Button onClick={handleSubmit} disabled={loading} size="default">
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Building…
                      </>
                    ) : (
                      <>
                        <Wrench className="size-4" />
                        Build widget combinations
                      </>
                    )}
                  </Button>
                </div>
              </section>
            </div>

            {/* Right: Results */}
            <div className="space-y-4">
              {!loading && !response && (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Wrench className="size-16 text-muted-foreground/50" />
                    <p className="mt-4 max-w-sm text-center text-muted-foreground">
                      Fill in Business & Metrics and click Build widget combinations to see recommendations here.
                    </p>
                    <p className="mt-2 text-center text-sm text-muted-foreground/80">
                      You&apos;ll get a business profile, widget bundles (Lean, Balanced, Comprehensive), and time +
                      cost savings.
                    </p>
                  </CardContent>
                </Card>
              )}

              {loading && (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                      <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                      <span className="size-2 animate-bounce rounded-full bg-primary" />
                    </div>
                    <p className="mt-4 text-muted-foreground">Generating widget combinations…</p>
                  </CardContent>
                </Card>
              )}

              {response && !loading && (
                <>
                  <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-lg">Business profile</CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary">{response.source === "openai" ? "AI" : "Heuristic"}</Badge>
                          <Badge variant="secondary">
                            Confidence {Math.round((response.business_profile.confidence ?? 0) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {response.business_profile.rationale}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(response.business_profile.inferred_categories ?? []).map((c) => (
                          <Badge key={c} variant="outline">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {response.bundles.map((bundle) => (
                    <Card key={bundle.id} className="border-border bg-card">
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg">{bundle.name}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">{bundle.description}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="default" className="bg-emerald-600/80">
                              {formatHours(bundle.totals.time_saved_hours_per_month)}
                            </Badge>
                            <Badge variant="default" className="bg-emerald-600/80">
                              {formatUsd(bundle.totals.cost_savings_usd_per_month)}/mo
                            </Badge>
                            {bundle.totals.roi_percent != null && (
                              <Badge variant="secondary">ROI {bundle.totals.roi_percent}%</Badge>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                saveTemplate({
                                  name: `${businessName.trim() || "Dashboard"} · ${bundle.name}`,
                                  businessName: businessName.trim() || undefined,
                                  bundleId: bundle.id,
                                  bundleName: bundle.name,
                                  description: bundle.description,
                                  widgets: widgetsFromBundle(bundle),
                                });
                                toast.success("Saved to My Templates");
                                router.push("/dashboard/documents");
                              }}
                            >
                              <Save className="mr-1.5 h-3.5 w-3.5" />
                              Save to My Templates
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {bundle.widgets.map((w) => (
                          <div
                            key={w.id}
                            className="rounded-lg border border-border bg-muted/30 p-3 space-y-1"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium">{w.title}</p>
                              <div className="flex flex-wrap gap-1.5">
                                <Badge variant="outline" className="text-xs">
                                  {w.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {w.type}
                                </Badge>
                                <Badge variant="default" className="bg-emerald-600/80 text-xs">
                                  {formatHours(w.impact.time_saved_hours_per_month)}
                                </Badge>
                                <Badge variant="default" className="bg-emerald-600/80 text-xs">
                                  {formatUsd(w.impact.cost_savings_usd_per_month)}/mo
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{w.why}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </DashboardMain>
    </>
  );
}
