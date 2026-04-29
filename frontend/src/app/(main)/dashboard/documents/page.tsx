"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FileText,
  Database,
  Wrench,
  ExternalLink,
  Pencil,
  Loader2,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { DashboardPageHeader } from "@/components/dashboard/layout/dashboard-page-header";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFreighter } from "@/hooks/useFreighter";
import { loadSavedTemplates, type SavedTemplate } from "@/lib/my-templates-storage";
import { useOnboardingUi } from "@/components/onboarding";
import { cn } from "@/utils";

function formatSavedAt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function MyTemplatesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { publicKey, disconnect, isConnecting } = useFreighter();
  const { isOnboardingComplete, openOnboardingQuiz } = useOnboardingUi();
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [, startTransition] = useTransition();
  /** Tracks which row action is navigating: `open:id` | `edit:id` */
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSavedTemplates(publicKey)
      .then((list) => {
        if (!cancelled) setTemplates(list);
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/dashboard/workspace")) {
      setPendingNav(null);
      return;
    }
    if (/^\/dashboard\/documents\/.+/.test(pathname)) {
      setPendingNav(null);
    }
  }, [pathname]);

  const hasTemplates = templates.length > 0;

  const runNav = useCallback(
    (key: string, href: string) => {
      setPendingNav(key);
      startTransition(() => {
        router.push(href);
      });
    },
    [router]
  );

  const openTemplate = (id: string) => {
    runNav(`open:${id}`, `/dashboard/documents/${encodeURIComponent(id)}`);
  };

  const editTemplate = (id: string) => {
    runNav(
      `edit:${id}`,
      `/dashboard/workspace?template=${encodeURIComponent(id)}`
    );
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
        <div className="flex flex-col gap-8">
          <DashboardPageHeader
            eyebrow="Documents"
            title="My templates"
            description="Saved from Compliance Maker. Open a read-only dashboard preview, or edit layouts in the workspace."
            end={
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!!pendingNav}
                className="rounded-full border-white/15 bg-white/[0.06] text-foreground hover:bg-white/10"
                onClick={() => {
                  if (!isOnboardingComplete) {
                    openOnboardingQuiz();
                    return;
                  }
                  startTransition(() => {
                    router.push("/dashboard/workspace");
                  });
                }}
              >
                <Wrench className="mr-2 h-4 w-4" />
                Create template
              </Button>
            }
          />

          <section className="rounded-2xl border border-white/[0.12] bg-transparent p-1 backdrop-blur-xl">
            <div className="rounded-xl border border-white/[0.06] bg-black/20 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">All templates</h2>
                  <p className="text-xs text-muted-foreground">
                    {hasTemplates ? `${templates.length} saved` : "Nothing saved yet"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {!hasTemplates ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-16 text-center">
                  <Database className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="font-medium text-foreground">No templates yet</p>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Run the onboarding quiz and save a bundle — it will show up here.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6 rounded-full border-white/20"
                    onClick={() => {
                      if (!isOnboardingComplete) {
                        openOnboardingQuiz();
                        return;
                      }
                      startTransition(() => {
                        router.push("/dashboard/workspace");
                      });
                    }}
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    Open Compliance Maker
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {templates.map((t) => {
                    const savedLabel = formatSavedAt(t.savedAt);
                    const isOpenPending = pendingNav === `open:${t.id}`;
                    const isEditPending = pendingNav === `edit:${t.id}`;
                    const workspaceHref = `/dashboard/workspace?template=${encodeURIComponent(t.id)}`;

                    return (
                      <li key={t.id}>
                        <div
                          className={cn(
                            "flex flex-col gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5",
                            "hover:border-amber-400/25 hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-medium text-foreground">{t.name}</p>
                                <Badge
                                  variant="secondary"
                                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                                >
                                  {t.bundleName}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {savedLabel ? `Saved ${savedLabel}` : "Saved template"}
                                {t.businessName ? ` · ${t.businessName}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={!!pendingNav}
                              className="rounded-full border-white/15 bg-white/[0.06] text-white hover:border-white/25 hover:bg-white/[0.14] hover:text-white"
                              onClick={() => openTemplate(t.id)}
                              onMouseEnter={() => router.prefetch(`/dashboard/documents/${encodeURIComponent(t.id)}`)}
                            >
                              {isOpenPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                              ) : (
                                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                              )}
                              {isOpenPending ? "Opening…" : "Open"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={!!pendingNav}
                              className="rounded-full border-white/15 bg-transparent text-white/90 hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
                              onClick={() => editTemplate(t.id)}
                              onMouseEnter={() => router.prefetch(workspaceHref)}
                            >
                              {isEditPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                              ) : (
                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                              )}
                              {isEditPending ? "Loading…" : "Edit"}
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      </DashboardMain>
    </>
  );
}
