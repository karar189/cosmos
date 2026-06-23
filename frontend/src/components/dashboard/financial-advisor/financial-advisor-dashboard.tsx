"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  Loader2,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import {
  FaChangeBadge,
  FaRiskBadge,
  FaSegmentedTabs,
  FaTokenIcon,
  useFaTheme,
  formatCompactUsd,
} from "@/components/dashboard/financial-advisor/financial-advisor-shared";
import { formatPct } from "@/lib/financial-advisor/insights";
import type { FaTimeRange, FaTreasurySnapshot } from "@/lib/financial-advisor/types";

const TIME_RANGES: { value: FaTimeRange; label: string }[] = [
  { value: "1d", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "all", label: "All Time" },
];

const CHART_COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f87171"];

type Props = {
  businessId: string;
  marketsHref: string;
  assetHref: (symbol: string) => string;
  fetchTreasury: (businessId: string, range: FaTimeRange) => Promise<FaTreasurySnapshot>;
};

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: typeof Wallet;
  accent?: "green" | "blue" | "amber";
}) {
  const t = useFaTheme();
  const accentBg = accent === "green"
    ? t.dark ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-50 text-emerald-700"
    : accent === "amber"
      ? t.dark ? "bg-amber-500/15 text-amber-300" : "bg-amber-50 text-amber-700"
      : t.dark ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-700";

  return (
    <div className={cn(t.panel, "flex flex-col gap-2 p-4")}>
      <div className="flex items-center gap-2">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accentBg)}>
          <Icon className="h-4 w-4" />
        </span>
        <span className={cn("text-xs font-medium", t.muted)}>{label}</span>
      </div>
      <p className={cn("text-2xl font-semibold tabular-nums tracking-tight", t.title)}>{value}</p>
      {sub ? <div className={cn("text-xs", t.muted)}>{sub}</div> : null}
    </div>
  );
}

