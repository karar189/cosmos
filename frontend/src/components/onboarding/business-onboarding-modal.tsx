"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Wrench, Loader2, Save, Clock, TrendingUp, Check, ChevronsUpDown, X } from "lucide-react";
import { toast } from "sonner";
import { saveTemplate, widgetsFromBundle } from "@/lib/my-templates-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { setOnboardingCompleted } from "./onboarding-modal";
import { persistTierFromOnboarding } from "@/lib/workspace-tier-context";
import { cn } from "@/utils";

// ── Types ────────────────────────────────────────────────────────────────────

type WidgetCategory = "remittance" | "fintech" | "bank" | "stablecoin" | "ngo" | "rwa" | "custom";

interface WidgetDef {
  id: string;
  title: string;
  category: WidgetCategory;
  type: "chart" | "metric" | "table" | "alert";
  why: string;
  impact: { time_saved_hours_per_month: number; cost_savings_usd_per_month: number };
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  widgets: WidgetDef[];
  totals: { time_saved_hours_per_month: number; cost_savings_usd_per_month: number; roi_percent: number | null };
}

interface RecommendationsResult {
  business_profile: { inferred_categories: WidgetCategory[]; confidence: number; rationale: string };
  bundles: Bundle[];
}

// ── Product tiers (fixed offerings; category inference is separate) ───────────

const PRESET_CATEGORY_MAP: Record<string, WidgetCategory[]> = {
  "Agency": ["custom"],
  "Remittance company": ["remittance", "fintech"],
  "Fintech payments": ["fintech", "remittance"],
  "Bank / Neobank": ["bank", "fintech"],
  "Stablecoin issuer": ["stablecoin", "bank"],
  "NGO": ["ngo", "custom"],
  "RWA platform": ["rwa", "bank"],
  "Custom": ["custom"],
};

const BUSINESS_TYPE_PRESETS = Object.keys(PRESET_CATEGORY_MAP);

const GEO_OPTIONS = [
  "Global", "US", "EU", "UK", "IN", "PH", "NG", "KE", "MX", "BR",
  "SG", "AE", "ZA", "ID", "PK", "BD", "GH", "TZ", "VN", "TH",
  "CO", "AR", "PL", "DE", "FR", "NL", "CA", "AU", "JP", "KR",
];

// ── Heuristic engine ──────────────────────────────────────────────────────────

function detectCategories(hint: string, description: string): WidgetCategory[] {
  const text = `${hint} ${description}`.toLowerCase();
  const cats: WidgetCategory[] = [];

  if (PRESET_CATEGORY_MAP[hint]) return PRESET_CATEGORY_MAP[hint];

  if (text.includes("remit") || text.includes("corridor") || text.includes("cross-border")) cats.push("remittance");
  if (text.includes("fintech") || text.includes("payment") || text.includes("fraud")) cats.push("fintech");
  if (text.includes("bank") || text.includes("neobank") || text.includes("liquidity")) cats.push("bank");
  if (text.includes("stablecoin") || text.includes("stable") || text.includes("peg") || text.includes("reserve")) cats.push("stablecoin");
  if (text.includes("ngo") || text.includes("grant") || text.includes("donor") || text.includes("nonprofit")) cats.push("ngo");
  if (text.includes("rwa") || text.includes("tokeniz") || text.includes("asset")) cats.push("rwa");

  return cats.length > 0 ? cats : ["custom"];
}

function tierLineToWidget(tierIndex: number, lineIndex: number, title: string): WidgetDef {
  return {
    id: `tier-${tierIndex + 1}-item-${lineIndex}`,
    title,
    category: "custom",
    type: "table",
    why: "Workspace-ready: connect APIs and policies from the dashboard.",
    impact: {
      time_saved_hours_per_month: 10 + lineIndex * 3 + tierIndex * 4,
      cost_savings_usd_per_month: 480 + lineIndex * 200 + tierIndex * 240,
    },
  };
}

