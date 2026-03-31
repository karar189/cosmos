"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Check, RefreshCw, Clock, DollarSign, Users,
  Code2, FileText, Search,
  TrendingUp, TrendingDown, BarChart2, Newspaper,
  Sparkles,
} from "lucide-react";

/* ── Shared card shell ─────────────────────────────────────────── */
function ServiceCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-[20px] transition-all duration-300
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}
      style={{
        background: "#080809",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="pointer-events-none absolute top-0 left-0 w-52 h-52 rounded-[20px]"
        style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.09) 0%, transparent 65%)" }}
      />
      <div className="pointer-events-none absolute top-0 left-0 w-36 h-px"
        style={{ background: "linear-gradient(to right, rgba(255,255,255,0.22), transparent)" }} />
      <div className="pointer-events-none absolute top-0 left-0 w-px h-36"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)" }} />
      {children}
    </motion.div>
  );
}

/* ── Card 1 — Automate onboarding steps ───────────────────────── */
const tasks = [
  { label: "Client KYC",         icon: <Users className="size-4" />,      done: true  },
  { label: "Document upload",    icon: <FileText className="size-4" />,   done: false },
  { label: "Payment terms",      icon: <DollarSign className="size-4" />, done: true  },
  { label: "Milestone review",   icon: <Clock className="size-4" />,      done: false },
];

function TaskCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <ServiceCard className="flex flex-col justify-between p-6 sm:p-7 h-full w-full" delay={0}>
      <div ref={ref} className="space-y-2.5">
        {tasks.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ delay: i * 0.1, duration: 0.35, ease: "easeOut" }}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07]
              bg-white/[0.04] px-4 py-3 hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-center gap-3 text-white/70">
              {t.icon}
              <span className="text-sm font-medium text-white/85">{t.label}</span>
            </div>
            {t.done
              ? <Check className="size-4 text-emerald-400/90 shrink-0" />
              : <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                >
                  <RefreshCw className="size-4 text-white/30" />
                </motion.div>
            }
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-left">
        <h3 className="text-xl font-semibold text-white leading-snug">Automate onboarding steps</h3>
        <p className="mt-2 text-sm text-white/45 leading-relaxed max-w-xs">
          Streamline every client touchpoint from KYC to final payment in one guided flow.
        </p>
      </div>
    </ServiceCard>
  );
}

/* ── Card 2 — One workflow link ────────────────────────────────── */
const SANKEY_PATHS = [
  { d: "M 90,107 C 230,107 260,22  440,22",  delay: 0    },
  { d: "M 90,107 C 230,107 260,74  440,74",  delay: 0.5  },
  { d: "M 90,107 C 230,107 260,140 440,140", delay: 0.25 },
  { d: "M 90,107 C 230,107 260,192 440,192", delay: 0.75 },
];

function WorkflowCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <ServiceCard className="relative flex flex-col justify-end p-5 sm:p-6 h-full w-full min-h-0" delay={0.1}>
      <div ref={ref} className="w-full">
        <svg viewBox="0 0 480 214" className="w-full" style={{ height: 214 }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="wf-box-a" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
            </linearGradient>
            <linearGradient id="wf-box-b" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
            <linearGradient id="wf-flow-grad" x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(100,180,255,0.0)" />
              <stop offset="20%"  stopColor="rgba(120,200,255,0.9)" />
              <stop offset="50%"  stopColor="rgba(255,255,255,1.0)" />
              <stop offset="80%"  stopColor="rgba(200,160,255,0.9)" />
              <stop offset="100%" stopColor="rgba(160,100,255,0.0)" />
            </linearGradient>
            <filter id="wf-node-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {SANKEY_PATHS.map((p, i) => (
            <g key={i}>
              <path d={p.d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" />
              <motion.path
                d={p.d} fill="none"
                stroke="url(#wf-flow-grad)" strokeWidth="0.5" strokeLinecap="round"
                strokeDasharray="260 240"
                style={{ filter: "blur(0.4px)" }}
                animate={{ strokeDashoffset: [0, -500] }}
                transition={{ repeat: Infinity, duration: 3, delay: p.delay, ease: "linear" }}
              />
              <motion.path
                d={p.d} fill="none"
                stroke="url(#wf-flow-grad)" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="260 240"
                animate={{ strokeDashoffset: [0, -500] }}
                transition={{ repeat: Infinity, duration: 3, delay: p.delay, ease: "linear" }}
              />
            </g>
          ))}

          <rect x="0" y="85" width="90" height="44" rx="10" fill="url(#wf-box-a)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" filter="url(#wf-node-glow)" />
          <rect x="0.5" y="85.5" width="89" height="1" rx="1" fill="rgba(255,255,255,0.18)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <image href="/logo.png" x="28" y="90" width="34" height="34" preserveAspectRatio="xMidYMid meet" />

          {([
            { y: 4,   Icon: TrendingUp   },
            { y: 56,  Icon: TrendingDown  },
            { y: 122, Icon: BarChart2     },
            { y: 174, Icon: Newspaper     },
          ] as { y: number; Icon: React.ElementType }[]).map(({ y, Icon }, i) => (
            <g key={i}>
              <rect x="440" y={y} width="40" height="36" rx="9"
                fill="url(#wf-box-b)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
              <rect x="440.5" y={y + 0.5} width="39" height="1" rx="1" fill="rgba(255,255,255,0.13)" />
              <foreignObject x="440" y={y} width="40" height="36">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                  <Icon size={14} color="rgba(255,255,255,0.55)" strokeWidth={1.5} />
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>

      <div className="relative z-10 mt-2 text-left">
        <h3 className="text-xl font-semibold text-white leading-snug">One workflow link</h3>
        <p className="mt-2 text-sm text-white/45 leading-relaxed max-w-sm">
          Share a single link. Clients complete onboarding, upload docs, and pay — no manual chasing.
        </p>
      </div>
    </ServiceCard>
  );
}

/* ── Card 3 — Real-time deal tracking ─────────────────────────── */
const RADAR_BLIPS = [
  { angle: 40,  r: 0.52 },
  { angle: 115, r: 0.38 },
  { angle: 195, r: 0.68 },
  { angle: 285, r: 0.44 },
  { angle: 330, r: 0.62 },
];
const SWEEP_DURATION = 3;

function TrackingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const cx = 100, cy = 100, maxR = 82;
  const deg = useMotionValue(0);

  useEffect(() => {
    if (!inView) { deg.set(0); return; }
    const ctrl = animate(deg, 360, { repeat: Infinity, duration: SWEEP_DURATION, ease: "linear" });
    return () => ctrl.stop();
  }, [inView, deg]);

  const toX = (d: number) => cx + Math.sin(d * Math.PI / 180) * maxR;
  const toY = (d: number) => cy - Math.cos(d * Math.PI / 180) * maxR;

  const lx2  = useTransform(deg, toX);
  const ly2  = useTransform(deg, toY);
  const tr1x = useTransform(deg, d => toX(d - 10));
  const tr1y = useTransform(deg, d => toY(d - 10));
  const tr2x = useTransform(deg, d => toX(d - 22));
  const tr2y = useTransform(deg, d => toY(d - 22));
  const tr3x = useTransform(deg, d => toX(d - 38));
  const tr3y = useTransform(deg, d => toY(d - 38));
  const tr4x = useTransform(deg, d => toX(d - 58));
  const tr4y = useTransform(deg, d => toY(d - 58));

  return (
    <ServiceCard className="flex flex-col p-5 sm:p-6 h-full w-full min-h-0" delay={0.2}>
      <div ref={ref} className="flex-1 flex items-center justify-center py-2">
        <svg viewBox="0 0 200 200" className="w-full max-w-[190px]" style={{ height: 190 }}>
          {[0.33, 0.66, 1].map((f, i) => (
            <circle key={i} cx={cx} cy={cy} r={maxR * f}
              fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={i === 2 ? 1 : 0.75} />
          ))}
          <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <motion.line x1={cx} y1={cy} x2={tr4x} y2={tr4y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeLinecap="round" />
          <motion.line x1={cx} y1={cy} x2={tr3x} y2={tr3y} stroke="rgba(255,255,255,0.09)" strokeWidth="1.1" strokeLinecap="round" />
          <motion.line x1={cx} y1={cy} x2={tr2x} y2={tr2y} stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
          <motion.line x1={cx} y1={cy} x2={tr1x} y2={tr1y} stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" strokeLinecap="round" />
          <motion.line x1={cx} y1={cy} x2={lx2} y2={ly2}
            stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.6))" }}
          />
          {RADAR_BLIPS.map((b, i) => {
            const rad = (b.angle - 90) * Math.PI / 180;
            const bx = cx + Math.cos(rad) * maxR * b.r;
            const by = cy + Math.sin(rad) * maxR * b.r;
            const delay = (b.angle / 360) * SWEEP_DURATION;
            return (
              <g key={i}>
                <motion.circle cx={bx} cy={by} r={0}
                  fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"
                  animate={inView ? { r: [0, 9], opacity: [0.7, 0] } : {}}
                  transition={{ repeat: Infinity, duration: SWEEP_DURATION, delay, ease: "easeOut" }}
                />
                <motion.circle cx={bx} cy={by} r={2}
                  fill="rgba(255,255,255,0.9)"
                  animate={inView ? { opacity: [0, 1, 0.5, 0.2] } : { opacity: 0.1 }}
                  transition={{ repeat: Infinity, duration: SWEEP_DURATION, delay, ease: "easeOut" }}
                />
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,0.08)" />
          <circle cx={cx} cy={cy} r={2.5} fill="rgba(255,255,255,0.95)"
            style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }} />
        </svg>
      </div>
      <div className="shrink-0 pt-2 pb-2 text-left">
        <h3 className="text-base font-semibold text-white">Real-time deal tracking</h3>
        <p className="mt-1 text-xs text-white/50 leading-relaxed">See who opened the link, completed steps, and payment status live.</p>
      </div>
    </ServiceCard>
  );
}

