"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Clock,
  Link2,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  CreditCard,
  BarChart3,
  Sparkles,
  Inbox,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

const HYPERTRON_CHART = {
  blue: "#60a5fa",
  blueFill: "rgba(96, 165, 250, 0.14)",
  amber: "#fbbf24",
  red: "#fca5a5",
  sky: "#7dd3fc",
} as const;

type DashboardStats = {
  totalReceivedXlm: string;
  linkCount: number;
  completed: number;
  pending: number;
};

type VaultInfo = {
  hasVault: boolean;
  balance: {
    xlm: string;
    usdc: string;
    xlmRaw: number;
    usdcRaw: number;
  } | null;
};

type LiveEvent = {
  linkId: string;
  amount: string | null;
  currency?: string;
  purpose?: string;
  clientName?: string;
  paidAt?: string;
  createdAt: string;
};

type WorkspaceOverviewDashboardProps = {
  businessId: string | null;
  workspaceName: string;
  userName: string;
  userInitials: string;
};

const overviewStyles = {
  panel: "rounded-2xl border border-slate-200/90 bg-white shadow-sm",
  title: "text-slate-900",
  muted: "text-slate-500",
  tick: "rgba(45, 52, 130, 0.45)",
} as const;

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildTreasurySeries(events: LiveEvent[]): { date: string; value: number }[] {
  const paid = events.filter((e) => e.paidAt && e.amount);
  if (paid.length === 0) return [];

  const byDay = new Map<string, number>();
  for (const e of paid) {
    const d = new Date(e.paidAt!);
    if (Number.isNaN(d.getTime())) continue;
    const key = d.toISOString().slice(0, 10);
    const amt = parseFloat(String(e.amount));
    if (!Number.isFinite(amt)) continue;
    byDay.set(key, (byDay.get(key) ?? 0) + amt);
  }

  const days = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));
  if (days.length < 2) return [];

  let cumulative = 0;
  return days.map(([iso, value]) => {
    cumulative += value;
    const d = new Date(`${iso}T12:00:00`);
    const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { date, value: cumulative };
  });
}

function ChartEmptyState({ message, compact }: { message: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-1.5 px-4 text-center",
        compact ? "min-h-[7rem]" : "min-h-[10rem]"
      )}
    >
      <BarChart3 className={cn("text-slate-300", compact ? "h-6 w-6" : "h-8 w-8")} />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

function ComingSoonState({ title, compact }: { title?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 text-center",
        compact ? "py-4" : "flex-1 py-8"
      )}
    >
      <Sparkles className={cn("text-slate-300", compact ? "h-6 w-6" : "h-7 w-7")} />
      {title ? <p className="text-sm font-semibold text-slate-700">{title}</p> : null}
      <p className="text-sm text-slate-500">Coming soon</p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  loading,
  styles,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Wallet;
  loading?: boolean;
  styles: typeof overviewStyles;
}) {
  return (
    <div className={cn(styles.panel, "flex flex-col gap-3 p-4")}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Icon className="h-4 w-4" />
        </span>
        <span className={cn("text-xs font-medium", styles.muted)}>{label}</span>
      </div>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      ) : (
        <p className={cn("text-2xl font-semibold tracking-tight", styles.title)}>{value}</p>
      )}
      <p className={cn("text-xs", styles.muted)}>{sub}</p>
    </div>
  );
}

