"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import plusIllustration from "@/assets/plus.png";
import templateIllustration from "@/assets/template.png";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  Users,
  LayoutGrid,
  List,
  ArrowRight,
  Loader2,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreVertical,
  Settings,
  Archive,
  ExternalLink,
} from "lucide-react";
import { WorkspaceHubTopChrome } from "@/components/dashboard/workspace-hub/workspace-hub-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { activateWorkspace } from "@/lib/activate-workspace";
import type { SavedTemplate } from "@/lib/my-templates-storage";
import { cn } from "@/utils";

export type WorkspaceCardModel = {
  id: string;
  name: string;
  type: string;
  members: number;
  role: "Owner" | "Admin" | "Member";
  openTasks: number;
  pendingApprovals: number;
  complianceAlerts: number;
  lastAccessed: string;
  accent: "violet" | "sky" | "amber";
  template: SavedTemplate;
};

function hashStat(id: string, mod: number, min: number) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return (n % mod) + min;
}

export function templatesToWorkspaces(templates: SavedTemplate[]): WorkspaceCardModel[] {
  const accents: WorkspaceCardModel["accent"][] = ["violet", "sky", "amber"];
  const roles: WorkspaceCardModel["role"][] = ["Owner", "Admin", "Member"];

  return templates.map((t, i) => ({
    id: t.id,
    name: (t.businessName || t.name || "Untitled workspace").trim(),
    type: t.bundleName || "Web3 Startup",
    members: hashStat(t.id, 8, 2),
    role: roles[i % roles.length] ?? "Owner",
    openTasks: hashStat(t.id, 12, 1),
    pendingApprovals: hashStat(t.id, 6, 0),
    complianceAlerts: hashStat(t.id, 4, 0),
    lastAccessed: t.savedAt,
    accent: accents[i % accents.length]!,
    template: t,
  }));
}

const ROLE_STYLES = {
  Owner: "bg-blue-100 text-blue-800 border-blue-200",
  Admin: "bg-sky-100 text-sky-800 border-sky-200",
  Member: "bg-slate-100 text-slate-700 border-slate-200",
} as const;

const WORKSPACE_MENU_ITEM =
  "cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-neutral-700 focus:bg-neutral-100 focus:text-neutral-700 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-700";

