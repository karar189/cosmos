"use client";

import Image from "next/image";
import { cn } from "@/utils";
import { paymentAssetLogo, type PaymentAssetCode } from "@/lib/stellar-assets";
import { assetLogo } from "@/lib/financial-advisor/prices";
import { formatPct } from "@/lib/financial-advisor/insights";
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";

export function useFaTheme() {
  const { theme } = useDashboardTheme();
  const dark = theme === "dark";

  return {
    dark,
    panel: dark
      ? "rounded-2xl border border-white/10 bg-slate-900/90 shadow-sm"
      : "rounded-2xl border border-slate-200/90 bg-white shadow-sm",
    title: dark ? "text-slate-50" : "text-slate-900",
    muted: dark ? "text-slate-400" : "text-slate-500",
    tabGroup: dark
      ? "rounded-lg border border-white/10 bg-slate-950/80 p-0.5"
      : "rounded-lg border border-slate-200 bg-slate-100/90 p-0.5",
    tabActive: dark
      ? "bg-white/15 text-white shadow-sm"
      : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80",
    tabInactive: dark
      ? "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      : "text-slate-600 hover:bg-white/60 hover:text-slate-900",
  };
}

/** @deprecated Use useFaTheme().panel */
export const faPanel = "rounded-2xl border border-slate-200/90 bg-white shadow-sm";

type SegmentedTab = { id: string; label: string };

export function FaSegmentedTabs({
  tabs,
  value,
  onChange,
  size = "md",
}: {
  tabs: SegmentedTab[];
  value: string;
  onChange: (id: string) => void;
  size?: "sm" | "md";
}) {
  const t = useFaTheme();
  const pad = size === "sm" ? "px-2.5 py-1" : "px-2.5 py-1.5";

  return (
    <div className={cn("flex flex-wrap gap-0.5", t.tabGroup)}>
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-md text-xs font-medium transition-colors",
              pad,
              active ? t.tabActive : t.tabInactive
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function FaTokenIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const src =
    symbol === "AQUA"
      ? assetLogo(symbol)
      : paymentAssetLogo(symbol as PaymentAssetCode);
  return (
    <Image
      src={src}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full"
      unoptimized
    />
  );
}

export function FaChangeBadge({ value, className }: { value: number | null; className?: string }) {
  if (value == null || !Number.isFinite(value)) {
    return <span className={cn("text-xs text-slate-400", className)}>—</span>;
  }
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "text-xs font-semibold tabular-nums",
        positive ? "text-emerald-600" : "text-red-500",
        className
      )}
    >
      {formatPct(value)}
    </span>
  );
}

export function FaRiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    medium: "bg-amber-50 text-amber-800 border-amber-100",
    high: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase", styles[level])}>
      {level} risk
    </span>
  );
}

export function formatCompactUsd(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US");
}
