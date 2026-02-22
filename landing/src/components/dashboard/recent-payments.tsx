"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
}

export function RecentPayments({ businessId }: RecentPaymentsProps) {
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/events?businessId=${encodeURIComponent(businessId)}`)
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => {
        const all = data.events ?? [];
        const paidOnly = all.filter((e: PaymentEvent) => e.paidAt).slice(0, 10);
        if (!cancelled) setEvents(paidOnly);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No payments yet. When clients pay a link, they appear here — amount and workflow only; we never show who paid.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((ev, i) => (
        <div key={ev.linkId} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="rounded-lg bg-muted text-xs">
              {String(i + 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Paid ✔</p>
              <p className="text-sm text-muted-foreground">
                {ev.workflowStage ? `${ev.workflowStage} · ` : ""}
                {new Date(ev.paidAt).toLocaleDateString()}
              </p>
            </div>
            <span className="font-medium text-primary">+{ev.amount} XLM</span>
          </div>
        </div>
      ))}
    </div>
  );
}
