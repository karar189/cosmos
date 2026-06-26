"use client";

import { cn } from "@/utils";
import { SOURCE_SEGMENTS } from "./risk-agent-data";

/* ─────────────────────────── Hero robot ─────────────────────────── */

export function RiskAgentRobot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-28 w-28 shrink-0", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id="robotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#6D28D9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="robotHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>
        <linearGradient id="robotVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <radialGradient id="robotEye" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#22D3EE" />
        </radialGradient>
      </defs>

      <circle cx="70" cy="72" r="56" fill="url(#robotGlow)" />

      {/* antenna */}
      <line x1="70" y1="22" x2="70" y2="36" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="18" r="5" fill="#C4B5FD" />

      {/* ears */}
      <rect x="24" y="58" width="12" height="26" rx="6" fill="#A78BFA" />
      <rect x="104" y="58" width="12" height="26" rx="6" fill="#A78BFA" />

      {/* head */}
      <rect x="34" y="36" width="72" height="62" rx="24" fill="url(#robotHead)" />
      <rect x="34" y="36" width="72" height="62" rx="24" stroke="#DDD6FE" strokeWidth="2" />

      {/* visor */}
      <rect x="44" y="48" width="52" height="38" rx="17" fill="url(#robotVisor)" />

      {/* eyes */}
      <ellipse cx="60" cy="67" rx="6.5" ry="9" fill="url(#robotEye)" />
      <ellipse cx="80" cy="67" rx="6.5" ry="9" fill="url(#robotEye)" />
      <circle cx="58" cy="63" r="1.8" fill="#FFFFFF" />
      <circle cx="78" cy="63" r="1.8" fill="#FFFFFF" />

      {/* body hint */}
      <rect x="52" y="98" width="36" height="16" rx="8" fill="#A78BFA" />
      <rect x="58" y="103" width="24" height="3" rx="1.5" fill="#EDE9FE" />
    </svg>
  );
}

export function RiskAgentMiniRobot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-11 w-11", className)} aria-hidden>
      <rect x="9" y="14" width="30" height="24" rx="9" fill="#EDE9FE" />
      <rect x="14" y="19" width="20" height="14" rx="7" fill="#4C1D95" />
      <circle cx="20" cy="26" r="2.6" fill="#67E8F9" />
      <circle cx="28" cy="26" r="2.6" fill="#67E8F9" />
      <path d="M24 9V14" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="7" r="2" fill="#A78BFA" />
      <rect x="5" y="22" width="5" height="10" rx="2.5" fill="#C4B5FD" />
      <rect x="38" y="22" width="5" height="10" rx="2.5" fill="#C4B5FD" />
    </svg>
  );
}

/* ─────────────────────────── Hero starfield ─────────────────────────── */

const STARS = Array.from({ length: 54 }, (_, i) => ({
  x: ((i * 73) % 100) + ((i % 5) * 1.7),
  y: ((i * 37) % 100) + ((i % 3) * 2.3),
  r: i % 7 === 0 ? 1.6 : i % 3 === 0 ? 1 : 0.6,
  o: 0.25 + ((i * 7) % 6) / 12,
}));

