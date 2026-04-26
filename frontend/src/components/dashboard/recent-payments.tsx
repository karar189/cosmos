"use client";

import { useState, useEffect } from "react";
import { getExplorerTxUrl } from "@/lib/stellar-explorer";
import { ArrowUpRight } from "lucide-react";
import { fallbackEvents } from "@/data/fallback";

export interface PaymentEvent {
  linkId: string;
  businessId: string;
  amount: string;
  workflowStage?: string;
  paidAt: string;
  commitmentId?: string;
}

interface RecentPaymentsProps {
  businessId: string | null;
  /** When true, show NA / empty state instead of activity (onboarding not completed). */
  onboardingIncomplete?: boolean;
}

export function RecentPayments({ businessId, onboardingIncomplete }: RecentPaymentsProps) {
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (onboardingIncomplete) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setEvents(fallbackEvents.slice(0, 8));
    setLoading(false);
  }, [businessId, onboardingIncomplete]);

  if (onboardingIncomplete) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-8 text-center">
        <p className="text-sm font-medium text-white/50">Activity: NA</p>
        <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/35">
          Recent payments will appear here after you finish onboarding.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-px">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-white/[0.06] animate-pulse shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3 w-28 rounded bg-white/[0.06] animate-pulse" />
                <div className="h-2.5 w-20 rounded bg-white/[0.04] animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-14 rounded bg-white/[0.06] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-white/30 py-2">
        No payments yet. They&apos;ll appear here when clients pay a link.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-px">
      <p className="text-xs text-white/30 mb-3">
        {events.length} payment{events.length !== 1 ? "s" : ""} received
      </p>
      <div className="divide-y divide-white/[0.04] max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
        {events.map((ev, i) => (
          <div key={ev.linkId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            {/* Left: index + info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-medium text-white/35">
                {i + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-none truncate">Payment received</p>
                <p className="text-xs text-white/30 mt-1 flex items-center gap-1.5 flex-wrap">
                  {ev.workflowStage && <span>{ev.workflowStage} ·</span>}
                  <span>
                    {new Date(ev.paidAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                  {ev.commitmentId && (
                    <>
                      <span>·</span>
                      <a
                        href={getExplorerTxUrl(ev.commitmentId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-cyan-400/80 transition-colors hover:text-cyan-300"
                      >
                        proof <ArrowUpRight className="h-2.5 w-2.5" />
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right: amount */}
            <span className="ml-4 shrink-0 text-sm font-semibold text-cyan-300/90">
              +{ev.amount} XLM
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
