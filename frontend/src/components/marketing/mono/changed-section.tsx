"use client";

import { Cpu, MessageSquare, Search } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "./fade-up";
import { FeaturesBento } from "./features-bento";

const PLATFORMS = [
  {
    name: "Expectations",
    description: "Clients expect guided flows, instant status, and transparent payment terms—not email threads.",
    Icon: MessageSquare,
  },
  {
    name: "Operations",
    description: "Your team needs one place for documents, approvals, and fund releases without spreadsheet chaos.",
    Icon: Search,
  },
  {
    name: "Settlement",
    description: "On-chain settlement and escrow should feel as simple as a checkout link, with auditability built in.",
    Icon: Cpu,
  },
] as const;

export function ChangedSection() {
  return (
    <section className="px-6 pb-6 pt-20 md:px-28 md:pb-9 md:pt-28">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          {...fadeUp(0)}
          className="text-5xl font-semibold leading-tight tracking-[-2px] text-foreground md:text-7xl md:leading-[1.15]"
        >
          Onboarding has{" "}
          <span className="font-serif font-normal italic">changed.</span>
          <br className="hidden sm:block" /> Have you?
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground"
        >
          Hypertron unifies onboarding, compliance touchpoints, and payments in a single workflow link so
          nothing slips through the cracks.
        </motion.p>
      </div>

      <FeaturesBento />

      <motion.p
        {...fadeUp(0.2)}
        className="mt-20 text-center text-sm text-muted-foreground"
      >
        If you don&apos;t own the workflow, someone else will define the experience.
      </motion.p>
    </section>
  );
}
