"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, LayoutGrid, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-provider";
import {
  buildHubNotifications,
  summarizeWorkspaces,
} from "@/components/dashboard/workspace-hub/workspace-hub-notifications";
import type { WorkspaceStatsSource } from "./workspace-hub-notifications";
import { cn } from "@/utils";

export type HubBreadcrumb = {
  label: string;
  href?: string;
  current?: boolean;
};

function useWorkspaceHubNotifications(workspaces: WorkspaceStatsSource[]) {
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(
    () => new Set()
  );

  const summary = useMemo(() => summarizeWorkspaces(workspaces), [workspaces]);
  const hubNotifications = useMemo(() => buildHubNotifications(summary), [summary]);

  const isNotificationUnread = (id: string, defaultUnread: boolean) =>
    defaultUnread && !readNotificationIds.has(id);

  const notificationBadgeCount = useMemo(
    () =>
      hubNotifications.filter((item) => isNotificationUnread(item.id, item.defaultUnread))
        .length,
    [hubNotifications, readNotificationIds]
  );

  const markNotificationRead = useCallback((id: string) => {
    setReadNotificationIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setReadNotificationIds(new Set(hubNotifications.map((item) => item.id)));
  }, [hubNotifications]);

  return {
    hubNotifications,
    notificationBadgeCount,
    markNotificationRead,
    markAllNotificationsRead,
    isNotificationUnread,
  };
}

function WorkspaceHubHeaderActions({
  workspaces,
}: {
  workspaces: WorkspaceStatsSource[];
}) {
  const { theme, setTheme } = useDashboardTheme();
  const {
    hubNotifications,
    notificationBadgeCount,
    markNotificationRead,
    markAllNotificationsRead,
    isNotificationUnread,
  } = useWorkspaceHubNotifications(workspaces);

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-10 w-10 rounded-full border-ui-border/80 bg-white shadow-none hover:bg-neutral-50"
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? (
          <Moon className="h-[18px] w-[18px] text-neutral-700" strokeWidth={1.75} />
        ) : (
          <Sun className="h-[18px] w-[18px] text-neutral-700" strokeWidth={1.75} />
        )}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ui-border/80 bg-white shadow-none hover:bg-neutral-50"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-neutral-700" strokeWidth={1.75} />
            {notificationBadgeCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                {notificationBadgeCount > 99 ? "99+" : notificationBadgeCount}
              </span>
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-[min(100vw-2rem,380px)] overflow-hidden rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-lg"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {notificationBadgeCount > 0
                  ? `${notificationBadgeCount} unread`
                  : "You're all caught up"}
              </p>
            </div>
            {notificationBadgeCount > 0 ? (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </button>
            ) : null}
          </div>
          <div className="max-h-[min(70vh,400px)] overflow-y-auto [scrollbar-color:rgb(226_232_240)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent">
            {hubNotifications.map((item) => {
              const unread = isNotificationUnread(item.id, item.defaultUnread);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markNotificationRead(item.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50/80",
                    unread && "bg-blue-50/50"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      item.iconBg,
                      unread ? "ring-1 ring-blue-100" : "opacity-80"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", item.iconColor)} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-[13px] leading-snug",
                          unread ? "font-semibold text-slate-900" : "font-medium text-slate-600"
                        )}
                      >
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-slate-400">{item.time}</span>
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 text-xs leading-relaxed",
                        unread ? "text-slate-600" : "text-slate-400"
                      )}
                    >
                      {item.message}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mt-2 h-2 w-2 shrink-0 rounded-full",
                      unread ? "bg-blue-500" : "bg-transparent"
                    )}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function HubBreadcrumbTrail({ breadcrumbs }: { breadcrumbs: HubBreadcrumb[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-wrap gap-2 text-sm text-neutral-500">
        {breadcrumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="contents">
            {index > 0 ? (
              <BreadcrumbSeparator className="text-neutral-400 [&>svg]:hidden">
                <span className="text-neutral-400">/</span>
              </BreadcrumbSeparator>
            ) : null}
            <BreadcrumbItem className={cn(index === 0 && "gap-2")}>
              {index === 0 ? (
                <LayoutGrid
                  className="h-4 w-4 text-neutral-400"
                  strokeWidth={1.75}
                  aria-hidden
                />
              ) : null}
              {crumb.current ? (
                <BreadcrumbPage className="font-semibold text-neutral-900">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="font-normal text-neutral-500 hover:text-neutral-700"
                >
                  <Link href={crumb.href ?? "#"}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Breadcrumb row + theme / notifications (workspace feature pages). */
export function WorkspaceHubShellBar({
  breadcrumbs,
  workspaces,
}: {
  breadcrumbs: HubBreadcrumb[];
  workspaces: WorkspaceStatsSource[];
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100/90 px-8 py-3">
      <HubBreadcrumbTrail breadcrumbs={breadcrumbs} />
      <WorkspaceHubHeaderActions workspaces={workspaces} />
    </header>
  );
}

export function WorkspaceHubTopChrome({
  breadcrumbs,
  title,
  subtitle,
  workspaces,
}: {
  breadcrumbs: HubBreadcrumb[];
  title: string;
  subtitle?: string;
  workspaces: WorkspaceStatsSource[];
}) {
  return (
    <>
      <div className="shrink-0 border-b border-slate-100/90 px-8 py-3">
        <HubBreadcrumbTrail breadcrumbs={breadcrumbs} />
      </div>

      <header className="flex items-start justify-between gap-4 px-8 pb-3 pt-5">
        <div>
          <h1 className="text-[17px] font-semibold tracking-tight text-neutral-900">{title}</h1>
          {subtitle ? (
            <p className="mt-0.5 text-[12px] text-neutral-500">{subtitle}</p>
          ) : null}
        </div>
        <WorkspaceHubHeaderActions workspaces={workspaces} />
      </header>
    </>
  );
}
