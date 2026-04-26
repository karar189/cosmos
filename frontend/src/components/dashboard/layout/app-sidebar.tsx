"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  buildBusinessTierNavGroup,
} from "@/components/dashboard/layout/data/sidebar-data";
import {
  getWorkspaceTierState,
  syncWorkspaceTierFromLatestTemplate,
  workspaceSectionTitle,
  WORKSPACE_TIER_UPDATED_EVENT,
} from "@/lib/workspace-tier-context";
import { NavGroup } from "@/components/dashboard/layout/nav-group";
import { NavUser } from "@/components/dashboard/layout/nav-user";
import { TeamSwitcher } from "@/components/dashboard/layout/team-switcher";
import { useFreighter } from "@/hooks/useFreighter";
import { fallbackBusiness } from "@/data/fallback";
import { getOnboardingData } from "@/components/onboarding/onboarding-modal";

type AppSidebarProps = {
  onDisconnect?: () => void;
  user?: { name: string; email: string; avatar: string };
};

export function AppSidebar({ onDisconnect, user }: AppSidebarProps) {
  const { publicKey, connect, isConnecting } = useFreighter();
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [tierNavTick, setTierNavTick] = useState(0);
  const [tierStorageReady, setTierStorageReady] = useState(false);
  const fetchRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!publicKey || publicKey.length !== 56 || !publicKey.startsWith("G")) {
      setSelectedWidgets([]);
      return;
    }
    const local = getOnboardingData();
    setSelectedWidgets(local?.selectedWidgets ?? fallbackBusiness.selectedWidgets ?? []);
  }, [publicKey]);

  fetchRef.current = () => {
    if (!publicKey || publicKey.length !== 56 || !publicKey.startsWith("G")) return;
    const local = getOnboardingData();
    setSelectedWidgets(local?.selectedWidgets ?? fallbackBusiness.selectedWidgets ?? []);
  };

  useEffect(() => {
    const onProfileUpdated = () => fetchRef.current();
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, []);

  useEffect(() => {
    syncWorkspaceTierFromLatestTemplate();
    setTierStorageReady(true);
    const onTier = () => setTierNavTick((k) => k + 1);
    window.addEventListener(WORKSPACE_TIER_UPDATED_EVENT, onTier);
    return () => window.removeEventListener(WORKSPACE_TIER_UPDATED_EVENT, onTier);
  }, []);

  const displayUser = user ?? sidebarData.user;
  const featuresGroup = getFeaturesNavGroup(selectedWidgets);
  const tierState = useMemo(
    () => (tierStorageReady ? getWorkspaceTierState() : null),
    [tierStorageReady, tierNavTick]
  );
  const businessGroup =
    tierState?.sidebarImported === true
      ? buildBusinessTierNavGroup(workspaceSectionTitle(tierState), tierState.bundleId)
      : null;

  const navGroups = businessGroup
    ? [DASHBOARD_GROUP, businessGroup]
    : featuresGroup.items.length > 0
      ? [DASHBOARD_GROUP, featuresGroup]
      : [DASHBOARD_GROUP];

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
        <NavUser
          user={displayUser}
          onDisconnect={onDisconnect}
          onConnect={connect}
          isConnecting={isConnecting}
          isConnected={!!publicKey}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
