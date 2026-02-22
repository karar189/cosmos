"use client";

import { getCookie } from "@/lib/cookies";
import { cn } from "@/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/layout/app-sidebar";
import { useFreighter } from "@/hooks/useFreighter";
import { sidebarData } from "@/components/dashboard/layout/data/sidebar-data";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey, disconnect } = useFreighter();
  const defaultOpen = getCookie("sidebar_state") !== "false";

  const user = publicKey
    ? {
        name: "Wallet",
        email: `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
        avatar: "",
      }
    : sidebarData.user;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        onDisconnect={disconnect}
        user={user}
      />
      <SidebarInset className={cn("flex flex-1 flex-col")}>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
