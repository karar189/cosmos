"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

type EventRecord = {
  amount?: string;
  paidAt?: string;
};

type ChartPoint = {
  name: string;
  total: number;
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/80 px-3 py-2 backdrop-blur-sm">
      <p className="text-[11px] text-white/40 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white">{payload[0].value.toLocaleString()} XLM</p>
    </div>
  );
}

type OverviewChartProps = {
  businessId: string | null;
  /** When true, show empty state instead of chart (onboarding not completed). */
  onboardingIncomplete?: boolean;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function OverviewChart({ businessId, onboardingIncomplete }: OverviewChartProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!businessId || onboardingIncomplete) {
      setEvents([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    fetch(`/api/events?businessId=${encodeURIComponent(businessId)}`, {
      credentials: "same-origin",
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof json?.error === "string" ? json.error : `Failed to load chart data (${res.status})`
          );
        }
        return json as { events?: EventRecord[] };
      })
      .then((json) => {
        if (cancelled) return;
        setEvents(Array.isArray(json.events) ? json.events : []);
      })
      .catch((e) => {
        if (cancelled) return;
        setEvents([]);
        setError(e instanceof Error ? e.message : "Could not load monthly revenue");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, onboardingIncomplete]);

  const data = useMemo<ChartPoint[]>(() => {
    const totals = new Array<number>(12).fill(0);
    for (const ev of events) {
      if (!ev.paidAt) continue;
      const d = new Date(ev.paidAt);
      if (Number.isNaN(d.getTime())) continue;
      const amt = parseFloat(String(ev.amount ?? "").trim());
      if (!Number.isFinite(amt) || amt < 0) continue;
      totals[d.getMonth()] += amt;
    }
    return MONTHS.map((name, idx) => ({ name, total: Number(totals[idx].toFixed(2)) }));
  }, [events]);

  if (onboardingIncomplete) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 text-center">
        <p className="text-sm font-medium text-white/50">No revenue data yet</p>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/35">
          Complete the onboarding quiz to unlock your dashboard metrics and charts.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.02] text-sm text-white/40">
        Loading revenue…
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 text-center">
        <p className="text-sm text-white/40">Connect wallet to load revenue data.</p>
      </div>
    );
  }

  return (
    <>
      {error && <p className="mb-3 text-xs text-destructive">{error}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={18}>
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="total" fill="rgba(139, 92, 246, 0.7)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
