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
import MagicCard from "@/components/ui/magic-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorldGeoPicker } from "@/components/compliance/world-geo-picker";

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
  const [geographies, setGeographies] = useState<string[]>([]);
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
      geographies,
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
      <DashboardMain fluid className="px-0 md:px-2 lg:px-4">
        <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col gap-6 px-2 pb-10 pt-4 md:px-3 lg:px-4 bg-background">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-4 md:flex-row md:items-center">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Compliance Maker</h1>
                <p className="max-w-2xl text-sm text-slate-400">
                  Describe your business, light up your operating geographies on the globe, and get widget
                  bundles with quantified time + cost savings.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-slate-800/80 bg-slate-900/70 px-4 py-2 text-xs text-slate-300 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                  <span className="font-medium">Live cost model</span>
                </div>
                <span className="h-4 w-px bg-slate-700" />
                <span className="text-slate-400">No scrolling, everything in one control surface.</span>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              {/* Left: Business, map, metrics */}
              <div className="flex flex-col gap-4">
                <MagicCard className="h-full max-w-none border-slate-800/80 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90">
                  <div className="flex h-full flex-col gap-4">
                    {/* Business profile */}
                    <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            Business profile
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Core info used to infer risk and complexity.
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-1 text-[10px] font-medium text-sky-300">
                          <UserPlus className="h-3 w-3" />
                          <span>Onboarding</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-200">
                              Business name <span className="text-red-400">*</span>
                            </label>
                            <Input
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="e.g. StellarPayouts, Acme RWA Fund"
                              className="h-9 max-w-full border-slate-800/80 bg-slate-900/80 text-sm placeholder:text-slate-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-200">Business type</label>
                            <Select
                              value={businessTypeHint || ""}
                              onValueChange={(val) => setBusinessTypeHint(val)}
                            >
                              <SelectTrigger
                                className="h-9 max-w-full border border-sky-500/40 bg-slate-900/40 text-xs text-slate-100 shadow-[0_0_0_1px_rgba(8,47,73,0.6)] backdrop-blur-md hover:border-sky-400/60 hover:bg-slate-900/60"
                              >
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                              <SelectContent className="border border-sky-500/40 bg-slate-950/90 text-xs text-slate-50 backdrop-blur-xl">
                                {BUSINESS_TYPE_PRESETS.map((label) => (
                                  <SelectItem key={label} value={label}>
                                    {label}
                                  </SelectItem>
                                ))}
                                <SelectItem value="Custom">Custom / Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">
                            Business description <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            value={businessDescription}
                            onChange={(e) => setBusinessDescription(e.target.value)}
                            placeholder="What do you do, who are your customers, what do you want to monitor/optimize?"
                            rows={3}
                            className={cn(
                              "w-full rounded-md border border-slate-800/80 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 ring-offset-background",
                              "placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500",
                              "min-h-[72px] resize-none"
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Globe-based geographies */}
                    <WorldGeoPicker value={geographies} onChange={setGeographies} />

                    {/* Products & volumes */}
                    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                          Products & volumes
                        </p>
                        <Badge variant="outline" className="border-sky-500/50 bg-sky-500/10 text-[10px]">
                          Demand model
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">
                            Products (comma-separated)
                          </label>
                          <Input
                            value={products}
                            onChange={(e) => setProducts(e.target.value)}
                            placeholder="e.g. cross-border payouts, cards"
                            className="h-9 border-slate-800/80 bg-slate-900/80 text-xs placeholder:text-slate-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">Monthly transactions</label>
                          <Input
                            value={monthlyTransactions}
                            onChange={(e) => setMonthlyTransactions(e.target.value)}
                            placeholder="e.g. 120000"
                            className="h-9 border-slate-800/80 bg-slate-900/80 text-xs placeholder:text-slate-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">
                            Avg transaction value (USD)
                          </label>
                          <Input
                            value={avgTxnValue}
                            onChange={(e) => setAvgTxnValue(e.target.value)}
                            placeholder="e.g. 120"
                            className="h-9 border-slate-800/80 bg-slate-900/80 text-xs placeholder:text-slate-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">Platform cost (USD/month)</label>
                          <Input
                            value={platformCost}
                            onChange={(e) => setPlatformCost(e.target.value)}
                            placeholder="e.g. 2500"
                            className="h-9 border-slate-800/80 bg-slate-900/80 text-xs placeholder:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hourly rates */}
                    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                          Hourly rates
                        </p>
                        <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-[10px]">
                          Cost inputs
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">Ops hourly rate (USD)</label>
                          <Input
                            value={opsRate}
                            onChange={(e) => setOpsRate(e.target.value)}
                            placeholder="e.g. 65"
                            className="h-9 border-slate-800/80 bg-slate-900/80 text-xs placeholder:text-slate-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">
                            Compliance hourly rate (USD)
                          </label>
                          <Input
                            value={complianceRate}
                            onChange={(e) => setComplianceRate(e.target.value)}
                            placeholder="e.g. 85"
                            className="h-9 border-slate-800/80 bg-slate-900/80 text-xs placeholder:text-slate-500"
                          />
                        </div>
                        <div className="col-span-full space-y-1.5">
                          <label className="text-xs font-medium text-slate-200">Constraints</label>
                          <Input
                            value={constraints}
                            onChange={(e) => setConstraints(e.target.value)}
                            placeholder="e.g. OFAC screening required, budget-conscious"
                            className="h-9 border-slate-800/80 bg-slate-900/80 text-xs placeholder:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>

                    {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

                    <div className="mt-2 flex items-center justify-end gap-3">
                      <p className="hidden text-[11px] text-slate-500 md:inline">
                        Change any parameter and hit{" "}
                        <span className="font-medium text-slate-300">Build widget combinations</span> to
                        refresh.
                      </p>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        size="sm"
                        className="gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/90 px-5 text-xs font-semibold shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:bg-emerald-500"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            Building…
                          </>
                        ) : (
                          <>
                            <Wrench className="size-3.5" />
                            Build widget combinations
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </MagicCard>
              </div>

              {/* Right: Results */}
              <div className="flex flex-col gap-4">
              {!loading && !response && (
                <Card className="border-slate-800/80 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
                  <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-900/90">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/20 via-transparent to-emerald-400/30 blur-md" />
                      <Wrench className="relative z-10 size-9 text-slate-100" />
                    </div>
                    <p className="mt-2 max-w-sm text-center text-sm text-slate-300">
                      Fill in the business surface on the left and hit{" "}
                      <span className="font-medium text-slate-50">Build widget combinations</span> to see
                      tailored dashboards here.
                    </p>
                    <p className="text-center text-xs text-slate-500">
                      You&apos;ll get a business profile, widget bundles (Lean, Balanced, Comprehensive) and
                      quantified time &amp; cost savings.
                    </p>
                  </CardContent>
                </Card>
              )}

              {loading && (
                <Card className="border-slate-800/80 bg-slate-950/90">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="flex gap-1.5">
                      <span className="size-2.5 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.3s]" />
                      <span className="size-2.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
                      <span className="size-2.5 animate-bounce rounded-full bg-sky-400" />
                    </div>
                    <p className="mt-4 text-sm text-slate-300">
                      Generating widget combinations from Cosmos AI…
                    </p>
                  </CardContent>
                </Card>
              )}

              {response && !loading && (
                <>
                  <Card className="border-slate-800/80 bg-slate-950/95 backdrop-blur">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-lg text-slate-50">Business profile</CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="border-sky-500/60 bg-sky-500/15 text-[11px]">
                            {response.source === "openai" ? "AI engine" : "Heuristic engine"}
                          </Badge>
                          <Badge variant="secondary" className="border-emerald-500/60 bg-emerald-500/10 text-[11px]">
                            Confidence {Math.round((response.business_profile.confidence ?? 0) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm leading-relaxed text-slate-300">
                        {response.business_profile.rationale}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(response.business_profile.inferred_categories ?? []).map((c) => (
                          <Badge key={c} variant="outline" className="border-slate-700 bg-slate-900/80 text-[11px]">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {response.bundles.map((bundle) => (
                  <Card
                    key={bundle.id}
                    className="border-slate-800/80 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95"
                  >
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg text-slate-50">{bundle.name}</CardTitle>
                            <p className="mt-1 text-sm text-slate-400">{bundle.description}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="default" className="bg-emerald-500/90">
                              {formatHours(bundle.totals.time_saved_hours_per_month)}
                            </Badge>
                            <Badge variant="default" className="bg-emerald-500/90">
                              {formatUsd(bundle.totals.cost_savings_usd_per_month)}/mo
                            </Badge>
                            {bundle.totals.roi_percent != null && (
                              <Badge variant="secondary" className="border-sky-500/50 bg-sky-500/10">
                                ROI {bundle.totals.roi_percent}%
                              </Badge>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="gap-1.5 rounded-full border border-slate-700 bg-slate-900/90 text-xs"
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
                            className="space-y-1 rounded-lg border border-slate-800/80 bg-slate-900/80 p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-100">{w.title}</p>
                              <div className="flex flex-wrap gap-1.5">
                                <Badge variant="outline" className="border-slate-700 bg-slate-900/70 text-[11px]">
                                  {w.category}
                                </Badge>
                                <Badge variant="outline" className="border-slate-700 bg-slate-900/70 text-[11px]">
                                  {w.type}
                                </Badge>
                                <Badge variant="default" className="bg-emerald-500/90 text-[11px]">
                                  {formatHours(w.impact.time_saved_hours_per_month)}
                                </Badge>
                                <Badge variant="default" className="bg-emerald-500/90 text-[11px]">
                                  {formatUsd(w.impact.cost_savings_usd_per_month)}/mo
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-300">{w.why}</p>
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
