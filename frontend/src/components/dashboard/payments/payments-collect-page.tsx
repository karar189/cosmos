"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Info,
  Lock,
  Shield,
  User,
  Wallet,
  QrCode,
  CreditCard,
  Building2,
} from "lucide-react";
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";
import { hubThemeClasses } from "@/components/dashboard/workspace-hub/workspace-hub-theme-classes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fallbackBusiness } from "@/data/fallback";
import { buildPaymentPreviewHref } from "@/components/dashboard/payments/payment-link-preview-utils";
import { cn } from "@/utils";

const PAYMENT_TABS = [
  { id: "collect", label: "Collect" },
  { id: "send", label: "Send", soon: true },
  { id: "subscriptions", label: "Subscriptions", soon: true },
  { id: "customers", label: "Customers", soon: true },
] as const;

const EXPIRY_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "never", label: "Never" },
];

const PAYMENT_METHODS = [
  { id: "wallet", label: "Wallet", sub: "USDC on Stellar", icon: Wallet, enabled: true },
  { id: "qr", label: "QR Code", sub: "Instant payment", icon: QrCode, enabled: true },
  { id: "onramp", label: "On-Ramp", sub: "Buy with MoneyGram", icon: Building2, enabled: true },
  { id: "card", label: "Card", sub: "Coming soon", icon: CreditCard, enabled: false },
] as const;

const RECENT_TRANSACTIONS = [
  {
    id: "1",
    name: "Riya Sharma",
    date: "May 28, 2:14 PM",
    amount: "+1,000.00",
    currency: "USDC",
    status: "Succeeded" as const,
  },
  {
    id: "2",
    name: "Acme Corp",
    date: "May 27, 11:02 AM",
    amount: "+500.00",
    currency: "USDC",
    status: "Succeeded" as const,
  },
  {
    id: "3",
    name: "Zara Ali",
    date: "May 26, 4:45 PM",
    amount: "+750.00",
    currency: "USDC",
    status: "Private" as const,
  },
  {
    id: "4",
    name: "Neha Gupta",
    date: "May 25, 9:30 AM",
    amount: "-75.00",
    currency: "USDC",
    status: "Refunded" as const,
  },
];

const VOLUME_SPARKLINE = [12, 18, 14, 22, 19, 28, 24, 32, 29, 35];
const PAYMENTS_SPARKLINE = [8, 12, 10, 16, 14, 18, 15, 22, 20, 24];

function Sparkline({
  points,
  strokeClass,
}: {
  points: number[];
  strokeClass: string;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="shrink-0" aria-hidden>
      <polyline
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
        className={strokeClass}
      />
    </svg>
  );
}

function SectionInfo({ className }: { className?: string }) {
  return (
    <Info
      className={cn("h-3.5 w-3.5 shrink-0 cursor-help opacity-60", className)}
      aria-hidden
    />
  );
}

function StatusBadge({
  status,
  dark,
}: {
  status: "Succeeded" | "Private" | "Refunded";
  dark: boolean;
}) {
  if (status === "Succeeded") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-700",
          dark && "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
        )}
      >
        Succeeded
      </Badge>
    );
  }
  if (status === "Private") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 border-blue-200 bg-blue-50 text-[11px] font-medium text-blue-700",
          dark && "border-blue-500/30 bg-blue-500/15 text-blue-300"
        )}
      >
        <Lock className="h-3 w-3" />
        Private
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-red-200 bg-red-50 text-[11px] font-medium text-red-600",
        dark && "border-red-500/30 bg-red-500/15 text-red-300"
      )}
    >
      Refunded
    </Badge>
  );
}

interface PaymentsCollectPageProps {
  businessId: string;
}

