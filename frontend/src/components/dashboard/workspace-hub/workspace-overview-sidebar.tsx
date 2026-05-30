"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  LifeBuoy,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  buildWorkspaceNavGroup,
  buildWorkspaceQuickActionsGroup,
} from "@/components/dashboard/layout/data/sidebar-data";
import type { NavCollapsible, NavItem, NavLink } from "@/components/dashboard/layout/types";
import { WorkspaceHubUserMenu } from "@/components/dashboard/workspace-hub/workspace-hub-user-menu";
import {
  getWorkspaceTierState,
  syncWorkspaceTierFromLatestTemplate,
  WORKSPACE_TIER_UPDATED_EVENT,
} from "@/lib/workspace-tier-context";
import { cn } from "@/utils";

type WorkspaceOverviewSidebarProps = {
  userName: string;
  userEmail: string;
  workspaceName?: string;
  onSignOut: () => void | Promise<void>;
};

function isPathActive(pathname: string, url: string) {
  const base = pathname.split("?")[0] ?? "";
  if (base === url) return true;
  if (url === "/dashboard/overview" && base.startsWith("/dashboard/overview")) return true;
  if (url === "/dashboard/documents" && base.startsWith("/dashboard/documents")) return true;
  return base.startsWith(`${url}/`);
}

function NavItemBadge({ children }: { children: string }) {
  return (
    <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold leading-none text-white">
      {children}
    </span>
  );
}

function HubNavLink({ item, pathname }: { item: NavLink; pathname: string }) {
  const active = isPathActive(pathname, item.url);
  const Icon = item.icon;
  return (
    <Link
      href={item.url}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
        active
          ? "bg-neutral-100 text-neutral-900 shadow-sm"
          : "text-neutral-500 hover:bg-neutral-100/60 hover:text-neutral-900"
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0",
            active ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-900"
          )}
          strokeWidth={1.75}
        />
      ) : null}
      <span className="flex-1 truncate">{item.title}</span>
      {item.badge ? <NavItemBadge>{item.badge}</NavItemBadge> : null}
    </Link>
  );
}

function HubNavCollapsible({ item, pathname }: { item: NavCollapsible; pathname: string }) {
  const Icon = item.icon;
  const childActive = item.items.some((sub) => isPathActive(pathname, sub.url));
  const [open, setOpen] = useState(childActive);

  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        type="button"
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
          childActive
            ? "bg-neutral-100/80 text-neutral-900"
            : "text-neutral-500 hover:bg-neutral-100/60 hover:text-neutral-900"
        )}
      >
        {Icon ? (
          <Icon
            className={cn(
              "h-[18px] w-[18px] shrink-0",
              childActive ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-900"
            )}
            strokeWidth={1.75}
          />
        ) : null}
        <span className="flex-1 truncate">{item.title}</span>
        {item.badge ? <NavItemBadge>{item.badge}</NavItemBadge> : null}
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-neutral-400 transition-transform",
            open && "rotate-90"
          )}
          strokeWidth={1.75}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 pb-1 pl-3 pt-0.5">
        {item.items.map((sub) => {
          const SubIcon = sub.icon;
          const active = isPathActive(pathname, sub.url);
          return (
            <Link
              key={`${sub.title}-${sub.url}`}
              href={sub.url}
              className={cn(
                "group flex items-center gap-3 rounded-lg py-2 pl-7 pr-3 text-[12px] font-medium transition-colors",
                active
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100/60 hover:text-neutral-900"
              )}
            >
              {SubIcon ? (
                <SubIcon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-900"
                  )}
                  strokeWidth={1.75}
                />
              ) : null}
              <span className="flex-1 truncate">{sub.title}</span>
              {sub.badge ? <NavItemBadge>{sub.badge}</NavItemBadge> : null}
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

function HubNavGroup({ title, items, pathname }: { title: string; items: NavItem[]; pathname: string }) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
        {title}
      </p>
      {items.map((item) => {
        const key = `${item.title}-${"url" in item ? item.url : "group"}`;
        if ("items" in item && item.items) {
          return <HubNavCollapsible key={key} item={item} pathname={pathname} />;
        }
        return <HubNavLink key={key} item={item as NavLink} pathname={pathname} />;
      })}
    </div>
  );
}

export function WorkspaceOverviewSidebar({
  userName,
  userEmail,
  workspaceName: workspaceNameProp,
  onSignOut,
}: WorkspaceOverviewSidebarProps) {
  const pathname = usePathname() ?? "";
  const [workspaceName, setWorkspaceName] = useState(workspaceNameProp?.trim() || "Workspace");

  useEffect(() => {
    syncWorkspaceTierFromLatestTemplate();
    const sync = () => {
      const state = getWorkspaceTierState();
      const fromTier = state?.businessName?.trim();
      if (fromTier) setWorkspaceName(fromTier);
      else if (workspaceNameProp?.trim()) setWorkspaceName(workspaceNameProp.trim());
    };
    sync();
    window.addEventListener(WORKSPACE_TIER_UPDATED_EVENT, sync);
    return () => window.removeEventListener(WORKSPACE_TIER_UPDATED_EVENT, sync);
  }, [workspaceNameProp]);

  const workspaceGroup = buildWorkspaceNavGroup();
  const quickActionsGroup = buildWorkspaceQuickActionsGroup();

  return (
    <aside className="workspace-hub-sidebar flex h-screen w-[248px] shrink-0 flex-col rounded-tl-[28px] border-r border-ui-border/80 shadow-[inset_1px_0_0_rgba(255,255,255,0.75)]">
      {/* Workspace switcher */}
      <div className="px-4 pb-2 pt-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border border-ui-border/80 bg-white px-3 py-3 text-left transition-colors",
                "hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Building2 className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold tracking-tight text-neutral-900">
                  {workspaceName}
                </p>
                <p className="text-[11px] text-neutral-500">Founder</p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="workspace-hub-user-menu-content w-56 rounded-xl border border-ui-border/80 bg-white p-1"
          >
            <DropdownMenuItem
              asChild
              className="hub-menu-item cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-neutral-700 focus:bg-neutral-100 data-[highlighted]:bg-neutral-100"
            >
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
                All workspaces
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workspace navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
        <HubNavGroup title={workspaceGroup.title} items={workspaceGroup.items} pathname={pathname} />
        <HubNavGroup
          title={quickActionsGroup.title}
          items={quickActionsGroup.items}
          pathname={pathname}
        />
      </nav>

      {/* Help + user */}
      <div className="space-y-3 px-4 pb-5 pt-2">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-2xl border border-ui-border/60 bg-blue-50/50 px-3 py-3 transition-colors hover:bg-blue-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-900">Need Help?</p>
            <p className="text-[11px] text-neutral-500">Chat with support</p>
          </div>
        </Link>

        <WorkspaceHubUserMenu
          userName={userName}
          userEmail={userEmail}
          onSignOut={onSignOut}
        />
      </div>
    </aside>
  );
}
