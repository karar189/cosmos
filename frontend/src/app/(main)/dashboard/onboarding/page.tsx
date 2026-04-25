"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Loader2, Save, Clock, TrendingUp, Check, ChevronsUpDown, X } from "lucide-react";
import { toast } from "sonner";
import { saveTemplate, widgetsFromBundle } from "@/lib/my-templates-storage";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useFreighter } from "@/hooks/useFreighter";
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

// ── Widget library ────────────────────────────────────────────────────────────

const WIDGET_LIBRARY: Record<WidgetCategory, WidgetDef[]> = {
  remittance: [
    { id: "r1", title: "Cross-border Payment Monitor", category: "remittance", type: "chart", why: "Tracks real-time settlement status across corridors so ops teams catch failures before clients escalate.", impact: { time_saved_hours_per_month: 12, cost_savings_usd_per_month: 780 } },
    { id: "r2", title: "Forex Rate Alerts", category: "remittance", type: "alert", why: "Automatic alerts when corridor rates deviate beyond threshold reduce manual monitoring overhead.", impact: { time_saved_hours_per_month: 8, cost_savings_usd_per_month: 520 } },
    { id: "r3", title: "KYC / AML Queue", category: "remittance", type: "table", why: "Centralises compliance review so no transaction sits unreviewed beyond SLA.", impact: { time_saved_hours_per_month: 20, cost_savings_usd_per_month: 1700 } },
    { id: "r4", title: "Corridor Volume Trends", category: "remittance", type: "chart", why: "Month-over-month corridor analysis surfaces underperforming routes early.", impact: { time_saved_hours_per_month: 5, cost_savings_usd_per_month: 325 } },
  ],
  fintech: [
    { id: "f1", title: "Payment Success Rate", category: "fintech", type: "metric", why: "Single-glance success/failure ratio highlights processor degradation instantly.", impact: { time_saved_hours_per_month: 10, cost_savings_usd_per_month: 650 } },
    { id: "f2", title: "Fraud Signal Dashboard", category: "fintech", type: "alert", why: "Aggregates risk signals into one view, halving time spent correlating multiple tools.", impact: { time_saved_hours_per_month: 18, cost_savings_usd_per_month: 1530 } },
    { id: "f3", title: "Chargeback Tracker", category: "fintech", type: "table", why: "Early chargeback visibility prevents ratio breaches with processors.", impact: { time_saved_hours_per_month: 7, cost_savings_usd_per_month: 455 } },
    { id: "f4", title: "Revenue Cohort Analysis", category: "fintech", type: "chart", why: "Cohort breakdown reduces reporting time by replacing ad-hoc SQL pulls.", impact: { time_saved_hours_per_month: 9, cost_savings_usd_per_month: 585 } },
  ],
  bank: [
    { id: "b1", title: "Portfolio Health Overview", category: "bank", type: "metric", why: "Aggregated exposure metrics replace multi-system logins for daily risk review.", impact: { time_saved_hours_per_month: 14, cost_savings_usd_per_month: 1190 } },
    { id: "b2", title: "Regulatory Compliance Calendar", category: "bank", type: "table", why: "Deadline tracking prevents last-minute filing rushes and associated penalties.", impact: { time_saved_hours_per_month: 11, cost_savings_usd_per_month: 935 } },
    { id: "b3", title: "Customer Onboarding Funnel", category: "bank", type: "chart", why: "Conversion tracking identifies drop-off points reducing CAC.", impact: { time_saved_hours_per_month: 6, cost_savings_usd_per_month: 510 } },
    { id: "b4", title: "Liquidity Stress Monitor", category: "bank", type: "alert", why: "Real-time alerts prevent LCR breaches that incur regulatory action.", impact: { time_saved_hours_per_month: 16, cost_savings_usd_per_month: 1360 } },
  ],
  stablecoin: [
    { id: "s1", title: "Reserve Ratio Tracker", category: "stablecoin", type: "metric", why: "Continuous reserve monitoring prevents peg deviation and loss of user trust.", impact: { time_saved_hours_per_month: 20, cost_savings_usd_per_month: 1700 } },
    { id: "s2", title: "On-chain Mint / Burn Activity", category: "stablecoin", type: "chart", why: "Supply visibility enables proactive treasury management.", impact: { time_saved_hours_per_month: 8, cost_savings_usd_per_month: 680 } },
    { id: "s3", title: "Liquidity Pool Monitor", category: "stablecoin", type: "alert", why: "Pool depth alerts prevent slippage events before they hit users.", impact: { time_saved_hours_per_month: 12, cost_savings_usd_per_month: 1020 } },
  ],
  ngo: [
    { id: "n1", title: "Fund Allocation Tracker", category: "ngo", type: "chart", why: "Donor-facing transparency reports generated automatically instead of monthly manual effort.", impact: { time_saved_hours_per_month: 15, cost_savings_usd_per_month: 975 } },
    { id: "n2", title: "Grant Compliance Dashboard", category: "ngo", type: "table", why: "Deadline and condition tracking prevents grant clawbacks.", impact: { time_saved_hours_per_month: 12, cost_savings_usd_per_month: 780 } },
    { id: "n3", title: "Donor Retention Metrics", category: "ngo", type: "metric", why: "Churn signals enable timely outreach before donors lapse.", impact: { time_saved_hours_per_month: 5, cost_savings_usd_per_month: 325 } },
  ],
  rwa: [
    { id: "rwa1", title: "Asset Tokenisation Pipeline", category: "rwa", type: "table", why: "Status tracking across legal, technical and on-chain steps prevents deal slippage.", impact: { time_saved_hours_per_month: 18, cost_savings_usd_per_month: 1530 } },
    { id: "rwa2", title: "Secondary Market Liquidity", category: "rwa", type: "chart", why: "Real-time order book depth prevents investor dissatisfaction from illiquidity surprises.", impact: { time_saved_hours_per_month: 10, cost_savings_usd_per_month: 850 } },
    { id: "rwa3", title: "Legal / Custody Status", category: "rwa", type: "alert", why: "Automated legal milestone alerts replace manual legal team check-ins.", impact: { time_saved_hours_per_month: 14, cost_savings_usd_per_month: 1190 } },
  ],
  custom: [
    { id: "c1", title: "Client Project Tracker", category: "custom", type: "table", why: "Centralises all active client engagements so nothing slips through the cracks between account managers.", impact: { time_saved_hours_per_month: 14, cost_savings_usd_per_month: 910 } },
    { id: "c2", title: "Invoice & Billing Dashboard", category: "custom", type: "metric", why: "Live outstanding vs paid breakdown reduces billing cycle from days to hours and prevents revenue leakage.", impact: { time_saved_hours_per_month: 10, cost_savings_usd_per_month: 650 } },
    { id: "c3", title: "Campaign Performance Monitor", category: "custom", type: "chart", why: "Cross-client campaign metrics in one view eliminates the need for manual reporting decks each week.", impact: { time_saved_hours_per_month: 12, cost_savings_usd_per_month: 780 } },
    { id: "c4", title: "Resource Utilisation Overview", category: "custom", type: "metric", why: "Team capacity tracking prevents overallocation and enables proactive hiring decisions.", impact: { time_saved_hours_per_month: 8, cost_savings_usd_per_month: 520 } },
    { id: "c5", title: "Client Onboarding Pipeline", category: "custom", type: "table", why: "Stage-by-stage onboarding funnel surfaces delays early so new clients go live faster.", impact: { time_saved_hours_per_month: 9, cost_savings_usd_per_month: 585 } },
  ],
};