export function PaymentsCollectPage({ businessId }: PaymentsCollectPageProps) {
  const { theme } = useDashboardTheme();
  const t = hubThemeClasses(theme);

  const [activeTab] = useState<(typeof PAYMENT_TABS)[number]["id"]>("collect");
  const [amount, setAmount] = useState("1,000.00");
  const [description, setDescription] = useState("Payment for design services");
  const [customer, setCustomer] = useState("");
  const [expiry, setExpiry] = useState("30");
  const [metadata, setMetadata] = useState("");
  const [privateSettlement, setPrivateSettlement] = useState(true);
  const [methods, setMethods] = useState<Record<string, boolean>>({
    wallet: true,
    qr: true,
    onramp: true,
    card: false,
  });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [workflowStage, setWorkflowStage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{ linkId: string; url: string; memo: string } | null>(
    null
  );

  const vaultName = useMemo(() => {
    const base = fallbackBusiness.name?.trim() || "Hypertron";
    return base.endsWith("Vault") ? base : `${base} Vault`;
  }, []);

  const previewHref = useMemo(
    () =>
      buildPaymentPreviewHref({
        amount,
        description,
        customer,
        expiry,
        privateSettlement,
        methods: Object.entries(methods)
          .filter(([, enabled]) => enabled)
          .map(([id]) => id),
        linkId: result?.linkId,
        linkUrl: result?.url,
      }),
    [amount, description, customer, expiry, privateSettlement, methods, result]
  );

  const inputCls = cn(
    "h-10 border text-sm focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0",
    t.dark
      ? "border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/40"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500/40"
  );

  const labelCls = cn("text-sm font-medium", t.dark ? "text-slate-300" : "text-slate-700");
  const hintCls = cn("text-xs", t.pageSubheading);
  const sectionTitle = cn("text-sm font-semibold", t.pageHeading);
  const cardCls = cn("rounded-xl border p-4 lg:p-5", t.card);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const normalizedAmount = amount.replace(/,/g, "").trim();
    if (!normalizedAmount) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          businessId,
          amount: normalizedAmount,
          purpose: description.trim() || undefined,
          clientName: customer.trim() || undefined,
          workflowStage: workflowStage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Could not create a payment link right now.");
        return;
      }
      setResult({ linkId: data.linkId, url: data.url, memo: data.memo });
    } catch {
      setError("Could not create a payment link right now.");
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

  function toggleMethod(id: string, enabled: boolean) {
    if (!enabled) return;
    setMethods((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const descriptionCount = description.length;

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {/* Top tabs */}
      <nav
        className={cn(
          "flex gap-5 border-b",
          t.dark ? "border-white/10" : "border-slate-200"
        )}
        aria-label="Payments sections"
      >
        {PAYMENT_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const isSoon = "soon" in tab && tab.soon;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={isSoon}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors",
                isActive
                  ? t.dark
                    ? "text-blue-400"
                    : "text-blue-600"
                  : isSoon
                    ? cn(t.cardMuted, "cursor-not-allowed")
                    : cn(t.pageSubheading, "hover:text-slate-700", t.dark && "hover:text-slate-200")
              )}
            >
              {tab.label}
              {isSoon ? (
                <span className={cn("ml-1.5 text-[10px] font-normal", t.cardMuted)}>Soon</span>
              ) : null}
              {isActive ? (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main form */}
        <div className={cardCls}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className={cn("text-xl font-semibold tracking-tight sm:text-2xl", t.pageHeading)}>
                Create a Payment Link
              </h1>
              <p className={cn("mt-1 text-sm", t.pageSubheading)}>
                Collect payments in USDC on Stellar. Fast, secure and private.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className={cn("shrink-0 gap-2 text-sm", t.outlineBtn)}
              asChild
            >
              <Link href={previewHref}>
                Preview Payment Page
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {result ? (
            <div
              className={cn(
                "mb-6 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between",
                t.dark
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-emerald-200 bg-emerald-50/80"
              )}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    t.dark ? "text-emerald-200" : "text-emerald-800"
                  )}
                >
                  Payment link ready
                </p>
                <p className={cn("mt-0.5 truncate text-xs", t.pageSubheading)}>{result.url}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={cn("shrink-0 gap-2", t.outlineBtn)}
                onClick={copyLink}
              >
                {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy link"}
              </Button>
            </div>
          ) : null}

          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            {/* Two columns: payment details | settlement & privacy */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-5">
              {/* Left — amount & details */}
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <Label htmlFor="amount" className={labelCls}>
                    Amount
                  </Label>
                  <div
                    className={cn(
                      "flex overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-blue-500/20",
                      t.dark ? "border-white/10" : "border-slate-200"
                    )}
                  >
                    <Input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={cn(
                        inputCls,
                        "h-11 flex-1 rounded-none border-0 focus-visible:ring-0"
                      )}
                      required
                    />
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-2 border-l px-3 text-sm font-medium",
                        t.dark
                          ? "border-white/10 bg-white/5 text-slate-200"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      )}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                        $
                      </span>
                      USDC
                      <ChevronDown className={cn("h-3.5 w-3.5", t.cardMuted)} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className={labelCls}>
                      Description{" "}
                      <span className={cn("font-normal", t.pageSubheading)}>(optional)</span>
                    </Label>
                    <span className={hintCls}>{descriptionCount}/140</span>
                  </div>
                  <Input
                    id="description"
                    value={description}
                    maxLength={140}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer" className={labelCls}>
                    Customer{" "}
                    <span className={cn("font-normal", t.pageSubheading)}>(optional)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="customer"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      placeholder="Enter name, email or wallet address"
                      className={cn(inputCls, "pr-10")}
                    />
                    <User
                      className={cn(
                        "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2",
                        t.cardMuted
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={labelCls}>Payment Link Expiry</Label>
                  <Select value={expiry} onValueChange={setExpiry}>
                    <SelectTrigger className={cn("h-10 gap-2", t.selectTrigger, inputCls)}>
                      <SelectValue />
                      <Calendar className={cn("ml-auto h-4 w-4 shrink-0", t.cardMuted)} />
                    </SelectTrigger>
                    <SelectContent className={t.selectContent}>
                      {EXPIRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className={t.selectItem}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metadata" className={labelCls}>
                    Metadata{" "}
                    <span className={cn("font-normal", t.pageSubheading)}>(optional)</span>
                  </Label>
                  <Textarea
                    id="metadata"
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                    placeholder="Add order ID, project ID, or any reference"
                    rows={4}
                    className={cn(
                      "resize-none text-sm focus:ring-2 focus:ring-blue-500/20",
                      t.dark
                        ? "border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
                        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                    )}
                  />
                </div>
              </div>

              {/* Right — settlement & privacy */}
              <div
                className={cn(
                  "flex flex-col gap-4 rounded-xl border p-5",
                  t.dark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <h2 className={sectionTitle}>Settlement &amp; Privacy</h2>
                  <SectionInfo className={t.cardMuted} />
                </div>

                <div
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border px-4 py-3",
                    t.dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                      S
                    </div>
                    <div>
                      <p className={cn("text-xs", t.pageSubheading)}>Settlement Rail</p>
                      <p className={cn("text-sm font-semibold", t.pageHeading)}>Stellar · USDC</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
                      t.dark && "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                    )}
                  >
                    Active
                  </Badge>
                </div>

                <div
                  className={cn(
                    "space-y-3 rounded-lg border px-4 py-3",
                    t.dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className={cn("text-sm font-medium", t.pageHeading)}>Private Settlement</p>
                        <SectionInfo className={t.cardMuted} />
                      </div>
                      <p className={cn("mt-1 text-xs leading-relaxed", t.pageSubheading)}>
                        Hide transaction details on-chain with opt-in privacy.
                      </p>
                    </div>
                    <Switch
                      checked={privateSettlement}
                      onCheckedChange={setPrivateSettlement}
                      className="shrink-0 data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  <div
                    className={cn(
                      "flex gap-3 rounded-lg px-3 py-2.5",
                      t.dark ? "bg-blue-500/10" : "bg-blue-50"
                    )}
                  >
                    <Shield
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0 text-blue-600",
                        t.dark && "text-blue-400"
                      )}
                    />
                    <p
                      className={cn(
                        "text-xs leading-relaxed",
                        t.dark ? "text-blue-200" : "text-blue-800"
                      )}
                    >
                      Proof of payment will be generated for verification.{" "}
                      <button type="button" className="font-medium underline underline-offset-2">
                        Learn more →
                      </button>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={cn("text-xs", t.pageSubheading)}>
                    Funds will be collected in your Hypertron Vault
                  </p>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                      t.dark
                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        t.dark ? "bg-white/10" : "bg-slate-100"
                      )}
                    >
                      <Wallet className={cn("h-5 w-5", t.dark ? "text-slate-300" : "text-slate-600")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm font-semibold", t.pageHeading)}>{vaultName}</p>
                      <p className={cn("text-xs", t.pageSubheading)}>Available Balance</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <p className={cn("text-sm font-semibold tabular-nums", t.pageHeading)}>
                        42,140.00 USDC
                      </p>
                      <ChevronRight className={cn("h-4 w-4", t.cardMuted)} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Methods — full width below columns */}
            <div
              className={cn(
                "space-y-3 border-t pt-6",
                t.dark ? "border-white/10" : "border-slate-200"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={sectionTitle}>Payment Methods</h2>
                  <SectionInfo className={t.cardMuted} />
                </div>
                <p className={cn("mt-0.5 text-xs", t.pageSubheading)}>
                  Select how your customers can pay.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const checked = methods[method.id];
                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={!method.enabled}
                      onClick={() => toggleMethod(method.id, method.enabled)}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                        !method.enabled && "cursor-not-allowed opacity-50",
                        checked && method.enabled
                          ? t.dark
                            ? "border-blue-500/50 bg-blue-500/10"
                            : "border-blue-300 bg-blue-50/60"
                          : t.dark
                            ? "border-white/10 bg-white/5 hover:border-white/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      {checked && method.enabled ? (
                        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      ) : null}
                      <Icon className={cn("h-4 w-4", t.dark ? "text-slate-300" : "text-slate-600")} />
                      <div>
                        <p className={cn("text-sm font-medium", t.pageHeading)}>{method.label}</p>
                        <p className={cn("text-[11px]", t.pageSubheading)}>{method.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced + submit */}
            <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((o) => !o)}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700",
                    t.dark && "text-blue-400 hover:text-blue-300"
                  )}
                >
                  Advanced Options
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", advancedOpen && "rotate-180")}
                  />
                </button>
                {advancedOpen ? (
                  <div className="max-w-xs space-y-1.5">
                    <Label htmlFor="workflow" className={hintCls}>
                      Workflow stage (optional)
                    </Label>
                    <Input
                      id="workflow"
                      value={workflowStage}
                      onChange={(e) => setWorkflowStage(e.target.value)}
                      placeholder="e.g. pending approval"
                      className={inputCls}
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 min-w-[200px] bg-blue-600 px-6 text-white hover:bg-blue-500"
                >
                  {loading ? "Generating…" : "Generate Payment Link"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="flex min-w-0 flex-col gap-4">
          {/* Treasury Vault */}
          <div className={cardCls}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className={sectionTitle}>Treasury Vault</h2>
                <SectionInfo className={t.cardMuted} />
              </div>
              <Link
                href="/dashboard/withdraw"
                className={cn(
                  "text-xs font-medium text-blue-600 hover:text-blue-700",
                  t.dark && "text-blue-400 hover:text-blue-300"
                )}
              >
                View all
              </Link>
            </div>
            <p className={cn("text-2xl font-semibold tracking-tight", t.pageHeading)}>
              42,140.00{" "}
              <span className={cn("text-base font-normal", t.pageSubheading)}>USDC</span>
            </p>
            <p className={cn("mt-0.5 text-xs", t.pageSubheading)}>≈ $42,140.00 USD</p>
            <div className={cn("mt-4 space-y-1.5 border-t pt-4 text-sm", t.cardDivider)}>
              <div className="flex justify-between">
                <span className={t.cardRowLabel}>Available</span>
                <span className={cn("font-medium", t.cardRowValueStrong)}>38,210.00 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className={t.cardRowLabel}>Pending</span>
                <span className={cn("font-medium", t.cardRowValueStrong)}>3,930.00 USDC</span>
              </div>
            </div>
            <Button
              variant="outline"
              className={cn("mt-4 w-full border-blue-200 text-blue-600 hover:bg-blue-50", t.dark && "border-blue-500/30 text-blue-400 hover:bg-blue-500/10")}
              asChild
            >
              <Link href="/dashboard/withdraw">Withdraw / Redeem</Link>
            </Button>
          </div>

          {/* Recent Transactions */}
          <div className={cardCls}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={sectionTitle}>Recent Transactions</h2>
              <button
                type="button"
                className={cn(
                  "text-xs font-medium text-blue-600 hover:text-blue-700",
                  t.dark && "text-blue-400 hover:text-blue-300"
                )}
              >
                View all
              </button>
            </div>
            <ul className="space-y-4">
              {RECENT_TRANSACTIONS.map((tx) => (
                <li key={tx.id} className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        t.dark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {tx.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("truncate text-sm font-medium", t.pageHeading)}>{tx.name}</p>
                      <p className={cn("text-[11px]", t.pageSubheading)}>{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <p
                      className={cn(
                        "text-sm font-medium tabular-nums",
                        tx.amount.startsWith("-")
                          ? "text-red-600"
                          : t.dark
                            ? "text-slate-100"
                            : "text-slate-900"
                      )}
                    >
                      {tx.amount} {tx.currency}
                    </p>
                    <StatusBadge status={tx.status} dark={t.dark} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Insights */}
          <div className={cardCls}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className={sectionTitle}>Payment Insights</h2>
                <SectionInfo className={t.cardMuted} />
              </div>
              <Select defaultValue="week">
                <SelectTrigger
                  className={cn(
                    "h-8 w-auto gap-1 border-0 bg-transparent px-2 text-xs shadow-none",
                    t.pageSubheading
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={t.selectContent}>
                  <SelectItem value="week" className={t.selectItem}>
                    This Week
                  </SelectItem>
                  <SelectItem value="month" className={t.selectItem}>
                    This Month
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className={cn("text-xs", t.pageSubheading)}>Volume</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className={cn("text-lg font-semibold", t.pageHeading)}>$12,420.00</span>
                    <span className="text-xs font-medium text-emerald-600">+12.5%</span>
                  </div>
                </div>
                <Sparkline
                  points={VOLUME_SPARKLINE}
                  strokeClass={t.dark ? "stroke-blue-400" : "stroke-blue-600"}
                />
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className={cn("text-xs", t.pageSubheading)}>Successful Payments</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className={cn("text-lg font-semibold", t.pageHeading)}>24</span>
                    <span className="text-xs font-medium text-emerald-600">+20%</span>
                  </div>
                </div>
                <Sparkline
                  points={PAYMENTS_SPARKLINE}
                  strokeClass={t.dark ? "stroke-emerald-400" : "stroke-emerald-600"}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
