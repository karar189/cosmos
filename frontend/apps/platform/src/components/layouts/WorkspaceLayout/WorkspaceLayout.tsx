/** @jsxImportSource @emotion/react */
'use client';

import PlatformLayout from '@/components/layouts/PlatformLayout';
import { HeaderProps, Icon, DataBlock } from '@core3/ui-components';
import { WorkspaceSidebar } from '@/components/workspaces/WorkspaceSidebar';
import { ROUTES } from '@/constants/routes';
import { useAccountType, useWorkspaceContent } from '@/hooks';
import useTranslation from '@/hooks/useTranslation';
import * as styles from './WorkspaceLayout.styles';

/**
 * WorkspaceLayout - Layout component for workspace pages
 * 
 * Provides a layout with sidebar navigation and header/footer via PlatformLayout.
 * Renders child pages in the main content area.
 * 
 * Features:
 * - Header and Footer via PlatformLayout (which uses Layout component)
 * - Sidebar navigation
 * - Main content area that renders child routes
 * - Responsive grid structure
 */
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Connect Wallet CTA: secondary style, no pulsing animation, no modal on click (wallet SDK to be added later)
  const headerProps: Partial<HeaderProps> = {
    ctaText: "Connect Wallet",
    ctaVariant: "secondary",
    ctaAnimated: false,
    onCtaClick: () => {}, // No modal; wallet SDK will be wired later
    menuItems: [
      { name: 'WORKSPACE', href: ROUTES.WORKSPACE.ROOT, active: true },
      { name: 'PROJECT RATINGS', href: ROUTES.RATINGS.PROJECTS },
      { name: 'EXCHANGE RATINGS', href: ROUTES.RATINGS.EXCHANGES },
      { name: 'MORE', href: '/more' },
    ],
  };

  return (
    <PlatformLayout headerProps={headerProps}>
      <div css={styles.workspaceContainer}>
        <div css={styles.workspaceGrid}>
          <aside>
            <WorkspaceSidebar />
          </aside>
          
          <main css={styles.mainContent}>
            {children}
          </main>
        </div>
      </div>
    </PlatformLayout>
  );
}

