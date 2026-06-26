import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Bell,
  Coins,
  FileText,
  Info,
  Landmark,
  Lock,
  Shield,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";

export const RISK_AGENT_TABS = [
  "Overview",
  "Alerts",
  "Reports",
  "Watchlist",
  "Sources",
  "Settings",
  "AI Agent",
] as const;

export type RiskAgentTab = (typeof RISK_AGENT_TABS)[number];

export type AlertSeverity = "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type RiskLevel = "High" | "Medium" | "Low";

export type RiskAlert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  relevance: string;
  jurisdiction: string;
  timeAgo: string;
  icon: LucideIcon;
};

export type RiskJurisdiction = {
  name: string;
  level: RiskLevel;
  score: number;
};

export type MonitoredTopic = {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: "violet" | "emerald" | "blue" | "rose" | "amber" | "indigo" | "orange" | "purple";
};

export type SourceSegment = {
  label: string;
  count: number;
  percent: number;
  color: string;
};

export const HERO_STATS = [
  { label: "New Alerts", value: "4", suffix: "Today", tone: "rose" as const, icon: TrendingUp },
  { label: "High Risk", value: "2", suffix: "Today", tone: "amber" as const, icon: ShieldAlert },
  { label: "Mentions", value: "18", suffix: "Today", tone: "blue" as const, icon: Bell },
  { label: "Last Scan", value: "7m", suffix: "ago", tone: "emerald" as const, icon: Info },
];

export const RECENT_ALERTS: RiskAlert[] = [
  {
    id: "1",
    severity: "HIGH",
    title: "EU MiCA Stablecoin Reporting Requirement Update",
    description:
      "New draft guidelines expand reporting obligations for stablecoin issuers and service providers.",
    relevance: "Treasury, Stablecoin Payments",
    jurisdiction: "EU • MiCA",
    timeAgo: "32m ago",
    icon: Bell,
  },
  {
    id: "2",
    severity: "MEDIUM",
    title: "OFAC Sanctions List Updated (Iran-related entities)",
    description: "2 wallet addresses transacted with in last 14 days are now flagged.",
    relevance: "Counterparty Risk, AML",
    jurisdiction: "US • OFAC",
    timeAgo: "2h ago",
    icon: Bell,
  },
  {
    id: "3",
    severity: "LOW",
    title: "India VDA Tax Reporting Format Change FY25-26",
    description: "New schema for virtual digital asset reporting announced.",
    relevance: "Tax Reporting",
    jurisdiction: "India • VDA",
    timeAgo: "5h ago",
    icon: Bell,
  },
  {
    id: "4",
    severity: "INFO",
    title: "MAS Guidance on Tokenized Assets – Consultation Paper",
    description: "Discussion paper on tokenized RWAs and custody responsibilities.",
    relevance: "Tokenization",
    jurisdiction: "Singapore • MAS",
    timeAgo: "5h ago",
    icon: Info,
  },
];

export const TOP_JURISDICTIONS: RiskJurisdiction[] = [
  { name: "European Union", level: "High", score: 94 },
  { name: "United States", level: "High", score: 90 },
  { name: "India", level: "Medium", score: 68 },
  { name: "Singapore", level: "Medium", score: 58 },
  { name: "United Kingdom", level: "Low", score: 34 },
];

export const MONITORED_TOPICS: MonitoredTopic[] = [
  { id: "stablecoin", label: "Stablecoin Regulation", icon: Coins, tone: "blue" },
  { id: "tax", label: "Tax Reporting (VDA)", icon: TrendingUp, tone: "emerald" },
  { id: "aml", label: "AML / KYC", icon: Shield, tone: "rose" },
  { id: "sanctions", label: "Sanctions Lists", icon: ShieldAlert, tone: "rose" },
  { id: "treasury", label: "Treasury Compliance", icon: Wallet, tone: "blue" },
  { id: "privacy", label: "Data Privacy (GDPR)", icon: Lock, tone: "emerald" },
  { id: "cross-border", label: "Cross-border Payments", icon: ArrowLeftRight, tone: "violet" },
  { id: "tokenization", label: "Tokenization / RWAs", icon: Landmark, tone: "orange" },
];

