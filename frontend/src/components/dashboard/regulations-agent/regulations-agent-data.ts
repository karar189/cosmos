import type { LucideIcon } from "lucide-react";
import { Bell, BookOpen, FileText, Scale, ShieldCheck } from "lucide-react";

export const REGULATIONS_TABS = [
  "Overview",
  "Regulatory Watch",
  "Impact Assessment",
  "Jurisdictions",
  "Requirements",
  "History",
] as const;

export type RegulationsTab = (typeof REGULATIONS_TABS)[number];

export type ImpactLevel = "High" | "Medium" | "Low";
export type FlagCode = "eu" | "us" | "gb" | "sg" | "in" | "global";

export type RegulatoryUpdate = {
  id: string;
  flag: FlagCode;
  title: string;
  description: string;
  jurisdiction: string;
  impact: ImpactLevel;
  date: string;
};

export type ImpactSummaryRow = {
  id: string;
  flag: FlagCode;
  name: string;
  code: string;
  active: number;
  upcoming: number;
  impact: ImpactLevel;
  readiness: "On Track" | "At Risk" | "Needs Review";
};

export type WatchlistItem = {
  id: string;
  flag: FlagCode;
  title: string;
  jurisdiction: string;
  impact: ImpactLevel;
  subscribed: boolean;
};

export type UpcomingDeadline = {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  tone: "rose" | "amber" | "emerald";
};

export type ResourceItem = {
  id: string;
  title: string;
  icon: LucideIcon;
};

export const SUMMARY_METRICS = [
  {
    id: "score",
    title: "Regulatory Score",
    type: "score" as const,
    value: "87",
    max: "100",
    status: "Strong",
    trend: "+ 8 pts vs last month",
    link: "Score breakdown",
  },
  {
    id: "applicable",
    title: "Applicable Regulations",
    type: "stat" as const,
    value: "18",
    detail: "across 7 jurisdictions",
    icon: FileText,
    iconTone: "blue",
    link: "View all",
  },
  {
    id: "high-impact",
    title: "High Impact Updates",
    type: "stat" as const,
    value: "3",
    detail: "require your attention",
    icon: Bell,
    iconTone: "amber",
    link: "View updates",
  },
  {
    id: "compliance",
    title: "Compliance Status",
    type: "stat" as const,
    value: "On Track",
    detail: "All critical requirements met",
    icon: ShieldCheck,
    iconTone: "emerald",
    link: "View status",
  },
];

export const RECENT_UPDATES: RegulatoryUpdate[] = [
  {
    id: "1",
    flag: "eu",
    title: "MiCA Stablecoin Reporting Requirements",
    description: "New reporting obligations for stablecoin issuers under MiCA framework.",
    jurisdiction: "EU",
    impact: "High",
    date: "May 16, 2024",
  },
  {
    id: "2",
    flag: "us",
    title: "FinCEN Beneficial Ownership Rule Update",
    description: "Updated BOI reporting requirements for financial institutions.",
    jurisdiction: "US",
    impact: "High",
    date: "May 14, 2024",
  },
  {
    id: "3",
    flag: "gb",
    title: "FCA Crypto Promotion Rules",
    description: "New rules for marketing crypto assets to UK consumers.",
    jurisdiction: "UK",
    impact: "Medium",
    date: "May 10, 2024",
  },
  {
    id: "4",
    flag: "sg",
    title: "MAS Guidelines on Digital Payment Token Services",
    description: "Updated guidance on DPT service provider obligations.",
    jurisdiction: "SG",
    impact: "Medium",
    date: "May 8, 2024",
  },
  {
    id: "5",
    flag: "in",
    title: "India VDA Tax Reporting Update",
    description: "New tax reporting format for Virtual Digital Assets.",
    jurisdiction: "IN",
    impact: "Low",
    date: "May 6, 2024",
  },
];

export const IMPACT_SUMMARY: ImpactSummaryRow[] = [
  {
    id: "eu",
    flag: "eu",
    name: "European Union",
    code: "EU",
    active: 6,
    upcoming: 2,
    impact: "High",
    readiness: "On Track",
  },
  {
    id: "us",
    flag: "us",
    name: "United States",
    code: "US",
    active: 5,
    upcoming: 1,
    impact: "High",
    readiness: "On Track",
  },
  {
    id: "sg",
    flag: "sg",
    name: "Singapore",
    code: "SG",
    active: 3,
    upcoming: 1,
    impact: "Medium",
    readiness: "On Track",
  },
  {
    id: "gb",
    flag: "gb",
    name: "United Kingdom",
    code: "UK",
    active: 2,
    upcoming: 0,
    impact: "Medium",
    readiness: "On Track",
  },
  {
    id: "in",
    flag: "in",
    name: "India",
    code: "IN",
    active: 2,
    upcoming: 1,
    impact: "Low",
    readiness: "On Track",
  },
];

