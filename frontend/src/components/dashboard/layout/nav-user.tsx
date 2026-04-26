"use client";

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onDisconnect?: () => void;
  onConnect?: () => Promise<string | null>;
  isConnecting?: boolean;
  isConnected?: boolean;
};

export function NavUser({
  user,
  onDisconnect,
  onConnect,
  isConnecting = false,
  isConnected = false,
}: NavUserProps) {
  const [signOutOpen, setSignOutOpen] = useState(false);

  const handleDisconnect = () => {
    onDisconnect?.();
    setSignOutOpen(false);
  };

  const handleConnect = () => {
    if (isConnecting) return;
    onConnect?.();
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          {isConnected ? (
            <SidebarMenuButton
              size="lg"
              className="cursor-default data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-60" />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              size="lg"
              onClick={handleConnect}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{isConnecting ? "Connecting..." : user.name}</span>
                <span className="truncate text-xs">{isConnecting ? "Open Freighter to continue" : user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>

      {isConnected ? (
        <>
          <SidebarSeparator className="opacity-30" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Disconnect wallet"
                className="text-red-400/80 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => setSignOutOpen(true)}
              >
                <LogOut className="size-4" />
                <span>Disconnect</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </>
      ) : null}

      <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <AlertDialogContent className="border-white/15 bg-[#060912]/95 text-white shadow-2xl backdrop-blur-xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold tracking-tight text-white">
              Disconnect wallet
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed text-white/65">
              Disconnect your Stellar wallet? You can connect again to access your payment links.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 gap-3 sm:justify-end">
            <AlertDialogCancel className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-red-500/85 text-white hover:bg-red-500"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
