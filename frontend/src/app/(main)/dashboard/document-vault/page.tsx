"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FolderArchive, ShieldCheck, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/layout/header";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useFreighter } from "@/hooks/useFreighter";
import { cn } from "@/utils";

type VaultItem = {
  id: string;
  type: string;
  title: string;
  items: { id: string; text: string; done: boolean }[];
  createdAt: string;
};

export default function DocumentVaultPage() {
  const router = useRouter();
  const { publicKey, disconnect, isConnecting } = useFreighter();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey || publicKey.length !== 56 || !publicKey.startsWith("G")) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/vault", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Connect your wallet to view your Document vault.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader fixed>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Document vault</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect} disabled={isConnecting}>
            Disconnect
          </Button>
        </div>
      </DashboardHeader>
      <DashboardMain>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FolderArchive className="h-8 w-8" />
              Document vault
            </h1>
            <p className="text-muted-foreground mt-1">
              Saved compliance checklists and other documents. Generate a new checklist from the Compliance Agent.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/dashboard/compliance-agent")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Open Compliance Agent
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FolderArchive className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-2">No saved checklists yet.</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the Compliance Agent to generate a regulatory checklist, then save it here.
                </p>
                <Button onClick={() => router.push("/dashboard/compliance-agent")}>
                  Go to Compliance Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {items.map((vault) => (
                <Card key={vault.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{vault.title}</CardTitle>
                    <CardDescription>
                      Saved {new Date(vault.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      {vault.type === "compliance_checklist" && " · Compliance checklist"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {vault.items.map((item) => (
                        <li
                          key={item.id}
                          className={cn(
                            "flex items-center gap-3 text-sm py-1",
                            item.done && "text-muted-foreground"
                          )}
                        >
                          <Checkbox checked={item.done} disabled className="pointer-events-none" />
                          <span className={item.done ? "line-through" : ""}>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardMain>
    </>
  );
}
