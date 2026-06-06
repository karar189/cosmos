"use client";

import {
  ChevronLeft,
  CircleDollarSign,
  FileSignature,
  FileText,
  Folder,
  Home,
  MapPin,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  Timer,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Decorative dashboard mock for the landing hero (non-interactive). */
export function HeroDashboardPreview() {
  return (
    <div
      className="grid grid-cols-1 overflow-hidden rounded-b-xl bg-[#08080a] text-left font-sans text-[11px] text-white/90 antialiased sm:grid-cols-[160px_1fr] sm:text-[12px]"
      aria-hidden
    >
      {/* ——— Sidebar ——— */}
      <aside className="hidden flex-col gap-1 border-r border-white/[0.06] bg-[#060607] px-3 py-4 sm:flex">
        {/* Logo + collapse */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-5 w-5 object-contain" />
            <span className="text-sm font-semibold tracking-tight text-white">Hypertron</span>
          </div>
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 text-white/40">
            <ChevronLeft className="h-3 w-3" strokeWidth={2} />
          </span>
        </div>

        {/* Main nav */}
        <SideItem icon={Home} label="Home" active />
        <SideItem icon={Users} label="Clients" />
        <SideItem icon={Folder} label="Projects" />
        <SideItem icon={Timer} label="Time tracking" />

        {/* Divider + Tools */}
        <div className="my-4 border-t border-white/[0.06]" />
        <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
          Tools
        </p>
        <SideItem icon={Receipt} label="Invoices" />
        <SideItem icon={FileSignature} label="Contracts" />
        <SideItem icon={Wallet} label="Balance" />
        <SideItem icon={ShieldCheck} label="Compliance" />
        <SideItem icon={CircleDollarSign} label="Payouts" />
      </aside>

      {/* ——— Main ——— */}
      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-3 py-3 sm:flex-nowrap sm:gap-3 sm:px-5 sm:py-4">
          <div className="flex w-full items-center justify-between sm:hidden">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-5 w-5 object-contain" />
              <span className="text-sm font-semibold tracking-tight text-white">Hypertron</span>
            </div>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[10px] tabular-nums text-white/60">
              0:00
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-tight text-white">Hello, Karar</p>
            <p className="text-[11px] text-white/45">What are you working on?</p>
          </div>

          <div className="relative ml-6 hidden min-w-0 flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
            <div className="rounded-full border border-white/[0.08] bg-white/[0.02] py-1.5 pl-9 pr-3 text-[11px] text-white/40">
              Search
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            {[MapPin, FileText, CircleDollarSign].map((Icon, i) => (
              <span
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/55"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
            ))}
            <span className="ml-1 font-mono text-sm tabular-nums text-white/85">0:00:00</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
              <TimerPlay />
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total volume", value: "1.42M", unit: "XLM", delta: "+16.4%", up: true, Icon: Receipt },
              { label: "Active deals", value: "55", unit: "open", delta: "−4.8%", up: false, Icon: FileSignature },
              { label: "Completed", value: "400", unit: "deals", delta: "+12.8%", up: true, Icon: ShieldCheck },
              { label: "Total hours", value: "600hrs", unit: "", delta: "−1.2%", up: false, Icon: Timer },
            ].map((k) => (
              <div
                key={k.label}
                className="min-w-0 rounded-xl border border-white/[0.06] bg-[#0d0d10] p-3 sm:flex sm:flex-col sm:gap-3 sm:p-3.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
                    <k.Icon className="h-3.5 w-3.5 text-white/70" strokeWidth={1.75} />
                  </span>
                  <p className="min-w-0 text-[10px] leading-tight text-white/55 sm:text-[11px]">
                    {k.label}
                  </p>
                </div>
                <div className="mt-3 flex min-w-0 flex-wrap items-end justify-between gap-x-2 gap-y-1 sm:mt-0">
                  <p className="min-w-0 text-xl font-semibold leading-none tabular-nums tracking-tight text-white sm:text-2xl">
                    {k.value}
                    {k.unit ? (
                      <span className="ml-1 text-[10px] font-medium text-white/40 sm:text-xs">{k.unit}</span>
                    ) : null}
                  </p>
                  <span
                    className={`text-[11px] font-medium tabular-nums ${
                      k.up ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {k.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + actions */}
          <div className="grid grid-cols-12 gap-3">
            {/* Earning chart */}
            <div className="col-span-12 rounded-xl border border-white/[0.06] bg-[#0d0d10] p-3 sm:p-4 lg:col-span-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Earning over time</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/55">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Billable
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400/35" /> Non-billable
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70">
                    Month
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white/40">
                      <path
                        d="M3 5 L6 8 L9 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-white/55">
                    <TrendingUp className="h-3 w-3" strokeWidth={1.75} />
                  </span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="mt-4 flex h-28 items-end justify-between gap-1.5 px-1 sm:mt-5 sm:h-36 sm:gap-2">
                {[
                  [55, 35],
                  [80, 50],
                  [60, 38],
                  [50, 32],
                  [75, 48],
                  [40, 22],
                  [85, 55],
                  [65, 42],
                  [45, 28],
                  [70, 45],
                  [55, 34],
                  [38, 20],
                ].map(([bill, nonBill], i) => {
                  const total = bill + nonBill;
                  return (
                    <div
                      key={i}
                      className="flex h-full flex-1 flex-col justify-end"
                    >
                      <div
                        className="flex w-full flex-col overflow-hidden rounded-t"
                        style={{ height: `${(total / 140) * 100}%` }}
                      >
                        <div
                          className="w-full bg-blue-400/25"
                          style={{ flex: `${nonBill} 0 0%` }}
                        />
                        <div
                          className="w-full bg-gradient-to-t from-blue-500/70 to-blue-400"
                          style={{ flex: `${bill} 0 0%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action grid */}
            <div className="col-span-12 grid grid-cols-2 gap-3 lg:col-span-4">
              {[
                { label: "New payout", Icon: CircleDollarSign },
                { label: "Run KYB", Icon: ShieldCheck },
                { label: "Add workflow", Icon: Plus },
                { label: "Send invoice", Icon: Receipt },
              ].map((a) => (
                <div
                  key={a.label}
                  className="flex min-h-24 flex-col items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0d0d10] p-3 sm:p-3.5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
                    <a.Icon className="h-3.5 w-3.5 text-white/75" strokeWidth={1.75} />
                  </span>
                  <p className="text-[12px] font-medium text-white/85">{a.label}</p>
                </div>
              ))}
            </div>

            {/* Footer accent strip */}
            <div className="col-span-12 flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-[#0a0a0c] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
              <div className="flex items-center gap-3 text-[11px] text-white/55">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Live on Stellar mainnet
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/45">
                <span>
                  Pool balance · <span className="font-mono tabular-nums text-white/75">23,094 XLM</span>
                </span>
                <span className="hidden sm:inline">
                  Last payout · <span className="font-mono tabular-nums text-white/75">06:49 AM</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] transition-colors ${
        active
          ? "bg-white/[0.06] text-white ring-1 ring-white/[0.08]"
          : "text-white/55"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      <span className="truncate">{label}</span>
    </div>
  );
}

function TimerPlay() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current">
      <path d="M5 3.5v9l7.5-4.5z" />
    </svg>
  );
}
