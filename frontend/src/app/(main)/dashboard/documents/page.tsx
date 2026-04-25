"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Database, Wrench, ExternalLink, Pencil } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFreighter } from "@/hooks/useFreighter";
import { loadSavedTemplates, type SavedTemplate } from "@/lib/my-templates-storage";

export default function MyTemplatesPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);

  useEffect(() => {
    setTemplates(loadSavedTemplates());
  }, []);

  const hasTemplates = templates.length > 0;

  const openTemplate = (id: string) => {
    router.push(`/dashboard/documents/${encodeURIComponent(id)}`);
  };

  const editTemplate = (id: string) => {
    router.push(`/dashboard/workspace?template=${encodeURIComponent(id)}`);
  };

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Connect your wallet to view this page.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">My Templates</span>
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-3xl font-bold tracking-tight">My Templates</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/onboarding")}
              >
                <Wrench className="mr-2 h-4 w-4" />
                Create template
              </Button>
            </div>
            <p className="text-muted-foreground">
              Templates saved from Compliance Maker. Open to view your dashboard, or Edit to customize.
            </p>
          </div>

          <Card className="rounded-xl border-border bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">All templates</h2>

              {!hasTemplates ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Database className="h-14 w-14 text-muted-foreground/60 mb-4" />
                  <p className="text-muted-foreground font-medium">No templates yet</p>
                  <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                    Build one in Compliance Maker (Onboarding) and save it here.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push("/dashboard/onboarding")}
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    Open Compliance Maker
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{t.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {t.bundleName}
                          {t.businessName ? ` · ${t.businessName}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openTemplate(t.id)}
                        >
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editTemplate(t.id)}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardMain>
    </>
  );
}
