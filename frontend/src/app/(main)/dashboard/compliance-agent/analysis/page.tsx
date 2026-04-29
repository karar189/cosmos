"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  FileCheck2,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFreighter } from "@/hooks/useFreighter";
import { getLatestComplianceResult } from "@/lib/compliance-agent-session";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function faviconFor(url: string): string {
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url)}`;
}

export default function ComplianceAgentAnalysisPage() {
  const router = useRouter();
  const { disconnect, isConnecting } = useFreighter();
  const result = getLatestComplianceResult();

  const tone = useMemo(() => {
    const status = result?.complianceHealth.status;
    if (status === "On Track") return { text: "text-emerald-300", ring: "#34d399" };
    if (status === "At Risk") return { text: "text-amber-300", ring: "#f59e0b" };
    return { text: "text-red-300", ring: "#f87171" };
  }, [result]);

  if (!result) {
    return (
      <DashboardMain>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">No completed analysis found for this tab yet.</p>
          <Button onClick={() => router.push("/dashboard/compliance-agent")}>Go to Compliance Agent</Button>
        </div>
      </DashboardMain>
    );
  }

  const score = Math.max(0, Math.min(100, result.complianceHealth.score));
  const gaugeStyle = {
    background: `conic-gradient(${tone.ring} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
  } as const;

  const websiteSources = result.sourceStatuses.filter(
    (s) => s.sourceType === "website" && s.status === "Processed"
  );
  const openDetail = (
    section: "licenses" | "documents" | "actions" | "timeline" | "risks",
    index: number
  ) => {
    router.push(`/dashboard/compliance-agent/analysis/${section}/${index}`);
  };

  return (
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Compliance Agent Analysis</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/compliance-agent")}>New Run</Button>
          <Button variant="ghost" size="sm" onClick={disconnect} disabled={isConnecting}>Disconnect</Button>
        </div>
      </DashboardHeader>

      <DashboardMain>
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/[0.12] bg-gradient-to-br from-violet-500/20 via-blue-500/10 to-emerald-500/10 p-6">
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/55">Compliance intelligence report</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Operational Compliance Roadmap</h1>
                <p className="mt-3 text-sm text-white/75">{result.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Model: {result.modelSource}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Licenses: {result.requiredLicenses.length}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Action items: {result.actionItems.length}</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.1] bg-black/25 p-4">
                <p className="text-xs text-white/55">Compliance health</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full p-1" style={gaugeStyle}>
                    <div className="absolute inset-1 grid place-items-center rounded-full bg-[#0a0a15] text-sm font-semibold">
                      {score.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <p className={`text-lg font-semibold ${tone.text}`}>{result.complianceHealth.status}</p>
                    <p className="text-xs text-white/55">{result.complianceHealth.rationale}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {websiteSources.length > 0 && (
            <Card className="border-white/[0.08] bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-violet-300" />
                  Source Intelligence (with website visuals)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {websiteSources.map((source) => (
                  <div key={source.name} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={faviconFor(source.name)}
                        alt={`${hostOf(source.name)} logo`}
                        className="h-10 w-10 rounded-md border border-white/[0.1] bg-white p-1"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white/95">{hostOf(source.name)}</p>
                        <p className="truncate text-xs text-white/50">{source.extractedChars} chars extracted</p>
                      </div>
                    </div>
                    <a
                      href={source.name}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center text-xs text-violet-300 hover:text-violet-200"
                    >
                      Visit source <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/[0.08] bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-blue-300" />
                  Required Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.requiredLicenses.map((item, idx) => (
                  <button
                    type="button"
                    key={`${item.name}-${idx}`}
                    className="w-full rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-left transition hover:border-violet-400/40 hover:bg-violet-500/[0.06]"
                    onClick={() => openDetail("licenses", idx)}
                  >
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-white/55">{item.jurisdiction}</p>
                    <p className="mt-1 text-xs">Priority {item.priority} · Confidence {item.confidence}</p>
                    <p className="mt-1 text-sm text-white/70">{item.reason}</p>
                    <p className="mt-2 inline-flex items-center text-xs text-violet-300">
                      Open detailed workflow <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/[0.08] bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileCheck2 className="h-5 w-5 text-emerald-300" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.requiredDocuments.map((item, idx) => (
                  <button
                    type="button"
                    key={`${item.name}-${idx}`}
                    className="w-full rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-left transition hover:border-violet-400/40 hover:bg-violet-500/[0.06]"
                    onClick={() => openDetail("documents", idx)}
                  >
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs">Owner {item.owner} · Priority {item.priority}</p>
                    <p className="mt-1 text-sm text-white/70">{item.reason}</p>
                    <p className="mt-2 inline-flex items-center text-xs text-violet-300">
                      Open detailed workflow <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/[0.08] bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BadgeCheck className="h-5 w-5 text-violet-300" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.actionItems.map((item, idx) => (
                  <button
                    type="button"
                    key={`${item.title}-${idx}`}
                    className="w-full rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-left transition hover:border-violet-400/40 hover:bg-violet-500/[0.06]"
                    onClick={() => openDetail("actions", idx)}
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs">Owner {item.owner} · Priority {item.priority}</p>
                    <p className="mt-1 text-sm text-white/70">{item.details}</p>
                    <p className="mt-2 inline-flex items-center text-xs text-violet-300">
                      Open detailed workflow <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/[0.08] bg-white/[0.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarClock className="h-5 w-5 text-amber-300" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.timeline.map((item, idx) => (
                  <button
                    type="button"
                    key={`${item.phase}-${idx}`}
                    className="w-full rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-left transition hover:border-violet-400/40 hover:bg-violet-500/[0.06]"
                    onClick={() => openDetail("timeline", idx)}
                  >
                    <p className="text-sm font-medium">{item.phase} <span className="text-xs text-white/50">({item.weeks})</span></p>
                    <ul className="mt-1 list-disc pl-5 text-sm text-white/70">
                      {item.goals.map((goal) => (
                        <li key={goal}>{goal}</li>
                      ))}
                    </ul>
                    <p className="mt-2 inline-flex items-center text-xs text-violet-300">
                      Open detailed workflow <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/[0.08] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-red-300" />
                Risks and Mitigation
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {result.risks.map((item, idx) => (
                <button
                  type="button"
                  key={`${item.risk}-${idx}`}
                  className="w-full rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 text-left transition hover:border-violet-400/40 hover:bg-violet-500/[0.06]"
                  onClick={() => openDetail("risks", idx)}
                >
                  <p className="text-sm font-medium">{item.risk}</p>
                  <p className="text-xs text-white/50">Severity: {item.severity}</p>
                  <p className="mt-1 text-sm text-white/70">{item.mitigation}</p>
                  <p className="mt-2 inline-flex items-center text-xs text-violet-300">
                    Open detailed workflow <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="text-lg">Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {result.disclaimers.map((text) => (
                <p key={text} className="text-sm text-white/60">- {text}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardMain>
    </>
  );
}
