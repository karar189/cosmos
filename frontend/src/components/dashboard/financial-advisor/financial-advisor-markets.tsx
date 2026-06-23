"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import {
  FaChangeBadge,
  FaTokenIcon,
  FaSegmentedTabs,
  useFaTheme,
  formatCompactUsd,
} from "@/components/dashboard/financial-advisor/financial-advisor-shared";
import type { FaMarketsResponse, FaMarketAsset } from "@/lib/financial-advisor/types";
import { cn } from "@/utils";

type Props = {
  advisorHref: string;
  assetHref: (symbol: string) => string;
  fetchMarkets: () => Promise<FaMarketsResponse>;
};

export function FinancialAdvisorMarkets({ advisorHref, assetHref, fetchMarkets }: Props) {
  const t = useFaTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FaMarketsResponse | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchMarkets());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchMarkets]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.assets.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (!q) return true;
      return a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
    });
  }, [data, search, category]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Stellar Markets"
        description="Track Stellar assets, market movements, and AI-powered analysis."
        end={
          <Link href={advisorHref} className="text-sm font-medium text-blue-600 hover:underline">
            Back to Financial Advisor
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <HighlightCard title="Top Gainers" icon={TrendingUp} assets={data?.topGainers ?? []} assetHref={assetHref} positive theme={t} />
        <HighlightCard title="Top Losers" icon={TrendingDown} assets={data?.topLosers ?? []} assetHref={assetHref} theme={t} />
        <div className={cn(t.panel, "p-4")}>
          <p className={cn("text-xs font-semibold uppercase tracking-wide", t.muted)}>Hypertron Payments</p>
          <ul className="mt-3 space-y-2">
            {(data?.assets.filter((a) => a.supportedByHypertron) ?? []).slice(0, 3).map((a) => (
              <li key={a.symbol}>
                <Link href={assetHref(a.symbol)} className="flex items-center justify-between text-xs hover:text-blue-600">
                  <span className="flex items-center gap-2 font-medium">
                    <FaTokenIcon symbol={a.symbol} size={16} />
                    {a.symbol}
                  </span>
                  <FaChangeBadge value={a.change24hPct} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={cn(t.panel, "p-4")}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="pl-9"
            />
          </div>
          <FaSegmentedTabs
            tabs={[
              { id: "all", label: "All" },
              { id: "stablecoin", label: "Stablecoins" },
              { id: "native", label: "Native" },
              { id: "defi", label: "DeFi" },
            ]}
            value={category}
            onChange={setCategory}
            size="sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
                <th className="px-2 py-2 font-medium">Asset</th>
                <th className="px-2 py-2 font-medium">Price</th>
                <th className="px-2 py-2 font-medium">1h</th>
                <th className="px-2 py-2 font-medium">24h</th>
                <th className="px-2 py-2 font-medium">7d</th>
                <th className="px-2 py-2 font-medium">Market Cap</th>
                <th className="px-2 py-2 font-medium">Volume</th>
                <th className="px-2 py-2 font-medium">Risk</th>
                <th className="px-2 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.symbol} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-2 py-3">
                    <Link href={assetHref(a.symbol)} className={cn("flex items-center gap-2 font-medium hover:text-blue-600", t.title)}>
                      <FaTokenIcon symbol={a.symbol} size={22} />
                      <span>
                        {a.name}
                        <span className="ml-1.5 text-slate-400">{a.symbol}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-2 py-3 tabular-nums">${a.priceUsd < 1 ? a.priceUsd.toFixed(4) : a.priceUsd.toFixed(2)}</td>
                  <td className="px-2 py-3"><FaChangeBadge value={a.change1hPct} /></td>
                  <td className="px-2 py-3"><FaChangeBadge value={a.change24hPct} /></td>
                  <td className="px-2 py-3"><FaChangeBadge value={a.change7dPct} /></td>
                  <td className="px-2 py-3 tabular-nums text-slate-600">{formatCompactUsd(a.marketCapUsd)}</td>
                  <td className="px-2 py-3 tabular-nums text-slate-600">{formatCompactUsd(a.volume24hUsd)}</td>
                  <td className="px-2 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {a.riskScore}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <Link href={assetHref(a.symbol)} className="inline-flex items-center text-blue-600 hover:underline">
                      View
                      <ArrowUpRight className="ml-0.5 h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No assets match your filters.</p>
        ) : null}
      </div>
    </div>
  );
}

function HighlightCard({
  title,
  icon: Icon,
  assets,
  assetHref,
  positive,
  theme,
}: {
  title: string;
  icon: typeof TrendingUp;
  assets: FaMarketAsset[];
  assetHref: (s: string) => string;
  positive?: boolean;
  theme: ReturnType<typeof useFaTheme>;
}) {
  return (
    <div className={cn(theme.panel, "p-4")}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("h-4 w-4", positive ? "text-emerald-600" : "text-red-500")} />
        <h3 className={cn("text-sm font-semibold", theme.title)}>{title}</h3>
      </div>
      <ul className="space-y-2">
        {assets.map((a) => (
          <li key={a.symbol}>
            <Link href={assetHref(a.symbol)} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-800">
                <FaTokenIcon symbol={a.symbol} size={16} />
                {a.symbol}
              </span>
              <FaChangeBadge value={a.change24hPct} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
