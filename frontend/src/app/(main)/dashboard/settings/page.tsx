"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings as SettingsIcon,
  Layers3,
  Plus,
  CheckCheck,
  Sun,
  Moon,
  Palette,
} from "lucide-react";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFreighter } from "@/hooks/useFreighter";
import { cn } from "@/utils";
import {
  getOnboardingData,
  setOnboardingCompleted,
  BUSINESS_NATURES,
  WIDGETS,
  type OnboardingData,
} from "@/components/onboarding/onboarding-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { hydrateWorkspaceTierFromProfile } from "@/lib/workspace-tier-context";
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";
import type { DashboardTheme } from "@/lib/dashboard-theme";

type SettingsSection =
  | "profile"
  | "account"
  | "appearance"
  | "plan";

const PLAN_OPTIONS = [
  { id: "tier-1", name: "Tier 1", description: "Payments foundation, employee management, and compliance analysis." },
  { id: "tier-2", name: "Tier 2", description: "Tier 1 plus opt-in privacy, compliance execution, and RNS." },
  { id: "tier-3", name: "Tier 3", description: "Tier 2 plus escrow-based project management." },
] as const;

const navItems: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "account",       label: "Account",        icon: SettingsIcon },
  { id: "appearance",    label: "Appearance",     icon: Palette },
  { id: "plan",          label: "Plan",           icon: Layers3 },
];

const inputCls =
  "h-9 border border-white/[0.1] bg-white/[0.04] text-foreground placeholder:text-muted-foreground focus:border-white/25 focus:ring-0";

