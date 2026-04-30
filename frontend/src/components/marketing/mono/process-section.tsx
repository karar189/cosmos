"use client";

import { motion } from "framer-motion";
import { PROCESS } from "@/utils/constants/misc";
import { fadeUp } from "./fade-up";

const STEP_LABELS = ["01", "02", "03"];

export function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="relative border-t border-border/30 px-6 py-32 md:px-28 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="text-xs uppercase tracking-[3px] text-muted-foreground"
            >
              How it works
            </motion.p>
            <motion.h2
              {...fadeUp(0.06)}
              className="mt-4 max-w-2xl text-4xl font-medium tracking-tight text-foreground md:text-5xl"
            >
              From signup to{" "}
              <span className="font-serif font-normal italic">settlement</span> in three moves
            </motion.h2>
          </div>
          <motion.p {...fadeUp(0.12)} className="max-w-sm text-sm text-muted-foreground">
            One pipeline replaces a stack of tools. Onboarding, compliance, and capital flow share the same rail.
          </motion.p>
        </div>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3 md:gap-4 lg:gap-6">
          {/* Connecting dotted line on desktop */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-[64px] z-0 hidden h-px md:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, transparent 0, rgba(255,255,255,0.18) 50%, transparent 100%)",
            }}
            aria-hidden
          />
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.title}
                {...fadeUp(0.08 * i)}
                className="group relative z-10 flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0a0a0c] p-7 transition-colors duration-300 hover:border-white/[0.18]"
              >
                <div className="flex items-center justify-between">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04]">
                    <Icon className="h-5 w-5 text-blue-300" strokeWidth={1.5} />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-blue-400/0 transition-all duration-300 group-hover:ring-blue-400/30" />
                  </div>
                  <span className="font-mono text-xs tracking-[0.18em] text-white/30">
                    {STEP_LABELS[i]}
                  </span>
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                <div className="mt-auto h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
