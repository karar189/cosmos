"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  History,
  Info,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";
import { hubThemeClasses } from "@/components/dashboard/workspace-hub/workspace-hub-theme-classes";
import {
  BRIDGE_ASSETS,
  BRIDGE_DEMO_BALANCES,
  BRIDGE_KPIS,
  BRIDGE_RECEIVE_RATE,
  BRIDGE_RECENT,
  BRIDGE_SOURCE_NETWORKS,
  BRIDGE_DEST_NETWORK,
  computeBridgeReceive,
  formatBridgeAddress,
  networkById,
  type BridgeAssetId,
  type BridgeKpi,
  type BridgeNetworkId,
  type BridgeStatus,
} from "@/lib/demo-bridge-data";
import { cn } from "@/utils";

type BridgeTab = "to-stellar" | "from-stellar";

function useBridgeStyles(theme: "light" | "dark") {
  const t = hubThemeClasses(theme);
  return useMemo(
    () => ({
      t,
      panel: cn(
        "rounded-2xl border p-5",
        t.dark ? "border-white/10 bg-white/[0.02]" : "border-slate-200/90 bg-white shadow-sm"
      ),
      kpiCard: cn(
        "flex flex-col gap-2 rounded-2xl border p-3",
        t.dark ? "border-white/10 bg-white/[0.02]" : "border-slate-200/90 bg-white shadow-sm"
      ),
      iconTile: cn(
        "flex h-7 w-7 items-center justify-center rounded-lg",
        t.dark ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-700"
      ),
      stepBadge: cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        t.dark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
      ),
      label: cn("text-xs font-medium", t.dark ? "text-white/50" : "text-slate-500"),
      sectionTitle: cn("text-sm font-semibold", t.dark ? "text-white" : "text-slate-900"),
      muted: cn("text-xs", t.dark ? "text-white/40" : "text-slate-500"),
      input: cn(
        "h-10 rounded-lg border text-sm",
        t.dark
          ? "border-white/10 bg-white/5 text-white placeholder:text-white/30"
          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
      ),
      selectTrigger: cn(
        "h-10 rounded-lg border text-sm",
        t.dark ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-900"
      ),
      selectContent: cn("rounded-lg border shadow-md", t.selectContent),
      selectItem: t.selectItem,
      tabActive: cn(
        "border-b-2 border-blue-600 pb-3 text-sm font-semibold",
        t.dark ? "text-blue-300" : "text-blue-600"
      ),
      tabInactive: cn(
        "border-b-2 border-transparent pb-3 text-sm font-medium transition-colors",
        t.dark ? "text-white/45 hover:text-white/70" : "text-slate-500 hover:text-slate-700"
      ),
    }),
    [t, theme]
  );
}

const TOKEN_SIZES = {
  sm: "h-5 w-5 text-[9px]",
  md: "h-6 w-6 text-[10px]",
  lg: "h-7 w-7 text-[11px]",
} as const;

function TokenIcon({
  icon,
  short,
  color,
  label,
  size = "md",
}: {
  icon?: string;
  short: string;
  color: string;
  label?: string;
  size?: keyof typeof TOKEN_SIZES;
}) {
  const [failed, setFailed] = useState(false);
  const dimension = TOKEN_SIZES[size];

  if (icon && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt={label ?? short}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("shrink-0 rounded-full object-cover ring-1 ring-black/5", dimension)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        dimension
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {short}
    </span>
  );
}

function NetworkIcon({
  network,
  size = "md",
}: {
  network: { short: string; color: string; icon?: string; label?: string };
  size?: keyof typeof TOKEN_SIZES;
}) {
  return (
    <TokenIcon
      icon={network.icon}
      short={network.short}
      color={network.color}
      label={network.label}
      size={size}
    />
  );
}

function AssetIcon({ asset, size = "md" }: { asset: BridgeAssetId; size?: keyof typeof TOKEN_SIZES }) {
  const meta = BRIDGE_ASSETS[asset];
  return (
    <TokenIcon icon={meta.icon} short={meta.label.slice(0, 1)} color={meta.color} label={meta.label} size={size} />
  );
}

