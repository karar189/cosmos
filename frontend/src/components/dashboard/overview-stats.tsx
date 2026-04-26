"use client";

import { useState, useEffect } from "react";
import { DollarSign, Link2, CheckCircle, Clock } from "lucide-react";
import { fallbackDashboardStats } from "@/data/fallback";

interface Stats {
  totalReceivedXlm: string;
  linkCount: number;
  completed: number;
  pending: number;
}

interface OverviewStatsProps {
  businessId: string | null;
  /** When true, show NA placeholders instead of metrics (onboarding not completed). */
  onboardingIncomplete?: boolean;
}

/** Matches SolutionSection accent */
const ACCENT_BAR = "#FFF971";

function StatCard({
  label,
  sub,
  icon: Icon,
  value,
}: {
  label: string;
  sub: string;
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.2]">
      <div className="flex items-start justify-between gap-3">
        <div
          className="mt-1 h-0.5 w-10 shrink-0 rounded-full transition-[width] group-hover:w-14"
          style={{ backgroundColor: ACCENT_BAR }}
          aria-hidden
        />
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{value}</span>
        <span className="text-xs leading-relaxed text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}

export function OverviewStats({ businessId, onboardingIncomplete }: OverviewStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(fallbackDashboardStats);
  }, [businessId]);

  const d = stats ?? fallbackDashboardStats;

  if (onboardingIncomplete) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Received" sub="Complete onboarding to see metrics" icon={DollarSign} value="NA" />
        <StatCard label="Payment Links" sub="Complete onboarding to see metrics" icon={Link2} value="NA" />
        <StatCard label="Completed" sub="Complete onboarding to see metrics" icon={CheckCircle} value="NA" />
        <StatCard label="Pending" sub="Complete onboarding to see metrics" icon={Clock} value="NA" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Received" sub="All-time from payment links" icon={DollarSign} value={`${d.totalReceivedXlm} XLM`} />
      <StatCard label="Payment Links" sub="Active links" icon={Link2} value={String(d.linkCount || "—")} />
      <StatCard label="Completed" sub="Successful payments" icon={CheckCircle} value={String(d.completed || "—")} />
      <StatCard label="Pending" sub="Awaiting payment" icon={Clock} value={String(d.pending || "—")} />
    </div>
  );
}
