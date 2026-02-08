/** @jsxImportSource @emotion/react */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@core3/ui-components';
import type { IconName } from '@core3/ui-components';
import { ROUTES } from '@/constants/routes';
import useTranslation from '@/hooks/useTranslation';
import { loadDashboards, type SavedDashboard } from '@/utils/dashboardWorkspace.storage';
import * as styles from './WorkspaceSidebar.styles';

interface NavItem {
  labelKey: string;
  href: string;
  icon?: string;
  disabled?: boolean;
}

// Main navigation items - ArcX Features (Agentic Builder merged into Compliance Maker)
const mainNavItems: Omit<NavItem, 'labelKey'>[] = [
  { href: ROUTES.WORKSPACE.COMPLIANCE_MAKER, icon: 'security', disabled: false },
  { href: ROUTES.WORKSPACE.ROUTING_ENGINE, icon: 'data-transfer', disabled: false },
  { href: ROUTES.WORKSPACE.DASHBOARD_WORKSPACE, icon: 'data-stack', disabled: false },
  { href: ROUTES.WORKSPACE.PORTFOLIO, icon: 'lock', disabled: true },
  { href: ROUTES.WORKSPACE.ALERTS, icon: 'lock', disabled: true },
  { href: ROUTES.WORKSPACE.CASES, icon: 'lock', disabled: true },
];

const mainNavKeys = [
  'workspace.sidebar.main.complianceMaker',
  'workspace.sidebar.main.routingEngine',
  'workspace.sidebar.main.dashboardBuilder',
  'workspace.sidebar.main.portfolio',
  'workspace.sidebar.main.alerts',
  'workspace.sidebar.main.cases',
];

// Bottom utility items (all disabled for now)
const utilityItems: Omit<NavItem, 'labelKey'>[] = [
  { href: ROUTES.WORKSPACE.SETTINGS, icon: 'settings', disabled: true },
  { href: ROUTES.WORKSPACE.DOCS, icon: 'documentation', disabled: true },
  { href: ROUTES.WORKSPACE.SUPPORT, icon: 'support', disabled: true },
];

const utilityKeys = [
  'workspace.sidebar.utility.workspaceSettings',
  'workspace.sidebar.utility.documentation',
  'workspace.sidebar.utility.support',
];

export default function WorkspaceSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation('workspace');
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);

  useEffect(() => {
    const refresh = () => setDashboards(loadDashboards());
    refresh();

    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cosmops_my_dashboards') refresh();
    };

    window.addEventListener('cosmops_my_dashboards_updated', onCustom as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('cosmops_my_dashboards_updated', onCustom as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const renderNavItem = (item: Omit<NavItem, 'labelKey'>, labelKey: string, isUtility = false) => {
    const isActive = !item.disabled && (pathname === item.href || pathname.startsWith(item.href + '/'));
    
    const content = (
      <div css={styles.sidebarItem}>
        {item.icon && (
          <Icon name={item.icon as IconName} css={isUtility ? styles.sidebarItemIconUtility : styles.sidebarItemIcon} />
        )}
        <span css={isUtility ? styles.sidebarItemTextUtility : styles.sidebarItemText}>
          {t(labelKey, '')}
        </span>
      </div>
    );

    if (item.disabled) {
      return (
        <div key={item.href} css={styles.sidebarItemWrapper}>
          {content}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        css={[styles.sidebarItemWrapper, isActive && styles.sidebarItemActive]}
      >
        {content}
      </Link>
    );
  };

  return (
    <nav css={styles.sidebar}>
      <div css={styles.sidebarMainSection}>
        {mainNavItems.map((item, index) => renderNavItem(item, mainNavKeys[index], false))}
      </div>

      {/* My Dashboards (dynamic, localStorage-backed) */}
      <div css={styles.sidebarDashboardsSection}>
        <div css={styles.sectionHeaderRow}>
          <p css={styles.sectionTitle}>{t('workspace.sidebar.main.myDashboards', 'My Dashboards')}</p>
          <Link href={ROUTES.WORKSPACE.MY_DASHBOARDS} css={styles.viewAllLink}>
            View all
          </Link>
        </div>
        {(dashboards || []).slice(0, 6).map((d) => {
          const href = `/dashboard-workspace?dashboardId=${encodeURIComponent(d.id)}`;
          const isActive = pathname === '/dashboard-workspace';
          return (
            <Link
              key={d.id}
              href={href}
              css={[styles.dashboardItemWrapper, isActive && styles.sidebarItemActive]}
              title={d.name}
            >
              <div css={styles.sidebarItem}>
                <Icon name={'data-stack' as IconName} css={styles.sidebarItemIcon} />
                <span css={styles.dashboardItemText}>{d.name}</span>
              </div>
            </Link>
          );
        })}
        {(!dashboards || dashboards.length === 0) && (
          <div css={styles.sidebarItemWrapper}>
            <div css={styles.sidebarItem}>
              <Icon name={'data-stack' as IconName} css={styles.sidebarItemIcon} />
              <span css={styles.sidebarItemText}>No dashboards yet</span>
            </div>
          </div>
        )}
      </div>
      
      <div css={styles.sidebarUtilitySection}>
        {utilityItems.map((item, index) => renderNavItem(item, utilityKeys[index], true))}
      </div>
    </nav>
  );
}
