"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Plus,
  LayoutList,
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Circle,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useFreighter } from "@/hooks/useFreighter";
import { cn } from "@/utils";

type Status = "active" | "inactive" | "on_leave" | "pending" | "offboarded";
type Priority = "low" | "medium" | "high";

interface Employee {
  id: string;
  tag: string;
  title: string;
  status: Status;
  priority: Priority;
}

const statusConfig: Record<
  Status,
  { label: string; icon: React.ElementType; className: string }
> = {
  active: { label: "Active", icon: CheckCircle2, className: "text-emerald-500" },
  inactive: { label: "Inactive", icon: XCircle, className: "text-muted-foreground" },
  on_leave: { label: "On leave", icon: Clock, className: "text-amber-500" },
  pending: { label: "Pending", icon: Circle, className: "text-muted-foreground" },
  offboarded: { label: "Offboarded", icon: HelpCircle, className: "text-destructive" },
};

const priorityConfig: Record<
  Priority,
  { label: string; icon: React.ElementType; className: string }
> = {
  high: { label: "High", icon: ArrowUp, className: "text-destructive" },
  medium: { label: "Medium", icon: Minus, className: "text-amber-500" },
  low: { label: "Low", icon: ArrowDown, className: "text-muted-foreground" },
};

const ROWS_PER_PAGE = 10;
const mockEmployees: Employee[] = [
  { id: "EMP-1001", tag: "Engineering", title: "Alex Johnson — Senior Developer", status: "active", priority: "high" },
  { id: "EMP-1002", tag: "Design", title: "Sam Rivera — Product Designer", status: "active", priority: "medium" },
  { id: "EMP-1003", tag: "Operations", title: "Jordan Lee — Operations Lead", status: "on_leave", priority: "low" },
  { id: "EMP-1004", tag: "Engineering", title: "Casey Morgan — Backend Engineer", status: "active", priority: "high" },
  { id: "EMP-1005", tag: "Support", title: "Riley Chen — Customer Support", status: "pending", priority: "medium" },
  { id: "EMP-1006", tag: "Marketing", title: "Taylor Kim — Marketing Manager", status: "active", priority: "medium" },
  { id: "EMP-1007", tag: "Engineering", title: "Morgan Davis — DevOps", status: "inactive", priority: "low" },
  { id: "EMP-1008", tag: "Design", title: "Avery Wilson — UX Researcher", status: "active", priority: "high" },
  { id: "EMP-1009", tag: "Operations", title: "Quinn Brown — Finance", status: "offboarded", priority: "low" },
  { id: "EMP-1010", tag: "Support", title: "Skyler Green — Support Lead", status: "active", priority: "high" },
];

export default function EmployeeManagementPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = mockEmployees;
    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.tag.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      list = list.filter((e) => e.priority === priorityFilter);
    }
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
          <span className="text-sm font-medium text-muted-foreground">Employee Management</span>
        </div>
        <div className="flex flex-1 max-w-sm items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9 bg-muted/50"
              onKeyDown={(e) => e.key === "k" && (e.metaKey || e.ctrlKey) && e.currentTarget.focus()}
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              <span>⌘</span>K
            </kbd>
          </div>
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
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Here&apos;s a list of your team members for this month!
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Filter by name or ID..."
                className="h-9 w-[200px] lg:w-[280px] bg-background"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priority</SelectItem>
                  {Object.entries(priorityConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <LayoutList className="mr-2 h-4 w-4" />
                    View
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Table</DropdownMenuItem>
                  <DropdownMenuItem>Cards</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button size="sm" className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                Create +
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={paginated.length > 0 && selected.size === paginated.length}
                      onCheckedChange={(c) => toggleSelectAll(!!c)}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[120px]">Employee</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[120px]">Priority</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((emp) => {
                  const StatusIcon = statusConfig[emp.status].icon;
                  const PriorityIcon = priorityConfig[emp.priority].icon;
                  return (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(emp.id)}
                          onCheckedChange={() => toggleSelect(emp.id)}
                          aria-label={`Select ${emp.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs text-muted-foreground">{emp.id}</span>
                          <Badge variant="secondary" className="w-fit text-xs">
                            {emp.tag}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{emp.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            className={cn("h-4 w-4", statusConfig[emp.status].className)}
                          />
                          <span className="text-sm">{statusConfig[emp.status].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PriorityIcon
                            className={cn("h-4 w-4", priorityConfig[emp.priority].className)}
                          />
                          <span className="text-sm">{priorityConfig[emp.priority].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>
              <Select defaultValue={String(ROWS_PER_PAGE)}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>Page {page} of {totalPages}</span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setPage(1)}
                    disabled={page <= 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">First page</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    className={cn(page <= 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                {(() => {
                  const pages: (number | "ellipsis")[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    const mid = new Set<number>();
                    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++)
                      mid.add(i);
                    pages.push(1);
                    if (page > 3) pages.push("ellipsis");
                    [...mid].sort((a, b) => a - b).forEach((n) => pages.push(n));
                    if (page < totalPages - 2) pages.push("ellipsis");
                    if (totalPages > 1) pages.push(totalPages);
                  }
                  return pages.map((p, i) =>
                    p === "ellipsis" ? (
                      <PaginationEllipsis key={`e-${i}`} />
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                          isActive={page === p}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  );
                })()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className={cn(page >= totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Last page</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </DashboardMain>
    </>
  );
}
