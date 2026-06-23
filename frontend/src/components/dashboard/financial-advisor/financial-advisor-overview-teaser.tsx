"use client";

import Link from "next/link";
import { ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { FaRiskBadge, faPanel } from "@/components/dashboard/financial-advisor/financial-advisor-shared";
import type { FaTreasurySnapshot } from "@/lib/financial-advisor/types";

type Props = {
  data: FaTreasurySnapshot | null;
  loading?: boolean;
  href: string;
  compact?: boolean;
};

export function FinancialAdvisorOverviewTeaser({ data, loading, href, compact }: Props) {
  if (loading) {
    return (
      <div className={cn(faPanel, "flex items-center justify-center p-4")}>
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn(faPanel, "flex flex-col justify-center gap-3 p-4")}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">Financial Advisor</h2>
        </div>
        <p className="text-xs text-slate-500">Connect a workspace to track treasury intelligence.</p>
        <Button asChild variant="outline" size="sm" className="w-fit text-xs">
          <Link href={href}>Open Financial Advisor</Link>
        </Button>
      </div>
    );
  }

  const topInsights = data.insights.slice(0, compact ? 2 : 3);

  return (
    <div className={cn(faPanel, "flex flex-col p-4")}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Financial Advisor</h2>
          </div>
          <p className="text-xs text-slate-500">AI treasury insights</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs text-slate-500">
          <Link href={href}>
            Open
            <ArrowUpRight className="ml-0.5 h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="mb-3 flex items-baseline justify-between gap-2 rounded-xl bg-slate-50/80 px-3 py-2.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Treasury Health</p>
          <p className="text-xl font-semibold tabular-nums text-slate-900">
            {data.healthScore}
            <span className="text-sm font-normal text-slate-400"> /100</span>
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {data.healthLabel}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {topInsights.map((insight) => (
          <li key={insight.id} className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
            <p className="line-clamp-2 text-[11px] font-medium leading-snug text-slate-800">{insight.title}</p>
            <div className="mt-1.5">
              <FaRiskBadge level={insight.riskLevel} />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[10px] tabular-nums text-slate-400">
        {data.totalTreasuryUsdFormatted} total treasury
      </p>
    </div>
  );
}