const KPI_ICONS: Record<BridgeKpi["icon"], LucideIcon> = {
  volume: ArrowLeftRight,
  time: Clock,
  networks: Globe,
  success: ShieldCheck,
};

function BridgeKpiCard({ kpi, styles }: { kpi: BridgeKpi; styles: ReturnType<typeof useBridgeStyles> }) {
  const Icon = KPI_ICONS[kpi.icon];
  return (
    <div className={styles.kpiCard}>
      <div className="flex items-center gap-2">
        <span className={styles.iconTile}>
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
        <span className={cn("text-[11px] font-medium", styles.t.pageSubheading)}>{kpi.label}</span>
      </div>
      <p className={cn("text-lg font-semibold tabular-nums tracking-tight", styles.t.pageHeading)}>{kpi.value}</p>
      <p className={cn("text-[10px] leading-snug", styles.t.pageSubheading)}>{kpi.sub}</p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  styles,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  styles: ReturnType<typeof useBridgeStyles>;
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="min-w-0">
        <h2 className={cn("text-sm font-semibold", styles.t.pageHeading)}>{title}</h2>
        {subtitle ? <p className={cn("mt-0.5 text-xs", styles.t.pageSubheading)}>{subtitle}</p> : null}
      </div>
      {action ?? (Icon ? <Icon className={cn("h-4 w-4 shrink-0", styles.muted)} strokeWidth={1.75} /> : null)}
    </div>
  );
}

function BridgeStatusBadge({ status, dark }: { status: BridgeStatus; dark: boolean }) {
  if (status === "completed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
          dark
            ? "border border-emerald-500/25 bg-emerald-500/15 text-emerald-400"
            : "border border-emerald-200 bg-emerald-50 text-emerald-700"
        )}
      >
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
          dark
            ? "border border-blue-500/25 bg-blue-500/15 text-blue-300"
            : "border border-blue-200 bg-blue-50 text-blue-700"
        )}
      >
        <Clock className="h-3 w-3" />
        In Progress
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        dark
          ? "border border-red-500/25 bg-red-500/15 text-red-400"
          : "border border-red-200 bg-red-50 text-red-700"
      )}
    >
      <XCircle className="h-3 w-3" />
      Failed
    </span>
  );
}