export function HeroStarfield({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden
    >
      {STARS.map((star, index) => (
        <circle
          key={index}
          cx={star.x % 100}
          cy={star.y % 100}
          r={star.r}
          fill="#FFFFFF"
          opacity={star.o}
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────── Dotted world map ─────────────────────────── */

// Risk markers positioned as percentages over the dotted world map image.
const RISK_DOTS: { left: number; top: number; color: string; size: number }[] = [
  { left: 19, top: 30, color: "#ef4444", size: 14 }, // North America
  { left: 16, top: 44, color: "#f97316", size: 10 }, // Mexico
  { left: 37, top: 40, color: "#3b82f6", size: 10 }, // Atlantic
  { left: 48, top: 26, color: "#ef4444", size: 14 }, // Europe
  { left: 50, top: 38, color: "#f97316", size: 10 }, // Mediterranean
  { left: 75, top: 33, color: "#ef4444", size: 12 }, // East Asia
  { left: 68, top: 46, color: "#f97316", size: 12 }, // South / SE Asia
  { left: 53, top: 56, color: "#22c55e", size: 10 }, // Central Africa
  { left: 54, top: 70, color: "#3b82f6", size: 10 }, // Southern Africa
  { left: 81, top: 58, color: "#f97316", size: 10 }, // Indonesia
  { left: 84, top: 74, color: "#22c55e", size: 10 }, // Australia
  { left: 31, top: 70, color: "#22c55e", size: 10 }, // South America
];

export function WorldRiskMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <img
        src="/risk-agent/world-map-dotted.png"
        alt="World risk heatmap"
        className="h-auto w-full select-none opacity-80"
        draggable={false}
      />
      {RISK_DOTS.map((dot, index) => (
        <span
          key={index}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
        >
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: dot.size + 12,
              height: dot.size + 12,
              backgroundColor: dot.color,
              opacity: 0.18,
            }}
          />
          <span
            className="relative block rounded-full ring-2 ring-white/80"
            style={{ width: dot.size, height: dot.size, backgroundColor: dot.color }}
          />
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────── Source donut ─────────────────────────── */

export function SourceCoverageDonut({ className }: { className?: string }) {
  const gradient = SOURCE_SEGMENTS.reduce<string[]>((acc, segment, index) => {
    const start = SOURCE_SEGMENTS.slice(0, index).reduce((sum, s) => sum + s.percent, 0);
    const end = start + segment.percent;
    acc.push(`${segment.color} ${start * 3.6}deg ${end * 3.6}deg`);
    return acc;
  }, []).join(", ");

  return (
    <div className={cn("flex flex-col items-center gap-6 sm:flex-row", className)}>
      <div className="relative grid h-36 w-36 shrink-0 place-items-center">
        <div
          className="h-full w-full rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute inset-[22%] grid place-items-center rounded-full bg-white text-center shadow-[0_2px_10px_rgba(15,23,42,0.08)]">
          <p className="text-xl font-semibold leading-none text-slate-950">1,247</p>
          <p className="mt-1 text-[11px] text-slate-500">Sources</p>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {SOURCE_SEGMENTS.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 font-medium text-slate-700">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate">{segment.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-slate-500">
              {segment.count}{" "}
              <span className="text-slate-400">({segment.percent}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── Sentiment trend ─────────────────────────── */

const SENTIMENT_POINTS = [
  [14, 78],
  [54, 64],
  [94, 70],
  [134, 52],
  [174, 60],
  [214, 46],
  [254, 40],
  [294, 50],
  [334, 30],
  [374, 20],
];

const SENTIMENT_DATES = ["May 11", "May 13", "May 15", "May 17", "May 19"];

export function SentimentTrendChart({ className }: { className?: string }) {
  const line = SENTIMENT_POINTS.map((p) => p.join(",")).join(" ");
  const area = `14,92 ${line} 374,92`;
  const spike = SENTIMENT_POINTS[8];

  return (
    <svg viewBox="0 0 390 116" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 44, 68, 92].map((y) => (
        <line key={y} x1="10" y1={y} x2="380" y2={y} stroke="#EEF2F6" strokeWidth="1" />
      ))}
      {[100, 75, 50, 25].map((label, index) => (
        <text key={label} x="2" y={24 + index * 24} fill="#94A3B8" fontSize="7">
          {label}
        </text>
      ))}
      <polygon points={area} fill="url(#sentimentFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#7C3AED"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={spike[0]} cy={spike[1]} r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
      <rect x={spike[0] - 46} y={spike[1] - 24} width="92" height="16" rx="8" fill="#FEE2E2" />
      <text
        x={spike[0]}
        y={spike[1] - 12.5}
        textAnchor="middle"
        fill="#DC2626"
        fontSize="8"
        fontWeight="600"
      >
        High Risk Spike
      </text>
      {SENTIMENT_DATES.map((date, index) => (
        <text
          key={date}
          x={20 + index * 90}
          y="112"
          fill="#94A3B8"
          fontSize="7.5"
          textAnchor="middle"
        >
          {date}
        </text>
      ))}
    </svg>
  );
}