export function FinancialAdvisorDashboard({ businessId, marketsHref, assetHref, fetchTreasury }: Props) {
  const t = useFaTheme();
  const [range, setRange] = useState<FaTimeRange>("30d");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<FaTreasurySnapshot | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const snapshot = await fetchTreasury(businessId, range);
        setData(snapshot);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId, range, fetchTreasury]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const allocationData = useMemo(() => {
    if (!data?.holdings.length) return [];
    return data.holdings.map((h, i) => ({
      name: h.symbol,
      value: h.usdValue,
      pct: h.allocationPct,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [data]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  const d = data;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Financial Advisor"
        description="Track your treasury, understand your assets, and discover market opportunities."
        end={
          <div className="flex flex-wrap items-center gap-2">
            <FaSegmentedTabs
              tabs={TIME_RANGES.map((r) => ({ id: r.value, label: r.label }))}
              value={range}
              onChange={(id) => setRange(id as FaTimeRange)}
            />
            <Button variant="outline" size="sm" onClick={() => void load(true)} disabled={refreshing}>
              <RefreshCcw className={cn("mr-1.5 h-3.5 w-3.5", refreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button asChild size="sm">
              <Link href={marketsHref}>
                Stellar Markets
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Total Treasury Value"
          value={d?.totalTreasuryUsdFormatted ?? "$0.00"}
          sub={
            d?.changePeriodPct != null ? (
              <span className={d.changePeriodPct >= 0 ? "text-emerald-600" : "text-red-500"}>
                {formatPct(d.changePeriodPct)} {d.changePeriodLabel}
              </span>
            ) : (
              "USD equivalent"
            )
          }
          icon={Wallet}
        />
        <MetricCard
          label="Portfolio Performance"
          value={d ? formatCompactUsd(d.unrealizedGainLossUsd + d.realizedGainLossUsd) : "$0.00"}
          sub="Unrealized tracking (MVP)"
          icon={TrendingUp}
          accent="green"
        />
        <MetricCard
          label="Assets Held"
          value={String(d?.assetsHeld ?? 0)}
          sub="Distinct assets in treasury"
          icon={BarChart3}
        />
        <MetricCard
          label="Incoming Payments"
          value={d ? formatCompactUsd(d.paymentInflow.thisMonth) : "$0.00"}
          sub={
            d?.paymentInflow.changeFromLastMonthPct != null ? (
              <span>{formatPct(d.paymentInflow.changeFromLastMonthPct)} vs last month</span>
            ) : (
              `${d?.paymentInflow.transactionCount ?? 0} transactions`
            )
          }
          icon={TrendingUp}
          accent="amber"
        />
        <MetricCard
          label="Treasury Health Score"
          value={
            <>
              {d?.healthScore ?? "—"}
              <span className="text-base font-normal text-slate-400"> /100</span>
            </>
          }
          sub={d?.healthLabel ?? "—"}
          icon={Sparkles}
          accent="green"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className={cn(t.panel, "lg:col-span-7 p-4")}>
          <h2 className={cn("mb-1 text-sm font-semibold", t.title)}>Treasury Growth</h2>
          <p className={cn("mb-3 text-xs", t.muted)}>Total treasury value over time</p>
          <div className="h-52">
            {d && d.treasurySeries.length >= 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d.treasurySeries}>
                  <defs>
                    <linearGradient id="faTreasuryFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v: number) => [formatCompactUsd(v), "Treasury"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="valueUsd" stroke="#60a5fa" fill="url(#faTreasuryFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">Not enough data yet</div>
            )}
          </div>
        </div>

        <div className={cn(t.panel, "lg:col-span-5 p-4")}>
          <h2 className={cn("mb-1 text-sm font-semibold", t.title)}>Asset Allocation</h2>
          <p className={cn("mb-3 text-xs", t.muted)}>Distribution by USD value</p>
          {allocationData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="relative h-40 w-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocationData} dataKey="value" innerRadius={44} outerRadius={64} paddingAngle={2} stroke="none">
                      {allocationData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex min-w-0 flex-1 flex-col gap-2">
                {allocationData.map((a) => (
                  <li key={a.name}>
                    <Link
                      href={assetHref(a.name)}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2 text-xs font-medium text-slate-800">
                        <FaTokenIcon symbol={a.name} size={18} />
                        {a.name}
                      </span>
                      <span className="text-xs tabular-nums text-slate-600">{a.pct}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-slate-400">No holdings yet</div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cn(t.panel, "p-4")}>
          <h2 className={cn("mb-1 text-sm font-semibold", t.title)}>Payment Inflows</h2>
          <p className={cn("mb-3 text-xs", t.muted)}>Volume by day (last 7 days)</p>
          <div className="h-44">
            {d && d.paymentSeries.some((p) => p.volume > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.paymentSeries}>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number) => [formatCompactUsd(v), "Volume"]} />
                  <Bar dataKey="volume" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">No payment inflows yet</div>
            )}
          </div>
        </div>

        <div className={cn(t.panel, "overflow-hidden p-0")}>
          <div className={cn("border-b px-4 py-3", t.dark ? "border-white/10" : "border-slate-100")}>
            <h2 className={cn("text-sm font-semibold", t.title)}>Asset Performance</h2>
            <p className={cn("text-xs", t.muted)}>Holdings vs market movement</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-2 font-medium">Asset</th>
                  <th className="px-2 py-2 font-medium">Value</th>
                  <th className="px-2 py-2 font-medium">24h</th>
                  <th className="px-2 py-2 font-medium">Alloc</th>
                </tr>
              </thead>
              <tbody>
                {(d?.holdings ?? []).map((h) => (
                  <tr key={h.symbol} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-2.5">
                      <Link href={assetHref(h.symbol)} className="flex items-center gap-2 font-medium text-slate-800 hover:text-blue-600">
                        <FaTokenIcon symbol={h.symbol} size={18} />
                        {h.symbol}
                      </Link>
                    </td>
                    <td className="px-2 py-2.5 tabular-nums text-slate-700">{formatCompactUsd(h.usdValue)}</td>
                    <td className="px-2 py-2.5">
                      <FaChangeBadge value={h.change24hPct} />
                    </td>
                    <td className="px-2 py-2.5 tabular-nums text-slate-600">{h.allocationPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={cn(t.panel, "p-4")}>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <div>
            <h2 className={cn("text-sm font-semibold", t.title)}>AI Advisor Insights</h2>
            <p className={cn("text-xs", t.muted)}>Actionable treasury intelligence</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(d?.insights ?? []).map((insight) => (
            <div key={insight.id} className={cn("rounded-xl border p-3", t.dark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50/50")}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className={cn("text-sm font-medium leading-snug", t.title)}>{insight.title}</p>
                <FaRiskBadge level={insight.riskLevel} />
              </div>
              <p className="mb-2 text-xs leading-relaxed text-slate-600">{insight.explanation}</p>
              <p className="text-[11px] font-medium text-blue-700">{insight.suggestedAction}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-400">{d?.disclaimer}</p>
    </div>
  );
}
