"use client";

import Link from "next/link";
import { Info, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hubThemeClasses } from "@/components/dashboard/workspace-hub/workspace-hub-theme-classes";
import type { DashboardTheme } from "@/lib/dashboard-theme";
import { cn } from "@/utils";

export const PAYMENT_TABS = [
  { id: "collect", label: "Collect" },
  { id: "send", label: "Send" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "customers", label: "Customers" },
] as const;

export type PaymentTabId = (typeof PAYMENT_TABS)[number]["id"];

export type TransactionStatus = "Succeeded" | "Private" | "Refunded" | "Pending" | "Failed";

export type TransactionRow = {
  id: string;
  name: string;
  date: string;
  amount: string;
  currency: string;
  status: TransactionStatus;
};

export const COLLECT_TRANSACTIONS: TransactionRow[] = [
  { id: "1", name: "Riya Sharma", date: "May 28, 2:14 PM", amount: "+1,000.00", currency: "USDC", status: "Succeeded" },
  { id: "2", name: "Acme Corp", date: "May 27, 11:02 AM", amount: "+500.00", currency: "USDC", status: "Succeeded" },
  { id: "3", name: "Zara Ali", date: "May 26, 4:45 PM", amount: "+750.00", currency: "USDC", status: "Private" },
  { id: "4", name: "Neha Gupta", date: "May 25, 9:30 AM", amount: "-75.00", currency: "USDC", status: "Refunded" },
];

export const SEND_TRANSACTIONS: TransactionRow[] = [
  { id: "s1", name: "Dev Contractor", date: "May 28, 10:22 AM", amount: "-2,400.00", currency: "USDC", status: "Succeeded" },
  { id: "s2", name: "CloudHost Inc", date: "May 27, 3:15 PM", amount: "-890.00", currency: "USDC", status: "Succeeded" },
  { id: "s3", name: "Marcus Lee", date: "May 26, 9:00 AM", amount: "-500.00", currency: "USDC", status: "Pending" },
  { id: "s4", name: "Legal Partners", date: "May 24, 1:45 PM", amount: "-1,200.00", currency: "USDC", status: "Private" },
];

const VOLUME_SPARKLINE = [12, 18, 14, 22, 19, 28, 24, 32, 29, 35];
const PAYMENTS_SPARKLINE = [8, 12, 10, 16, 14, 18, 15, 22, 20, 24];
const SEND_SPARKLINE = [6, 9, 11, 8, 14, 12, 16, 13, 18, 15];
const SUBS_SPARKLINE = [4, 5, 6, 7, 8, 9, 10, 11, 12, 14];
const CUSTOMER_SPARKLINE = [18, 20, 22, 21, 24, 26, 28, 30, 32, 35];

export function usePaymentsStyles(theme: DashboardTheme) {
  const t = hubThemeClasses(theme);
  return {
    t,
    inputCls: cn(
      "h-10 border text-sm focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0",
      t.dark
        ? "border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/40"
        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500/40"
    ),
    labelCls: cn("text-sm font-medium", t.dark ? "text-slate-300" : "text-slate-700"),
    hintCls: cn("text-xs", t.pageSubheading),
    sectionTitle: cn("text-sm font-semibold", t.pageHeading),
    cardCls: cn("rounded-xl border p-4 lg:p-5", t.card),
    panelCls: cn(
      "flex flex-col gap-4 rounded-xl border p-5",
      t.dark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50/40"
    ),
  };
}

export function Sparkline({ points, strokeClass }: { points: number[]; strokeClass: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="shrink-0" aria-hidden>
      <polyline
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
        className={strokeClass}
      />
    </svg>
  );
}

export function SectionInfo({ className }: { className?: string }) {
  return (
    <Info
      className={cn("h-3.5 w-3.5 shrink-0 cursor-help opacity-60", className)}
      aria-hidden
    />
  );
}

export function StatusBadge({
  status,
  dark,
}: {
  status: TransactionStatus;
  dark: boolean;
}) {
  const styles: Record<TransactionStatus, string> = {
    Succeeded: cn(
      "border-emerald-200 bg-emerald-50 text-emerald-700",
      dark && "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
    ),
    Private: cn(
      "gap-1 border-blue-200 bg-blue-50 text-blue-700",
      dark && "border-blue-500/30 bg-blue-500/15 text-blue-300"
    ),
    Refunded: cn(
      "border-red-200 bg-red-50 text-red-600",
      dark && "border-red-500/30 bg-red-500/15 text-red-300"
    ),
    Pending: cn(
      "border-amber-200 bg-amber-50 text-amber-700",
      dark && "border-amber-500/30 bg-amber-500/15 text-amber-300"
    ),
    Failed: cn(
      "border-red-200 bg-red-50 text-red-600",
      dark && "border-red-500/30 bg-red-500/15 text-red-300"
    ),
  };

  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium", styles[status])}>
      {status === "Private" ? <Lock className="h-3 w-3" /> : null}
      {status}
    </Badge>
  );
}