function buildTierBundles(opsRate: number, _complianceRate: number): Bundle[] {
  const tierDefs = [
    {
      id: "tier-1",
      name: "Tier 1",
      description:
        "Foundation: payments infrastructure on Stellar, employee management, and compliance analysis.",
      lines: [
        "Stripe-class payments on Stellar",
        "Employee management",
        "Compliance Analyser",
      ],
    },
    {
      id: "tier-2",
      name: "Tier 2",
      description:
        "Adds opt-in privacy payments, compliance execution, and RNS (Regulation News Sniper).",
      lines: [
        "Payments + opt-in privacy",
        "Employee management",
        "Compliance Analyser & execution",
        "RNS (Regulation News Sniper)",
      ],
    },
    {
      id: "tier-3",
      name: "Tier 3",
      description:
        "Full stack: everything in Tier 2 plus escrow-based project management.",
      lines: [
        "Payments + opt-in privacy",
        "Employee management",
        "Compliance Analyser & execution",
        "RNS (Regulation News Sniper)",
        "Escrow-based project management",
      ],
    },
  ];

  const computeTotals = (widgets: WidgetDef[]): Bundle["totals"] => {
    const time = widgets.reduce((s, w) => s + w.impact.time_saved_hours_per_month, 0);
    const cost = widgets.reduce((s, w) => s + w.impact.cost_savings_usd_per_month, 0);
    return {
      time_saved_hours_per_month: time,
      cost_savings_usd_per_month: cost,
      roi_percent: Math.round(cost / Math.max(opsRate * time, 1) * 100),
    };
  };

  return tierDefs.map((def, tierIndex) => {
    const widgets = def.lines.map((title, lineIndex) =>
      tierLineToWidget(tierIndex, lineIndex, title)
    );
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      widgets,
      totals: computeTotals(widgets),
    };
  });
}

