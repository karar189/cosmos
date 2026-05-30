"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";
import { HubAvatar } from "@/components/global/hub-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/utils";

type WorkspaceHubUserMenuProps = {
  userName: string;
  userEmail: string;
  onSignOut: () => void | Promise<void>;
};

export function WorkspaceHubUserMenu({
  userName,
  userEmail,
  onSignOut,
}: WorkspaceHubUserMenuProps) {
  const [signOutOpen, setSignOutOpen] = useState(false);

  const handleSignOut = async () => {
    await onSignOut();
    setSignOutOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border border-ui-border/80 bg-white px-3 py-3 text-left transition-colors",
              "hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            )}
          >
            <HubAvatar value={userEmail || userName} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">{userName}</p>
              <p className="truncate text-xs text-neutral-500">{userEmail}</p>
            </div>
            <ChevronsUpDown
              className="h-4 w-4 shrink-0 text-neutral-400"
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={2}
          className={cn(
            "workspace-hub-user-menu-content z-50 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] rounded-xl border border-ui-border/80 bg-white p-1 text-neutral-900",
            "!shadow-none data-[state=open]:animate-none data-[state=closed]:animate-none"
          )}
          style={{ boxShadow: "none", filter: "none" }}
        >
          <DropdownMenuItem
            asChild
            className="hub-menu-item cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-neutral-700 focus:bg-neutral-100 focus:text-neutral-700 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-700"
          >
            <Link href="/dashboard/settings" className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="hub-menu-item cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-neutral-700 focus:bg-neutral-100 focus:text-neutral-700 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-700"
          >
            <Link href="/dashboard/settings" className="flex items-center gap-2.5">
              <Settings className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="hub-menu-item cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-neutral-700 focus:bg-neutral-100 focus:text-neutral-700 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-700"
          >
            <Link href="/dashboard/settings" className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
              Help & support
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-neutral-200" />
          <DropdownMenuItem
            className="hub-menu-item hub-menu-item--destructive cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-red-700 focus:bg-neutral-100 focus:text-red-700 data-[highlighted]:bg-neutral-100 data-[highlighted]:text-red-700"
            onSelect={(e) => {
              e.preventDefault();
              setSignOutOpen(true);
            }}
          >
            <LogOut className="h-4 w-4 text-red-700" strokeWidth={1.75} />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <AlertDialogContent className="rounded-2xl border border-ui-border/90 bg-white text-neutral-900 shadow-none sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-900">Sign out?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600">
              You will be signed out of Hypertron and disconnected from your wallet. You can sign
              in again anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="rounded-lg border-ui-border bg-white text-neutral-900 hover:bg-neutral-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleSignOut()}
              className="rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
