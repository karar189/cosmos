"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/components/dashboard/layout/data/sidebar-data";
import { NavGroup } from "@/components/dashboard/layout/nav-group";
import { NavUser } from "@/components/dashboard/layout/nav-user";
import { TeamSwitcher } from "@/components/dashboard/layout/team-switcher";

type AppSidebarProps = {
  onDisconnect?: () => void;
  user?: { name: string; email: string; avatar: string };
};

export function AppSidebar({ onDisconnect, user }: AppSidebarProps) {
  const displayUser = user ?? sidebarData.user;
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} onDisconnect={onDisconnect} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