function generateRecommendations(
  hint: string,
  description: string,
  opsRate: number,
  complianceRate: number
): RecommendationsResult {
  const categories = detectCategories(hint, description);
  const bundles = buildTierBundles(opsRate, complianceRate);
  const confidence = hint && PRESET_CATEGORY_MAP[hint] ? 0.92 : description.length > 60 ? 0.75 : 0.55;
  return {
    business_profile: {
      inferred_categories: categories,
      confidence,
      rationale: `Based on your inputs, we inferred ${categories.join(" + ")} as a fit. Compare Tier 1–3 below and choose the stack that matches how you operate.`,
    },
    bundles,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatUsd(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function formatHours(n: number) { return `${Math.round(n * 10) / 10}h/mo`; }

const inputCls = "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-blue-500/50 focus:ring-0 h-9 text-sm";
const labelCls = "text-xs font-medium text-white/55";

function parseUsdVolume(raw: string): number | null {
  const n = parseFloat(raw.replace(/,/g, "").replace(/^\s+|\s+$/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function filterUsdInput(raw: string): string {
  return raw.replace(/[^\d.,]/g, "");
}

export type BusinessOnboardingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string | null;
};

export function BusinessOnboardingModal({
  open,
  onOpenChange,
  walletAddress,
}: BusinessOnboardingModalProps) {
  const router = useRouter();
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open || !walletAddress) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, walletAddress]);

  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessTypeHint, setBusinessTypeHint] = useState("");
  const [geographies, setGeographies] = useState<string[]>([]);
  const [geoOpen, setGeoOpen] = useState(false);
  const [products, setProducts] = useState<string[]>([]);
  const [productInput, setProductInput] = useState("");
  const [monthlyTransactions, setMonthlyTransactions] = useState("");
  const [monthlyOutbound, setMonthlyOutbound] = useState("");
  const [opsRate, setOpsRate] = useState("65");
  const [complianceRate, setComplianceRate] = useState("85");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<RecommendationsResult | null>(null);

  const handleSubmit = async () => {
    setError("");
    if (!businessName.trim()) { setError("Business name is required."); return; }
    if (businessDescription.trim().length < 20) { setError("Add a description of at least 20 characters."); return; }
    if (monthlyTransactions.trim()) {
      const v = parseUsdVolume(monthlyTransactions);
      if (v === null) { setError("Monthly inbound volume must be a number (e.g. 500000 or 500,000)."); return; }
    }
    if (monthlyOutbound.trim()) {
      const v = parseUsdVolume(monthlyOutbound);
      if (v === null) { setError("Monthly outbound volume must be a number (e.g. 300000 or 300,000)."); return; }
    }
    setLoading(true);
    // Simulate a brief thinking delay for UX
    await new Promise((r) => setTimeout(r, 900));
    const result = generateRecommendations(
      businessTypeHint,
      businessDescription,
      parseFloat(opsRate) || 65,
      parseFloat(complianceRate) || 85
    );
    setResponse(result);
    setLoading(false);
  };

  const saveBusinessProfile = useCallback(
    async (bundle: Bundle) => {
      if (!walletAddress || walletAddress.length !== 56 || !walletAddress.startsWith("G")) {
        throw new Error("Connect a valid Stellar wallet before saving onboarding.");
      }
      const selectedWidgets = bundle.widgets.map((w) => String(w.id));
      const complianceForm = {
        businessDescription: businessDescription.trim(),
        businessTypeHint: businessTypeHint.trim(),
        geographies,
        products,
        monthlyInboundUsd: monthlyTransactions.trim() || null,
        monthlyOutboundUsd: monthlyOutbound.trim() || null,
        opsRate: parseFloat(opsRate) || 65,
        complianceRate: parseFloat(complianceRate) || 85,
        constraints: constraints.trim() || null,
        selectedTier: {
          id: bundle.id,
          name: bundle.name,
        },
      };

      const res = await fetch("/api/business/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: walletAddress.trim(),
          name: businessName.trim(),
          businessNature: businessTypeHint.trim() || null,
          selectedWidgets,
          complianceForm,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : `Failed to save onboarding profile (${res.status})`
        );
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("profile-updated"));
      }
    },
    [
      walletAddress,
      businessDescription,
      businessTypeHint,
      geographies,
      products,
      monthlyTransactions,
      monthlyOutbound,
      opsRate,
      complianceRate,
      constraints,
      businessName,
    ]
  );

  if (!open || !walletAddress) {
    return null;
  }

  if (!portalReady) {
    return null;
  }

  return createPortal(
      <div
        className="fixed inset-0 z-[200] bg-slate-950/50 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        onClick={() => onOpenChange(false)}
      >
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-center p-4 md:p-6">
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-900/35 via-black/50 to-black/60 p-5 shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-2xl backdrop-saturate-150 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.08)] md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Page heading */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0 pr-2">
                <h1 id="onboarding-title" className="text-2xl font-semibold tracking-tight text-white">
                  Business Onboarding
                </h1>
                <p className="mt-1 text-sm text-amber-200/50">
                  Help us know you and your customers better.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="shrink-0 rounded-lg border border-white/20 bg-white/[0.08] p-2 text-amber-200/80 backdrop-blur-sm transition-colors hover:bg-white/[0.14] hover:text-amber-100"
                aria-label="Close onboarding"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start">

          {/* ── Left: form ── */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md md:p-6 flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-xs font-semibold text-amber-300 ring-1 ring-amber-400/25">
                  1
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">Business & metrics</p>
                  <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                    {response
                      ? "Update anything below, then regenerate or pick a tier on the right."
                      : "Tell us about your business first. Your tier options appear in step 2 after you generate."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Business name <span className="text-red-400">*</span></label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. StellarPayouts, Acme RWA Fund" className={inputCls} />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Business description <span className="text-red-400">*</span></label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="What do you do, who are your customers, what do you want to monitor/optimize?"
                    rows={3}
                    className="w-full rounded-md bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none min-h-[72px] resize-y"
                  />
                </div>

                {/* Business type — dropdown */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Business type</label>
                  <Select value={businessTypeHint} onValueChange={setBusinessTypeHint}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white h-9 text-sm focus:ring-0 focus:border-blue-500/50 data-[placeholder]:text-white/20">
                      <SelectValue placeholder="Select your business type…" />
                    </SelectTrigger>
                    <SelectContent className="z-[250] border border-white/20 bg-slate-900/70 text-white shadow-xl backdrop-blur-xl">
                      {BUSINESS_TYPE_PRESETS.map((label) => (
                        <SelectItem key={label} value={label} className="text-sm text-white/80 focus:bg-white/[0.1] focus:text-amber-100 cursor-pointer">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Geographies multi-select + Services */}
                <div className="flex flex-col gap-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Geographies</label>
                    <Popover open={geoOpen} onOpenChange={setGeoOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-md bg-white/[0.04] border border-white/[0.08] px-3 h-9 text-sm text-left transition-colors hover:border-blue-500/30 focus:outline-none focus:border-blue-500/50"
                        >
                          <span className={geographies.length === 0 ? "text-white/20" : "text-white"}>
                            {geographies.length === 0 ? "Select…" : geographies.length === 1 ? geographies[0] : `${geographies.length} selected`}
                          </span>
                          <ChevronsUpDown className="h-3.5 w-3.5 text-white/30 shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="z-[250] w-56 border border-white/20 bg-slate-900/70 p-0 shadow-xl backdrop-blur-xl" align="start">
                        <Command className="bg-transparent">
                          <CommandInput placeholder="Search…" className="text-white text-sm border-b border-white/[0.08] h-8" />
                          <CommandList className="max-h-48">
                            <CommandGroup>
                              {GEO_OPTIONS.map((geo) => {
                                const selected = geographies.includes(geo);
                                return (
                                  <CommandItem
                                    key={geo}
                                    value={geo}
                                    onSelect={() => {
                                      setGeographies((prev) =>
                                        prev.includes(geo) ? prev.filter((g) => g !== geo) : [...prev, geo]
                                      );
                                    }}
                                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer aria-selected:bg-white/[0.06]"
                                  >
                                    <div className={cn("flex h-4 w-4 items-center justify-center rounded border", selected ? "border-amber-400/60 bg-white/[0.12]" : "border-white/20")}>
                                      {selected && <Check className="h-3 w-3 text-amber-300" />}
                                    </div>
                                    {geo}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        {geographies.length > 0 && (
                          <div className="border-t border-white/[0.08] px-2 py-1.5 flex flex-wrap gap-1">
                            {geographies.map((g) => (
                              <span key={g} className="inline-flex items-center gap-1 rounded-full bg-white/[0.1] border border-amber-400/25 text-amber-200/90 px-2 py-0.5 text-[10px]">
                                {g}
                                <button type="button" onClick={() => setGeographies((p) => p.filter((x) => x !== g))}>
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Services offered — press Enter to add</label>
                    <Input
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = productInput.trim();
                          if (val && !products.includes(val)) {
                            setProducts((p) => [...p, val]);
                          }
                          setProductInput("");
                        }
                      }}
                      placeholder="e.g. payments, cards, loans…"
                      className={inputCls}
                    />
                    {products.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {products.map((p) => (
                          <span key={p} className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/70 px-2.5 py-0.5 text-[11px]">
                            {p}
                            <button type="button" onClick={() => setProducts((prev) => prev.filter((x) => x !== p))}>
                              <X className="h-2.5 w-2.5 text-white/40 hover:text-white/80" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Volume */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Monthly inbound volume (USD)</label>
                    <Input
                      inputMode="decimal"
                      autoComplete="off"
                      value={monthlyTransactions}
                      onChange={(e) => setMonthlyTransactions(filterUsdInput(e.target.value))}
                      placeholder="e.g. 500000"
                      className={inputCls}
                    />
                    <p className="text-[11px] text-white/30">Optional. Numbers only.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Monthly outbound volume (USD)</label>
                    <Input
                      inputMode="decimal"
                      autoComplete="off"
                      value={monthlyOutbound}
                      onChange={(e) => setMonthlyOutbound(filterUsdInput(e.target.value))}
                      placeholder="e.g. 300000"
                      className={inputCls}
                    />
                    <p className="text-[11px] text-white/30">Optional. Numbers only.</p>
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Is there anything else you want us to know?</label>
                  <textarea
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="e.g. OFAC screening required, budget-conscious, specific compliance needs…"
                    rows={3}
                    className="w-full rounded-md bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none min-h-[72px] resize-y"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="border-t border-white/[0.06] pt-5">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  variant={response ? "outline" : "primary"}
                  className={cn(
                    "w-full h-10 text-sm font-medium",
                    response
                      ? "border-amber-400/25 bg-transparent text-amber-100/90 hover:bg-amber-400/10 hover:text-amber-50"
                      : "border-0 bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_8px_28px_-10px_rgba(234,179,8,0.2)]"
                  )}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Generating…</>
                  ) : response ? (
                    <><Wrench className="h-4 w-4 mr-1.5 opacity-80" /> Regenerate tier options</>
                  ) : (
                    <><Wrench className="h-4 w-4 mr-1.5" /> Build widget combinations</>
                  )}
                </Button>
                {response && (
                  <p className="mt-2 text-center text-[11px] text-amber-200/35">
                    Primary action: choose a tier on the right.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: results ── */}
          <div className="flex flex-col gap-4">
            {!loading && !response && (
              <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.04] flex flex-col items-center justify-center py-16 backdrop-blur-sm md:py-20 text-center px-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-200/45">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/35 bg-white/[0.08] text-amber-200/90 backdrop-blur-sm">
                    2
                  </span>
                  <span>Choose a tier</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] mb-4 backdrop-blur-sm">
                  <Wrench className="h-6 w-6 text-amber-400/35" />
                </div>
                <p className="text-sm text-white/45 max-w-sm leading-relaxed">
                  Complete step <span className="text-amber-200/90 font-medium">1</span> on the left, then use{" "}
                  <span className="text-amber-200/90 font-medium">Build widget combinations</span>. Tier cards and savings estimates will show here.
                </p>
                <p className="text-xs text-white/25 mt-3 max-w-xs leading-relaxed">
                  Nothing to select here yet — tier cards and save actions appear after you generate options.
                </p>
              </div>
            )}

            {loading && (
              <div className="rounded-xl border border-white/15 bg-white/[0.05] flex flex-col items-center justify-center py-20 backdrop-blur-md">
                <div className="flex gap-1.5 mb-4">
                  <span className="size-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                  <span className="size-2 animate-bounce rounded-full bg-amber-400 [animation-delay:-0.15s]" />
                  <span className="size-2 animate-bounce rounded-full bg-zinc-400" />
                </div>
                <p className="text-sm text-white/40">Generating widget combinations…</p>
              </div>
            )}

            {response && !loading && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-xs font-semibold text-amber-300 ring-1 ring-amber-400/25">
                    2
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">Pick a product tier</p>
                    <p className="text-xs text-white/40 mt-0.5">Compare scope and impact, then save one layout to your workspace.</p>
                  </div>
                </div>

                {/* Business profile pill row */}
                <div className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2.5 flex flex-wrap items-center gap-2 backdrop-blur-md">
                  <span className="text-xs text-amber-200/55">Inferred categories</span>
                  {response.business_profile.inferred_categories.map((c) => (
                    <span key={c} className="rounded-full border border-white/20 bg-white/[0.08] text-white/90 px-2.5 py-0.5 text-xs font-medium capitalize">
                      {c}
                    </span>
                  ))}
                  <span className="ml-auto text-xs text-zinc-950 tabular-nums rounded-md bg-amber-300/90 px-2 py-1 font-medium border border-amber-200/50">
                    {Math.round(response.business_profile.confidence * 100)}% confidence
                  </span>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-stretch">
                  {response.bundles.map((bundle, bi) => {
                    const isRecommended = bi === 1;
                    return (
                      <div
                        key={bundle.id}
                        className={cn(
                          "relative flex flex-col rounded-2xl border overflow-hidden transition-all",
                          isRecommended
                            ? "border-amber-400/35 bg-white/[0.07] shadow-[0_0_48px_-12px_rgba(0,0,0,0.65),0_0_28px_-10px_rgba(251,191,36,0.16)] backdrop-blur-md"
                            : "border-zinc-800/70 bg-zinc-950/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm"
                        )}
                      >
                        {/* Recommended ribbon — amber highlight */}
                        {isRecommended && (
                          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                        )}

                        {/* Card header */}
                        <div className={cn("px-5 pt-6 pb-5", isRecommended ? "border-b border-amber-400/20" : "border-b border-zinc-800/60")}>
                          {isRecommended && (
                            <span className="inline-block mb-3 text-[10px] rounded-full bg-amber-400/15 border border-amber-300/40 text-amber-200 px-2.5 py-0.5 font-semibold tracking-wide uppercase">
                              Recommended
                            </span>
                          )}
                          <p className={cn("text-base font-semibold", isRecommended ? "text-white" : "text-white/80")}>{bundle.name}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/50">{bundle.description}</p>

                          {/* Savings summary */}
                          <div className="mt-4 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-white/40 flex items-center gap-1"><Clock className="h-3 w-3" /> Time saved</span>
                              <span className="text-[11px] font-medium text-amber-300">{formatHours(bundle.totals.time_saved_hours_per_month)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-white/40 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Cost savings</span>
                              <span className="text-[11px] font-medium text-amber-300">{formatUsd(bundle.totals.cost_savings_usd_per_month)}/mo</span>
                            </div>
                          </div>
                        </div>

                        {/* Feature list: title + explainer */}
                        <div className="flex flex-1 flex-col gap-3.5 px-4 py-5">
                          {bundle.widgets.map((w) => (
                            <div key={w.id} className="flex gap-3">
                              <div
                                className={cn(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                                  isRecommended ? "bg-zinc-600/40 ring-1 ring-amber-400/25" : "bg-zinc-800/80 ring-1 ring-zinc-700/50"
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    isRecommended ? "bg-amber-400" : "bg-zinc-500"
                                  )}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium leading-snug text-white/90 break-words">
                                  {w.title}
                                </p>
                                {w.why ? (
                                  <p className="mt-1 text-xs leading-relaxed text-white/45">{w.why}</p>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* CTA — recommended: solid primary; others: outline */}
                        <div className="px-5 pb-5 pt-0">
                          <Button
                            onClick={async () => {
                              try {
                                await saveBusinessProfile(bundle);
                              } catch (e) {
                                toast.error(e instanceof Error ? e.message : "Could not save onboarding profile");
                                return;
                              }
                              setOnboardingCompleted(undefined, walletAddress ?? undefined);
                              saveTemplate({
                                name: `${businessName.trim() || "Dashboard"} · ${bundle.name}`,
                                businessName: businessName.trim() || undefined,
                                bundleId: bundle.id,
                                bundleName: bundle.name,
                                description: bundle.description,
                                widgets: widgetsFromBundle(bundle),
                              });
                              persistTierFromOnboarding({
                                bundleId: bundle.id,
                                businessName: businessName.trim(),
                                bundleName: bundle.name,
                              });
                              toast.success("Saved to My Templates");
                              onOpenChange(false);
                              router.push("/dashboard/documents");
                            }}
                            variant={isRecommended ? "primary" : "outline"}
                            className={cn(
                              "w-full h-10 text-sm font-medium",
                              isRecommended
                                ? "border-0 bg-blue-600 text-white hover:bg-blue-500 shadow-[0_4px_28px_-6px_rgba(0,0,0,0.45),0_2px_12px_-4px_rgba(251,191,36,0.22)]"
                                : "border-zinc-700/60 bg-zinc-900/50 text-amber-100/80 backdrop-blur-sm hover:border-zinc-600/70 hover:bg-zinc-800/50 hover:text-amber-50"
                            )}
                          >
                            <Save className="h-3.5 w-3.5 mr-1.5" /> Use this tier
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
}
