/** @jsxImportSource @emotion/react */
'use client';

import PlatformLayout from '@/components/layouts/PlatformLayout';
import ExchangeSidebar from '@/components/exchanges/ExchangeSidebar/ExchangeSidebar';
import { ROUTES } from '@/constants/routes';
import useTranslation from '@/hooks/useTranslation';
import { ExchangeApiResponse } from '@/types/api/exchange';
import { ExchangeHeaderData } from '@/types/exchange-layout';
import { Core3Button } from '@core3/ui-components';
import { motion, MotionConfig } from 'motion/react';
import { useRouter } from 'next/navigation';
import ExchangeHeader from './ExchangeHeader';
import * as styles from './ExchangeLayout.styles';

const MotionDiv = motion.div;

export interface ExchangeLayoutProps {
  /**
   * Loading state
   */
  isLoading: boolean;
  /**
   * Project data
   */
  exchangeData?: ExchangeApiResponse;
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
export default function ExchangeLayout({
  isLoading,
  exchangeData,
  error,
  refetch,
  children,
}: ExchangeLayoutProps) {
  const { t } = useTranslation(['exchanges']);
  const router = useRouter();

  // Transform exchange data to header format
  const headerData: ExchangeHeaderData | null = exchangeData
    ? {
        id: exchangeData.exchangeDetails.id,
        name: exchangeData.exchangeDetails.name,
        icon: exchangeData.exchangeDetails.logo,
        rank: exchangeData.exchangeDetails.rank ?? 0,
        certification: exchangeData.exchangeDetails.certification.level || '',
      }
    : null;

  // Loading state
  if (isLoading) {
    return (
      <PlatformLayout page="exchange">
        <div css={styles.loadingContainer}>
          <div
            css={styles.loadingSpinner}
            role="status"
            aria-label={t('layout.loading', 'Loading exchange details...')}
          />
          <p css={styles.loadingText}>{t('layout.loading', 'Loading exchange details...')}</p>
        </div>
      </PlatformLayout>
    );
  }

  // Error state
  if (error || !exchangeData || !headerData) {
    return (
      <PlatformLayout page="exchange">
        <div css={styles.errorContainer}>
          <h1 css={styles.errorTitle}>{t('layout.error.title', 'Unable to Load Exchange')}</h1>
          <p css={styles.errorMessage}>
            {error instanceof Error
              ? error.message
              : t(
                  'layout.error.message',
                  "We couldn't load the exchange details. Please try again."
                )}
          </p>
          <div css={styles.errorActions}>
            <Core3Button onClick={() => refetch()}>{t('layout.error.retry', 'Retry')}</Core3Button>
              <Core3Button variant="secondary" onClick={() => router.push(ROUTES.RATINGS.EXCHANGES)}>
              {t('layout.backToExchanges', 'Back to Exchange Ratings')}
            </Core3Button>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  // Success state - render layout with two columns from start
  return (
    <PlatformLayout page="exchange">
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
            <ExchangeHeader data={headerData} />

            {/* Content Area */}
            <div css={styles.contentArea}>
              <div css={styles.mainContent}>{children}</div>
            </div>
          </MotionDiv>

          {/* Right Column: Sticky Sidebar */}
          <aside css={styles.sidebarColumn}>
            <ExchangeSidebar data={exchangeData} />
          </aside>
        </div>
      </MotionConfig>
    </PlatformLayout>
  );
}
