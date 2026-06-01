"use client";

import { useEffect, useState } from "react";
import {
  CheckCheck,
  CreditCard,
  Download,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import {
  WorkspacePageShell,
  workspaceHubBreadcrumbs,
} from "@/components/dashboard/workspace-hub/workspace-page-shell";
import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import {
  getWorkspaceTierState,
  hydrateWorkspaceTierFromProfile,
} from "@/lib/workspace-tier-context";
import { cn } from "@/utils";

type PlanOption = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
};

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "tier-1",
    name: "Tier 1",
    price: "$0",
    cadence: "/mo",
    description: "Payments foundation, employee management, and compliance analysis.",
    features: ["Payments & payment links", "Employee management", "Compliance analysis"],
  },
  {
    id: "tier-2",
    name: "Tier 2",
    price: "$49",
    cadence: "/mo",
    description: "Tier 1 plus opt-in privacy, compliance execution, and RNS.",
    features: ["Everything in Tier 1", "Opt-in privacy", "Compliance execution", "RNS"],
  },
  {
    id: "tier-3",
    name: "Tier 3",
    price: "$149",
    cadence: "/mo",
    description: "Tier 2 plus escrow-based project management.",
    features: ["Everything in Tier 2", "Escrow-based project management", "Priority support"],
  },
];

const INVOICES = [
  { id: "INV-2026-005", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
];

export default function BillingPage() {
  const { publicKey } = useFreighter();
  const [selectedTier, setSelectedTier] = useState("tier-2");
  const [selectedTierName, setSelectedTierName] = useState("Tier 2");
  const [activeTier, setActiveTier] = useState("tier-2");
  const [loading, setLoading] = useState(!!publicKey);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (publicKey?.trim().length === 56 && publicKey.startsWith("G")) {
      setLoading(true);
      fetch("/api/business/profile", { credentials: "same-origin" })
        .then((res) => (res.ok ? res.json() : null))
        .then((profile) => {
          if (profile) {
            const tier =
              typeof profile.selectedTier === "string" && profile.selectedTier.trim()
                ? profile.selectedTier.trim()
                : "tier-2";
            const tierName =
              typeof profile.selectedTierName === "string" && profile.selectedTierName.trim()
                ? profile.selectedTierName.trim()
                : PLAN_OPTIONS.find((p) => p.id === tier)?.name ?? "Tier 2";
            setSelectedTier(tier);
            setSelectedTierName(tierName);
            setActiveTier(tier);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [publicKey]);

  const handleSelectTier = (tierId: string) => {
    const next = PLAN_OPTIONS.find((p) => p.id === tierId);
    if (!next) return;
    setSelectedTier(next.id);
    setSelectedTierName(next.name);
  };

  const handleUpdatePlan = async () => {
    if (!(publicKey?.trim().length === 56 && publicKey.startsWith("G"))) return;
    setSaving(true);
    try {
      const res = await fetch("/api/business/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ selectedTier, selectedTierName }),
      });
      if (!res.ok) return;
      hydrateWorkspaceTierFromProfile({
        selectedTier,
        selectedTierName,
        businessName: getWorkspaceTierState()?.businessName ?? "",
        activeTemplateId: null,
        activeTemplate: null,
      });
      setActiveTier(selectedTier);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("profile-updated"));
    } finally {
      setSaving(false);
    }
  };

  const currentPlan = PLAN_OPTIONS.find((p) => p.id === activeTier) ?? PLAN_OPTIONS[1]!;

  return (
    <WorkspacePageShell
      breadcrumbs={workspaceHubBreadcrumbs("Billing & Plans")}
      connectMessage="Connect your wallet to view billing."
    >
      <div className="flex flex-col gap-6">
        <DashboardPageHeader
          variant="hub"
          eyebrow="Workspace"
          title="Billing & Plans"
          description="Manage your subscription, payment method, and invoices."
        />

        {/* Current plan */}
        <div className="rounded-xl border border-ui-border/80 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Current plan</p>
                <p className="mt-0.5 text-lg font-semibold text-neutral-900">{currentPlan.name}</p>
                <p className="mt-0.5 text-sm text-neutral-500">{currentPlan.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums text-neutral-900">
                {currentPlan.price}
                <span className="text-sm font-medium text-neutral-400">{currentPlan.cadence}</span>
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">Renews Jun 1, 2026</p>
            </div>
          </div>
        </div>

        {/* Plan options */}
        <div className="rounded-xl border border-ui-border/80 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-medium text-neutral-900">Available plans</p>
            <p className="mt-0.5 text-xs text-neutral-500">Choose the tier that fits your workspace.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {PLAN_OPTIONS.map((plan) => {
              const selected = selectedTier === plan.id;
              const isActive = activeTier === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectTier(plan.id)}
                  className={cn(
                    "relative flex flex-col rounded-xl border p-4 text-left transition-colors",
                    selected
                      ? "border-blue-500/60 bg-blue-50/50 ring-1 ring-blue-500/30"
                      : "border-ui-border/80 bg-white hover:border-blue-300"
                  )}
                >
                  {isActive ? (
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Current
                    </span>
                  ) : null}
                  <p className="text-sm font-semibold text-neutral-900">{plan.name}</p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-neutral-900">
                    {plan.price}
                    <span className="text-xs font-medium text-neutral-400">{plan.cadence}</span>
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-neutral-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" strokeWidth={2.5} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button
              onClick={handleUpdatePlan}
              disabled={loading || saving || selectedTier === activeTier}
              className={cn(
                "min-w-[140px] rounded-full font-semibold transition-all",
                saved
                  ? "border-0 bg-emerald-600 text-white hover:bg-emerald-600"
                  : "border border-ui-border/80 bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {saved ? (
                <><CheckCheck className="mr-1.5 h-4 w-4" /> Saved</>
              ) : saving ? (
                <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving…</>
              ) : (
                "Update plan"
              )}
            </Button>
            {selectedTier !== activeTier ? (
              <p className="text-xs text-neutral-500">
                Switching to <span className="font-medium text-neutral-700">{selectedTierName}</span>
              </p>
            ) : null}
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-xl border border-ui-border/80 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-ui-border/80 bg-neutral-50 text-neutral-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Visa ending in 4242</p>
                <p className="text-xs text-neutral-500">Expires 08 / 2028</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-ui-border/80 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Update payment method
            </Button>
          </div>
        </div>

        {/* Billing history */}
        <div className="rounded-xl border border-ui-border/80 bg-white shadow-sm">
          <div className="border-b border-ui-border/80 px-5 py-4">
            <p className="text-sm font-medium text-neutral-900">Billing history</p>
            <p className="mt-0.5 text-xs text-neutral-500">Download invoices for your records.</p>
          </div>
          <div className="divide-y divide-ui-border/70">
            {INVOICES.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900">{invoice.id}</p>
                  <p className="text-xs text-neutral-500">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {invoice.status}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-neutral-900">{invoice.amount}</span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                    aria-label={`Download ${invoice.id}`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WorkspacePageShell>
  );
}
