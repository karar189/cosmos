"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp } from "./fade-up";
import { DarkVeil } from "./dark-veil";
import Image from "next/image";

const DEMO_HREF = "https://calendly.com/kararsweta/30min";

export function CtaHlsSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/30 py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 z-0" style={{ position: "absolute", inset: 0 }} aria-hidden>
        <DarkVeil resolutionScale={0.6} />
      </div>
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/55 via-blue-950/20 to-slate-950/65"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center md:px-8">
        <motion.div {...fadeUp(0)} className="mb-8">
          <Image src="/logo.png" alt="Hypertron" width={48} height={48} className="h-12 w-12 object-contain" />
        </motion.div>
        <motion.h2
          {...fadeUp(0.08)}
          className="text-4xl font-medium tracking-tight text-foreground md:text-5xl"
        >
          <span className="font-serif font-normal italic">Start</span> your rollout
        </motion.h2>
        <motion.p {...fadeUp(0.14)} className="mt-4 max-w-md text-muted-foreground">
          Book a walkthrough with the Hypertron team: onboarding, settlements, and the dashboard on Stellar.
        </motion.p>
        <motion.div {...fadeUp(0.2)} className="mt-10">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={DEMO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-3.5 text-sm font-medium text-background"
            >
              Book a demo
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
