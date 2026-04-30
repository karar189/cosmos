"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Home,
  LayoutDashboard,
  Link2,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Vault,
  Wallet,
} from "lucide-react";

/** Decorative dashboard mock for the landing hero (non-interactive). */
export function HeroDashboardPreview() {
  return (
    <div
      className="grid gap-0 overflow-hidden rounded-b-xl bg-[#08080a] text-left font-sans text-[12px] leading-normal text-white/90 antialiased md:grid-cols-[56px_1fr]"
      aria-hidden
    >
      {/* Sidebar */}
      <aside className="hidden flex-col items-center gap-1 border-r border-white/[0.06] bg-[#050506] py-3 md:flex">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-white/[0.08]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-5 w-5 object-contain opacity-90" />
        </div>
        {[
          { Icon: Home, active: true },
          { Icon: LayoutDashboard },
          { Icon: Link2 },
          { Icon: Wallet },
          { Icon: Vault },
          { Icon: ShieldCheck },
        ].map(({ Icon, active }, i) => (
          <span
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              active
                ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30"
                : "text-white/30 hover:text-white/55"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        ))}
        <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-lg text-white/30">
          <Settings className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
          <button
            type="button"
            tabIndex={-1}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-white/75"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Dashboard
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          <div className="relative hidden min-w-0 flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-white/30" />
            <div className="rounded-md border border-white/[0.08] bg-black/30 py-1.5 pl-8 pr-3 text-[11px] text-white/40">
              Search workflows, clients, invoices…
              <span className="float-right rounded border border-white/10 bg-white/[0.04] px-1.5 text-[9px] text-white/40">
                ⌘K
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-300 sm:inline">
              Live · Stellar mainnet
            </span>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <Bell className="h-3.5 w-3.5 text-white/55" strokeWidth={1.75} />
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-md bg-blue-500 px-1 text-[8px] font-bold text-white">
                2
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] py-1 pl-1 pr-2.5">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-sky-400" />
              <div className="hidden text-[10px] leading-tight sm:block">
                <p className="font-medium text-white/85">Hypertron Team</p>
                <p className="text-[9px] text-white/45">3 members online</p>
              </div>
            </div>
          </div>
        </header>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-px border-b border-white/[0.06] bg-white/[0.03] sm:grid-cols-4">
          {[
            { label: "Volume (30d)", value: "1.42M", sub: "XLM", delta: "+12.4%", up: true },
            { label: "Active deals", value: "47", sub: "open", delta: "+6", up: true },
            { label: "Avg cycle", value: "2.8d", sub: "to settle", delta: "−18%", up: true },
            { label: "Compliance", value: "98%", sub: "pass rate", delta: "+1.2%", up: true },
          ].map((k) => (
            <div key={k.label} className="bg-[#08080a] px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {k.label}
              </p>
              <p className="mt-1 flex items-baseline gap-1.5 text-base font-semibold tabular-nums tracking-tight text-white">
                {k.value}
                <span className="text-[10px] font-medium text-white/40">{k.sub}</span>
              </p>
              <p
                className={`mt-0.5 flex items-center gap-1 text-[10px] font-medium tabular-nums ${
                  k.up ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {k.up ? (
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                ) : (
                  <ArrowDownRight className="h-3 w-3" strokeWidth={2} />
                )}
                {k.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-3 p-3 md:p-4">
          {/* Chart card */}
          <div className="col-span-12 flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0d0d10] p-4 lg:col-span-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Settlement volume · Inbound XLM
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-white">
                  1,423,094 <span className="text-sm font-medium text-blue-300">XLM</span>
                </p>
                <p className="mt-0.5 text-[10px] tabular-nums text-emerald-400">
                  +176,420 vs prev. period
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5">
                {["24h", "7d", "30d", "QTD"].map((t, i) => (
                  <span
                    key={t}
                    className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                      i === 2
                        ? "bg-white/[0.08] text-white ring-1 ring-white/10"
                        : "text-white/45"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative flex-1">
              <svg viewBox="0 0 400 130" className="h-[140px] w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.42)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                  </linearGradient>
                  <linearGradient id="hpLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                {/* gridlines */}
                {[0, 32, 64, 96].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="400"
                    y1={y + 12}
                    y2={y + 12}
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="2 4"
                  />
                ))}
                <path
                  d="M0,90 L32,82 L64,95 L96,68 L128,76 L160,55 L192,62 L224,42 L256,48 L288,30 L320,38 L352,22 L400,18 L400,130 L0,130 Z"
                  fill="url(#hpFill)"
                />
                <path
                  d="M0,90 L32,82 L64,95 L96,68 L128,76 L160,55 L192,62 L224,42 L256,48 L288,30 L320,38 L352,22 L400,18"
                  fill="none"
                  stroke="url(#hpLine)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* highlight dot */}
                <circle cx="288" cy="30" r="4" fill="#60a5fa" />
                <circle cx="288" cy="30" r="8" fill="#60a5fa" fillOpacity="0.18" />
              </svg>
              {/* tooltip */}
              <div
                className="absolute top-2 rounded-md border border-white/[0.1] bg-black/80 px-2.5 py-1.5 text-[10px] backdrop-blur-md"
                style={{ left: "calc(72% - 30px)" }}
              >
                <p className="text-white/45">Mar 29 · 06:49</p>
                <p className="font-semibold tabular-nums text-blue-300">5,538 XLM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-t border-white/[0.05] pt-3 text-[10px]">
              <span className="flex items-center gap-1.5 text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Settled
              </span>
              <span className="flex items-center gap-1.5 text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" /> Pending pool
              </span>
              <span className="flex items-center gap-1.5 text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Confirmed
              </span>
              <span className="ml-auto tabular-nums text-white/35">Updated 06:49 AM</span>
            </div>
          </div>

          {/* Pool balance card */}
          <div className="col-span-12 flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0d0d10] p-4 sm:col-span-6 lg:col-span-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Pool balance
                </p>
                <p className="mt-1 text-[10px] text-white/45">Settled via Stellar</p>
              </div>
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold tabular-nums text-emerald-300">
                +7.2%
              </span>
            </div>

            <div>
              <p className="text-[26px] font-semibold leading-none tabular-nums tracking-tight text-white">
                23,094
                <span className="ml-1 text-base font-medium text-blue-300">XLM</span>
              </p>
              <p className="mt-1 text-[10px] tabular-nums text-white/40">≈ $9,237.60 USD</p>
            </div>

            {/* mini sparkline */}
            <svg viewBox="0 0 120 28" className="h-7 w-full">
              <path
                d="M0,22 L12,18 L24,20 L36,14 L48,16 L60,10 L72,12 L84,7 L96,9 L108,4 L120,6"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* breakdown */}
            <div className="space-y-1.5">
              {[
                { label: "Inflow", v: "18.4K", pct: 78, c: "bg-blue-400" },
                { label: "Pool", v: "3.2K", pct: 14, c: "bg-amber-400/80" },
                { label: "Reserve", v: "1.5K", pct: 8, c: "bg-emerald-400/80" },
              ].map((r) => (
                <div key={r.label} className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-white/55">
                    <span>{r.label}</span>
                    <span className="tabular-nums">{r.v}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div className={`h-full ${r.c}`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Private payouts card */}
          <div className="relative col-span-12 flex flex-col gap-3 overflow-hidden rounded-xl border border-amber-400/20 bg-gradient-to-b from-[#161118] via-[#0e0d11] to-[#0a0a0c] p-4 sm:col-span-6 lg:col-span-2">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/[0.08] blur-2xl" />
            <div className="relative flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-wide text-white/70">Private payouts</p>
              <span className="rounded border border-amber-300/40 bg-amber-400/[0.16] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                Beta
              </span>
            </div>
            <p className="relative text-[10px] leading-relaxed text-white/45">
              Route via the pool with memo-based attribution — opt-in privacy.
            </p>

            <div className="relative space-y-1.5">
              <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1.5">
                <span className="font-mono text-[10px] text-white/55">commit_0x9f…b4</span>
                <Check className="h-3 w-3 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1.5">
                <span className="font-mono text-[10px] text-white/55">commit_0xe2…a1</span>
                <Clock className="h-3 w-3 text-amber-300" />
              </div>
            </div>

            <div className="relative mt-auto flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] font-medium text-amber-200/85 underline decoration-amber-400/40 underline-offset-2">
                Learn more
              </span>
              <span className="rounded-md bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-stone-900">
                Open
              </span>
            </div>
          </div>

          {/* Active workflows */}
          <div className="col-span-12 rounded-xl border border-white/[0.07] bg-[#0d0d10] p-4 lg:col-span-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Active workflows
              </p>
              <span className="text-[10px] tabular-nums text-white/35">12 open · 4 stalled</span>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "Acme onboarding",
                  sub: "12 clients · KYC · Soroban escrow",
                  pct: 72,
                  delta: "+9.2%",
                  c: "bg-blue-400",
                },
                {
                  name: "RWA intake — Q2",
                  sub: "8 pending docs · 3 awaiting review",
                  pct: 44,
                  delta: "+4.1%",
                  c: "bg-amber-400/80",
                },
                {
                  name: "Stacked Labs payout",
                  sub: "Milestone 3 of 5 · escrow funded",
                  pct: 60,
                  delta: "+2.3%",
                  c: "bg-emerald-400/80",
                },
                {
                  name: "Northwind retainer",
                  sub: "Awaiting compliance signoff",
                  pct: 18,
                  delta: "−0.4%",
                  c: "bg-rose-400/70",
                },
              ].map((row) => (
                <div
                  key={row.name}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] font-medium text-white/85">{row.name}</p>
                      <span className="shrink-0 text-[10px] font-semibold tabular-nums text-emerald-300">
                        {row.delta}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[9px] text-white/40">{row.sub}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div className={`h-full ${row.c}`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/45">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion / This week */}
          <div className="col-span-12 flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0d0d10] p-4 sm:col-span-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Conversion · this week
              </p>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </div>
            <div>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-blue-300">
                +19.2%
              </p>
              <p className="mt-0.5 text-[10px] text-white/40">Workflow opens → completed payments</p>
            </div>

            {/* funnel */}
            <div className="space-y-1.5">
              {[
                { label: "Opened", v: 412, pct: 100 },
                { label: "Verified", v: 337, pct: 81 },
                { label: "Paid", v: 196, pct: 47 },
              ].map((s, i) => (
                <div key={s.label} className="space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/55">{s.label}</span>
                    <span className="tabular-nums text-white/70">{s.v}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className={`h-full ${
                        i === 0 ? "bg-blue-400" : i === 1 ? "bg-blue-400/70" : "bg-blue-400/45"
                      }`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-2 rounded-lg border border-blue-500/25 bg-blue-500/[0.06] p-2">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-300" />
              <p className="text-[10px] leading-relaxed text-white/60">
                <span className="font-semibold text-white/80">AI</span> · 3 workflows need
                compliance review.
              </p>
            </div>
          </div>

          {/* Recent receivables table */}
          <div className="col-span-12 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0d10] lg:col-span-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Recent receivables
              </p>
              <span className="text-[10px] font-semibold text-amber-300">View all</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {[
                {
                  name: "Invoice #1042",
                  biz: "Northwind",
                  amt: "5,538 XLM",
                  status: "Paid",
                  tone: "emerald",
                  letter: "N",
                  bg: "from-blue-500/30 to-cyan-500/20",
                },
                {
                  name: "Retainer Q2",
                  biz: "Blue Ocean",
                  amt: "12,400 XLM",
                  status: "Pending",
                  tone: "amber",
                  letter: "B",
                  bg: "from-emerald-500/30 to-teal-500/20",
                },
                {
                  name: "Pilot deposit",
                  biz: "Stacked Labs",
                  amt: "3,200 XLM",
                  status: "Paid",
                  tone: "emerald",
                  letter: "S",
                  bg: "from-amber-400/30 to-orange-500/20",
                },
                {
                  name: "Milestone #2",
                  biz: "Acme Co.",
                  amt: "8,750 XLM",
                  status: "Review",
                  tone: "blue",
                  letter: "A",
                  bg: "from-rose-400/30 to-pink-500/20",
                },
              ].map((row) => (
                <div key={row.name} className="flex items-center gap-3 px-4 py-2.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${row.bg} text-[10px] font-bold text-white/85 ring-1 ring-white/10`}
                  >
                    {row.letter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-white/85">{row.name}</p>
                    <p className="truncate text-[9px] text-white/40">{row.biz}</p>
                  </div>
                  <p className="shrink-0 font-mono text-[10px] tabular-nums text-white/65">
                    {row.amt}
                  </p>
                  <span
                    className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${
                      row.tone === "emerald"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                        : row.tone === "amber"
                          ? "border-amber-400/30 bg-amber-400/[0.1] text-amber-100"
                          : "border-blue-400/30 bg-blue-400/[0.08] text-blue-200"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance log */}
          <div className="col-span-12 flex flex-col gap-2.5 rounded-xl border border-white/[0.07] bg-[#0d0d10] p-4 sm:col-span-6 lg:col-span-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Compliance log
              </p>
              <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                All passing
              </span>
            </div>
            {[
              { t: "06:49", e: "KYB approved", who: "Northwind Co.", c: "emerald" },
              { t: "06:31", e: "Document hash committed", who: "Stacked Labs", c: "blue" },
              { t: "05:58", e: "Pool deposit confirmed", who: "Acme Co.", c: "amber" },
              { t: "05:12", e: "Privacy commit relayed", who: "0xe2…a1", c: "blue" },
            ].map((row, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] text-white/80">
                    {row.e}{" "}
                    <span className="text-white/40">· {row.who}</span>
                  </p>
                </div>
                <span className="font-mono text-[10px] tabular-nums text-white/35">{row.t}</span>
              </div>
            ))}
          </div>

          {/* Document vault */}
          <div className="col-span-12 flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0d0d10] p-4 sm:col-span-6 lg:col-span-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Document vault
              </p>
              <span className="text-[10px] tabular-nums text-white/35">128 files</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { n: "MSA_Northwind.pdf", s: "verified", i: "emerald" },
                { n: "KYB_BlueOcean.pdf", s: "pending", i: "amber" },
                { n: "Term_Sheet_v3.pdf", s: "verified", i: "emerald" },
                { n: "Audit_Q1.pdf", s: "verified", i: "emerald" },
              ].map((d) => (
                <div
                  key={d.n}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1.5"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-white/45" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-medium text-white/80">{d.n}</p>
                    <p
                      className={`text-[9px] ${
                        d.i === "emerald" ? "text-emerald-400/85" : "text-amber-300/85"
                      }`}
                    >
                      · {d.s}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-md bg-white/[0.03] px-2.5 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.75} />
              <p className="text-[10px] text-white/55">
                All hashes anchored on Stellar — verifiable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
