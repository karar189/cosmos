"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const QUOTE =
  "Fragmented tools and exposed on-chain flows block real B2B adoption. Hypertron unifies onboarding, compliance, and Stellar payments, with a privacy pool so execution stays programmable and defensible.";

const WORDS = QUOTE.split(/\s+/);

function RevealWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const color = useTransform(progress, [start, end], ["hsl(0, 0%, 35%)", "hsl(0, 0%, 100%)"]);
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.3em] inline">
      {word}
    </motion.span>
  );
}

export function NeuralTestimonial() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"],
  });

  return (
    <section
      id="reviews"
      ref={containerRef}
      className="flex flex-col items-center gap-10 px-8 pt-24 pb-8 md:px-28 md:pt-20 md:pb-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 text-center">
        <p className="flex flex-wrap justify-center text-4xl font-medium leading-[1.2] md:text-5xl">
          {WORDS.map((w, i) => (
            <RevealWord key={`${w}-${i}`} word={w} index={i} total={WORDS.length} progress={scrollYProgress} />
          ))}
        </p>

      </div>
    </section>
  );
}