// Compliance checker widget — injected into every bundle regardless of category
const COMPLIANCE_WIDGET: WidgetDef = {
  id: "compliance_checker",
  title: "Compliance Checker",
  category: "custom",
  type: "alert",
  why: "Automated compliance status across all active clients and transactions — flags breaches before they escalate to regulatory action.",
  impact: { time_saved_hours_per_month: 16, cost_savings_usd_per_month: 1280 },
};

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

function buildBundles(categories: WidgetCategory[], opsRate: number, complianceRate: number): Bundle[] {
  const allWidgets = categories
    .flatMap((c) => WIDGET_LIBRARY[c] ?? [])
    .filter((w, i, arr) => arr.findIndex((x) => x.id === w.id) === i); // dedupe

  const fallback = WIDGET_LIBRARY.custom;
  const pool = allWidgets.length >= 3 ? allWidgets : [...allWidgets, ...fallback].slice(0, 6);

  const computeTotals = (widgets: WidgetDef__[]): Bundle["totals"] => {
    const time = widgets.reduce((s, w) => s + w.impact.time_saved_hours_per_month, 0);
    const cost = widgets.reduce((s, w) => s + w.impact.cost_savings_usd_per_month, 0);
    return { time_saved_hours_per_month: time, cost_savings_usd_per_month: cost, roi_percent: Math.round((cost / Math.max(opsRate * time, 1)) * 100) };
  };

  // Compliance checker is always present in every bundle
  const withCompliance = (widgets: WidgetDef__[]): WidgetDef__[] =>
    widgets.some((w) => w.id === COMPLIANCE_WIDGET.id) ? widgets : [...widgets, COMPLIANCE_WIDGET];

  const lean = withCompliance(pool.slice(0, Math.min(3, pool.length)));
  const balanced = withCompliance(pool.slice(0, Math.min(5, pool.length)));
  const comprehensive = withCompliance(pool);

  return [
    { id: "lean", name: "Lean Bundle", description: "Core widgets only — fast to adopt, low operational overhead.", widgets: lean, totals: computeTotals(lean) },
    { id: "balanced", name: "Balanced Bundle", description: "Recommended starting point balancing coverage and complexity.", widgets: balanced, totals: computeTotals(balanced) },
    { id: "comprehensive", name: "Comprehensive Bundle", description: "Full coverage for mature teams ready to operationalise all insights.", widgets: comprehensive, totals: computeTotals(comprehensive) },
  ];
}

