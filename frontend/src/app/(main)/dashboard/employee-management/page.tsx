"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Circle,
  UserX,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronsLeft,
  ChevronsRight,
  Users,
  UserCheck,
  UserMinus,
  Download,
} from "lucide-react";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFreighter } from "@/hooks/useFreighter";
import { cn } from "@/utils";

type Status = "active" | "inactive" | "on_leave" | "pending" | "offboarded";
type Priority = "low" | "medium" | "high";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: Status;
  priority: Priority;
}

const statusConfig: Record<Status, { label: string; icon: React.ElementType; pill: string }> = {
  active:     { label: "Active",      icon: CheckCircle2, pill: "bg-emerald-500/12 border-emerald-500/25 text-emerald-400" },
  inactive:   { label: "Inactive",    icon: XCircle,      pill: "bg-white/[0.05] border-white/[0.1] text-white/40" },
  on_leave:   { label: "On leave",    icon: Clock,        pill: "bg-amber-500/10 border-amber-500/25 text-amber-400" },
  pending:    { label: "Pending",     icon: Circle,       pill: "bg-blue-500/10 border-blue-500/25 text-blue-400" },
  offboarded: { label: "Offboarded",  icon: UserX,        pill: "bg-red-500/10 border-red-500/25 text-red-400/80" },
};

const priorityConfig: Record<Priority, { label: string; icon: React.ElementType; cls: string }> = {
  high:   { label: "High",   icon: ArrowUp,   cls: "text-red-400" },
  medium: { label: "Medium", icon: Minus,     cls: "text-amber-400" },
  low:    { label: "Low",    icon: ArrowDown, cls: "text-white/35" },
};

const deptColors: Record<string, string> = {
  Engineering: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  Design:      "bg-pink-500/12 text-pink-300 border-pink-500/25",
  Operations:  "bg-blue-500/10 text-blue-300 border-blue-500/25",
  Support:     "bg-teal-500/10 text-teal-300 border-teal-500/25",
  Marketing:   "bg-orange-500/10 text-orange-300 border-orange-500/25",
  Finance:     "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
};

const ROWS_PER_PAGE = 10;

