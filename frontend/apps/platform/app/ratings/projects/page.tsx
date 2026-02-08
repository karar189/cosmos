/** @jsxImportSource @emotion/react */
'use client';

import { PlatformLayout, ProjectRatingsTable } from '@/components';
import { ProjectPolChart } from '@/components/projects/ProjectPolChart';
import ProjectsPolCard from '@/components/projects/ProjectsPolCard/ProjectsPolCard';
import { useProjectsStatistic, useProjectsWithMarketData } from '@/hooks';
import { Card, DataProgressList, ThemeRegistry } from '@core3/ui-components';
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
  const { t } = useTranslation(['ratings']);
  const { data: projectsStatisticData, isLoading, error, refetch } = useProjectsStatistic();
  
  const topPolGainers = projectsStatisticData?.topPolGainers;
  const topPolLosers = projectsStatisticData?.topPolLosers;
  const mostCommonIssues =
  projectsStatisticData?.mostCommonIssues?.map((issue) => ({
    label: issue.name,
    value: issue.projectsCount,
  })) ?? [];
  const probabilityOfLossDynamic = projectsStatisticData?.probabilityOfLossDynamic;
  
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
        loadingText={t('projects.loading', 'Loading projects...')}
        headerProps={{
          // searchComponent is provided by PlatformLayout with proper onOpenSearch callback
        }}
        error={error}
        refetch={refetch}
        titleSectionContent={
          <>
            <div css={styles.listWrapper}>
              <ProjectsPolCard
                title={t('ratings.projects.topPolGainers.title', 'Top PoL Gainers')}
                icon="arrow-up-right"
                data={topPolGainers}
              />
              <ProjectsPolCard
                title={t('ratings.projects.topPolLosers.title', 'Top PoL Losers')}
                icon="arrow-down-right"
                data={topPolLosers}
              />
              <Card
                icon="warning-hexagon"
                titleType="secondary"
                title={t('ratings.projects.mostCommonIssues.title', 'Most Common Issues')}
              >
                <DataProgressList items={mostCommonIssues} />
              </Card>
              <Card
                icon="activity"
                titleType="secondary"
                title={t('ratings.projects.polDynamic', 'PoL Dynamic')}
                tooltip={t('ratings.projects.polDynamicTooltip', 'PoL Dynamic Tooltip')}
              >
                <ProjectPolChart data={probabilityOfLossDynamic} />
              </Card>
            </div>
          </>
        }
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
