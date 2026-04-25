"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

const MISSION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4";

const P1: { w: string; em?: boolean }[] = [
  { w: "We're" },
  { w: "building" },
  { w: "a" },
  { w: "space" },
  { w: "where" },
  { w: "onboarding", em: true },
  { w: "meets", em: true },
  { w: "payment", em: true },
  { w: "where" },
  { w: "teams" },
  { w: "find" },
  { w: "clarity,", em: true },
  { w: "clients" },
  { w: "move" },
  { w: "faster,", em: true },
  { w: "and" },
  { w: "every" },
  { w: "workflow" },
  { w: "link" },
  { w: "becomes" },
  { w: "something" },
  { w: "you" },
  { w: "can" },
  { w: "trust." },
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
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="mt-10 text-xl font-medium text-heroSubtitle md:text-2xl lg:text-3xl text-center"
        >
          A platform where content, capital, and compliance flow together with less noise, less friction, and
          more certainty for everyone involved.
        </motion.p>
      </div>
    </section>
  );
}