export const WATCHLIST: WatchlistItem[] = [
  {
    id: "1",
    flag: "eu",
    title: "EU MiCA Implementation",
    jurisdiction: "EU",
    impact: "High",
    subscribed: true,
  },
  {
    id: "2",
    flag: "us",
    title: "US SEC Crypto Regulations",
    jurisdiction: "US",
    impact: "High",
    subscribed: true,
  },
  {
    id: "3",
    flag: "global",
    title: "Global Travel Rule Updates",
    jurisdiction: "Global",
    impact: "Medium",
    subscribed: false,
  },
  {
    id: "4",
    flag: "gb",
    title: "UK Financial Promotions Regime",
    jurisdiction: "UK",
    impact: "Medium",
    subscribed: true,
  },
  {
    id: "5",
    flag: "sg",
    title: "Singapore PS Act Updates",
    jurisdiction: "SG",
    impact: "Low",
    subscribed: false,
  },
  {
    id: "6",
    flag: "in",
    title: "India VDA Framework",
    jurisdiction: "IN",
    impact: "Low",
    subscribed: true,
  },
];

export const UPCOMING_DEADLINES: UpcomingDeadline[] = [
  {
    id: "1",
    title: "MiCA Reporting - Q2 2024",
    date: "Jun 30, 2024",
    daysLeft: 45,
    tone: "rose",
  },
  {
    id: "2",
    title: "US BOI Reporting",
    date: "Jul 01, 2024",
    daysLeft: 46,
    tone: "amber",
  },
  {
    id: "3",
    title: "UK Financial Promotions Compliance",
    date: "Jul 15, 2024",
    daysLeft: 60,
    tone: "amber",
  },
  {
    id: "4",
    title: "Singapore DPT Licensing Review",
    date: "Aug 01, 2024",
    daysLeft: 76,
    tone: "emerald",
  },
];

export const RESOURCES: ResourceItem[] = [
  { id: "1", title: "Regulatory Compliance Guide", icon: BookOpen },
  { id: "2", title: "Jurisdiction Comparison", icon: Scale },
  { id: "3", title: "Compliance Glossary", icon: FileText },
];

export const TAB_SUMMARIES: Record<RegulationsTab, string> = {
  Overview: "Regulatory score, recent updates, and jurisdiction impact summary.",
  "Regulatory Watch": "Monitor subscribed regulations and watchlist alerts.",
  "Impact Assessment": "Assess how regulatory changes affect your business.",
  Jurisdictions: "Browse regulations by country and region.",
  Requirements: "Track compliance requirements and obligations.",
  History: "View past regulatory updates and actions taken.",
};

export const FLAG_LABELS: Record<FlagCode, string> = {
  eu: "European Union",
  us: "United States",
  gb: "United Kingdom",
  sg: "Singapore",
  in: "India",
  global: "Global",
};

export function impactPillClass(level: ImpactLevel) {
  if (level === "High") return "bg-rose-50 text-rose-600 ring-rose-100";
  if (level === "Medium") return "bg-orange-50 text-orange-600 ring-orange-100";
  return "bg-emerald-50 text-emerald-600 ring-emerald-100";
}

export function impactTextClass(level: ImpactLevel) {
  if (level === "High") return "text-rose-600";
  if (level === "Medium") return "text-orange-600";
  return "text-emerald-600";
}

export function readinessPillClass(status: ImpactSummaryRow["readiness"]) {
  if (status === "On Track") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "At Risk") return "bg-rose-50 text-rose-700 ring-rose-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

export function deadlineToneClass(tone: UpcomingDeadline["tone"]) {
  if (tone === "rose") return "bg-rose-50 text-rose-600 ring-rose-100";
  if (tone === "amber") return "bg-orange-50 text-orange-600 ring-orange-100";
  return "bg-emerald-50 text-emerald-600 ring-emerald-100";
}

export function metricIconTone(tone: string) {
  switch (tone) {
    case "blue":
      return "bg-blue-50 text-blue-700";
    case "amber":
      return "bg-orange-50 text-orange-600";
    case "emerald":
      return "bg-emerald-50 text-emerald-600";
    default:
      return "bg-slate-50 text-slate-600";
  }
}