export const MORE_TOPICS_COUNT = 35;

export const SOURCE_SEGMENTS: SourceSegment[] = [
  { label: "Regulatory Bodies", count: 412, percent: 33, color: "#7c3aed" },
  { label: "Government Sites", count: 286, percent: 23, color: "#3b82f6" },
  { label: "Legal News", count: 228, percent: 18, color: "#f97316" },
  { label: "Industry Publications", count: 176, percent: 14, color: "#ef4444" },
  { label: "Web3 Communities", count: 145, percent: 12, color: "#14b8a6" },
];

export const QUICK_ASK_PLACEHOLDER = "Ask RNS AI anything...";
export const QUICK_ASK_EXAMPLE = "How does MiCA affect our stablecoin payouts?";
export const QUICK_ASK_SUGGESTIONS = [
  "MiCA impact on us",
  "US crypto tax updates",
  "Sanctions risk",
  "India VDA changes",
];

export const UPCOMING_REPORT_ITEMS = [
  "Top regulatory changes",
  "Jurisdiction updates",
  "Risk assessment",
  "Actionable recommendations",
];

export const AGENT_METRICS: { label: string; value: string; editable?: boolean }[] = [
  { label: "Accuracy", value: "97%" },
  { label: "Sources Monitored", value: "1,247" },
  { label: "Topics Tracked", value: "43" },
  { label: "Business Context", value: "Acme Labs", editable: true },
];

export const HEATMAP_LEGEND: { label: string; color: string }[] = [
  { label: "High", color: "#ef4444" },
  { label: "Medium", color: "#f97316" },
  { label: "Low", color: "#22c55e" },
  { label: "Info", color: "#3b82f6" },
];

export const TAB_SUMMARIES: Record<RiskAgentTab, string> = {
  Overview: "Live regulatory radar, risk heatmap, and AI agent summary.",
  Alerts: "Filtered alert queue with severity, jurisdiction, and relevance tags.",
  Reports: "Scheduled and on-demand intelligence reports.",
  Watchlist: "Jurisdictions and topics you are actively monitoring.",
  Sources: "Coverage breakdown across regulatory and industry sources.",
  Settings: "Agent configuration, scan frequency, and notification preferences.",
  "AI Agent": "Chat with RNS AI about regulatory impact on your business.",
};

export function severityStyles(severity: AlertSeverity) {
  switch (severity) {
    case "HIGH":
      return {
        badge: "bg-rose-50 text-rose-600 ring-rose-100",
        icon: "bg-rose-50 text-rose-500",
      };
    case "MEDIUM":
      return {
        badge: "bg-amber-50 text-amber-700 ring-amber-100",
        icon: "bg-amber-50 text-amber-600",
      };
    case "LOW":
      return {
        badge: "bg-yellow-50 text-yellow-700 ring-yellow-100",
        icon: "bg-yellow-50 text-yellow-600",
      };
    case "INFO":
      return {
        badge: "bg-blue-50 text-blue-600 ring-blue-100",
        icon: "bg-blue-50 text-blue-500",
      };
  }
}

export function levelColor(level: RiskLevel) {
  if (level === "High") return "#ef4444";
  if (level === "Medium") return "#f97316";
  return "#22c55e";
}

export function levelBarClass(level: RiskLevel) {
  if (level === "High") return "bg-rose-500";
  if (level === "Medium") return "bg-orange-500";
  return "bg-emerald-500";
}

export function levelPillClass(level: RiskLevel) {
  if (level === "High") return "bg-rose-50 text-rose-600 ring-rose-100";
  if (level === "Medium") return "bg-orange-50 text-orange-600 ring-orange-100";
  return "bg-emerald-50 text-emerald-600 ring-emerald-100";
}

export function topicToneClasses(tone: MonitoredTopic["tone"]) {
  const map = {
    violet: "text-violet-600",
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    rose: "text-rose-600",
    amber: "text-amber-600",
    indigo: "text-indigo-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };
  return map[tone];
}