export default function SettingsPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();
  const { theme, setTheme } = useDashboardTheme();
  const [section, setSection] = useState<SettingsSection>("profile");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [businessNature, setBusinessNature] = useState("");
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>("tier-2");
  const [selectedTierName, setSelectedTierName] = useState<string>("Tier 2");
  const [saved, setSaved] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [loading, setLoading] = useState(!!publicKey);

  useEffect(() => {
    if (publicKey?.trim().length === 56 && publicKey.startsWith("G")) {
      setLoading(true);
      fetch("/api/business/profile", { credentials: "same-origin" })
        .then((res) => (res.ok ? res.json() : null))
        .then((profile) => {
          if (profile) {
            setUsername(profile.name ?? "");
            setEmail(profile.email ?? "");
            setBusinessNature(profile.businessNature ?? "");
            setSelectedWidgets(Array.isArray(profile.selectedWidgets) ? profile.selectedWidgets : []);
            const tierFromProfile =
              typeof profile.selectedTier === "string" && profile.selectedTier.trim().length > 0
                ? profile.selectedTier.trim()
                : "tier-2";
            const tierNameFromProfile =
              typeof profile.selectedTierName === "string" && profile.selectedTierName.trim().length > 0
                ? profile.selectedTierName.trim()
                : PLAN_OPTIONS.find((p) => p.id === tierFromProfile)?.name ?? "Tier 2";
            setSelectedTier(tierFromProfile);
            setSelectedTierName(tierNameFromProfile);
            const activeTpl =
              profile?.activeTemplate &&
              typeof profile.activeTemplate === "object" &&
              typeof profile.activeTemplate.id === "string"
                ? profile.activeTemplate
                : null;
            hydrateWorkspaceTierFromProfile({
              selectedTier: tierFromProfile,
              selectedTierName: tierNameFromProfile,
              businessName: profile.name ?? "",
              activeTemplateId:
                typeof profile.activeTemplateId === "string" ? profile.activeTemplateId : null,
              activeTemplate: activeTpl
                ? {
                    id: activeTpl.id,
                    name: typeof activeTpl.name === "string" ? activeTpl.name : "",
                    bundleId: typeof activeTpl.bundleId === "string" ? activeTpl.bundleId : "",
                    bundleName:
                      activeTpl.bundleName === null || typeof activeTpl.bundleName === "string"
                        ? activeTpl.bundleName
                        : null,
                    businessName:
                      activeTpl.businessName === null || typeof activeTpl.businessName === "string"
                        ? activeTpl.businessName
                        : null,
                  }
                : null,
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }
    const stored = getOnboardingData();
    if (stored) {
      setUsername(stored.name ?? "");
      setEmail(stored.email ?? "");
      setBusinessNature(stored.businessNature ?? "");
      setSelectedWidgets(Array.isArray(stored.selectedWidgets) ? stored.selectedWidgets : []);
    }
  }, [publicKey]);

  function handleUpdateProfile() {
    const data: OnboardingData = {
      name: username.trim(),
      email: email.trim(),
      businessNature: businessNature || "",
      selectedWidgets,
    };
    if (publicKey?.trim().length === 56 && publicKey.startsWith("G")) {
      fetch("/api/business/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          businessNature: data.businessNature || null,
          selectedWidgets: data.selectedWidgets,
        }),
      }).then((res) => {
        if (res.ok) {
          setOnboardingCompleted(data);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("profile-updated"));
        }
      }).catch(() => {});
      return;
    }
    setOnboardingCompleted(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const addUrl = () => setUrls((p) => [...p, ""]);
  const setUrlAt = (i: number, v: string) =>
    setUrls((p) => { const n = [...p]; n[i] = v; return n; });
  const toggleWidget = (id: string) =>
    setSelectedWidgets((p) => p.includes(id) ? p.filter((w) => w !== id) : [...p, id]);
  const handleTierChange = (tierId: string) => {
    const next = PLAN_OPTIONS.find((p) => p.id === tierId);
    if (!next) return;
    setSelectedTier(next.id);
    setSelectedTierName(next.name);
  };

  const handleUpdatePlan = async () => {
    if (!(publicKey?.trim().length === 56 && publicKey.startsWith("G"))) return;
    setSavingPlan(true);
    try {
      const res = await fetch("/api/business/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          selectedTier,
          selectedTierName,
        }),
      });
      if (!res.ok) return;
      const updated = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      const activeTpl =
        updated?.activeTemplate &&
        typeof updated.activeTemplate === "object" &&
        typeof (updated.activeTemplate as { id?: string }).id === "string"
          ? (updated.activeTemplate as {
              id: string;
              name?: string;
              bundleId?: string;
              bundleName?: string | null;
              businessName?: string | null;
            })
          : null;
      hydrateWorkspaceTierFromProfile({
        selectedTier,
        selectedTierName,
        businessName: username.trim(),
        activeTemplateId:
          typeof updated?.activeTemplateId === "string" ? updated.activeTemplateId : null,
        activeTemplate: activeTpl
          ? {
              id: activeTpl.id,
              name: typeof activeTpl.name === "string" ? activeTpl.name : "",
              bundleId: typeof activeTpl.bundleId === "string" ? activeTpl.bundleId : "",
              bundleName:
                activeTpl.bundleName === null || typeof activeTpl.bundleName === "string"
                  ? activeTpl.bundleName
                  : null,
              businessName:
                activeTpl.businessName === null || typeof activeTpl.businessName === "string"
                  ? activeTpl.businessName
                  : null,
            }
          : null,
      });
      setPlanSaved(true);
      setTimeout(() => setPlanSaved(false), 2500);
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("profile-updated"));
    } finally {
      setSavingPlan(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-white/40 text-center text-sm">Connect your wallet to view settings.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  const SaveButton = ({ label = "Save changes" }: { label?: string }) => (
    <Button
      onClick={handleUpdateProfile}
      disabled={loading}
      className={cn(
        "min-w-[130px] rounded-full font-semibold transition-all",
        saved
          ? "border-0 bg-emerald-600 text-white hover:bg-emerald-600"
          : "border border-white/10 bg-foreground text-background hover:opacity-90"
      )}
    >
      {saved ? <><CheckCheck className="h-4 w-4 mr-1.5" /> Saved</> : label}
    </Button>
  );

  return (
    <DashboardMain>
      <div className="flex flex-col gap-6">
        <DashboardPageHeader
          eyebrow="Workspace"
          title="Settings"
          description="Manage your account, appearance, and notifications."
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">

          {/* ── Side nav ── */}
          <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:flex-col lg:w-44">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors whitespace-nowrap",
                  section === id
                    ? "border border-white/12 bg-white/[0.08] font-medium text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* ── Content ── */}
          <div className="min-w-0 flex-1">

            {/* Profile */}
            {section === "profile" && (
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col gap-5">
                <div>
                  <p className="text-sm font-medium text-white">Profile</p>
                  <p className="text-xs text-white/35 mt-0.5">This is how others will see you on the platform.</p>
                </div>

                <div className="flex flex-col gap-4 max-w-lg">
                  <div className="space-y-1.5">
                    <Label htmlFor="settings-username" className="text-xs text-white/50">Display name</Label>
                    <Input id="settings-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" className={inputCls} />
                    <p className="text-[11px] text-white/25">Can be your real name or a pseudonym.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="settings-email" className="text-xs text-white/50">Email</Label>
                    <Input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="settings-bio" className="text-xs text-white/50">Bio</Label>
                    <Textarea
                      id="settings-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a little about yourself…"
                      className="min-h-[80px] resize-none border border-white/[0.1] bg-white/[0.04] text-foreground placeholder:text-muted-foreground focus:border-white/25 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/50">URLs</Label>
                    <div className="flex flex-col gap-2">
                      {urls.map((url, i) => (
                        <Input key={i} value={url} onChange={(e) => setUrlAt(i, e.target.value)} placeholder="https://…" className={inputCls} />
                      ))}
                      <button type="button" onClick={addUrl} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors w-fit">
                        <Plus className="h-3.5 w-3.5" /> Add URL
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <SaveButton label="Update profile" />
                  </div>
                </div>
              </div>
            )}

            {/* Account */}
            {section === "account" && (
              <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">Account</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Business nature and feature preferences.</p>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs text-white/50">Nature of your business</Label>
                    <div className="grid gap-2 sm:grid-cols-2 max-w-2xl">
                      {BUSINESS_NATURES.map(({ value, label }) => (
                        <label
                          key={value}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                            businessNature === value
                              ? "border-white/20 bg-white/[0.08] text-foreground"
                              : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:border-white/[0.14] hover:text-foreground"
                          )}
                        >
                          <input type="radio" name="businessNature" value={value} checked={businessNature === value} onChange={() => setBusinessNature(value)} className="sr-only" />
                          <span className="font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-white/50">Feature widgets</Label>
                    <p className="text-[11px] text-white/25">Select the features you want enabled in the sidebar.</p>
                    <div className="grid gap-2.5 sm:grid-cols-2 max-w-2xl">
                      {WIDGETS.map((w) => {
                        const Icon = w.icon;
                        const checked = selectedWidgets.includes(w.id);
                        return (
                          <label
                            key={w.id}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                              checked
                                ? "border-white/18 bg-white/[0.07] text-foreground"
                                : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:border-white/[0.14]"
                            )}
                          >
                            <Checkbox checked={checked} onCheckedChange={() => toggleWidget(w.id)} className="mt-0.5 border-white/20" />
                            <div className="flex flex-1 items-start gap-2.5 min-w-0">
                              <div className="rounded-md bg-white/[0.06] p-1.5 shrink-0">
                                <Icon className="size-3.5 text-white/50" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white/80 truncate">{w.label}</p>
                                <p className="text-[11px] text-white/30 leading-relaxed">{w.description}</p>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <SaveButton />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {section === "appearance" && (
              <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">Appearance</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Choose how your dashboard looks. Light mode uses a soft mesh gradient inspired by the BDO palette.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
                  {(
                    [
                      {
                        id: "dark" as DashboardTheme,
                        label: "Dark",
                        description: "True black with blue and amber ambience.",
                        icon: Moon,
                        preview: "bg-black",
                      },
                      {
                        id: "light" as DashboardTheme,
                        label: "Light",
                        description: "Lavender, sky blue, and warm amber mesh gradient.",
                        icon: Sun,
                        preview:
                          "bg-[radial-gradient(circle_at_0%_0%,#b197fc_0%,transparent_50%),radial-gradient(circle_at_100%_0%,#ffb347_0%,transparent_50%),radial-gradient(circle_at_0%_100%,#74a0ff_0%,transparent_50%),radial-gradient(circle_at_100%_100%,#f5c6d0_0%,transparent_50%),#f5f0ff]",
                      },
                    ] as const
                  ).map(({ id, label, description, icon: Icon, preview }) => {
                    const selected = theme === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTheme(id)}
                        className={cn(
                          "group flex flex-col gap-3 rounded-xl border p-4 text-left transition-all",
                          selected
                            ? "border-white/20 bg-white/[0.08] ring-1 ring-white/10"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                        )}
                      >
                        <div
                          className={cn(
                            "h-20 w-full rounded-lg border border-white/10 shadow-inner",
                            preview
                          )}
                        />
                        <div className="flex items-start gap-3">
                          <div className="rounded-md bg-white/[0.06] p-2">
                            <Icon className="size-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{label}</p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                              {description}
                            </p>
                          </div>
                          {selected ? (
                            <CheckCheck className="ml-auto size-4 shrink-0 text-emerald-400" />
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Plan */}
            {section === "plan" && (
              <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.12] bg-transparent p-6 backdrop-blur-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">Plan</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Select your active workspace tier. This is saved to your business profile.
                  </p>
                </div>

                <div className="max-w-2xl space-y-3">
                  <Label className="text-xs text-white/50">Workspace tier</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {PLAN_OPTIONS.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handleTierChange(plan.id)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left transition-colors",
                          selectedTier === plan.id
                            ? "border-white/20 bg-white/[0.08]"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14]"
                        )}
                      >
                        <p className="text-sm font-medium text-foreground">{plan.name}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {plan.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Button
                    onClick={handleUpdatePlan}
                    disabled={loading || savingPlan}
                    className={cn(
                      "min-w-[130px] rounded-full font-semibold transition-all",
                      planSaved
                        ? "border-0 bg-emerald-600 text-white hover:bg-emerald-600"
                        : "border border-white/10 bg-foreground text-background hover:opacity-90"
                    )}
                  >
                    {planSaved ? (
                      <>
                        <CheckCheck className="mr-1.5 h-4 w-4" />
                        Saved
                      </>
                    ) : savingPlan ? "Saving..." : "Save plan"}
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardMain>
  );
}
