"use client";

import { FEATURES } from "@/utils/constants/misc";
import { motion } from "framer-motion";
import { fadeUp } from "./fade-up";

/** Light Yellow 3 – accent bar only */
const YELLOW = "#FFF971";

const GRID = FEATURES.slice(0, 4);

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="border-t border-border/30 px-6 py-32 md:px-28 md:py-44"
    >
      <motion.p
        {...fadeUp(0)}
        className="text-xs uppercase tracking-[3px] text-muted-foreground"
      >
        Solution
      </motion.p>
      <motion.h2
        {...fadeUp(0.06)}
        className="mt-4 max-w-4xl text-4xl font-medium tracking-tight text-foreground md:text-6xl"
      >
        B2B operations on Stellar, with{" "}
        <span className="font-serif font-normal italic">privacy</span> you can program
      </motion.h2>

      <div className="mt-16 grid gap-4 font-sans sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5">
        {GRID.map((f, i) => (
          <motion.article
            key={f.title}
            {...fadeUp(0.05 * i)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-transparent p-6 font-sans backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.2]"
          >
            <div
              className="mb-4 h-0.5 w-10 shrink-0 rounded-full transition-[width] group-hover:w-14"
              style={{ backgroundColor: YELLOW }}
              aria-hidden
            />
            <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground">
              {f.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
