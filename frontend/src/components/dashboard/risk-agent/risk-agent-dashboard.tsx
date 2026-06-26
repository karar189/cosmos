"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Code2,
  HelpCircle,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";
import {
  AGENT_METRICS,
  HEATMAP_LEGEND,
  MONITORED_TOPICS,
  MORE_TOPICS_COUNT,
  QUICK_ASK_EXAMPLE,
  QUICK_ASK_PLACEHOLDER,
  QUICK_ASK_SUGGESTIONS,
  RECENT_ALERTS,
  RISK_AGENT_TABS,
  TAB_SUMMARIES,
  TOP_JURISDICTIONS,
  UPCOMING_REPORT_ITEMS,
  levelBarClass,
  levelColor,
  levelPillClass,
  severityStyles,
  topicToneClasses,
  type RiskAgentTab,
} from "./risk-agent-data";
import {
  RiskAgentMiniRobot,
  SentimentTrendChart,
  SourceCoverageDonut,
  WorldRiskMap,
} from "./risk-agent-visuals";

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40",
        className
      )}
    >
      {children}
    </section>
  );
}

function CardHead({
  title,
  action,
  info,
}: {
  title: string;
  action?: React.ReactNode;
  info?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5">
      <h2 className="inline-flex items-center gap-1.5 text-base font-semibold text-slate-950">
        {title}
        {info ? <HelpCircle className="h-3.5 w-3.5 text-slate-300" /> : null}
      </h2>
      {action}
    </div>
  );
}

function TimeDropdown({ label = "This Week" }: { label?: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </button>
  );
}

/* ─────────────────────────── Recent alerts ─────────────────────────── */

