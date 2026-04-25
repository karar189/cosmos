"use client";

import { useScroll, useTransform, type MotionValue, motion } from "framer-motion";
import { useRef } from "react";

const MISSION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4";

const P1: { w: string; em?: boolean }[] = [
  { w: "We're" },
  { w: "building" },
  { w: "where" },
  { w: "onboarding,", em: true },
  { w: "capital,", em: true },
  { w: "and", em: true },
  { w: "compliance", em: true },
  { w: "share" },
  { w: "one" },
  { w: "Stellar-native", em: true },
  { w: "rail," },
  { w: "so" },
  { w: "teams" },
  { w: "ship" },
  { w: "end-to-end", em: true },
  { w: "flows" },
  { w: "with" },
  { w: "privacy", em: true },
  { w: "you" },
  { w: "can" },
  { w: "prove", em: true },
  { w: "when" },
  { w: "it" },
  { w: "matters." },
];

function RevealWord({
  text,
  index,
  total,
  progress,
  emphasize,
}: {
  text: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  emphasize?: boolean;
}) {
  const start = (index / Math.max(total, 1)) * 0.72 + 0.06;
  const end = Math.min(start + 0.14, 0.98);
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      <span className={emphasize ? "text-foreground" : "text-heroSubtitle"}>{text}</span>{" "}
    </motion.span>
  );
}

export function MissionSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.32"],
  });

  return (
    <section id="mission" ref={ref} className="px-6 pb-32 pt-0 md:px-28 md:pb-44 flex flex-col items-center">
      <div className="mx-auto flex max-w-3xl justify-center">
        <video
          className="aspect-square max-h-[min(800px,85vw)] w-full max-w-[800px] rounded-sm object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={MISSION_VIDEO} type="video/mp4" />
        </video>
      </div>

      <div className="mx-auto mt-16 max-w-4xl px-2 md:mt-24 text-center">
        <p className="text-2xl font-medium tracking-[-1px] md:text-4xl lg:text-5xl text-center">
          {P1.map((item, i) => (
            <RevealWord
              key={`${item.w}-${i}`}
              text={item.w}
              index={i}
              total={P1.length}
              progress={scrollYProgress}
              emphasize={item.em}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
