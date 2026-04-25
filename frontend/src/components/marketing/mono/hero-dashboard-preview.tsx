"use client";

import {
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  Link2,
  Search,
  Settings,
  Sparkles,
  Vault,
  Wallet,
} from "lucide-react";

/** Decorative dashboard mock for the landing hero (non-interactive). */
export function HeroDashboardPreview() {
  return (
    <div
      className="flex min-h-[400px] gap-0 overflow-hidden rounded-b-xl bg-[#0a0a0b] text-left font-sans text-[13px] leading-normal text-white/90 antialiased md:min-h-[440px] md:text-sm"
      aria-hidden
    >
      {/* Sidebar */}
      <aside className="flex w-11 shrink-0 flex-col items-center gap-3 border-r border-white/[0.07] bg-[#060607] py-3 md:w-14 md:gap-4 md:py-4 min-h-[400px] md:min-h-[440px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-white/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-5 w-5 object-contain opacity-90" />
        </div>
        <nav className="flex flex-1 flex-col items-center gap-2.5 text-white/35 md:gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-400/25">
            <Home className="h-4 w-4 text-blue-400" strokeWidth={1.75} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg opacity-70">
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg opacity-70">
            <Link2 className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg opacity-70">
            <Wallet className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg opacity-70">
            <Vault className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="mt-auto flex h-8 w-8 items-center justify-center rounded-lg opacity-70">
            <Settings className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 pt-4 md:gap-4 md:p-4 md:pt-5">
        {/* Top bar */}
        <header className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-3 md:gap-3 md:pb-4">
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-white/75 md:text-[11px]"
            tabIndex={-1}
          >
            Dashboard
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          <div className="relative mx-auto min-w-0 flex-1 md:max-w-[200px] lg:max-w-[280px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/30" />
            <div className="rounded-full border border-white/[0.1] bg-black/30 py-1.5 pl-8 pr-3 text-[10px] tracking-wide text-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] md:text-[11px]">
              Search workflows…
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-md border border-amber-300/40 bg-amber-400/[0.12] px-2 py-1 text-[9px] font-medium tabular-nums tracking-wide text-amber-100 sm:inline md:text-[10px]">
              Today
            </span>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <Bell className="h-3.5 w-3.5 text-white/45" strokeWidth={1.75} />
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded border border-blue-400/40 bg-blue-600 px-0.5 text-[7px] font-semibold tabular-nums text-white">
                2
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] py-1 pl-1 pr-2.5 ring-1 ring-white/[0.03]">
              <div className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-blue-500 to-sky-500" />
              <div className="hidden min-w-0 text-[10px] leading-tight sm:block">
                <p className="truncate font-medium tracking-wide text-white/88">Team</p>
                <p className="truncate text-[9px] tracking-wide text-white/45">@hypertron</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main grid */}
        <div className="mt-6 grid flex-1 grid-cols-12 gap-2 pt-1 md:mt-10 md:gap-3 md:pt-2">
          {/* Chart card */}
          <div className="col-span-12 flex flex-col rounded-2xl border border-white/[0.08] bg-[#111113] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] md:col-span-5 md:p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45 md:text-[10px]">
                  Settlement volume
                </p>
                <p className="mt-0.5 text-xs font-medium tracking-wide text-white md:text-[13px]">
                  Inbound XLM
                </p>
              </div>
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold tabular-nums tracking-wide text-emerald-300">
                +12.4%
              </span>
            </div>
            <div className="mb-1.5 flex gap-1">
              {["24h", "Week", "Month"].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-md px-2 py-1 text-[9px] font-medium tracking-wide ${
                    i === 2
                      ? "bg-blue-500/20 text-blue-100 ring-1 ring-amber-300/55"
                      : "text-white/40"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="relative mt-1 flex-1 min-h-[100px]">
              <svg viewBox="0 0 200 72" className="h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                  </linearGradient>
                  <linearGradient id="heroChartLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,52 L28,48 L56,55 L84,38 L112,44 L140,28 L168,32 L200,18 L200,72 L0,72 Z"
                  fill="url(#heroChartFill)"
                />
                <path
                  d="M0,52 L28,48 L56,55 L84,38 L112,44 L140,28 L168,32 L200,18"
                  fill="none"
                  stroke="url(#heroChartLine)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute bottom-1 left-2 rounded-md border border-white/[0.12] bg-black/70 px-2 py-1 text-[9px] tabular-nums tracking-wide backdrop-blur-sm">
                <span className="text-white/50">Mar 29</span>
                <span className="mx-1 text-white/25">|</span>
                <span className="font-semibold text-blue-300">5,538 XLM</span>
              </div>
            </div>
            <p className="mt-2 text-[9px] tracking-wide text-white/38">Last updated · 06:49 AM</p>
          </div>

          {/* Balance card */}
          <div className="col-span-12 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111113] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] md:col-span-4 md:p-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45 md:text-[10px]">
                Pool balance
              </p>
              <p className="mt-0.5 text-[10px] tracking-wide text-white/50 md:text-[11px]">
                Settled via Stellar
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums tracking-tight text-white md:text-[1.75rem]">
                23,094{" "}
                <span className="text-lg font-medium tabular-nums text-blue-400 md:text-xl">XLM</span>
              </p>
              <p className="mt-1 text-[10px] tabular-nums tracking-wide text-emerald-400/85 md:text-[11px]">
                vs last mo · +7.2%
              </p>
            </div>
            <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/[0.12] to-amber-400/[0.1] p-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-[9px] leading-relaxed tracking-wide text-white/60 md:text-[10px]">
                <span className="font-semibold text-white/75">AI</span> · 3 workflows need compliance review
                before next payout batch.
              </p>
            </div>
          </div>

          {/* Promo / insight */}
          <div className="col-span-12 flex flex-col justify-between rounded-2xl border border-amber-400/20 bg-gradient-to-b from-[#151518] via-[#101014] to-[#0c0c0e] p-3 shadow-[inset_0_1px_0_0_rgba(253,224,71,0.08)] md:col-span-3 md:p-4">
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-white/60 md:text-[11px]">
                Private payouts
              </p>
              <span className="mt-1.5 inline-block rounded border border-amber-300/50 bg-amber-400/[0.18] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-50">
                Beta
              </span>
            </div>
            <p className="text-[10px] leading-relaxed tracking-wide text-white/48 md:text-[11px]">
              Route settlements through the pool with memo-based attribution.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="cursor-default text-[9px] tracking-wide text-amber-200/95 underline decoration-amber-400/45 underline-offset-2">
                Learn more
              </span>
              <span className="rounded-md border border-amber-200/70 bg-amber-300 px-2.5 py-1 text-[9px] font-semibold tracking-wide text-stone-900 shadow-[0_1px_0_0_rgba(255,255,255,0.35)_inset]">
                Open
              </span>
            </div>
          </div>

          {/* Bottom: two columns */}
          <div className="col-span-12 grid grid-cols-1 gap-2 md:col-span-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50">
                Active workflows
              </p>
              <div className="mt-3 space-y-2">
                {[
                  { name: "Acme onboarding", sub: "12 clients · KYC", pct: "+9.2%" },
                  { name: "RWA intake", sub: "8 pending docs", pct: "+4.1%" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.04] bg-white/[0.03] px-2.5 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-medium tracking-wide text-white/88">{row.name}</p>
                      <p className="text-[9px] tracking-wide text-white/42">{row.sub}</p>
                    </div>
                    <span className="shrink-0 text-[9px] font-semibold tabular-nums tracking-wide text-emerald-300">
                      {row.pct}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50">This week</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-blue-400">+19.2%</p>
              <p className="mt-1 text-[9px] leading-relaxed tracking-wide text-white/42">
                Workflow opens → completed payments
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="col-span-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] md:col-span-6">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50">
                Recent receivables
              </p>
              <span className="text-[9px] font-semibold tracking-wide text-amber-300">View all</span>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {[
                { name: "Invoice #1042", biz: "Northwind", status: "Paid", tone: "emerald" as const },
                { name: "Retainer Q2", biz: "Blue Ocean", status: "Pending", tone: "amber" as const },
                { name: "Pilot deposit", biz: "Stacked Labs", status: "Paid", tone: "emerald" as const },
              ].map((row) => (
                <div key={row.name} className="flex items-center gap-2.5 px-3 py-2.5">
                  <div className="h-7 w-7 shrink-0 rounded-md bg-white/[0.07] ring-1 ring-white/[0.06]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-medium tracking-wide text-white/88">{row.name}</p>
                    <p className="text-[9px] tracking-wide text-white/42">{row.biz}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${
                      row.tone === "emerald"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-400/30 bg-amber-400/[0.1] text-amber-100"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