const mockEmployees: Employee[] = [
  { id: "EMP-1001", name: "Alex Johnson",  role: "Senior Developer",    department: "Engineering", status: "active",     priority: "high" },
  { id: "EMP-1002", name: "Sam Rivera",    role: "Product Designer",    department: "Design",      status: "active",     priority: "medium" },
  { id: "EMP-1003", name: "Jordan Lee",    role: "Operations Lead",     department: "Operations",  status: "on_leave",   priority: "low" },
  { id: "EMP-1004", name: "Casey Morgan",  role: "Backend Engineer",    department: "Engineering", status: "active",     priority: "high" },
  { id: "EMP-1005", name: "Riley Chen",    role: "Customer Support",    department: "Support",     status: "pending",    priority: "medium" },
  { id: "EMP-1006", name: "Taylor Kim",    role: "Marketing Manager",   department: "Marketing",   status: "active",     priority: "medium" },
  { id: "EMP-1007", name: "Morgan Davis",  role: "DevOps Engineer",     department: "Engineering", status: "inactive",   priority: "low" },
  { id: "EMP-1008", name: "Avery Wilson",  role: "UX Researcher",       department: "Design",      status: "active",     priority: "high" },
  { id: "EMP-1009", name: "Quinn Brown",   role: "Finance Analyst",     department: "Finance",     status: "offboarded", priority: "low" },
  { id: "EMP-1010", name: "Skyler Green",  role: "Support Lead",        department: "Support",     status: "active",     priority: "high" },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const avatarHues = ["bg-violet-500/20 text-violet-300", "bg-pink-500/15 text-pink-300", "bg-teal-500/15 text-teal-300", "bg-blue-500/15 text-blue-300", "bg-amber-500/15 text-amber-300"];
function avatarColor(name: string) {
  const i = name.charCodeAt(0) % avatarHues.length;
  return avatarHues[i];
}

export default function EmployeeManagementPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = mockEmployees;
    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      list = list.filter((e) =>
        e.id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter((e) => e.status === statusFilter);
    if (priorityFilter !== "all") list = list.filter((e) => e.priority === priorityFilter);
    return list;
  }, [filter, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filtered.slice(start, start + ROWS_PER_PAGE);
  }, [filtered, page]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelected(new Set(paginated.map((e) => e.id)));
    else setSelected(new Set());
  };
  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const stats = useMemo(() => ({
    total: mockEmployees.length,
    active: mockEmployees.filter((e) => e.status === "active").length,
    onLeave: mockEmployees.filter((e) => e.status === "on_leave").length,
    inactive: mockEmployees.filter((e) => e.status === "inactive" || e.status === "offboarded").length,
  }), []);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-white/40 text-center text-sm">Connect your wallet to view this page.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <DashboardMain>
      <div className="flex flex-col gap-6">

        {/* ── Page heading ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Employee Management</h1>
            <p className="mt-1 text-sm text-white/40">Manage your team members and their roles.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 border-white/[0.08] bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button size="sm" className="h-8 bg-violet-600 hover:bg-violet-500 text-white border-0 text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add employee
            </Button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total",    value: stats.total,    icon: Users,      cls: "text-white/60",    bg: "bg-white/[0.05]" },
            { label: "Active",   value: stats.active,   icon: UserCheck,  cls: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "On leave", value: stats.onLeave,  icon: Clock,      cls: "text-amber-400",   bg: "bg-amber-500/10" },
            { label: "Inactive", value: stats.inactive, icon: UserMinus,  cls: "text-red-400/80",  bg: "bg-red-500/10" },
          ].map(({ label, value, icon: Icon, cls, bg }) => (
            <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 flex items-center gap-3">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08]", bg)}>
                <Icon className={cn("h-4 w-4", cls)} />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-none">{value}</p>
                <p className="text-xs text-white/35 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
            <Input
              placeholder="Search by name, role, ID…"
              className="pl-8 h-8 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/40 focus:ring-0 text-sm"
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-[130px] bg-white/[0.04] border-white/[0.08] text-white text-sm focus:ring-0 focus:border-violet-500/40 data-[placeholder]:text-white/30">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f1a] border-white/[0.1] text-white">
              <SelectItem value="all" className="text-sm text-white/70 focus:bg-violet-500/15 focus:text-white">All status</SelectItem>
              {Object.entries(statusConfig).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-sm text-white/70 focus:bg-violet-500/15 focus:text-white">{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-[130px] bg-white/[0.04] border-white/[0.08] text-white text-sm focus:ring-0 focus:border-violet-500/40 data-[placeholder]:text-white/30">
              <SelectValue placeholder="All priority" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f1a] border-white/[0.1] text-white">
              <SelectItem value="all" className="text-sm text-white/70 focus:bg-violet-500/15 focus:text-white">All priority</SelectItem>
              {Object.entries(priorityConfig).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-sm text-white/70 focus:bg-violet-500/15 focus:text-white">{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selected.size > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-white/40">{selected.size} selected</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 px-2.5">
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_140px_130px_100px_44px] items-center border-b border-white/[0.06] px-4 py-2.5">
            <div>
              <Checkbox
                checked={paginated.length > 0 && selected.size === paginated.length}
                onCheckedChange={(c) => toggleSelectAll(!!c)}
                aria-label="Select all"
                className="border-white/20"
              />
            </div>
            <span className="text-[11px] font-medium text-white/35 uppercase tracking-wider">Employee</span>
            <span className="text-[11px] font-medium text-white/35 uppercase tracking-wider">Department</span>
            <span className="text-[11px] font-medium text-white/35 uppercase tracking-wider">Status</span>
            <span className="text-[11px] font-medium text-white/35 uppercase tracking-wider">Priority</span>
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.04]">
            {paginated.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-white/25">No employees match your filters.</p>
              </div>
            ) : paginated.map((emp) => {
              const StatusIcon = statusConfig[emp.status].icon;
              const PriorityIcon = priorityConfig[emp.priority].icon;
              const isSelected = selected.has(emp.id);
              return (
                <div
                  key={emp.id}
                  className={cn(
                    "grid grid-cols-[40px_1fr_140px_130px_100px_44px] items-center px-4 py-3 transition-colors",
                    isSelected ? "bg-violet-500/[0.06]" : "hover:bg-white/[0.02]"
                  )}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(emp.id)}
                    aria-label={`Select ${emp.id}`}
                    className="border-white/20"
                  />

                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold", avatarColor(emp.name))}>
                      {getInitials(emp.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{emp.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-white/25">{emp.id}</span>
                        <span className="text-white/15">·</span>
                        <span className="text-[11px] text-white/40 truncate">{emp.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                      deptColors[emp.department] ?? "bg-white/[0.06] border-white/[0.1] text-white/50"
                    )}>
                      {emp.department}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                      statusConfig[emp.status].pill
                    )}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[emp.status].label}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className={cn("flex items-center gap-1.5 text-sm", priorityConfig[emp.priority].cls)}>
                    <PriorityIcon className="h-3.5 w-3.5" />
                    <span className="text-[12px] font-medium">{priorityConfig[emp.priority].label}</span>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/25 hover:text-white hover:bg-white/[0.06]">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0f0f1a] border-white/[0.1] text-white min-w-[140px]">
                      <DropdownMenuItem className="text-sm text-white/70 focus:bg-violet-500/15 focus:text-white cursor-pointer">View profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm text-white/70 focus:bg-violet-500/15 focus:text-white cursor-pointer">Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm text-red-400/80 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Pagination ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            Showing {Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} employees
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/30 hover:text-white hover:bg-white/[0.06]"
              onClick={() => setPage(1)}
              disabled={page <= 1}
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-xs text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors",
                    page === p
                      ? "bg-violet-500/20 text-violet-300 font-medium"
                      : "text-white/35 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-xs text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/30 hover:text-white hover:bg-white/[0.06]"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </DashboardMain>
  );
}
