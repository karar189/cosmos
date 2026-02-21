/** @jsxImportSource @emotion/react */
'use client';

import { PlatformLayout, ProjectRatingsTable } from '@/components';
import { useProjectsStatistic, useProjectsWithMarketData } from '@/hooks';
import { ThemeRegistry } from '@core3/ui-components';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import * as styles from './page.styles';
import { useMemo } from 'react';

const MotionDiv = motion.div;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

export default function ProjectRatingsPage() {
  const { t } = useTranslation(['regulatory']);
  const { data: projectsStatisticData, isLoading, error, refetch } = useProjectsStatistic();
  
  const projectsRatings = useMemo(
    () => projectsStatisticData?.projectsList?.list ?? [],
    [projectsStatisticData?.projectsList?.list]
  );
  
  // Use custom hook to merge projects with market data
  const { mergedProjectRatings } = useProjectsWithMarketData(projectsRatings);
  
  return (
    <ThemeRegistry>
      <PlatformLayout
        variant="with-title"
        isLoading={isLoading}
        loadingText={t('regulatory.projects.loading', 'Loading projects...')}
        headerProps={{
          // searchComponent is provided by PlatformLayout with proper onOpenSearch callback
        }}
        error={error}
        refetch={refetch}
        activeMenuItem="/ratings/projects"
      >
        <div css={styles.container}>
          <MotionDiv
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            css={styles.contentWrapper}
          >
            <ProjectRatingsTable data={mergedProjectRatings} />
          </MotionDiv>
        </div>
      </PlatformLayout>
    </ThemeRegistry>
  );
}
