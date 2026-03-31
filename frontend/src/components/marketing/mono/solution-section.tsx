"use client";

import { FEATURES } from "@/utils/constants/misc";
import { motion } from "framer-motion";
import { fadeUp } from "./fade-up";

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
        The platform for{" "}
        <span className="font-serif font-normal italic">meaningful</span> operations
      </motion.h2>

      <div className="mt-20 grid gap-10 md:grid-cols-4 md:gap-8">
        {GRID.map((f, i) => (
          <motion.div key={f.title} {...fadeUp(0.05 * i)}>
            <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
