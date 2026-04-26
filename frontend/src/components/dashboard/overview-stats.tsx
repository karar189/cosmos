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
}

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
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 flex flex-col gap-4 hover:bg-white/[0.05] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/35 tracking-widest uppercase">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]">
          <Icon className="h-3.5 w-3.5 text-white/40" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs text-white/30">{sub}</span>
      </div>
    </div>
  );
}

export function OverviewStats({ businessId }: OverviewStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!businessId) {
      setStats(fallbackDashboardStats);
      return;
    }
    let cancelled = false;
    fetch(`/api/dashboard-stats?businessId=${encodeURIComponent(businessId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setStats({
            totalReceivedXlm: data.totalReceivedXlm ?? "0",
            linkCount: data.linkCount ?? 0,
            completed: data.completed ?? 0,
            pending: data.pending ?? 0,
          });
          return;
        }
        setStats(fallbackDashboardStats);
      })
      .catch(() => {
        if (!cancelled) setStats(fallbackDashboardStats);
      });
    return () => { cancelled = true; };
  }, [businessId]);

  const d = stats ?? fallbackDashboardStats;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Received" sub="All-time from payment links" icon={DollarSign} value={`${d.totalReceivedXlm} XLM`} />
      <StatCard label="Payment Links" sub="Active links" icon={Link2} value={String(d.linkCount || "—")} />
      <StatCard label="Completed" sub="Successful payments" icon={CheckCircle} value={String(d.completed || "—")} />
      <StatCard label="Pending" sub="Awaiting payment" icon={Clock} value={String(d.pending || "—")} />
    </div>
  );
}
