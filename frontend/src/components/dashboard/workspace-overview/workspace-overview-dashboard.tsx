"use client";

import Link from "next/link";
import {
  Wallet,
  Clock,
  Users,
  ListChecks,
  HeartPulse,
  TrendingUp,
  ArrowUpRight,
  CreditCard,
  FileText,
  Scale,
  Calendar,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

/** Soft chart palette aligned with Hypertron hub blues, sky gradients, and warm accents */
const HYPERTRON_CHART = {
  blue: "#60a5fa",
  blueFill: "rgba(96, 165, 250, 0.14)",
  amber: "#fbbf24",
  red: "#fca5a5",
  sky: "#7dd3fc",
} as const;

const TREASURY_SERIES = [
  { date: "May 11", value: 920000 },
  { date: "May 12", value: 980000 },
  { date: "May 13", value: 1010000 },
  { date: "May 14", value: 1080000 },
  { date: "May 15", value: 1120000 },
  { date: "May 16", value: 1180000 },
  { date: "May 17", value: 1248420 },
];

const ASSET_BREAKDOWN = [
  { name: "Ethereum", value: "$412,800" },
  { name: "Polygon", value: "$298,400" },
  { name: "Arbitrum", value: "$186,220" },
  { name: "Solana", value: "$224,000" },
  { name: "Other", value: "$127,000" },
];

const PAYMENT_STATUS = [
  { name: "Completed", value: 65, color: HYPERTRON_CHART.blue },
  { name: "Pending", value: 18, color: HYPERTRON_CHART.amber },
  { name: "Failed", value: 5, color: HYPERTRON_CHART.red },
  { name: "Upcoming", value: 12, color: HYPERTRON_CHART.sky },
];

const EXPENSES = [
  { name: "Infrastructure", value: 42 },
  { name: "Payroll", value: 78 },
  { name: "Marketing", value: 28 },
  { name: "Operations", value: 35 },
  { name: "Others", value: 18 },
];

const KPI_SPARKS = [
  [40, 52, 48, 61, 58, 72, 68],
  [30, 28, 35, 32, 38, 36, 34],
  [20, 24, 28, 32, 36, 40, 44],
  [50, 48, 52, 49, 55, 51, 47],
  [70, 72, 74, 76, 78, 84, 87],
];

type WorkspaceOverviewDashboardProps = {
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

function KpiCard({
  label,
  value,
  sub,
  delta,
  positive,
  icon: Icon,
  spark,
  styles,
}: {
  label: string;
  value: string;
  sub: string;
  delta?: string;
  positive?: boolean;
  icon: typeof Wallet;
  spark: number[];
  styles: typeof overviewStyles;
}) {
  const data = spark.map((v, i) => ({ i, v }));
  const stroke = HYPERTRON_CHART.blue;

  return (
    <div className={cn(styles.panel, "flex flex-col gap-3 p-4")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Icon className="h-4 w-4" />
          </span>
          <span className={cn("text-xs font-medium", styles.muted)}>{label}</span>
        </div>
        {delta ? (
          <span
            className={cn(
              "text-[11px] font-semibold",
              positive ? "text-emerald-600" : "text-red-500"
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
      <p className={cn("text-2xl font-semibold tracking-tight", styles.title)}>{value}</p>
      <p className={cn("text-xs", styles.muted)}>{sub}</p>
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function WorkspaceOverviewDashboard({
  workspaceName: _workspaceName,
  userName: _userName,
  userInitials: _userInitials,
}: WorkspaceOverviewDashboardProps) {
  const styles = overviewStyles;
  const areaFill = HYPERTRON_CHART.blueFill;
  const areaStroke = HYPERTRON_CHART.blue;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Total Treasury"
          value="$1,248,420"
          sub="Across all chains"
          delta="+12.5%"
          positive
          icon={Wallet}
          spark={KPI_SPARKS[0]!}
          styles={styles}
        />
        <KpiCard
          label="Pending Payments"
          value="$78,230"
          sub="12 payments"
          icon={Clock}
          spark={KPI_SPARKS[1]!}
          styles={styles}
        />
        <KpiCard
          label="Active Contributors"
          value="123"
          sub="+8 this week"
          delta="+8"
          positive
          icon={Users}
          spark={KPI_SPARKS[2]!}
          styles={styles}
        />
        <KpiCard
          label="Open Tasks"
          value="17"
          sub="5 overdue"
          delta="5 overdue"
          positive={false}
          icon={ListChecks}
          spark={KPI_SPARKS[3]!}
          styles={styles}
        />
        <KpiCard
          label="Health Score"
          value="87%"
          sub='Status: "Good"'
          delta="Good"
          positive
          icon={HeartPulse}
          spark={KPI_SPARKS[4]!}
          styles={styles}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className={cn(styles.panel, "lg:col-span-5 p-5")}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className={cn("text-sm font-semibold", styles.title)}>Treasury Overview</h2>
              <p className={cn("text-xs", styles.muted)}>7-day balance trend</p>
            </div>
            <TrendingUp className={cn("h-4 w-4", styles.muted)} />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREASURY_SERIES}>
                <defs>
                  <linearGradient id="treasuryFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={areaFill} stopOpacity={1} />
                    <stop offset="100%" stopColor={areaFill} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: styles.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Balance"]}
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
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-5">
            {ASSET_BREAKDOWN.map((a) => (
              <div key={a.name}>
                <p className={cn("text-[10px] font-medium uppercase tracking-wide", styles.muted)}>{a.name}</p>
                <p className={cn("text-sm font-semibold", styles.title)}>{a.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(styles.panel, "lg:col-span-4 flex flex-col p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Operations Overview</h2>
          <ul className="mt-4 flex flex-1 flex-col gap-3">
            {[
              { label: "Client Onboarding", count: "7 in progress" },
              { label: "Contributor Onboarding", count: "5 in progress" },
              { label: "Agency Onboarding", count: "3 in progress" },
              { label: "Workflows", count: "5 active" },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-2 text-sm">
                <span className={styles.title}>{item.label}</span>
                <span className={cn("text-xs", styles.muted)}>{item.count}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-red-200/80 bg-red-50 px-3 py-2.5">
            <p className="text-xs font-semibold text-red-700">Tasks Overdue</p>
            <p className="text-[11px] text-red-600/90">5 action needed</p>
          </div>
        </div>

        <div className={cn(styles.panel, "lg:col-span-3 flex flex-col p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Recent Activity</h2>
          <ul className="mt-4 flex flex-1 flex-col gap-4">
            {[
              { icon: CreditCard, text: "Payment of $12,500 to Acme Vendor", time: "2h ago" },
              { icon: Users, text: "Contributor onboarded — Jane D.", time: "4h ago" },
              { icon: FileText, text: "Compliance doc uploaded", time: "6h ago" },
              { icon: Scale, text: "Regulation update flagged", time: "1d ago" },
            ].map((item) => (
              <li key={item.text} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className={cn("text-xs leading-snug", styles.title)}>{item.text}</p>
                  <p className={cn("mt-0.5 text-[10px]", styles.muted)}>{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className={cn(styles.panel, "p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Payments</h2>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PAYMENT_STATUS} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={2}>
                    {PAYMENT_STATUS.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-1 flex-col gap-2 text-xs">
              {PAYMENT_STATUS.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    <span className={styles.muted}>{s.name}</span>
                  </span>
                  <span className={cn("font-semibold", styles.title)}>{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cn(styles.panel, "p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Top Expenses</h2>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXPENSES} layout="vertical" margin={{ left: 4, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fill: styles.tick, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="value" fill={HYPERTRON_CHART.blue} radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn(styles.panel, "p-5")}>
          <h2 className={cn("text-sm font-semibold", styles.title)}>Compliance News</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              { level: "High Impact", color: "text-red-600 bg-red-50 border-red-100", title: "EU MiCA reporting deadline moved up" },
              { level: "Medium Impact", color: "text-amber-700 bg-amber-50 border-amber-100", title: "US stablecoin guidance — draft comment period" },
              { level: "Low Impact", color: "text-emerald-700 bg-emerald-50 border-emerald-100", title: "Stellar foundation network upgrade notice" },
            ].map((n) => (
              <li key={n.title} className="flex flex-col gap-1.5">
                <span className={cn("w-fit rounded-md border px-2 py-0.5 text-[10px] font-semibold", n.color)}>
                  {n.level}
                </span>
                <p className={cn("text-xs leading-snug", styles.title)}>{n.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className={cn("text-[10px] font-semibold uppercase tracking-wide", styles.muted)}>Regulatory Watch</p>
            <div className="mt-1 flex flex-wrap gap-4 text-xs">
              <span className={styles.title}>
                <Calendar className="mr-1 inline h-3 w-3" />
                New Regulations <strong className="text-blue-600">3</strong>
              </span>
              <span className={styles.title}>
                Updates <strong className="text-blue-600">5</strong>
              </span>
              <span className={styles.title}>
                Deadlines <strong className="text-amber-600">2</strong>
              </span>
            </div>
          </div>
          <div className="hidden h-10 w-px bg-slate-200 sm:block" />
          <div>
            <p className={cn("text-[10px] font-semibold uppercase tracking-wide", styles.muted)}>Risk Overview</p>
            <div className="mt-1 flex flex-wrap gap-4 text-xs">
              <span className={styles.title}>
                High <strong className="text-red-500">2</strong>
              </span>
              <span className={styles.title}>
                Medium <strong className="text-amber-500">5</strong>
              </span>
              <span className={styles.title}>
                Low <strong className="text-emerald-500">8</strong>
              </span>
            </div>
          </div>
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