function WorkspaceHubCard({
  workspace: ws,
  opening,
  onOpen,
}: {
  workspace: WorkspaceCardModel;
  opening: boolean;
  onOpen: () => void;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="bg-gradient-to-br from-blue-100/80 via-sky-50/70 to-white px-5 pb-4 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-sm">
              {ws.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex flex-col justify-center gap-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="truncate text-[15px] font-semibold leading-none text-slate-900">{ws.name}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 rounded-full border-0 px-2 py-0 text-[10px] font-semibold leading-5",
                    ROLE_STYLES[ws.role]
                  )}
                >
                  {ws.role}
                </Badge>
              </div>
              <p className="text-xs leading-none text-slate-500">
                {ws.type} • {ws.members} members
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none hover:bg-white/60 hover:text-slate-600 focus:ring-0 focus-visible:ring-0 data-[state=open]:bg-white/60 data-[state=open]:text-slate-600"
                aria-label="Workspace options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-50 min-w-[200px] rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-md"
            >
              <DropdownMenuItem
                className={WORKSPACE_MENU_ITEM}
                onSelect={() => onOpen()}
              >
                <ExternalLink className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
                Open workspace
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={WORKSPACE_MENU_ITEM}>
                <Link href="/dashboard/settings" className="flex items-center gap-2.5">
                  <Settings className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
                  Workspace settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={WORKSPACE_MENU_ITEM}>
                <Link href="/dashboard/employee-management" className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
                  Manage members
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-slate-200" />
              <DropdownMenuItem
                className={cn(
                  WORKSPACE_MENU_ITEM,
                  "text-red-700 focus:text-red-700 data-[highlighted]:text-red-700"
                )}
              >
                <Archive className="h-4 w-4 text-red-700" strokeWidth={1.75} />
                Archive workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="border-b border-slate-100 px-4 py-3.5">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <p className="pr-3 text-left text-lg font-bold tabular-nums leading-none text-slate-900">
              {ws.openTasks}
            </p>
            <p className="px-3 text-left text-lg font-bold tabular-nums leading-none text-slate-900">
              {ws.pendingApprovals}
            </p>
            <p className="pl-3 text-left text-lg font-bold tabular-nums leading-none text-slate-900">
              {ws.complianceAlerts}
            </p>
          </div>
          <div className="mt-1.5 grid grid-cols-3 divide-x divide-slate-100">
            <p className="pr-3 text-left text-xs text-slate-500">Open Tasks</p>
            <p className="px-3 text-left text-xs text-slate-500">Pending Approvals</p>
            <p className="pl-3 text-left text-xs text-slate-500">Compliance Alerts</p>
          </div>
          <div className="mt-1 grid grid-cols-3 divide-x divide-slate-100">
            {ws.openTasks > 0 ? (
              <p className="pr-3 text-left text-[10px] font-medium text-red-500">Needs attention</p>
            ) : (
              <p className="pr-3 text-left text-[10px] text-slate-400">—</p>
            )}
            {ws.pendingApprovals > 0 ? (
              <p className="px-3 text-left text-[10px] font-medium text-amber-600">Action required</p>
            ) : (
              <p className="px-3 text-left text-[10px] text-slate-400">—</p>
            )}
            {ws.complianceAlerts > 0 ? (
              <p className="pl-3 text-left text-[10px] font-medium text-red-500">
                {ws.complianceAlerts >= 3 ? "High priority" : "Medium priority"}
              </p>
            ) : (
              <p className="pl-3 text-left text-[10px] font-medium text-emerald-600">All clear</p>
            )}
          </div>
        </div>

        <div className="space-y-2 border-b border-slate-100 px-5 py-3.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Last accessed</span>
            <span className="font-medium text-slate-700">
              {formatDistanceToNow(new Date(ws.lastAccessed), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Role</span>
            <span className="font-semibold text-slate-900">{ws.role}</span>
          </div>
        </div>

        <div className="p-4 pt-3">
          <Button
            type="button"
            variant="ghost"
            disabled={opening}
            onClick={onOpen}
            className="h-11 w-full rounded-xl bg-blue-50 text-sm font-semibold text-blue-600 shadow-none transition-colors hover:bg-blue-100 hover:text-blue-700 active:scale-[0.99]"
          >
            {opening ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Open Workspace
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type WorkspaceHubMainProps = {
  userName: string;
  workspaces: WorkspaceCardModel[];
  loading: boolean;
  onCreateWorkspace: () => void;
};

export function WorkspaceHubMain({
  userName,
  workspaces,
  loading,
  onCreateWorkspace,
}: WorkspaceHubMainProps) {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recent");
  const [openingId, setOpeningId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = [...workspaces];
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    });
    return list;
  }, [workspaces, sort]);

  const handleOpen = async (workspace: WorkspaceCardModel) => {
    setOpeningId(workspace.id);
    await activateWorkspace(workspace.template);
    router.push("/dashboard/overview");
  };

  const firstName = userName.split(" ")[0] || userName;

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden bg-transparent">
      <WorkspaceHubTopChrome
        breadcrumbs={[
          { label: "Overview", href: "/dashboard/overview" },
          { label: "Dashboard", current: true },
        ]}
        title={`Welcome back, ${firstName}! 👋`}
        subtitle="Select a workspace to continue or create a new one."
        workspaces={workspaces}
      />

      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="workspace-hub-action-card--blue relative flex h-full flex-col overflow-hidden rounded-2xl bg-transparent shadow-none">
            <Image
              src={plusIllustration}
              alt=""
              width={420}
              height={420}
              className="pointer-events-none absolute bottom-0 right-0 z-0 h-[420px] w-[420px] translate-x-[28%] translate-y-[40%] object-contain opacity-90 drop-shadow-sm"
            />
            <CardContent className="relative z-10 flex min-h-[240px] flex-1 flex-col p-7">
              <div className="max-w-[min(70%,340px)]">
                <h2 className="text-lg font-semibold text-[#1e1b4b]">Create New Workspace</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                  Start fresh and set up a new workspace for your team or organization.
                </p>
              </div>
              <div className="mt-auto pt-6">
                <Button
                  type="button"
                  onClick={onCreateWorkspace}
                  className="h-auto w-fit rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-5 py-3 text-white hover:from-[#2563eb] hover:to-[#3b82f6]"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Workspace
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="workspace-hub-action-card--peach relative flex h-full flex-col overflow-hidden rounded-2xl bg-transparent shadow-none">
            <Image
              src={templateIllustration}
              alt=""
              width={420}
              height={420}
              className="pointer-events-none absolute bottom-0 right-0 z-0 h-[420px] w-[420px] translate-x-[28%] translate-y-[40%] object-contain opacity-90 drop-shadow-sm"
            />
            <CardContent className="relative z-10 flex min-h-[240px] flex-1 flex-col p-7">
              <div className="max-w-[min(70%,340px)]">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[#1e1b4b]">Quick Start with Template</h2>
                  <Badge className="shrink-0 border-0 bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-[#1e1b4b] hover:bg-violet-100">
                    New
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                  Choose from pre-built templates tailored for Web3 companies.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["DAO", "Web3 Startup", "Agency", "Foundation"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-orange-200/60 bg-[#fff4eb] px-1.5 py-0.5 text-[10px] font-medium leading-tight text-[#1e1b4b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-auto pt-6">
                <Button
                  variant="ghost"
                  asChild
                  className="h-auto w-fit rounded-lg border border-orange-200/40 bg-gradient-to-r from-[#fff7ed] via-[#ffedd5] to-[#ffe8d6] px-5 py-3 text-[#1e1b4b] shadow-none transition-colors hover:border-orange-300/50 hover:bg-transparent hover:bg-gradient-to-r hover:from-[#ffedd5] hover:via-[#ffe4cc] hover:to-[#ffd9b8] hover:text-[#1e1b4b] active:scale-[0.99]"
                >
                  <Link href="/dashboard/documents">
                    Explore Templates
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Workspaces</h2>
            <p className="text-sm text-slate-500">Recently accessed</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[140px] rounded-lg border border-slate-200 bg-white text-sm text-slate-900 shadow-none">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-slate-200 bg-white text-slate-900 shadow-md">
                <SelectItem
                  value="recent"
                  className="rounded-md text-slate-700 focus:bg-slate-100 focus:text-slate-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900"
                >
                  Last Accessed
                </SelectItem>
                <SelectItem
                  value="name"
                  className="rounded-md text-slate-700 focus:bg-slate-100 focus:text-slate-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900"
                >
                  Name
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 rounded-md", view === "grid" && "bg-slate-100")}
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 rounded-md", view === "list" && "bg-slate-100")}
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="mt-6 border-dashed border-slate-200 bg-white">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <Building2 className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-700">No workspaces yet</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Create your first workspace to start managing payments, compliance, and operations.
              </p>
              <Button
                type="button"
                onClick={onCreateWorkspace}
                className="mt-6 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={cn(
              "mt-6 gap-5",
              view === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3" : "flex flex-col"
            )}
          >
            {filtered.map((ws) => (
              <WorkspaceHubCard
                key={ws.id}
                workspace={ws}
                opening={openingId === ws.id}
                onOpen={() => void handleOpen(ws)}
              />
            ))}
          </div>
        )}

        {workspaces.length > 3 ? (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="rounded-lg border-slate-200 bg-white">
              View All Workspaces ({workspaces.length})
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
