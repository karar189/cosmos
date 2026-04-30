"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./fade-up";
import { FeaturesBento } from "./features-bento";

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="relative border-t border-border/30 px-6 py-32 md:px-28 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="text-xs uppercase tracking-[3px] text-muted-foreground"
            >
              The product
            </motion.p>
            <motion.h2
              {...fadeUp(0.06)}
              className="mt-4 max-w-3xl text-4xl font-medium tracking-tight text-foreground md:text-6xl"
            >
              B2B operations on Stellar, with{" "}
              <span className="font-serif font-normal italic">privacy</span> you can program
            </motion.h2>
          </div>
          <motion.p
            {...fadeUp(0.12)}
            className="max-w-sm text-sm leading-relaxed text-muted-foreground"
          >
            Every workflow primitive you need to onboard clients, run compliance, and settle on-chain — composed into a single programmable surface.
          </motion.p>
        </div>

        <FeaturesBento />
      </div>
    </section>
  );
}
