"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, ExternalLink, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import {
  FaChangeBadge,
  FaTokenIcon,
  faPanel,
  formatCompactUsd,
} from "@/components/dashboard/financial-advisor/financial-advisor-shared";
import type { FaAssetDetail } from "@/lib/financial-advisor/types";
import { cn } from "@/utils";

type Props = {
  symbol: string;
  marketsHref: string;
  fetchAsset: (symbol: string) => Promise<FaAssetDetail | null>;
};

export function FinancialAdvisorAssetDetail({ symbol, marketsHref, fetchAsset }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FaAssetDetail | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchAsset(symbol));
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchAsset, symbol]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-slate-500">Asset not found.</p>
        <Button asChild variant="outline">
          <Link href={marketsHref}>Back to Markets</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={marketsHref} className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Stellar Markets
        </Link>
        <DashboardPageHeader
          title={
            <span className="flex items-center gap-3">
              <FaTokenIcon symbol={data.symbol} size={40} />
              {data.name}
              <span className="text-2xl font-normal text-slate-400">{data.symbol}</span>
            </span>
          }
          description={`${data.assetType} · Issued by ${data.issuer}`}
          end={
            <div className="text-right">
              <p className="text-3xl font-semibold tabular-nums text-slate-900">
                ${data.priceUsd < 1 ? data.priceUsd.toFixed(4) : data.priceUsd.toFixed(2)}
              </p>
              <FaChangeBadge value={data.change24hPct} className="text-sm" />
            </div>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Market Cap", value: formatCompactUsd(data.marketCapUsd) },
          { label: "24h Volume", value: formatCompactUsd(data.volume24hUsd) },
          { label: "Security Score", value: `${data.securityScore}/100` },
          { label: "AI Sentiment", value: data.sentiment },
        ].map((item) => (
          <div key={item.label} className={cn(faPanel, "p-4")}>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className={cn(faPanel, "p-4")}>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Price Chart</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.priceHistory}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(4)}`, "Price"]} />
              <Line type="monotone" dataKey="price" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cn(faPanel, "p-4")}>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Asset Overview</h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">{data.description}</p>
          <dl className="grid gap-2 text-xs">
            <div className="flex justify-between border-b border-slate-50 py-2">
              <dt className="text-slate-500">Primary use case</dt>
              <dd className="font-medium text-slate-800">{data.primaryUseCase}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-50 py-2">
              <dt className="text-slate-500">Hypertron payments</dt>
              <dd className="font-medium text-slate-800">{data.supportedByHypertron ? "Supported" : "Not yet"}</dd>
            </div>
          </dl>
        </div>

        <div className={cn(faPanel, "p-4")}>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">AI Token Analysis</h2>
          </div>
          <p className="mb-2 text-xs font-semibold text-slate-700">Recommendation: {data.aiRecommendation}</p>
          <p className="mb-3 text-xs leading-relaxed text-slate-600">{data.shortTermOutlook}</p>
          <p className="text-xs leading-relaxed text-slate-600">{data.longTermOutlook}</p>
        </div>
      </div>

      <div className={cn(faPanel, "p-4")}>
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-semibold text-slate-900">Security Score — {data.securityLabel}</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {data.riskCategories.map((r) => (
            <div key={r.name} className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-medium uppercase text-slate-500">{r.name}</p>
              <p className="text-sm font-semibold text-slate-800">
                {r.score}/100 · {r.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(faPanel, "border-blue-100 bg-blue-50/30 p-4")}>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Treasury Recommendation</h2>
        <p className="text-sm leading-relaxed text-slate-700">{data.treasuryRecommendation}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled>
            Create Price Alert
          </Button>
          <Button variant="outline" size="sm" disabled>
            Add to Watchlist
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a
              href={`https://stellar.expert/explorer/${process.env.NEXT_PUBLIC_STELLAR_NETWORK === "public" ? "public" : "testnet"}/asset/${data.symbol}-`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Stellar Explorer
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {data.news.length > 0 ? (
        <div className={cn(faPanel, "p-4")}>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Latest News</h2>
          <ul className="space-y-3">
            {data.news.map((n) => (
              <li key={n.headline} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-900">{n.headline}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {n.source} · {n.date}
                </p>
                <p className="mt-2 text-xs text-slate-600">{n.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
