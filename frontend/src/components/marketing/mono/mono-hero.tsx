"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DarkVeil } from "./dark-veil";
import { ShinyText } from "@/components/ui/shiny-text";
import { HeroMarquee } from "./hero-marquee";

const BOOK_DEMO = "https://calendly.com/kararsweta/30min";

export function MonoHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black px-4 pb-24 pt-28 text-center md:px-8 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={{ position: "absolute", inset: 0 }} aria-hidden>
        <DarkVeil speed={0.4} warpAmount={0.3} noiseIntensity={0.02} resolutionScale={0.6} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/30 to-black/70"
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
            New
          </span>
          <ShinyText
            text="Say hello to workflow links on Stellar"
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
          className="mb-3 text-5xl font-semibold leading-tight tracking-[-2px] text-foreground drop-shadow-sm md:text-7xl md:leading-[1.15]"
        >
          Your insights.
          <br />
          One clear <span className="font-serif text-[1.06em] font-normal italic">overview</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-xl text-lg font-normal leading-6 text-heroSubtitle opacity-95 drop-shadow-sm"
        >
          Hypertron helps teams track onboarding, goals,
          <br />
          and progress with precision.
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
        className="relative z-10 mt-16 w-full max-w-5xl px-4 translate-y-[82%]"
      >
        {/* Glow beneath the frame */}
        <div
          className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 h-24 w-3/4 rounded-full blur-3xl"
          style={{ background: "rgba(120, 80, 255, 0.35)" }}
        />
        {/* Frame */}
        <div
          className="relative overflow-hidden rounded-2xl"
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
              <span className="text-xs text-white/40">app.hypertron.xyz/dashboard</span>
            </div>
          </div>

          {/* Placeholder body */}
          <div className="bg-[#080809] p-6" style={{ minHeight: 420 }}>
            {/* Top bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="h-5 w-32 rounded-md bg-white/[0.07]" />
              <div className="flex gap-2">
                <div className="h-8 w-20 rounded-lg bg-white/[0.05]" />
                <div className="h-8 w-28 rounded-lg bg-white/[0.12]" />
              </div>
            </div>

            {/* Stat cards */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {["Total Clients", "Active Workflows", "Funds in Escrow", "Completed Deals"].map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <div className="mb-3 h-3 w-20 rounded bg-white/[0.08]" />
                  <div className="h-6 w-16 rounded bg-white/[0.12]" />
                </div>
              ))}
            </div>

            {/* Content rows */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="border-b border-white/[0.06] px-4 py-3">
                <div className="h-3.5 w-24 rounded bg-white/[0.08]" />
              </div>
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/[0.07]" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 rounded bg-white/[0.09]" />
                      <div className="h-2.5 w-20 rounded bg-white/[0.05]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-16 rounded-full bg-white/[0.07]" />
                    <div className="h-3 w-14 rounded bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />
    </section>
  );
}
