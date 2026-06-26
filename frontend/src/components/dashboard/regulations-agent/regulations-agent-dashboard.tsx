"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bell,
  BellRing,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  Plus,
  Scale,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import {
  IMPACT_SUMMARY,
  RECENT_UPDATES,
  REGULATIONS_TABS,
  RESOURCES,
  SUMMARY_METRICS,
  TAB_SUMMARIES,
  UPCOMING_DEADLINES,
  WATCHLIST,
  deadlineToneClass,
  impactPillClass,
  impactTextClass,
  metricIconTone,
  readinessPillClass,
  type RegulationsTab,
} from "./regulations-agent-data";
import { CountryFlag, RegulatoryScoreRing } from "./regulations-agent-visuals";

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
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      {action}
    </div>
  );
}

function JurisdictionDropdown() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
    >
      All Jurisdictions
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </button>
  );
}

/* ─────────────────────────── Summary metrics ─────────────────────────── */

function SummaryMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {SUMMARY_METRICS.map((metric) => (
        <Card key={metric.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-800">{metric.title}</h3>
            {metric.type === "stat" && metric.icon ? (
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                  metricIconTone(metric.iconTone ?? "slate")
                )}
              >
                <metric.icon className="h-4 w-4" />
              </span>
            ) : null}
          </div>

          {metric.type === "score" ? (
            <>
              <RegulatoryScoreRing score={87} max={100} />
              <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                {metric.link} <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{metric.detail}</p>
              <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                {metric.link} <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}

/* ─────────────────────────── Recent updates table ─────────────────────────── */

function RecentRegulatoryUpdates() {
  return (
    <Card>
      <CardHead title="Recent Regulatory Updates" action={<JurisdictionDropdown />} />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3">Update</th>
              <th className="px-5 py-3">Jurisdiction</th>
              <th className="px-5 py-3">Impact</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {RECENT_UPDATES.map((update) => (
              <tr key={update.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <CountryFlag code={update.flag} size="md" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{update.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {update.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {update.jurisdiction}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                      impactPillClass(update.impact)
                    )}
                  >
                    {update.impact}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-slate-500">{update.date}</td>
                <td className="px-5 py-4">
                  <Button variant="outline" size="sm" className="h-8 rounded-lg">
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-5 py-4">
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
          View all regulatory updates <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

/* ─────────────────────────── Impact summary ─────────────────────────── */

function RegulatoryImpactSummary() {
  return (
    <Card>
      <CardHead title="Regulatory Impact Summary" />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3">Jurisdiction</th>
              <th className="px-5 py-3">Active Regulations</th>
              <th className="px-5 py-3">Upcoming Changes</th>
              <th className="px-5 py-3">Impact Level</th>
              <th className="px-5 py-3">Your Readiness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {IMPACT_SUMMARY.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CountryFlag code={row.flag} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-900">{row.name}</p>
                      <p className="text-xs text-slate-400">{row.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium tabular-nums text-slate-700">{row.active}</td>
                <td className="px-5 py-4 font-medium tabular-nums text-slate-700">{row.upcoming}</td>
                <td className="px-5 py-4">
                  <span className={cn("font-semibold", impactTextClass(row.impact))}>
                    {row.impact}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                      readinessPillClass(row.readiness)
                    )}
                  >
                    {row.readiness}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-5 py-4">
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
          View all jurisdictions <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

/* ─────────────────────────── Right sidebar ─────────────────────────── */

function RegulatoryWatchlist() {
  return (
    <Card>
      <CardHead title="Regulatory Watchlist" />
      <div className="divide-y divide-slate-100">
        {WATCHLIST.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-5 py-4">
            <CountryFlag code={item.flag} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">{item.jurisdiction}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                    impactPillClass(item.impact)
                  )}
                >
                  {item.impact}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {item.subscribed ? (
                <BellRing className="h-4 w-4 text-violet-600" />
              ) : (
                <Bell className="h-4 w-4 text-slate-300" />
              )}
              {item.subscribed ? (
                <span className="text-[11px] font-medium text-violet-600">Subscribed</span>
              ) : (
                <Button variant="outline" size="sm" className="h-7 rounded-lg px-2.5 text-xs">
                  Subscribe
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function UpcomingDeadlines() {
  return (
    <Card>
      <CardHead title="Upcoming Deadlines" />
      <div className="divide-y divide-slate-100">
        {UPCOMING_DEADLINES.map((deadline) => (
          <div key={deadline.id} className="flex items-start gap-3 px-5 py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{deadline.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{deadline.date}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                deadlineToneClass(deadline.tone)
              )}
            >
              {deadline.daysLeft} days left
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ResourcesSection() {
  return (
    <Card>
      <CardHead title="Resources" />
      <div className="divide-y divide-slate-100">
        {RESOURCES.map((resource) => {
          const Icon = resource.icon;
          return (
            <button
              key={resource.id}
              type="button"
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50/70"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-medium text-slate-800">{resource.title}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          );
        })}
      </div>
      <div className="border-t border-slate-100 px-5 py-4">
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
          Visit Resource Center <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

function SecondaryTabView({ activeTab }: { activeTab: RegulationsTab }) {
  return (
    <Card className="p-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-700">
          <Scale className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{activeTab}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{TAB_SUMMARIES[activeTab]}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-violet-600">
          API integration coming soon
        </p>
      </div>
    </Card>
  );
}

export function RegulationsAgentDashboard() {
  const [activeTab, setActiveTab] = useState<RegulationsTab>("Overview");

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50/60 text-slate-950">
      <div className="mx-auto flex w-full min-w-0 max-w-[1680px] flex-col gap-6">
        {/* Header */}
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">
              Regulations
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Stay updated with global regulations and assess their impact on your business.
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
            <Button className="h-10 min-w-0 rounded-xl bg-violet-700 px-5 text-sm text-white shadow-lg shadow-violet-200 hover:bg-violet-800">
              <Plus className="mr-2 h-4 w-4" />
              New Verification
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex min-w-0 gap-4 overflow-x-auto border-b border-slate-200 sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REGULATIONS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative shrink-0 px-1 pb-3 text-sm font-semibold transition",
                activeTab === tab ? "text-violet-700" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tab}
              {activeTab === tab ? (
                <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-violet-700" />
              ) : null}
            </button>
          ))}
        </div>

        {activeTab === "Overview" ? (
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="flex flex-col gap-6 xl:col-span-8">
              <SummaryMetrics />
              <RecentRegulatoryUpdates />
              <RegulatoryImpactSummary />
            </div>
            <aside className="flex flex-col gap-6 xl:col-span-4">
              <RegulatoryWatchlist />
              <UpcomingDeadlines />
              <ResourcesSection />
            </aside>
          </div>
        ) : (
          <SecondaryTabView activeTab={activeTab} />
        )}
      </div>
    </main>
  );
}
