"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Save, FileCheck } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useFreighter } from "@/hooks/useFreighter";
import { cn } from "@/utils";

type ChecklistItem = { id: string; text: string; done?: boolean };

export default function ComplianceCheckerPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();
  const [profile, setProfile] = useState<{ name?: string; email?: string; businessNature?: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey || publicKey.length !== 56 || !publicKey.startsWith("G")) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    fetch(`/api/business/profile?walletAddress=${encodeURIComponent(publicKey.trim())}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setProfile({ name: data.name, email: data.email, businessNature: data.businessNature });
      })
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, [publicKey]);

  const handleGenerate = () => {
    if (!publicKey) return;
    setError(null);
    setGenerating(true);
    fetch("/api/compliance/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: publicKey.trim() }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => { throw new Error(e.error || "Failed to generate"); });
        return res.json();
      })
      .then((data) => setItems((data.items ?? []).map((i: { id: string; text: string }) => ({ ...i, done: false }))))
      .catch((e) => setError(e.message || "Failed to generate checklist"))
      .finally(() => setGenerating(false));
  };

  const handleSave = () => {
    if (!publicKey || items.length === 0) return;
    setError(null);
    setSaving(true);
    fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress: publicKey.trim(),
        title: "Regulatory & compliance checklist",
        items: items.map((i) => ({ id: i.id, text: i.text, done: i.done ?? false })),
      }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => { throw new Error(e.error || "Failed to save"); });
        return res.json();
      })
      .then(() => router.push("/dashboard/document-vault"))
      .catch((e) => setError(e.message || "Failed to save to Document vault"))
      .finally(() => setSaving(false));
  };

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Connect your wallet to use the Compliance checker.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Compliance checker</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect} disabled={isConnecting}>
            Disconnect
          </Button>
        </div>
      </DashboardHeader>
      <DashboardMain>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-8 w-8" />
              Compliance checker
            </h1>
            <p className="text-muted-foreground mt-1">
              Review your business profile and generate a regulatory and compliance checklist to operate in a fully compliant manner.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your saved business profile</CardTitle>
              <CardDescription>
                We use this information to tailor the compliance checklist to your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileLoading ? (
                <p className="text-muted-foreground text-sm">Loading profile…</p>
              ) : (
                <dl className="grid gap-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Business name</dt>
                    <dd className="font-medium">{profile?.name || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="font-medium">{profile?.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Nature of business</dt>
                    <dd className="font-medium">{profile?.businessNature || "—"}</dd>
                  </div>
                </dl>
              )}
              <Button
                onClick={handleGenerate}
                disabled={profileLoading || generating}
                className="mt-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating checklist…
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Generate regulatory & compliance checklist
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated checklist</CardTitle>
                <CardDescription>
                  Review the items below. You can tick completed items, then save this list to your Document vault as a todo list.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.done ?? false}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={item.id}
                        className={cn(
                          "text-sm flex-1 cursor-pointer",
                          item.done && "text-muted-foreground line-through"
                        )}
                      >
                        {item.text}
                      </label>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleSave} disabled={saving} className="mt-2">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save to Document vault
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardMain>
    </>
  );
}

