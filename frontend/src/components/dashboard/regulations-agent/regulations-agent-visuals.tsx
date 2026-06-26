"use client";

import { Globe2 } from "lucide-react";
import { cn } from "@/utils";
import type { FlagCode } from "./regulations-agent-data";

const FLAG_SRC: Partial<Record<FlagCode, string>> = {
  eu: "/regulations-agent/flags/eu.png",
  us: "/regulations-agent/flags/us.png",
  gb: "/regulations-agent/flags/gb.png",
  sg: "/regulations-agent/flags/sg.png",
  in: "/regulations-agent/flags/in.png",
};

export function CountryFlag({
  code,
  size = "md",
  className,
}: {
  code: FlagCode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  if (code === "global") {
    return (
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-slate-100 ring-1 ring-slate-200",
          sizeClass,
          className
        )}
      >
        <Globe2
          className={cn(
            "text-slate-500",
            size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
          )}
        />
      </span>
    );
  }

  const src = FLAG_SRC[code];
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      className={cn("shrink-0 rounded-full object-cover ring-1 ring-slate-200", sizeClass, className)}
      draggable={false}
    />
  );
}

export function RegulatoryScoreRing({ score = 87, max = 100 }: { score?: number; max?: number }) {
  const pct = Math.round((score / max) * 100);

  return (
    <div className="mt-5 flex items-center gap-5">
      <div
        className="grid h-20 w-20 shrink-0 place-items-center rounded-full p-1.5"
        style={{
          background: `conic-gradient(#2563eb 0 ${pct * 3.6}deg, #dbeafe ${pct * 3.6}deg 360deg)`,
        }}
      >
        <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
          <p className="text-xl font-semibold leading-none text-slate-950">{score}</p>
          <p className="text-[10px] text-slate-400">/{max}</p>
        </div>
      </div>
      <div>
        <p className="font-semibold text-emerald-600">Strong</p>
        <p className="mt-2 text-sm font-medium text-emerald-600">+ 8 pts vs last month</p>
      </div>
    </div>
  );
}
