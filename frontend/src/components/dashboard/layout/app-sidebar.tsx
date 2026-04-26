"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  sidebarData,
  DASHBOARD_GROUP,
  getFeaturesNavGroup,
} from "@/components/dashboard/layout/data/sidebar-data";
import { NavGroup } from "@/components/dashboard/layout/nav-group";
import { NavUser } from "@/components/dashboard/layout/nav-user";
import { TeamSwitcher } from "@/components/dashboard/layout/team-switcher";
import { useFreighter } from "@/hooks/useFreighter";
import { fallbackBusiness } from "@/data/fallback";

type AppSidebarProps = {
  onDisconnect?: () => void;
  user?: { name: string; email: string; avatar: string };
};

export function AppSidebar({ onDisconnect, user }: AppSidebarProps) {
  const { publicKey } = useFreighter();
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const fetchRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!publicKey || publicKey.length !== 56 || !publicKey.startsWith("G")) {
      setSelectedWidgets([]);
      return;
    }
    fetch(`/api/business/profile?walletAddress=${encodeURIComponent(publicKey)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (profile && Array.isArray(profile.selectedWidgets)) {
          setSelectedWidgets(profile.selectedWidgets);
        } else {
          setSelectedWidgets(fallbackBusiness.selectedWidgets);
        }
      })
      .catch(() => setSelectedWidgets(fallbackBusiness.selectedWidgets));
  }, [publicKey]);

  fetchRef.current = () => {
    if (!publicKey || publicKey.length !== 56 || !publicKey.startsWith("G")) return;
    fetch(`/api/business/profile?walletAddress=${encodeURIComponent(publicKey)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (profile && Array.isArray(profile.selectedWidgets)) {
          setSelectedWidgets(profile.selectedWidgets);
        } else {
          setSelectedWidgets(fallbackBusiness.selectedWidgets);
        }
      })
      .catch(() => setSelectedWidgets(fallbackBusiness.selectedWidgets));
  };

  useEffect(() => {
    const onProfileUpdated = () => fetchRef.current();
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, []);

  const displayUser = user ?? sidebarData.user;
  const navGroups = [
    DASHBOARD_GROUP,
    getFeaturesNavGroup(selectedWidgets),
  ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} onDisconnect={onDisconnect} />
      </SidebarFooter>
    </Sidebar>
  );
}
