"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DarkVeil } from "./dark-veil";
import { HeroDashboardPreview } from "./hero-dashboard-preview";
import { ShinyText } from "@/components/ui/shiny-text";
const BOOK_DEMO = "https://calendly.com/kararsweta/30min";

export function MonoHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black px-4 pb-24 pt-28 text-center md:px-8 md:pt-48"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={{ position: "absolute", inset: 0 }} aria-hidden>
        <DarkVeil resolutionScale={0.6} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/75 via-blue-950/25 to-slate-950/80"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-6 relative flex flex-wrap items-center justify-center gap-2.5 rounded-full px-4 py-2 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
        >
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-black tracking-wide">
            Stellar
          </span>
          <ShinyText
            text="B2B AI workflows & pooled settlement"
            speed={3}
            color="rgba(255,255,255,0.6)"
            shineColor="#ffffff"
            spread={100}
            className="text-sm font-medium"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 max-w-3xl text-4xl font-semibold leading-[1.15] tracking-[-1.5px] text-foreground drop-shadow-sm sm:text-5xl md:text-6xl md:leading-[1.1]"
        >
          Unified B2B onboarding and private settlement.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-8 max-w-xl text-md leading-relaxed text-heroSubtitle/90 opacity-85 drop-shadow-sm md:text-sm"
        >
          Replace fragmented tools and expose less sensitive financial data. Hypertron combines onboarding, payments, AI-assisted workflows, and a privacy layer into a single programmable B2B infrastructure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={BOOK_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-foreground px-8 py-3.5 text-base font-semibold text-background"
            >
              Book a Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Dashboard preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 mt-24 w-full max-w-5xl px-4 translate-y-[82%] md:mt-20 lg:mt-32"
      >
        {/* Glow beneath the frame */}
        <div
          className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 h-24 w-3/4 rounded-full blur-3xl"
          style={{ background: "rgba(59, 130, 246, 0.35)" }}
        />
        {/* Frame */}
        <div
          className="pointer-events-none relative overflow-hidden rounded-2xl select-none"
          style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1">
              <span className="font-mono text-[11px] tracking-wide text-white/45">
                app.hypertron.xyz/dashboard
              </span>
            </div>
          </div>

          <HeroDashboardPreview />
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />
    </section>
  );
}
