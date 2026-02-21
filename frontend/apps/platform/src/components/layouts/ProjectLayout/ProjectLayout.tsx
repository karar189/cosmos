/** @jsxImportSource @emotion/react */
'use client';

import PlatformLayout from '@/components/layouts/PlatformLayout';
import ProjectSidebar from '@/components/projects/ProjectSidebar/ProjectSidebar';
import { ROUTES } from '@/constants/routes';
import useTranslation from '@/hooks/useTranslation';
import { ProjectApiResponse } from '@/types/api/project';
import { ProjectHeaderData } from '@/types/project-layout';
import { Core3Button } from '@core3/ui-components';
import { motion, MotionConfig } from 'motion/react';
import { useRouter } from 'next/navigation';
import ProjectHeader from './ProjectHeader';
import * as styles from './ProjectLayout.styles';

const MotionDiv = motion.div;

export interface ProjectLayoutProps {
  /**
   * Loading state
   */
  isLoading: boolean;
  /**
   * Project data
   */
  projectData?: ProjectApiResponse;
  /**
   * Error state
   */
  error?: Error | null;
  /**
   * Refetch function
   */
  refetch: () => void;
  /**
   * Content to render in the main area (tabs and tab panels)
   */
  children: React.ReactNode;
  /**
   * (Removed) Improve Score CTA flow
   */
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

/**
 * ProjectLayout Component
 *
 * Main layout component for project detail pages. Fetches project data,
 * displays header with navigation, sidebar, and main content area.
 *
 * Features:
 * - Data fetching with TanStack React Query
 * - Loading and error states
 * - Responsive grid layout (sidebar right on desktop, stacked on mobile)
 * - Framer motion animations
 * - Back navigation with state restoration
 *
 * @example
 * ```tsx
 * <ProjectLayout projectId="uniswap">
 *   <Tabs>...</Tabs>
 *   <TabPanel>...</TabPanel>
 * </ProjectLayout>
 * ```
 */
export default function ProjectLayout({
  isLoading,
  projectData,
  error,
  refetch,
  children,
}: ProjectLayoutProps) {
  const { t } = useTranslation(['projects']);
  const router = useRouter();

  // Transform project data to header format
  const headerData: ProjectHeaderData | null = projectData
    ? {
        id: projectData.projectDetails.id,
        name: projectData.projectDetails.name,
        ticker: projectData.projectDetails.ticker,
        icon: projectData.projectDetails.logo,
        rank: projectData.projectDetails.rank ?? 0,
        certification: projectData.projectDetails.certification?.level || '',
        launchStage: 'Live',
        regulatoryTier: 'Tier 2 (Informational)',
      }
    : null;

  // Loading state
  if (isLoading) {
    return (
      <PlatformLayout>
        <div css={styles.loadingContainer}>
          <div
            css={styles.loadingSpinner}
            role="status"
            aria-label={t('layout.loading', 'Loading project details...')}
          />
          <p css={styles.loadingText}>{t('layout.loading', 'Loading project details...')}</p>
        </div>
      </PlatformLayout>
    );
  }

  // Error state
  if (error || !projectData || !headerData) {
    return (
      <PlatformLayout>
        <div css={styles.errorContainer}>
          <h1 css={styles.errorTitle}>{t('layout.error.title', 'Unable to Load Project')}</h1>
          <p css={styles.errorMessage}>
            {error instanceof Error
              ? error.message
              : t(
                  'layout.error.message',
                  "We couldn't load the project details. Please try again."
                )}
          </p>
          <div css={styles.errorActions}>
            <Core3Button onClick={() => refetch()}>{t('layout.error.retry', 'Retry')}</Core3Button>
            <Core3Button variant="secondary" onClick={() => router.push(ROUTES.RATINGS.PROJECTS)}>
              {t('layout.backToProjects', 'Back to Project Ratings')}
            </Core3Button>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  // Success state - render layout with two columns from start
  return (
    <PlatformLayout>
      {/* Respect user's motion preferences */}
      <MotionConfig reducedMotion="user">
        {/* Two Column Layout starts here (below platform header) */}
        <div css={styles.contentRow}>
          {/* Left Column: ProjectHeader + Content */}
          <MotionDiv
            css={styles.leftColumn}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Project Header */}
            <ProjectHeader data={headerData} />

            {/* Content Area */}
            <div css={styles.contentArea}>
              <div css={styles.mainContent}>{children}</div>
            </div>
          </MotionDiv>

          {/* Right Column: Sticky Sidebar */}
          <aside css={styles.sidebarColumn}>
            <ProjectSidebar data={projectData} />
          </aside>
        </div>
      </MotionConfig>
    </PlatformLayout>
  );
}
