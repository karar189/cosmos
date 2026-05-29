"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  Bell,
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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Owner: "bg-violet-100 text-violet-800 border-violet-200",
  Admin: "bg-sky-100 text-sky-800 border-sky-200",
  Member: "bg-slate-100 text-slate-700 border-slate-200",
} as const;

const ICON_STYLES = {
  violet: "bg-violet-600",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
} as const;

type WorkspaceHubMainProps = {
  userName: string;
  userInitials: string;
  workspaces: WorkspaceCardModel[];
  loading: boolean;
  onCreateWorkspace: () => void;
};

export function WorkspaceHubMain({
  userName,
  userInitials,
  workspaces,
  loading,
  onCreateWorkspace,
}: WorkspaceHubMainProps) {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recent");
  const [query, setQuery] = useState("");
  const [openingId, setOpeningId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...workspaces];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (w) => w.name.toLowerCase().includes(q) || w.type.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    });
    return list;
  }, [workspaces, query, sort]);

  const summary = useMemo(
    () => ({
      workspaces: workspaces.length,
      members: workspaces.reduce((s, w) => s + w.members, 0),
      openTasks: workspaces.reduce((s, w) => s + w.openTasks, 0),
      pendingApprovals: workspaces.reduce((s, w) => s + w.pendingApprovals, 0),
      complianceAlerts: workspaces.reduce((s, w) => s + w.complianceAlerts, 0),
      deadlines: Math.min(workspaces.length + 2, 9),
    }),
    [workspaces]
  );

  const handleOpen = async (workspace: WorkspaceCardModel) => {
    setOpeningId(workspace.id);
    await activateWorkspace(workspace.template);
    router.push("/dashboard/overview");
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#f8f6fc]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back, {userName.split(" ")[0] || userName}! 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a workspace to continue or create a new one.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-10 w-56 rounded-lg border-slate-200 bg-white pl-9 text-slate-900 placeholder:text-slate-400"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-1.5 text-[10px] text-slate-400 lg:inline">
              ⌘ K
            </kbd>
          </div>
          <Button variant="outline" size="icon" className="relative rounded-lg border-slate-200 bg-white">
            <Bell className="h-4 w-4 text-slate-600" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              12
            </span>
          </Button>
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-violet-100 font-semibold text-violet-800">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-sky-50 to-blue-50/80 shadow-md shadow-sky-100/50">
            <CardContent className="flex flex-col items-center p-8 text-center sm:flex-row sm:text-left">
              <div className="flex flex-1 flex-col items-center sm:items-start">
                <h2 className="text-lg font-semibold text-slate-900">Create New Workspace</h2>
                <p className="mt-1 max-w-sm text-sm text-slate-600">
                  Start fresh and set up a new workspace for your team or organization.
                </p>
                <Button
                  type="button"
                  onClick={onCreateWorkspace}
                  className="mt-5 rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Workspace
                </Button>
              </div>
              <div className="mt-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm sm:mt-0">
                <Plus className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50/80 shadow-md shadow-amber-100/40">
            <CardContent className="p-8">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Quick Start with Template</h2>
                <Badge className="border-0 bg-amber-200/80 text-amber-900 hover:bg-amber-200/80">New</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Choose from pre-built templates tailored for Web3 companies.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["DAO", "Web3 Startup", "Agency", "Foundation"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-amber-200/80 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                asChild
                className="mt-5 rounded-lg border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              >
                <Link href="/dashboard/documents">
                  Explore Templates
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
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
              <SelectTrigger className="h-9 w-[140px] rounded-lg border-slate-200 bg-white text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Last Accessed</SelectItem>
                <SelectItem value="name">Name</SelectItem>
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
              <Card
                key={ws.id}
                className="border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
                          ICON_STYLES[ws.accent]
                        )}
                      >
                        {ws.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{ws.name}</p>
                        <p className="text-xs text-slate-500">{ws.type}</p>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                          <Users className="h-3.5 w-3.5" />
                          {ws.members} members
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("shrink-0 text-[10px]", ROLE_STYLES[ws.role])}>
                      {ws.role}
                    </Badge>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Open Tasks
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-slate-900">{ws.openTasks}</p>
                      {ws.openTasks > 0 ? (
                        <p className="text-[10px] text-red-500">Needs attention</p>
                      ) : (
                        <p className="text-[10px] text-slate-400">—</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Pending
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-slate-900">{ws.pendingApprovals}</p>
                      {ws.pendingApprovals > 0 ? (
                        <p className="text-[10px] text-amber-600">Action required</p>
                      ) : (
                        <p className="text-[10px] text-slate-400">—</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Compliance
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-slate-900">{ws.complianceAlerts}</p>
                      {ws.complianceAlerts > 0 ? (
                        <p className="text-[10px] text-red-500">Needs attention</p>
                      ) : (
                        <p className="text-[10px] text-emerald-600">All clear</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Last accessed{" "}
                      {formatDistanceToNow(new Date(ws.lastAccessed), { addSuffix: true })}
                    </span>
                    <span>{ws.role}</span>
                  </div>

                  <Button
                    type="button"
                    disabled={openingId === ws.id}
                    onClick={() => void handleOpen(ws)}
                    className="mt-4 w-full rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                  >
                    {openingId === ws.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Open Workspace
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
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

        <div className="mt-10 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total Workspaces", value: summary.workspaces, sub: "Active", icon: Building2, color: "text-emerald-600" },
            { label: "Total Members", value: summary.members, sub: "Across all workspaces", icon: Users, color: "text-blue-600" },
            { label: "Open Tasks", value: summary.openTasks, sub: "Require attention", icon: CheckCircle2, color: "text-red-500" },
            { label: "Pending Approvals", value: summary.pendingApprovals, sub: "Awaiting your action", icon: Clock, color: "text-amber-600" },
            { label: "Compliance Alerts", value: summary.complianceAlerts, sub: "Need your review", icon: AlertTriangle, color: "text-red-500" },
            { label: "Upcoming Deadlines", value: summary.deadlines, sub: "This week", icon: Clock, color: "text-violet-600" },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="flex flex-col gap-1 border-slate-100 px-2 py-1 sm:border-r last:border-0">
              <div className="flex items-center gap-1.5">
                <Icon className={cn("h-3.5 w-3.5", color)} />
                <span className="text-xl font-bold text-slate-900">{value}</span>
              </div>
              <p className="text-xs font-medium text-slate-700">{label}</p>
              <p className={cn("text-[10px]", color)}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
