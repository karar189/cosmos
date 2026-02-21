/** @jsxImportSource @emotion/react */
'use client';

import { TabsSectionRef } from '@/components/common/TabsSection';
import TabsSection from '@/components/common/TabsSection/TabsSection';
import { ProjectLayout } from '@/components/layouts/ProjectLayout';
import { ProjectOverviewSection } from '@/containers/projects/ProjectOverviewSection';
import ProjectRegulatoryPathSection from '@/containers/projects/ProjectRegulatoryPathSection';
import ProjectComplianceBuilderSection from '@/containers/projects/ProjectComplianceBuilderSection';
import ProjectRoutingSection from '@/containers/projects/ProjectRoutingSection';
import ProjectRegistrySection from '@/containers/projects/ProjectRegistrySection';
import ProjectReportsSection from '@/containers/projects/ProjectReportsSection';
import { useTokenBasic } from '@/data/api/coinGecko.queries';
import { useProjectData, useResponsiveTabView } from '@/hooks';
import { notFound } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './page.styles';

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const tabsSectionRef = useRef<TabsSectionRef>(null);
  const { data: projectData, isLoading, error, refetch } = useProjectData(id);
  const isTokenProject = projectData?.projectDetails?.hasToken ?? false;
  const [currentHash, setCurrentHash] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1) || 'overview';
      setCurrentHash(hash);
      const handleHashChange = () => setCurrentHash(window.location.hash.slice(1) || 'overview');
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const { shouldRenderTab, isMobile } = useResponsiveTabView(currentHash, 'overview');
  const { data: tokenData } = useTokenBasic(
    projectData?.projectDetails.coingeckoId || '',
    {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
      dax_pair_format: 'symbol',
    },
    { enabled: !!projectData?.projectDetails.coingeckoId }
  );

  const tabs = [
    {
      label: t('projects.details.tabs.overview', 'Overview'),
      value: 'overview',
      component: (tabId: string) => (
        <ProjectOverviewSection
          id={tabId}
          projectDetails={projectData?.projectDetails}
          isTokenProject={isTokenProject}
          tokenData={tokenData}
        />
      ),
    },
    {
      label: t('projects.details.tabs.cosmos.regulatoryPath', 'Regulatory Path'),
      value: 'regulatoryPath',
      component: (tabId: string) => <ProjectRegulatoryPathSection id={tabId} />,
    },
    {
      label: t('projects.details.tabs.cosmos.complianceBuilder', 'Compliance Builder'),
      value: 'complianceBuilder',
      component: (tabId: string) => <ProjectComplianceBuilderSection id={tabId} />,
    },
    {
      label: t('projects.details.tabs.cosmos.routing', 'Routing'),
      value: 'routing',
      component: (tabId: string) => <ProjectRoutingSection id={tabId} />,
    },
    {
      label: t('projects.details.tabs.cosmos.registry', 'Registry'),
      value: 'registry',
      component: (tabId: string) => <ProjectRegistrySection id={tabId} />,
    },
    {
      label: t('projects.details.tabs.cosmos.reports', 'Reports'),
      value: 'reports',
      component: (tabId: string) => <ProjectReportsSection id={tabId} />,
    },
  ];

  useEffect(() => {
    if (!isLoading && !isMobile) tabsSectionRef.current?.scrollToCurrentSection?.();
  }, [isLoading, isMobile]);

  if (!isLoading && !projectData) return notFound();

  return (
    <ProjectLayout isLoading={isLoading} projectData={projectData} error={error} refetch={refetch}>
      <div css={styles.stickyTabsContainer}>
        <TabsSection data={tabs} />
      </div>
      <div css={styles.tabsContent}>
        {tabs.map((tab) =>
          shouldRenderTab(tab.value) ? (
            <div key={tab.value} id={tab.value}>
              {tab.component(tab.value)}
            </div>
          ) : (
            <div key={tab.value} id={tab.value} css={styles.hiddenSection} aria-hidden="true" />
          )
        )}
      </div>
    </ProjectLayout>
  );
}