function RecentAlerts() {
  return (
    <Card>
      <CardHead
        title="Recent Alerts"
        action={
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
            View all alerts <ArrowRight className="h-4 w-4" />
          </button>
        }
      />
      <div className="space-y-3 p-5">
        {RECENT_ALERTS.map((alert) => {
          const styles = severityStyles(alert.severity);
          const Icon = alert.icon;
          return (
            <article
              key={alert.id}
              className="rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/20"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                    styles.icon
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1",
                          styles.badge
                        )}
                      >
                        {alert.severity}
                      </span>
                      <h3 className="text-sm font-semibold leading-snug text-slate-900">
                        {alert.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400">{alert.timeAgo}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">{alert.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-slate-500">
                      Relevant to:{" "}
                      <strong className="font-semibold text-slate-700">{alert.relevance}</strong>
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                      {alert.jurisdiction}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                      View Details
                    </button>
                    <button
                      type="button"
                      className="grid h-7 w-7 place-items-center rounded-lg text-slate-300 transition hover:bg-slate-50 hover:text-blue-600"
                      aria-label="Bookmark alert"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}

/* ─────────────────────────── Topics ─────────────────────────── */

function TopicsMonitored() {
  return (
    <Card>
      <CardHead title="Topics Being Monitored" />
      <div className="p-5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {MONITORED_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
              >
                <Icon className={cn("h-4 w-4 shrink-0", topicToneClasses(topic.tone))} strokeWidth={2} />
                <span className="truncate text-xs font-medium text-slate-700">{topic.label}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium text-slate-500">
            + {MORE_TOPICS_COUNT} more topics
          </div>
        </div>
        <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
          Manage topics <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

/* ─────────────────────────── Heatmap ─────────────────────────── */

function RiskHeatmap() {
  return (
    <Card>
      <CardHead title="Risk Heatmap" info action={<TimeDropdown />} />
      <div className="p-5">
        <div className="rounded-xl bg-slate-50/60 p-3">
          <WorldRiskMap />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
          {HEATMAP_LEGEND.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Top Risk Jurisdictions</h3>
            <button className="text-sm font-semibold text-blue-600">View all</button>
          </div>
          <div className="space-y-3.5">
            {TOP_JURISDICTIONS.map((jurisdiction) => (
              <div key={jurisdiction.name} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: levelColor(jurisdiction.level) }}
                />
                <span className="w-32 shrink-0 truncate text-sm font-medium text-slate-800">
                  {jurisdiction.name}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", levelBarClass(jurisdiction.level))}
                    style={{ width: `${jurisdiction.score}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "w-16 shrink-0 rounded-full py-0.5 text-center text-[11px] font-semibold ring-1",
                    levelPillClass(jurisdiction.level)
                  )}
                >
                  {jurisdiction.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────── Right column ─────────────────────────── */

function AgentSummary() {
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <RiskAgentMiniRobot />
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-950">AI Agent Summary</h2>
            <p className="mt-0.5 text-sm font-medium text-slate-700">RNS Agent</p>
            <p className="text-xs text-slate-400">Custom-trained on your business</p>
          </div>
        </div>
        <dl className="mt-5 divide-y divide-slate-100">
          {AGENT_METRICS.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-sm text-slate-500">{metric.label}</dt>
              <dd className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <span className={metric.label === "Accuracy" ? "text-emerald-600" : undefined}>
                  {metric.value}
                </span>
                {metric.editable ? (
                  <button
                    type="button"
                    aria-label="Edit business context"
                    className="text-slate-300 transition hover:text-blue-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        <Button
          variant="outline"
          className="mt-4 h-10 w-full justify-center rounded-xl border-slate-200 text-sm font-semibold text-slate-700"
        >
          View Agent Details <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function UpcomingReport() {
  return (
    <Card>
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-slate-950">Upcoming Report</h2>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
          AI
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Weekly Intelligence Report</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Next report on <span className="font-medium text-slate-700">May 22, 2024</span> • 9:00 AM
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Includes:</p>
        <ul className="mt-2 space-y-2">
          {UPCOMING_REPORT_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
        <Button className="mt-5 h-10 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">
          Preview Last Report
        </Button>
      </div>
    </Card>
  );
}

function QuickAsk() {
  const [value, setValue] = useState("");
  return (
    <Card>
      <CardHead title="Quick Ask" />
      <div className="p-5">
        <div className="relative">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={QUICK_ASK_PLACEHOLDER}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-11"
          />
          <button
            type="button"
            aria-label="Ask"
            className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-xs italic text-slate-400">{QUICK_ASK_EXAMPLE}</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Suggested questions
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_ASK_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setValue(suggestion)}
              className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function SentimentTrend() {
  return (
    <Card>
      <CardHead title="AI Sentiment Trend" info action={<TimeDropdown />} />
      <div className="p-5 pt-4">
        <SentimentTrendChart />
      </div>
    </Card>
  );
}

function SourceCoverage() {
  return (
    <Card>
      <CardHead title="Source Coverage" />
      <div className="p-5">
        <SourceCoverageDonut />
        <button className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
          View all sources <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

/* ─────────────────────────── Tabs / shell ─────────────────────────── */

function SecondaryTabView({ activeTab }: { activeTab: RiskAgentTab }) {
  return (
    <Card className="p-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
          <Sparkles className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{activeTab}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{TAB_SUMMARIES[activeTab]}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-blue-600">
          API integration coming soon
        </p>
      </div>
    </Card>
  );
}

export function RiskAgentDashboard() {
  const [activeTab, setActiveTab] = useState<RiskAgentTab>("Overview");

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50/60 text-slate-950">
      <div className="mx-auto flex w-full min-w-0 max-w-[1680px] flex-col gap-6">
        {/* Header */}
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">
                Regulation News Sniper (RNS)
              </h1>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-blue-600">
                AI
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Your AI regulator radar. We monitor the world so you can stay ahead.
            </p>
          </div>
          <div className="grid w-full min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-3 xl:w-auto">
            <Button variant="outline" className="h-10 min-w-0 rounded-xl bg-white text-sm">
              <Code2 className="mr-2 h-4 w-4" />
              API Keys
            </Button>
            <Button variant="outline" className="h-10 min-w-0 rounded-xl bg-white text-sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="h-10 min-w-0 rounded-xl bg-blue-600 px-5 text-sm text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>

        {/* Status + tabs */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="order-2 flex min-w-0 gap-4 overflow-x-auto sm:gap-6 lg:order-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RISK_AGENT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative shrink-0 px-1 pb-3 text-sm font-semibold transition",
                  activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {tab}
                {activeTab === tab ? (
                  <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-blue-600" />
                ) : null}
              </button>
            ))}
          </div>
          <div className="order-1 flex flex-wrap items-center gap-3 pb-3 text-sm lg:order-2 lg:pb-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 ring-1 ring-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              RNS Agent: <span className="text-emerald-600">Active</span>
              <ChevronDown className="h-3.5 w-3.5 text-emerald-500" />
            </span>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:text-blue-600">
              <Settings className="h-4 w-4" />
              Configure Agent
            </button>
          </div>
        </div>

        {activeTab === "Overview" ? (
          <>
            <div className="grid gap-6 xl:grid-cols-12">
              <div className="flex flex-col gap-6 xl:col-span-4">
                <RecentAlerts />
                <TopicsMonitored />
              </div>
              <div className="flex flex-col gap-6 xl:col-span-5">
                <RiskHeatmap />
                <SourceCoverage />
              </div>
              <aside className="flex flex-col gap-6 xl:col-span-3">
                <SentimentTrend />
                <AgentSummary />
                <UpcomingReport />
                <QuickAsk />
              </aside>
            </div>
          </>
        ) : (
          <SecondaryTabView activeTab={activeTab} />
        )}
      </div>
    </main>
  );
}
