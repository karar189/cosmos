"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Bell,
  FileText,
  CreditCard,
  Settings,
  LifeBuoy,
  Plus,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

const NAV: {
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  badge?: number;
}[] = [
  { label: "Workspaces", href: "/dashboard", icon: LayoutGrid },
  { label: "Notifications", href: "/dashboard", icon: Bell, badge: 12 },
  { label: "Templates", href: "/dashboard/documents", icon: FileText },
  { label: "Billing & Plans", href: "/dashboard/settings", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Support", href: "/dashboard/settings", icon: LifeBuoy },
];

type WorkspaceHubSidebarProps = {
  userName: string;
  userEmail: string;
  userInitials: string;
  activeWorkspaceName?: string;
  activeWorkspaceRole?: string;
  onCreateWorkspace: () => void;
};

export function WorkspaceHubSidebar({
  userName,
  userEmail,
  userInitials,
  activeWorkspaceName,
  activeWorkspaceRole = "Founder",
  onCreateWorkspace,
}: WorkspaceHubSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-slate-900">Hypertron</span>
      </div>

      <div className="mx-4 mb-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white shadow-sm">
            <AvatarFallback className="bg-violet-100 text-sm font-semibold text-violet-800">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
              <Badge className="h-5 shrink-0 border-0 bg-violet-100 px-1.5 text-[10px] font-medium text-violet-700 hover:bg-violet-100">
                Owner
              </Badge>
            </div>
            <p className="truncate text-xs text-slate-500">{userEmail}</p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map(({ label, href, icon: Icon, badge }) => {
          const active = label === "Workspaces" && pathname === "/dashboard";
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-violet-50 text-violet-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-violet-600" : "text-slate-400")} />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/80 p-4">
        <p className="text-sm font-semibold leading-snug text-slate-900">
          Run your entire Web3 company, from one place.
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
          {["Treasury", "Operations", "Compliance", "Governance", "Analytics"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-violet-400" />
              {item}
            </li>
          ))}
        </ul>
        <Button
          type="button"
          onClick={onCreateWorkspace}
          className="mt-4 w-full rounded-lg bg-violet-600 text-white shadow-sm hover:bg-violet-700"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      {activeWorkspaceName ? (
        <div className="border-t border-slate-200/80 px-4 py-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-xs font-bold text-white">
              {activeWorkspaceName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900">{activeWorkspaceName}</p>
              <p className="text-[10px] text-slate-500">{activeWorkspaceRole}</p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
