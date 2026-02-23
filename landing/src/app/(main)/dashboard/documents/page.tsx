"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  LayoutGrid,
  Building2,
  Users,
  CreditCard,
  FileCheck,
  Receipt,
  Briefcase,
  ShoppingCart,
  ArrowDownWideNarrow,
  FolderArchive,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFreighter } from "@/hooks/useFreighter";
import { cn } from "@/utils";

type Category = "all" | "business" | "customer";

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: "business" | "customer";
  icon: React.ElementType;
  connected?: boolean;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "b2b-onboarding",
    name: "B2B onboarding",
    description: "Onboard business clients with KYC, agreements, and payment terms in one flow.",
    category: "business",
    icon: Building2,
    connected: true,
  },
  {
    id: "smb-payment",
    name: "SMB payment flow",
    description: "Simple payment links and invoices for small and medium businesses.",
    category: "business",
    icon: CreditCard,
  },
  {
    id: "enterprise-agreement",
    name: "Enterprise agreement",
    description: "Multi-step contracts, approvals, and compliance docs for enterprise deals.",
    category: "business",
    icon: FileCheck,
  },
  {
    id: "freelancer-invoice",
    name: "Freelancer invoice",
    description: "Send invoices and collect payment with a single link. Ideal for contractors.",
    category: "business",
    icon: Receipt,
  },
  {
    id: "consumer-checkout",
    name: "Consumer checkout",
    description: "One-click checkout for end customers. Minimal steps, fast payment.",
    category: "customer",
    icon: ShoppingCart,
  },
  {
    id: "subscription-billing",
    name: "Subscription billing",
    description: "Recurring payments and subscription management for your customers.",
    category: "customer",
    icon: CreditCard,
  },
  {
    id: "client-portal",
    name: "Client portal",
    description: "Dedicated portal for clients to view docs, sign, and pay in one place.",
    category: "customer",
    icon: Users,
  },
  {
    id: "document-template",
    name: "Document template",
    description: "Collect and store client documents securely. Templates and e-sign ready.",
    category: "business",
    icon: FileText,
  },
  {
    id: "deal-room",
    name: "Deal room",
    description: "Structured deal flow for investors and borrowers with milestones and releases.",
    category: "business",
    icon: Briefcase,
  },
];

export default function DocumentsPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");

  const filtered = useMemo(() => {
    let list = TEMPLATES;
    if (category !== "all") {
      list = list.filter((t) => t.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, category]);

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
          <span className="text-sm font-medium text-muted-foreground">Templates</span>
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
            <h1 className="text-3xl font-bold tracking-tight">Templates & segments</h1>
            <p className="text-muted-foreground">
              Choose a template for your business or customer segment.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-fit"
              onClick={() => router.push("/dashboard/document-vault")}
            >
              <FolderArchive className="mr-2 h-4 w-4" />
              Document vault — saved compliance checklists
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="All templates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All templates</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="customer">Customer segment</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0" title="Sort">
              <ArrowDownWideNarrow className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className={cn(
                    "rounded-xl border-border bg-card overflow-hidden transition-colors hover:border-muted-foreground/30"
                  )}
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Button
                        size="sm"
                        variant={item.connected ? "primary" : "outline"}
                        className={cn(
                          "shrink-0",
                          item.connected && "bg-primary text-primary-foreground"
                        )}
                      >
                        {item.connected ? "In use" : "Use template"}
                      </Button>
                    </div>
                    <h3 className="font-semibold text-foreground leading-tight mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-snug flex-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <LayoutGrid className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No templates match your filters.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </DashboardMain>
    </>
  );
}