export function BridgePageContent() {
  const { theme } = useDashboardTheme();
  const s = useBridgeStyles(theme);
  const dark = theme === "dark";

  const [activeTab, setActiveTab] = useState<BridgeTab>("to-stellar");
  const [sourceNetwork, setSourceNetwork] = useState<BridgeNetworkId>("ethereum");
  const [sourceAsset, setSourceAsset] = useState<BridgeAssetId>("USDC");
  const [destAsset, setDestAsset] = useState<BridgeAssetId>("USDC");
  const [amount, setAmount] = useState("500");
  const [copied, setCopied] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "completed" | "in_progress">("all");

  const sendAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const { fee, receive } = computeBridgeReceive(sendAmount);

  const filteredRecent = useMemo(
    () => (historyFilter === "all" ? BRIDGE_RECENT : BRIDGE_RECENT.filter((b) => b.status === historyFilter)),
    [historyFilter]
  );

  function copyAddress() {
    void navigator.clipboard.writeText(BRIDGE_DEMO_BALANCES.stellarAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleMax() {
    setAmount(String(BRIDGE_DEMO_BALANCES.sourceUsdc));
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className={cn("text-xl font-semibold tracking-tight sm:text-2xl", s.t.pageHeading)}>Bridge</h1>
          <p className={cn("mt-1 max-w-2xl text-sm", s.t.pageSubheading)}>
            Bridge assets from other blockchains to Stellar and manage cross-chain transfers.
          </p>
        </div>
        <Button type="button" variant="outline" className={cn("h-9 shrink-0 gap-2 rounded-lg", s.t.outlineBtn)}>
          <History className="h-4 w-4" strokeWidth={1.75} />
          Bridge history
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {BRIDGE_KPIS.map((kpi) => (
          <BridgeKpiCard key={kpi.label} kpi={kpi} styles={s} />
        ))}
      </div>

      <div className="flex gap-6 border-b border-slate-200/80 dark:border-white/10">
        <button type="button" className={activeTab === "to-stellar" ? s.tabActive : s.tabInactive} onClick={() => setActiveTab("to-stellar")}>
          Bridge to Stellar
        </button>
        <button type="button" className={activeTab === "from-stellar" ? s.tabActive : s.tabInactive} onClick={() => setActiveTab("from-stellar")}>
          Bridge from Stellar
        </button>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className={s.panel}>
          {activeTab === "from-stellar" ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ArrowLeftRight className={cn("h-8 w-8", dark ? "text-white/30" : "text-slate-300")} />
              <p className={cn("text-sm font-medium", s.t.pageHeading)}>Bridge from Stellar</p>
              <p className={cn("max-w-sm text-sm", s.t.pageSubheading)}>
                Outbound bridges from Stellar to EVM networks are coming soon in the sandbox.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <section className="grid gap-x-6 gap-y-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div className="flex items-start gap-3">
                  <span className={s.stepBadge}>1</span>
                  <div className="min-w-0">
                    <p className={s.sectionTitle}>From</p>
                    <p className={cn("mt-0.5", s.muted)}>Select the network and asset to bridge from.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className={s.label}>Network</Label>
                    <Select value={sourceNetwork} onValueChange={(v) => setSourceNetwork(v as BridgeNetworkId)}>
                      <SelectTrigger className={s.selectTrigger}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={s.selectContent}>
                        {BRIDGE_SOURCE_NETWORKS.map((network) => (
                          <SelectItem key={network.id} value={network.id} className={cn(s.selectItem, "pl-9")}>
                            <span className="flex items-center gap-2">
                              <NetworkIcon network={network} size="sm" />
                              {network.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className={s.label}>Asset</Label>
                    <Select value={sourceAsset} onValueChange={(v) => setSourceAsset(v as BridgeAssetId)}>
                      <SelectTrigger className={s.selectTrigger}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={s.selectContent}>
                        {(["USDC", "USDT", "ETH"] as BridgeAssetId[]).map((asset) => (
                          <SelectItem key={asset} value={asset} className={cn(s.selectItem, "pl-9")}>
                            <span className="flex items-center gap-2">
                              <AssetIcon asset={asset} size="sm" />
                              {asset}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 sm:col-span-2 dark:border-white/10 dark:bg-white/[0.03]">
                    {walletConnected ? (
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className={s.t.pageHeading}>Wallet connected</span>
                      </span>
                    ) : (
                      <Button type="button" size="sm" className="h-9 rounded-lg bg-blue-600 hover:bg-blue-700" onClick={() => setWalletConnected(true)}>
                        Connect Wallet
                      </Button>
                    )}
                    <div className="text-right">
                      <p className={s.label}>Balance</p>
                      <p className={cn("mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums", s.t.pageHeading)}>
                        {BRIDGE_DEMO_BALANCES.sourceUsdc.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        <AssetIcon asset={sourceAsset} size="sm" />
                        {sourceAsset}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className={cn("h-px", dark ? "bg-white/10" : "bg-slate-100")} />

              <section className="grid gap-x-6 gap-y-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div className="flex items-start gap-3">
                  <span className={s.stepBadge}>2</span>
                  <div className="min-w-0">
                    <p className={s.sectionTitle}>To</p>
                    <p className={cn("mt-0.5", s.muted)}>Select the destination on Stellar.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className={s.label}>Network</Label>
                    <div className={cn(s.selectTrigger, "flex items-center gap-2 px-3")}>
                      <NetworkIcon network={BRIDGE_DEST_NETWORK} size="sm" />
                      <span className="text-sm">Stellar</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className={s.label}>Asset</Label>
                    <Select value={destAsset} onValueChange={(v) => setDestAsset(v as BridgeAssetId)}>
                      <SelectTrigger className={s.selectTrigger}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={s.selectContent}>
                        <SelectItem value="USDC" className={cn(s.selectItem, "pl-9")}>
                          <span className="flex items-center gap-2">
                            <AssetIcon asset="USDC" size="sm" />
                            USDC
                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                              Native
                            </span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:col-span-2 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="min-w-0 space-y-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Connected
                      </span>
                      <div className="flex items-center gap-2">
                        <code className={cn("font-mono text-sm font-medium", s.t.pageHeading)}>
                          {formatBridgeAddress(BRIDGE_DEMO_BALANCES.stellarAddress)}
                        </code>
                        <button type="button" onClick={copyAddress} className={cn("rounded-md p-1 transition-colors", dark ? "text-white/40 hover:bg-white/10 hover:text-white/70" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600")} aria-label="Copy address">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {copied ? <span className={cn("text-[11px] text-emerald-600", dark && "text-emerald-400")}>Copied</span> : null}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={s.label}>Balance</p>
                      <p className={cn("mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums", s.t.pageHeading)}>
                        {BRIDGE_DEMO_BALANCES.destUsdc.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        <AssetIcon asset={destAsset} size="sm" />
                        {destAsset}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className={cn("h-px", dark ? "bg-white/10" : "bg-slate-100")} />

              <section className="grid gap-x-6 gap-y-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div className="flex items-start gap-3">
                  <span className={s.stepBadge}>3</span>
                  <div className="min-w-0">
                    <p className={s.sectionTitle}>Amount</p>
                    <p className={cn("mt-0.5", s.muted)}>Enter the amount you want to bridge.</p>
                  </div>
                </div>
                <div className="relative grid items-start gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className={s.label}>You send</Label>
                    <div className="relative">
                      <Input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} className={cn(s.input, "h-12 pr-28 text-lg font-semibold tabular-nums")} inputMode="decimal" />
                      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                        <AssetIcon asset={sourceAsset} size="sm" />
                        <span className={cn("text-xs font-semibold", s.t.pageHeading)}>{sourceAsset}</span>
                        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold text-blue-600 hover:text-blue-700" onClick={handleMax}>
                          Max
                        </Button>
                      </div>
                    </div>
                    <p className={s.muted}>${sendAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                  </div>
                  <div className={cn("absolute left-1/2 top-[2.35rem] z-10 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border shadow-sm sm:flex", dark ? "border-white/10 bg-slate-900 text-white/70" : "border-slate-200 bg-white text-slate-500")} aria-hidden>
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={s.label}>You receive (estimated)</Label>
                    <div className={cn(s.input, "flex h-12 items-center justify-between gap-2 px-3")}>
                      <span className="text-lg font-semibold tabular-nums">{receive.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className="flex items-center gap-1.5">
                        <AssetIcon asset={destAsset} size="sm" />
                        <span className={cn("text-xs font-semibold", s.t.pageHeading)}>{destAsset}</span>
                      </span>
                    </div>
                    <p className={s.muted}>${receive.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                  </div>
                </div>
              </section>

              <div className={cn("grid grid-cols-1 gap-3 rounded-xl px-4 py-3 sm:grid-cols-3", dark ? "bg-white/[0.04]" : "bg-slate-50")}>
                <div className="flex items-center gap-2">
                  <Info className={cn("h-3.5 w-3.5 shrink-0", s.muted)} />
                  <div>
                    <p className={s.label}>Est. Fee</p>
                    <p className={cn("text-sm font-medium tabular-nums", s.t.pageHeading)}>{fee.toFixed(2)} {sourceAsset}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={cn("h-3.5 w-3.5 shrink-0", s.muted)} />
                  <div>
                    <p className={s.label}>Time</p>
                    <p className={cn("text-sm font-medium", s.t.pageHeading)}>~ 2–5 mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className={cn("h-3.5 w-3.5 shrink-0", s.muted)} />
                  <div>
                    <p className={s.label}>Rate</p>
                    <p className={cn("text-sm font-medium tabular-nums", s.t.pageHeading)}>1 {sourceAsset} = {BRIDGE_RECEIVE_RATE} {destAsset}</p>
                  </div>
                </div>
              </div>

              <Button type="button" className="h-11 w-full rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-700">
                Review Bridge Details
              </Button>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
          <div className={s.panel}>
            <SectionHeader title="Supported Networks" subtitle="Bridge in from any chain" icon={Globe} styles={s} />
            <div className="space-y-4">
              <div>
                <p className={cn("mb-2 text-xs font-medium", s.label)}>From</p>
                <div className="flex flex-wrap items-center gap-2">
                  {BRIDGE_SOURCE_NETWORKS.map((network) => (
                    <NetworkIcon key={network.id} network={network} />
                  ))}
                  <span className={cn("inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2 text-[11px] font-semibold", dark ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-600")}>
                    +6
                  </span>
                </div>
              </div>
              <div>
                <p className={cn("mb-2 text-xs font-medium", s.label)}>To</p>
                <div className="flex items-center gap-2">
                  <NetworkIcon network={BRIDGE_DEST_NETWORK} />
                  <span className={cn("text-sm font-medium", s.t.pageHeading)}>{BRIDGE_DEST_NETWORK.label}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={s.panel}>
            <SectionHeader
              title="Recent Bridges"
              subtitle="Latest cross-chain transfers"
              styles={s}
              action={
                <button type="button" className="text-xs font-medium text-blue-600 hover:underline">
                  View all
                </button>
              }
            />
            <nav className={cn("mb-4 flex gap-5 border-b", dark ? "border-white/10" : "border-slate-200")} role="tablist" aria-label="Bridge history filters">
              {([
                { id: "all", label: "All" },
                { id: "completed", label: "Completed" },
                { id: "in_progress", label: "In Progress" },
              ] as const).map((tab) => {
                const active = historyFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setHistoryFilter(tab.id)}
                    className={cn(
                      "relative pb-2.5 text-sm font-medium transition-colors",
                      active ? (dark ? "text-blue-400" : "text-blue-600") : cn(s.t.pageSubheading, "hover:text-slate-700", dark && "hover:text-slate-200")
                    )}
                  >
                    {tab.label}
                    {active ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" /> : null}
                  </button>
                );
              })}
            </nav>
            {filteredRecent.length === 0 ? (
              <p className={cn("py-6 text-center text-xs", s.t.pageSubheading)}>No bridges in this view yet.</p>
            ) : (
              <ul className="space-y-4">
                {filteredRecent.map((item) => {
                  const network = networkById(item.fromNetwork)!;
                  return (
                    <li key={item.id} className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", dark ? "bg-white/10" : "bg-slate-100")}>
                          <NetworkIcon network={network} size="md" />
                        </div>
                        <div className="min-w-0">
                          <p className={cn("truncate text-sm font-medium", s.t.pageHeading)}>{network.label}</p>
                          <p className={cn("whitespace-nowrap text-[11px]", s.t.pageSubheading)}>{item.timeAgo}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <p className={cn("text-sm font-medium tabular-nums", s.t.pageHeading)}>
                          {item.amount} {item.asset}
                        </p>
                        <BridgeStatusBadge status={item.status} dark={dark} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className={s.panel}>
            <h2 className={cn("mb-2 text-sm font-semibold", s.t.pageHeading)}>Need Help?</h2>
            <p className={cn("mb-3 text-xs leading-relaxed", s.t.pageSubheading)}>Learn how cross-chain bridging works on Hypertron.</p>
            <Button asChild variant="outline" className={cn("h-9 w-full gap-2 rounded-lg", s.t.outlineBtn)}>
              <Link href="/docs/introduction" target="_blank" rel="noopener noreferrer">
                Visit Help Center
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
