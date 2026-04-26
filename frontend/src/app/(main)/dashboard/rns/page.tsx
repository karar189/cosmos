"use client";

import { Button } from "@/components/ui/button";
import { useFreighter } from "@/hooks/useFreighter";
import { useRouter } from "next/navigation";
import { Newspaper } from "lucide-react";
import { DashboardMain } from "@/components/dashboard/layout/main";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function RnsPage() {
  const router = useRouter();
  const { publicKey } = useFreighter();

  if (!publicKey) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-sm text-muted-foreground">Connect your wallet to use Regulation News Sniper.</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <DashboardMain>
      <PlaceholderPage
        icon={Newspaper}
        title="Regulation News Sniper (RNS)"
        description="Track regulatory changes and news relevant to your corridors. This Tier 2+ surface will connect to live feeds and alerts."
      />
    </DashboardMain>
  );
}