/* ── Card 4 — Smart compliance checks ─────────────────────────── */
const codeLines = [
  { indent: 0, text: "def run_kyb_check(self, entity_id):",         dim: false },
  { indent: 1, text: 'self.status = "pending_review"',              dim: true  },
  { indent: 1, text: "docs = self.fetch_documents(entity_id)",      dim: false },
  { indent: 0, text: "def approve_if_compliant(self, docs):",       dim: false },
  { indent: 1, text: "if docs.all_verified and not docs.flagged:",  dim: true  },
];

function ComplianceCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <ServiceCard className="flex flex-col p-5 sm:p-6 h-full w-full min-h-0" delay={0.3}>
      <div ref={ref} className="min-h-0 overflow-auto">
        <div className="rounded-xl border border-white/[0.07] bg-black/40 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-[#ff5f57]" />
              <div className="size-2.5 rounded-full bg-[#febc2e]" />
              <div className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Search className="size-3 text-white/30" />
              <span className="flex items-center gap-1.5 rounded bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/50">
                <Code2 className="size-3" /> Compliance
              </span>
            </div>
          </div>
          <div className="px-3 py-2.5 font-mono text-[10px] leading-[1.6]">
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                className={line.dim ? "text-white/28" : "text-white/70"}
                style={{ paddingLeft: line.indent * 16 }}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: line.dim ? 0.28 : 0.7, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: i * 0.12, duration: 0.3, ease: "easeOut" }}
              >
                <span className="mr-4 text-white/20 select-none">{i + 1}</span>
                {line.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="shrink-0 pt-4 pb-2 text-left">
        <h3 className="text-base font-semibold text-white">Smart compliance checks</h3>
        <p className="mt-1 text-xs text-white/50 leading-relaxed">KYB, document verification and approvals built into every workflow.</p>
      </div>
    </ServiceCard>
  );
}

/* ── Card 5 — Escrow & milestone settlements ──────────────────── */
const barHeights = [40, 58, 50, 70, 62, 78, 68, 88, 72];

function EscrowCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <ServiceCard className="flex flex-col p-5 sm:p-6 h-full w-full min-h-0" delay={0.4}>
      <div ref={ref} className="relative min-h-0 flex flex-col items-center justify-center gap-4">
        <motion.div
          className="relative z-10 flex items-center justify-center size-14 rounded-full
            bg-[radial-gradient(circle_at_38%_30%,rgba(255,255,255,0.18),rgba(0,0,0,0.85))]
            border border-white/[0.12] shadow-[0_0_28px_rgba(255,255,255,0.08)]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        >
          <Sparkles className="size-6 text-white/90" />
        </motion.div>

        <div className="w-full flex items-end justify-center gap-1 h-12 px-2">
          {barHeights.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 max-w-3 rounded-t"
              style={{ background: "rgba(255,255,255,0.18)" }}
              initial={{ scaleY: 0, originY: 1 }}
              animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
            >
              <div style={{ height: `${h * 0.48}px` }} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="shrink-0 pt-4 pb-2 text-left">
        <h3 className="text-base font-semibold text-white">Escrow & milestone settlements</h3>
        <p className="mt-1 text-xs text-white/50 leading-relaxed">Funds held securely and released only when conditions are met.</p>
      </div>
    </ServiceCard>
  );
}

/* ── Exported section ──────────────────────────────────────────── */
export function FeaturesBento() {
  return (
    <div className="mt-20 max-w-5xl mx-auto grid grid-cols-1 gap-4
      lg:grid-cols-3 lg:grid-rows-[auto_auto] lg:items-stretch">
      <div className="lg:col-span-1 lg:row-span-1 flex min-h-[260px] sm:min-h-[300px]">
        <TaskCard />
      </div>
      <div className="lg:col-span-2 lg:row-span-1 flex min-h-[260px] sm:min-h-[300px]">
        <WorkflowCard />
      </div>
      <div className="lg:col-span-1 flex min-h-[260px] sm:min-h-[300px]">
        <TrackingCard />
      </div>
      <div className="lg:col-span-1 flex min-h-[260px] sm:min-h-[300px]">
        <ComplianceCard />
      </div>
      <div className="lg:col-span-1 flex min-h-[260px] sm:min-h-[300px]">
        <EscrowCard />
      </div>
    </div>
  );
}