// TypeScript fix: WidgetDef alias
type WidgetDef__ = WidgetDef;

function generateRecommendations(
  hint: string,
  description: string,
  opsRate: number,
  complianceRate: number
): RecommendationsResult {
  const categories = detectCategories(hint, description);
  const bundles = buildBundles(categories, opsRate, complianceRate);
  const confidence = hint && PRESET_CATEGORY_MAP[hint] ? 0.92 : description.length > 60 ? 0.75 : 0.55;
  return {
    business_profile: {
      inferred_categories: categories,
      confidence,
      rationale: `Based on your inputs, we identified this as a ${categories.join(" + ")} business. Widget recommendations are optimised for your described use case and team size.`,
    },
    bundles,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatUsd(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function formatHours(n: number) { return `${Math.round(n * 10) / 10}h/mo`; }

const inputCls = "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/40 focus:ring-0 h-9 text-sm";
const labelCls = "text-xs text-white/50";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OnboardingComplianceMakerPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();

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

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-white/40 text-center text-sm">Connect your wallet to view this page.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <DashboardMain>
      <div className="flex flex-col gap-6 max-w-[1300px]">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Business Onboarding</h1>
          <p className="mt-1 text-sm text-white/40">
            Help us know you and your customers better.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">

          {/* ── Left: form ── */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-white">Business & Metrics</p>
                <p className="text-xs text-white/35 mt-0.5">Fill in your details to generate personalised widget bundles.</p>
              </div>

              <div className="flex flex-col gap-3.5">
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
                    className="w-full rounded-md bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-violet-500/40 focus:outline-none min-h-[72px] resize-y"
                  />
                </div>

                {/* Business type — dropdown */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Business type</label>
                  <Select value={businessTypeHint} onValueChange={setBusinessTypeHint}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white h-9 text-sm focus:ring-0 focus:border-violet-500/40 data-[placeholder]:text-white/20">
                      <SelectValue placeholder="Select your business type…" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f1a] border-white/[0.1] text-white">
                      {BUSINESS_TYPE_PRESETS.map((label) => (
                        <SelectItem key={label} value={label} className="text-sm text-white/80 focus:bg-violet-500/15 focus:text-white cursor-pointer">
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
                          className="flex w-full items-center justify-between rounded-md bg-white/[0.04] border border-white/[0.08] px-3 h-9 text-sm text-left transition-colors hover:border-white/[0.14] focus:outline-none focus:border-violet-500/40"
                        >
                          <span className={geographies.length === 0 ? "text-white/20" : "text-white"}>
                            {geographies.length === 0 ? "Select…" : geographies.length === 1 ? geographies[0] : `${geographies.length} selected`}
                          </span>
                          <ChevronsUpDown className="h-3.5 w-3.5 text-white/30 shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0 bg-[#0f0f1a] border-white/[0.1]" align="start">
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
                                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer aria-selected:bg-violet-500/10"
                                  >
                                    <div className={cn("flex h-4 w-4 items-center justify-center rounded border", selected ? "border-violet-500 bg-violet-500/20" : "border-white/20")}>
                                      {selected && <Check className="h-3 w-3 text-violet-300" />}
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
                              <span key={g} className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 px-2 py-0.5 text-[10px]">
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Monthly inbound volume (USD)</label>
                    <Input value={monthlyTransactions} onChange={(e) => setMonthlyTransactions(e.target.value)} placeholder="e.g. 500,000" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Monthly outbound volume (USD)</label>
                    <Input value={monthlyOutbound} onChange={(e) => setMonthlyOutbound(e.target.value)} placeholder="approx. e.g. 300,000" className={inputCls} />
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
                    className="w-full rounded-md bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-violet-500/40 focus:outline-none min-h-[72px] resize-y"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white border-0"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Generating…</>
                ) : (
                  <><Wrench className="h-4 w-4 mr-1.5" /> Build widget combinations</>
                )}
              </Button>
            </div>
          </div>

          {/* ── Right: results ── */}
          <div className="flex flex-col gap-4">
            {!loading && !response && (
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.07] mb-4">
                  <Wrench className="h-6 w-6 text-white/20" />
                </div>
                <p className="text-sm text-white/40 max-w-xs">
                  Fill in your business details and click <span className="text-white/60 font-medium">Build widget combinations</span> to see personalised recommendations here.
                </p>
                <p className="text-xs text-white/20 mt-2">
                  You&apos;ll get Lean, Balanced and Comprehensive bundles with time + cost savings.
                </p>
              </div>
            )}

            {loading && (
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col items-center justify-center py-20">
                <div className="flex gap-1.5 mb-4">
                  <span className="size-2 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.3s]" />
                  <span className="size-2 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.15s]" />
                  <span className="size-2 animate-bounce rounded-full bg-violet-500" />
                </div>
                <p className="text-sm text-white/40">Generating widget combinations…</p>
              </div>
            )}

            {response && !loading && (
              <div className="flex flex-col gap-5">
                {/* Business profile pill row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-white/40">Inferred categories:</span>
                  {response.business_profile.inferred_categories.map((c) => (
                    <span key={c} className="rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-300/80 px-2.5 py-0.5 text-[11px] font-medium capitalize">
                      {c}
                    </span>
                  ))}
                  <span className="ml-auto text-[11px] text-white/25 rounded-full border border-white/[0.07] px-2.5 py-0.5">
                    {Math.round(response.business_profile.confidence * 100)}% confidence
                  </span>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {response.bundles.map((bundle, bi) => {
                    const isRecommended = bi === 1;
                    return (
                      <div
                        key={bundle.id}
                        className={cn(
                          "relative flex flex-col rounded-2xl border overflow-hidden transition-all",
                          isRecommended
                            ? "border-violet-500/40 bg-violet-500/[0.06] shadow-[0_0_32px_-8px_rgba(124,58,237,0.25)]"
                            : "border-white/[0.07] bg-white/[0.02]"
                        )}
                      >
                        {/* Recommended ribbon */}
                        {isRecommended && (
                          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-600/0 via-violet-500 to-violet-600/0" />
                        )}

                        {/* Card header */}
                        <div className={cn("px-5 pt-6 pb-5", isRecommended ? "border-b border-violet-500/20" : "border-b border-white/[0.06]")}>
                          {isRecommended && (
                            <span className="inline-block mb-3 text-[10px] rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2.5 py-0.5 font-semibold tracking-wide uppercase">
                              Recommended
                            </span>
                          )}
                          <p className={cn("text-base font-semibold", isRecommended ? "text-white" : "text-white/80")}>{bundle.name}</p>
                          <p className="text-xs text-white/35 mt-1 leading-relaxed">{bundle.description}</p>

                          {/* Savings summary */}
                          <div className="mt-4 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-white/40 flex items-center gap-1"><Clock className="h-3 w-3" /> Time saved</span>
                              <span className="text-[11px] font-medium text-emerald-400">{formatHours(bundle.totals.time_saved_hours_per_month)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-white/40 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Cost savings</span>
                              <span className="text-[11px] font-medium text-emerald-400">{formatUsd(bundle.totals.cost_savings_usd_per_month)}/mo</span>
                            </div>
                          </div>
                        </div>

                        {/* Widget list */}
                        <div className="flex-1 px-4 py-4 flex flex-col gap-2.5">
                          {bundle.widgets.map((w) => (
                            <div key={w.id} className="flex items-start gap-2.5">
                              <div className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full", isRecommended ? "bg-violet-500/20" : "bg-white/[0.06]")}>
                                <div className={cn("h-1.5 w-1.5 rounded-full", isRecommended ? "bg-violet-400" : "bg-white/30")} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] font-medium text-white/85 leading-snug">{w.title}</p>
                                <p className="text-[11px] text-white/30 leading-relaxed mt-0.5">{w.why}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-5 pt-1">
                          <Button
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
                            className={cn(
                              "w-full border-0 text-sm font-medium",
                              isRecommended
                                ? "bg-violet-600 hover:bg-violet-500 text-white"
                                : "bg-white/[0.06] hover:bg-white/[0.10] text-white/70 hover:text-white"
                            )}
                          >
                            <Save className="h-3.5 w-3.5 mr-1.5" /> Use this bundle
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
    </DashboardMain>
  );
}