export function PaymentTabsNav({
  activeTab,
  onTabChange,
  theme,
}: {
  activeTab: PaymentTabId;
  onTabChange: (tab: PaymentTabId) => void;
  theme: DashboardTheme;
}) {
  const t = hubThemeClasses(theme);

  return (
    <nav
      className={cn("flex gap-5 border-b", t.dark ? "border-white/10" : "border-slate-200")}
      aria-label="Payments sections"
    >
      {PAYMENT_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors",
              isActive
                ? t.dark
                  ? "text-blue-400"
                  : "text-blue-600"
                : cn(t.pageSubheading, "hover:text-slate-700", t.dark && "hover:text-slate-200")
            )}
          >
            {tab.label}
            {isActive ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

type SidebarInsight = {
  label: string;
  value: string;
  delta?: string;
  sparkline: number[];
  strokeClass: string;
};

function getSidebarConfig(tab: PaymentTabId, dark: boolean): {
  txTitle: string;
  txRows: TransactionRow[];
  insights: SidebarInsight[];
  insightPeriod: string;
} {
  const blueStroke = dark ? "stroke-blue-400" : "stroke-blue-600";
  const greenStroke = dark ? "stroke-emerald-400" : "stroke-emerald-600";
  const violetStroke = dark ? "stroke-violet-400" : "stroke-violet-600";

  switch (tab) {
    case "send":
      return {
        txTitle: "Recent Outgoing",
        txRows: SEND_TRANSACTIONS,
        insightPeriod: "This Week",
        insights: [
          { label: "Sent Volume", value: "$8,240.00", delta: "+8.2%", sparkline: SEND_SPARKLINE, strokeClass: blueStroke },
          { label: "Payments Sent", value: "12", delta: "+3", sparkline: PAYMENTS_SPARKLINE, strokeClass: greenStroke },
        ],
      };
    case "subscriptions":
      return {
        txTitle: "Recent Renewals",
        txRows: COLLECT_TRANSACTIONS.slice(0, 3),
        insightPeriod: "This Month",
        insights: [
          { label: "MRR", value: "$4,860.00", delta: "+18%", sparkline: SUBS_SPARKLINE, strokeClass: violetStroke },
          { label: "Active Subscribers", value: "47", delta: "+6", sparkline: CUSTOMER_SPARKLINE, strokeClass: greenStroke },
        ],
      };
    case "customers":
      return {
        txTitle: "Recent Activity",
        txRows: COLLECT_TRANSACTIONS,
        insightPeriod: "This Month",
        insights: [
          { label: "Total Customers", value: "128", delta: "+14", sparkline: CUSTOMER_SPARKLINE, strokeClass: blueStroke },
          { label: "Avg. Lifetime Value", value: "$892", delta: "+9.4%", sparkline: VOLUME_SPARKLINE, strokeClass: greenStroke },
        ],
      };
    default:
      return {
        txTitle: "Recent Transactions",
        txRows: COLLECT_TRANSACTIONS,
        insightPeriod: "This Week",
        insights: [
          { label: "Volume", value: "$12,420.00", delta: "+12.5%", sparkline: VOLUME_SPARKLINE, strokeClass: blueStroke },
          { label: "Successful Payments", value: "24", delta: "+20%", sparkline: PAYMENTS_SPARKLINE, strokeClass: greenStroke },
        ],
      };
  }
}

export function PaymentsSidebar({ tab, theme }: { tab: PaymentTabId; theme: DashboardTheme }) {
  const t = hubThemeClasses(theme);
  const { cardCls, sectionTitle } = usePaymentsStyles(theme);
  const config = getSidebarConfig(tab, t.dark);

  return (
    <aside className="flex min-w-0 flex-col gap-4">
      <div className={cardCls}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={sectionTitle}>Treasury Vault</h2>
            <SectionInfo className={t.cardMuted} />
          </div>
          <Link
            href="/dashboard/withdraw"
            className={cn(
              "text-xs font-medium text-blue-600 hover:text-blue-700",
              t.dark && "text-blue-400 hover:text-blue-300"
            )}
          >
            View all
          </Link>
        </div>
        <p className={cn("text-2xl font-semibold tracking-tight", t.pageHeading)}>
          42,140.00 <span className={cn("text-base font-normal", t.pageSubheading)}>USDC</span>
        </p>
        <p className={cn("mt-0.5 text-xs", t.pageSubheading)}>≈ $42,140.00 USD</p>
        <div className={cn("mt-4 space-y-1.5 border-t pt-4 text-sm", t.cardDivider)}>
          <div className="flex justify-between">
            <span className={t.cardRowLabel}>Available</span>
            <span className={cn("font-medium", t.cardRowValueStrong)}>38,210.00 USDC</span>
          </div>
          <div className="flex justify-between">
            <span className={t.cardRowLabel}>Pending</span>
            <span className={cn("font-medium", t.cardRowValueStrong)}>3,930.00 USDC</span>
          </div>
        </div>
        <Button
          variant="outline"
          className={cn(
            "mt-4 w-full border-blue-200 text-blue-600 hover:bg-blue-50",
            t.dark && "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          )}
          asChild
        >
          <Link href="/dashboard/withdraw">Withdraw / Redeem</Link>
        </Button>
      </div>

      <div className={cardCls}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={sectionTitle}>{config.txTitle}</h2>
          <button
            type="button"
            className={cn(
              "text-xs font-medium text-blue-600 hover:text-blue-700",
              t.dark && "text-blue-400 hover:text-blue-300"
            )}
          >
            View all
          </button>
        </div>
        <ul className="space-y-4">
          {config.txRows.map((tx) => (
            <li key={tx.id} className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    t.dark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {tx.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className={cn("truncate text-sm font-medium", t.pageHeading)}>{tx.name}</p>
                  <p className={cn("text-[11px]", t.pageSubheading)}>{tx.date}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <p
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    tx.amount.startsWith("-")
                      ? "text-red-600"
                      : t.dark
                        ? "text-slate-100"
                        : "text-slate-900"
                  )}
                >
                  {tx.amount} {tx.currency}
                </p>
                <StatusBadge status={tx.status} dark={t.dark} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={cardCls}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className={sectionTitle}>
              {tab === "customers" ? "Customer Insights" : tab === "subscriptions" ? "Subscription Metrics" : "Payment Insights"}
            </h2>
            <SectionInfo className={t.cardMuted} />
          </div>
          <Select defaultValue="week">
            <SelectTrigger
              className={cn(
                "h-8 w-auto gap-1 border-0 bg-transparent px-2 text-xs shadow-none",
                t.pageSubheading
              )}
            >
              <SelectValue placeholder={config.insightPeriod} />
            </SelectTrigger>
            <SelectContent className={t.selectContent}>
              <SelectItem value="week" className={t.selectItem}>
                This Week
              </SelectItem>
              <SelectItem value="month" className={t.selectItem}>
                This Month
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-5">
          {config.insights.map((insight) => (
            <div key={insight.label} className="flex items-end justify-between gap-3">
              <div>
                <p className={cn("text-xs", t.pageSubheading)}>{insight.label}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={cn("text-lg font-semibold", t.pageHeading)}>{insight.value}</span>
                  {insight.delta ? (
                    <span className="text-xs font-medium text-emerald-600">{insight.delta}</span>
                  ) : null}
                </div>
              </div>
              <Sparkline points={insight.sparkline} strokeClass={insight.strokeClass} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function MethodCard({
  id,
  label,
  sub,
  icon: Icon,
  enabled,
  checked,
  onToggle,
  theme,
}: {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  checked: boolean;
  onToggle: (id: string) => void;
  theme: DashboardTheme;
}) {
  const t = hubThemeClasses(theme);

  return (
    <button
      key={id}
      type="button"
      disabled={!enabled}
      onClick={() => enabled && onToggle(id)}
      className={cn(
        "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
        !enabled && "cursor-not-allowed opacity-50",
        checked && enabled
          ? t.dark
            ? "border-blue-500/50 bg-blue-500/10"
            : "border-blue-300 bg-blue-50/60"
          : t.dark
            ? "border-white/10 bg-white/5 hover:border-white/20"
            : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      {checked && enabled ? (
        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
      <Icon className={cn("h-4 w-4", t.dark ? "text-slate-300" : "text-slate-600")} />
      <div>
        <p className={cn("text-sm font-medium", t.pageHeading)}>{label}</p>
        <p className={cn("text-[11px]", t.pageSubheading)}>{sub}</p>
      </div>
    </button>
  );
}