export function WorkspaceOverviewDashboard({
  businessId,
  workspaceName: _workspaceName,
  userName: _userName,
  userInitials: _userInitials,
}: WorkspaceOverviewDashboardProps) {
  const styles = overviewStyles;
  const areaFill = HYPERTRON_CHART.blueFill;
  const areaStroke = HYPERTRON_CHART.blue;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vault, setVault] = useState<VaultInfo | null>(null);
  const [events, setEvents] = useState<LiveEvent[]>([]);

  const loadData = useCallback(async () => {
    if (!businessId) {
      setStats(null);
      setVault(null);
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [statsRes, vaultRes, eventsRes] = await Promise.all([
        fetch(`/api/dashboard-stats?businessId=${encodeURIComponent(businessId)}`, {
          credentials: "same-origin",
        }),
        fetch(`/api/vault/treasury?businessId=${encodeURIComponent(businessId)}`, {
          credentials: "same-origin",
        }),
        fetch(`/api/events?businessId=${encodeURIComponent(businessId)}`, {
          credentials: "same-origin",
        }),
      ]);

      if (statsRes.ok) {
        setStats((await statsRes.json()) as DashboardStats);
      } else {
        setStats({ totalReceivedXlm: "0.0000", linkCount: 0, completed: 0, pending: 0 });
      }

      if (vaultRes.ok) {
        setVault((await vaultRes.json()) as VaultInfo);
      } else {
        setVault({ hasVault: false, balance: null });
      }

      if (eventsRes.ok) {
        const body = (await eventsRes.json()) as { events?: LiveEvent[] };
        setEvents(Array.isArray(body.events) ? body.events : []);
      } else {
        setEvents([]);
      }
    } catch {
      setStats({ totalReceivedXlm: "0.0000", linkCount: 0, completed: 0, pending: 0 });
      setVault({ hasVault: false, balance: null });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const treasurySeries = useMemo(() => buildTreasurySeries(events), [events]);

  const assetBreakdown = useMemo(() => {
    if (vault?.hasVault && vault.balance) {
      return [
        { name: "USDC", value: `$${vault.balance.usdc}` },
        { name: "XLM", value: vault.balance.xlm },
      ];
    }
    return [];
  }, [vault]);

  const treasuryDisplay = useMemo(() => {
    if (vault?.hasVault && vault.balance) {
      const usdc = vault.balance.usdcRaw;
      const xlm = vault.balance.xlmRaw;
      if (usdc > 0 || xlm > 0) {
        if (usdc > 0 && xlm > 0) return `$${vault.balance.usdc} · ${vault.balance.xlm} XLM`;
        if (usdc > 0) return `$${vault.balance.usdc}`;
        return `${vault.balance.xlm} XLM`;
      }
    }
    const received = parseFloat(stats?.totalReceivedXlm ?? "0");
    if (Number.isFinite(received) && received > 0) {
      return `${stats!.totalReceivedXlm} XLM`;
    }
    return "$0.00";
  }, [vault, stats]);

  const paymentStatus = useMemo(() => {
    const completed = stats?.completed ?? 0;
    const pending = stats?.pending ?? 0;
    const total = stats?.linkCount ?? 0;
    if (total === 0) return [];

    const pct = (n: number) => Math.round((n / total) * 100);
    const slices = [
      { name: "Completed", count: completed, color: HYPERTRON_CHART.blue },
      { name: "Pending", count: pending, color: HYPERTRON_CHART.amber },
    ].filter((s) => s.count > 0);

    return slices.map((s) => ({
      name: s.name,
      value: pct(s.count),
      count: s.count,
      color: s.color,
    }));
  }, [stats]);

  const recentActivity = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const ta = new Date(a.paidAt || a.createdAt).getTime();
        const tb = new Date(b.paidAt || b.createdAt).getTime();
        return tb - ta;
      })
      .slice(0, 5)
      .map((e) => {
        const paid = Boolean(e.paidAt);
        const label = (e.clientName || e.purpose || "Payment link").trim();
        const amt = e.amount ? parseFloat(String(e.amount)) : NaN;
        const currency = e.currency === "XLM" ? "XLM" : "USDC";
        const amountStr = Number.isFinite(amt)
          ? amt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : null;

        return {
          id: e.linkId,
          icon: paid ? CreditCard : Clock,
          text: paid
            ? amountStr
              ? `Payment received — ${amountStr} ${currency} from ${label}`
              : `Payment received from ${label}`
            : `Payment link created — ${label}`,
          time: formatTimeAgo(e.paidAt || e.createdAt),
        };
      });
  }, [events]);

  const d = stats ?? { totalReceivedXlm: "0.0000", linkCount: 0, completed: 0, pending: 0 };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Total Treasury"
          value={treasuryDisplay}
          sub={vault?.hasVault ? "Vault balance" : "Received via payment links"}
          icon={Wallet}
          loading={loading}
          styles={styles}
        />
        <KpiCard
          label="Total Received"
          value={`${d.totalReceivedXlm} XLM`}
          sub="All-time from payment links"
          icon={TrendingUp}
          loading={loading}
          styles={styles}
        />
        <KpiCard
          label="Payment Links"
          value={String(d.linkCount)}
          sub="Active links"
          icon={Link2}
          loading={loading}
          styles={styles}
        />
        <KpiCard
          label="Completed"
          value={String(d.completed)}
          sub="Successful payments"
          icon={CheckCircle2}
          loading={loading}
          styles={styles}
        />
        <KpiCard
          label="Pending"
          value={String(d.pending)}
          sub="Awaiting payment"
          icon={Clock}
          loading={loading}
          styles={styles}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className={cn(styles.panel, "lg:col-span-5 p-4")}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className={cn("text-sm font-semibold", styles.title)}>Treasury Overview</h2>
              <p className={cn("text-xs", styles.muted)}>Cumulative received over time</p>
            </div>
            <TrendingUp className={cn("h-4 w-4", styles.muted)} />
          </div>
          <div className="h-40">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              </div>
            ) : treasurySeries.length >= 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={treasurySeries}>
                  <defs>
                    <linearGradient id="treasuryFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={areaFill} stopOpacity={1} />
                      <stop offset="100%" stopColor={areaFill} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: styles.tick, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                    }}
                    formatter={(v: number) => [v.toLocaleString(), "Received"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={areaStroke}
                    fill="url(#treasuryFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState message="Not enough data" compact />
            )}
          </div>
          {assetBreakdown.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              {assetBreakdown.map((a) => (
                <div key={a.name}>
                  <p className={cn("text-[10px] font-medium uppercase tracking-wide", styles.muted)}>
                    {a.name}
                  </p>
                  <p className={cn("text-sm font-semibold", styles.title)}>{a.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className={cn(styles.panel, "lg:col-span-4 flex flex-col p-4")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Operations Overview</h2>
          <ComingSoonState compact />
        </div>

        <div className={cn(styles.panel, "lg:col-span-3 flex flex-col p-4")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Recent Activity</h2>
          {loading ? (
            <div className="flex flex-1 items-center justify-center py-5">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-5 text-center">
              <Inbox className="h-7 w-7 text-slate-300" />
              <p className="text-sm text-slate-500">No recent activity</p>
            </div>
          ) : (
            <ul className="mt-3 flex flex-1 flex-col gap-2.5">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <item.icon className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn("line-clamp-2 text-xs leading-snug", styles.title)}
                      title={item.text}
                    >
                      {item.text}
                    </p>
                    <p className={cn("mt-0.5 text-[10px]", styles.muted)}>{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className={cn(styles.panel, "p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Payments</h2>
          {loading ? (
            <div className="flex h-44 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : paymentStatus.length === 0 ? (
            <div className="mt-2">
              <ChartEmptyState message="Not enough data" />
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-4">
              <div className="h-40 w-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatus}
                      dataKey="value"
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={2}
                    >
                      {paymentStatus.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex flex-1 flex-col gap-2 text-xs">
                {paymentStatus.map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      <span className={styles.muted}>{s.name}</span>
                    </span>
                    <span className={cn("font-semibold", styles.title)}>
                      {s.value}% ({s.count})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={cn(styles.panel, "p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Top Expenses</h2>
          <ComingSoonState />
        </div>

        <div className={cn(styles.panel, "p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Compliance News</h2>
          <ComingSoonState />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className={cn("text-[10px] font-semibold uppercase tracking-wide", styles.muted)}>
            Regulatory Watch & Risk Overview
          </p>
          <p className={cn("text-sm", styles.muted)}>Coming soon</p>
        </div>
        <Button asChild variant="outline" className="rounded-lg border-slate-200">
          <Link href="/dashboard/compliance-analysis">
            View Risk Report
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
