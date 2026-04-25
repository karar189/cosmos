"use client";

import { FEATURES } from "@/utils/constants/misc";
import { motion } from "framer-motion";
import { fadeUp } from "./fade-up";

const GRID = FEATURES.slice(0, 4);

/** Blue accent palette (replaces prior yellow bar) */
const blue = {
  glow: "rgba(59, 130, 246, 0.45)",
  ring: "rgba(96, 165, 250, 0.35)",
};

function CardVisualPool() {
  const nodes = 8;
  return (
    <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-blue-950/35 via-slate-950/20 to-transparent">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 45%, ${blue.glow}, transparent 65%)`,
        }}
      />
      <div className="relative flex h-[140px] w-[140px] items-center justify-center">
        {Array.from({ length: nodes }).map((_, i) => {
          const angle = (i / nodes) * Math.PI * 2 - Math.PI / 2;
          const r = 52;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <div
              key={i}
              className="absolute h-7 w-7 rounded-full border border-sky-400/20 bg-white/[0.06] shadow-sm"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            />
          );
        })}
        <div
          className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-sky-400/40 bg-gradient-to-br from-blue-500/30 to-sky-600/20 shadow-[0_0_48px_rgba(59,130,246,0.4)]"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-200" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CardVisualStacked() {
  return (
    <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-950/80 to-transparent px-4">
      <div className="relative w-full max-w-[220px] translate-x-2">
        <div className="absolute left-0 top-3 z-0 w-[92%] rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 shadow-lg backdrop-blur-sm">
          <div className="mb-2 h-2 w-24 rounded bg-white/10" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded bg-white/[0.06]" />
            <div className="h-1.5 w-[85%] rounded bg-white/[0.06]" />
            <div className="h-1.5 w-[70%] rounded bg-white/[0.06]" />
          </div>
        </div>
        <div className="relative z-10 rounded-lg border border-sky-500/30 bg-slate-950/90 p-3 shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium tracking-wide text-sky-200/90">Hypertron</span>
            <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[8px] font-medium text-emerald-300/90">Live</span>
          </div>
          <div className="space-y-2">
            {["Receivables", "Pool balance", "Payout batch"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      i === 0 ? "rgb(56, 189, 248)" : i === 1 ? "rgb(125, 211, 252)" : "rgb(129, 140, 248)",
                  }}
                />
                <span className="text-[10px] text-white/55">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            <div className="h-5 w-5 rounded-full border border-white/10 bg-white/5" />
            <div className="h-5 w-5 rounded-full border border-white/10 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardVisualTree() {
  return (
    <div className="relative flex min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-blue-950/25 to-transparent px-6 pt-6">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/35 bg-blue-500/20 shadow-[0_0_24px_rgba(59,130,246,0.25)]">
        <div className="h-3 w-3 rounded-sm bg-sky-300/80" />
      </div>
      <div className="h-6 w-px bg-gradient-to-b from-sky-500/50 to-sky-500/20" />
      <div className="w-full max-w-[200px] rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-medium text-white/70">Final workflow</span>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-white/[0.07]" />
          <div className="h-1.5 w-[90%] rounded bg-white/[0.07]" />
          <div className="h-1.5 w-[75%] rounded bg-white/[0.07]" />
        </div>
        <div className="mt-2 flex justify-end gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-4 rounded-full border border-white/10 bg-white/[0.06]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardVisualCarousel() {
  return (
    <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-950/60 to-transparent px-2">
      <div className="flex w-full max-w-[260px] items-center justify-center gap-2 pb-2">
        <div className="w-[28%] shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 opacity-50">
          <div className="mb-1 h-1.5 w-10 rounded bg-white/10" />
          <div className="h-1 w-full rounded bg-white/[0.05]" />
        </div>
        <div className="w-[44%] shrink-0 rounded-lg border border-sky-400/40 bg-gradient-to-b from-blue-500/15 to-slate-950/80 p-2.5 shadow-[0_0_32px_rgba(59,130,246,0.2)]">
          <div className="mb-1.5 inline-block rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-emerald-300">
            Active
          </div>
          <div className="mb-1 text-[10px] font-medium text-white/85">Compliance pass</div>
          <div className="mb-2 text-[8px] leading-snug text-white/40">Review before next batch.</div>
          <div className="flex gap-1">
            <div className="h-4 w-4 rounded-full border border-sky-400/20 bg-sky-500/10" />
            <div className="h-4 w-4 rounded-full border border-white/10 bg-white/5" />
          </div>
        </div>
        <div className="w-[28%] shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 opacity-50">
          <div className="mb-1 h-1.5 w-8 rounded bg-white/10" />
          <div className="h-1 w-full rounded bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}

const visuals = [CardVisualPool, CardVisualStacked, CardVisualTree, CardVisualCarousel] as const;

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="border-t border-border/30 bg-background px-6 py-24 md:px-12 md:py-32 lg:px-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          {...fadeUp(0)}
          className="text-xs uppercase tracking-[3px] text-muted-foreground"
        >
          Solution
        </motion.p>
        <motion.h2
          {...fadeUp(0.06)}
          className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.1]"
        >
          B2B operations on Stellar, with{" "}
          <span className="font-serif font-normal italic">privacy</span> you can program
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {GRID.map((f, i) => {
            const Visual = visuals[i] ?? CardVisualPool;
            return (
              <motion.article
                key={f.title}
                {...fadeUp(0.05 * i)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl transition-all duration-300 hover:border-sky-500/25 hover:shadow-[0_24px_80px_-24px_rgba(59,130,246,0.15)]"
              >
                <div className="border-b border-white/[0.06] p-3 sm:p-4">
                  <Visual />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div
                    className="mb-4 h-0.5 w-10 shrink-0 rounded-full transition-[width] group-hover:w-14"
                    style={{ background: `linear-gradient(90deg, ${blue.ring}, transparent)` }}
                    aria-hidden
                  />
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
