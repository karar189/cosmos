"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings as SettingsIcon,
  Palette,
  Bell,
  Monitor,
  Plus,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
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

type SettingsSection = "profile" | "account" | "appearance" | "notifications" | "display";

const navItems: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: SettingsIcon },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "display", label: "Display", icon: Monitor },
];

export default function SettingsPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();
  const [section, setSection] = useState<SettingsSection>("profile");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("I own a computer.");
  const [urls, setUrls] = useState<string[]>(["https://shadcn.com", "http://twitter.com/shadcn"]);
  const [businessNature, setBusinessNature] = useState("");
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(!!publicKey);

  useEffect(() => {
    if (publicKey?.trim().length === 56 && publicKey.startsWith("G")) {
      setLoading(true);
      fetch(`/api/business/profile?walletAddress=${encodeURIComponent(publicKey.trim())}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((profile) => {
          if (profile) {
            setUsername(profile.name ?? "");
            setEmail(profile.email ?? "");
            setBusinessNature(profile.businessNature ?? "");
            setSelectedWidgets(Array.isArray(profile.selectedWidgets) ? profile.selectedWidgets : []);
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

  const handleUpdateProfile = () => {
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
        body: JSON.stringify({
          walletAddress: publicKey.trim(),
          name: data.name,
          email: data.email,
          businessNature: data.businessNature || null,
          selectedWidgets: data.selectedWidgets,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setOnboardingCompleted(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }
        })
        .catch(() => {});
      return;
    }
    setOnboardingCompleted(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addUrl = () => setUrls((prev) => [...prev, ""]);
  const setUrlAt = (i: number, v: string) =>
    setUrls((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

  const toggleWidget = (id: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Connect your wallet to view settings.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Settings</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect} disabled={isConnecting}>
            Disconnect
          </Button>
        </div>
      </DashboardHeader>

      <DashboardMain>
        <div className="flex flex-col gap-6 p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Vertical nav */}
            <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-border pb-4 lg:flex-col lg:border-b-0 lg:border-r lg:pr-6 lg:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors whitespace-nowrap",
                      section === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-6">
              {section === "profile" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Profile</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      This is how others will see you on the site.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="settings-username">Username</Label>
                      <Input
                        id="settings-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="shadcn"
                        className="max-w-md"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is your public display name. It can be your real name or a pseudonym.
                        You can only change this once every 30 days.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-email">Email</Label>
                      <Input
                        id="settings-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Select a verified email to display"
                        className="max-w-md"
                      />
                      <p className="text-xs text-muted-foreground">
                        You can manage verified email addresses in your email settings.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-bio">Bio</Label>
                      <Textarea
                        id="settings-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="I own a computer."
                        className="max-w-md min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        You can @mention other users and organizations to link to them.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>URLs</Label>
                      <p className="text-xs text-muted-foreground">
                        Add links to your website, blog, or social media profiles.
                      </p>
                      <div className="flex flex-col gap-2 max-w-md">
                        {urls.map((url, i) => (
                          <Input
                            key={i}
                            value={url}
                            onChange={(e) => setUrlAt(i, e.target.value)}
                            placeholder="https://..."
                          />
                        ))}
                        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={addUrl}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add URL
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                      {saved ? "Saved" : "Update profile"}
                    </Button>
                  </div>
                </>
              )}

              {section === "account" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Account</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Business nature and feature preferences.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Nature of your business</Label>
                      <div className="grid gap-2 sm:grid-cols-2 max-w-2xl">
                        {BUSINESS_NATURES.map(({ value, label }) => (
                          <label
                            key={value}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50",
                              businessNature === value && "border-primary bg-primary/5"
                            )}
                          >
                            <input
                              type="radio"
                              name="settings-businessNature"
                              value={value}
                              checked={businessNature === value}
                              onChange={() => setBusinessNature(value)}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Suggestions (widgets)</Label>
                      <p className="text-xs text-muted-foreground">
                        Select the features you want to use.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
                        {WIDGETS.map((w) => {
                          const Icon = w.icon;
                          const checked = selectedWidgets.includes(w.id);
                          return (
                            <label
                              key={w.id}
                              className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                                checked && "border-primary bg-primary/5"
                              )}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleWidget(w.id)}
                              />
                              <div className="flex flex-1 items-start gap-3">
                                <div className="rounded-md bg-muted p-2">
                                  <Icon className="size-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{w.label}</p>
                                  <p className="text-xs text-muted-foreground">{w.description}</p>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                      {saved ? "Saved" : "Save changes"}
                    </Button>
                  </div>
                </>
              )}

              {section === "appearance" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Appearance</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customize how the dashboard looks on your device.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label>Theme</Label>
                    <ThemeSwitch />
                    <span className="text-sm text-muted-foreground">Switch between light and dark.</span>
                  </div>
                </>
              )}

              {section === "notifications" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure how you receive notifications.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Notification preferences can be added here (email, push, etc.).
                  </p>
                </>
              )}

              {section === "display" && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">Display</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Turn items on or off to control what’s displayed in the dashboard.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Display options and layout preferences.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </DashboardMain>
    </>
  );
}
