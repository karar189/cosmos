/** @jsxImportSource @emotion/react */
'use client';

import { TabsSectionRef } from '@/components/common/TabsSection';
import TabsSection from '@/components/common/TabsSection/TabsSection';
import { ProjectLayout } from '@/components/layouts/ProjectLayout';
import ProjectDependencySection from '@/containers/projects/ProjectDependencySection/ProjectDependencySection';
import { ProjectFinancialSection } from '@/containers/projects/ProjectFinancialSection';
import { ProjectOperationalSection } from '@/containers/projects/ProjectOperationalSection';
import { ProjectOverviewSection } from '@/containers/projects/ProjectOverviewSection';
import { ProjectProofOfOpinionSection } from '@/containers/projects/ProjectProofOfOpinionSection';
import { ProjectRegulatorySection } from '@/containers/projects/ProjectRegulatorySection';
import ProjectReputationalSection from '@/containers/projects/ProjectReputationalSection/ProjectReputationalSection';
import { ProjectSecuritySection } from '@/containers/projects/ProjectSecuritySection';
import { useTokenBasic } from '@/data/api/coinGecko.queries';
import { useProjectData, useResponsiveTabView } from '@/hooks';
import { Core3Button } from '@core3/ui-components';
import { notFound } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './page.styles';
import { ImproveScoreModal } from '@/components/projects/ProjectSidebar/ImproveScoreModal';

interface ProjectDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const tabsSectionRef = useRef<TabsSectionRef>(null);
  const [isImproveScoreModalOpen, setIsImproveScoreModalOpen] = useState(false);
  // Get project data using shared hook (same query key as ProjectLayout)
  const { data: projectData, isLoading, error, refetch } = useProjectData(id);
  const isTokenProject = projectData?.projectDetails?.hasToken ?? false;
  
  // Get current hash from URL
  const [currentHash, setCurrentHash] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1) || 'overview';
      setCurrentHash(hash);
      
      const handleHashChange = () => {
        setCurrentHash(window.location.hash.slice(1) || 'overview');
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);
  
  // Responsive tab view - shows one section at a time on mobile
  const { shouldRenderTab, isMobile } = useResponsiveTabView(currentHash, 'overview');
  const { data: tokenData, isLoading: _isTokenLoading } = useTokenBasic(
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
    {
      enabled: !!projectData?.projectDetails.coingeckoId, // Only fetch when coingecko_id exists
    }
  );

  const tabs = [
    {
      label: t('projects.details.tabs.overview', 'Overview'),
      value: 'overview',
      component: (id: string) => (
        <ProjectOverviewSection
          id={id}
          projectDetails={projectData?.projectDetails}
          isTokenProject={isTokenProject}
          tokenData={tokenData}
          probabilityOfLossCategoriesDynamic={projectData?.probabilityOfLossCategoriesDynamic}
          probabilityOfLoss={projectData?.probabilityOfLoss}
          newsFeed={projectData?.newsFeed}
          onOpenImproveScore={() => setIsImproveScoreModalOpen(true)}
        />
      ),
    },
    {
      label: t('projects.details.tabs.security', 'Security'),
      value: 'security',
      component: (id: string) => (
        <ProjectSecuritySection
          id={id}
          data={projectData?.security}
          isTokenProject={isTokenProject}
          onScrollToAudits={() => {
            tabsSectionRef.current?.scrollToSection(id);
          }}
        />
      ),
    },
    {
      label: t('projects.details.tabs.financial', 'Financial'),
      value: 'financial',
      component: (id: string) => (
        <ProjectFinancialSection
          id={id}
          data={projectData?.financial}
          isTokenProject={isTokenProject}
        />
      ),
    },
    {
      label: t('projects.details.tabs.operational', 'Operational'),
      value: 'operational',
      component: (id: string) => (
        <ProjectOperationalSection
          id={id}
          data={projectData?.operational}
          isTokenProject={isTokenProject}
        />
      ),
    },
    {
      label: t('projects.details.tabs.reputational', 'Reputational'),
      value: 'reputational',
      component: (id: string) => (
        <ProjectReputationalSection id={id} data={projectData?.reputational} />
      ),
    },
    {
      label: t('projects.details.tabs.regulatory', 'Regulatory'),
      value: 'regulatory',
      component: (id: string) => (
        <ProjectRegulatorySection id={id} data={projectData?.regulatory} />
      ),
    },
    {
      label: t('projects.details.tabs.dependency', 'Dependency'),
      value: 'dependency',
      component: (id: string) => (
        <ProjectDependencySection id={id} data={projectData?.dependency} />
      ),
    },
    {
      label: t('projects.details.tabs.proofOfOpinion', 'Proof of Opinion'),
      value: 'proofOfOpinion',
      component: (id: string) => (
        <ProjectProofOfOpinionSection id={id} data={projectData?.proofOfOpinion} />
      ),
    },
  ];

  useEffect(() => {
    if (!isLoading && !isMobile) {
      tabsSectionRef.current?.scrollToCurrentSection();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isMobile]);

  if (!isLoading && !projectData) {
    return notFound();
  }

  return (
    <ProjectLayout 
      isLoading={isLoading} 
      projectData={projectData} 
      error={error} 
      refetch={refetch}
      onOpenImproveScore={() => setIsImproveScoreModalOpen(true)}
    >
      <div css={styles.stickyTabsContainer}>
        <TabsSection data={tabs} />
      </div>
      <div css={styles.tabsContent}>
        {tabs.map((tab) => 
          shouldRenderTab(tab.value) ? (
            <div key={tab.value} id={tab.value}>{tab.component(tab.value)}</div>
          ) : (
            <div key={tab.value} id={tab.value} css={styles.hiddenSection} aria-hidden="true" />
          )
        )}
      </div>

      <div css={styles.improveScoreContainer}>
        <p css={styles.improveScoreText}>
          {t('projects.details.improveScore.title', 'Do you own this project?')}
        </p>
        <Core3Button 
          size="small" 
          variant="inverse" 
          css={styles.improveScoreButton}
          onClick={() => setIsImproveScoreModalOpen(true)}
        >
          {t('projects.details.improveScore.button', 'Improve score')}
        </Core3Button>
      </div>

      <ImproveScoreModal 
        open={isImproveScoreModalOpen} 
        onClose={() => setIsImproveScoreModalOpen(false)} 
        projectName={projectData?.projectDetails?.name ?? ''} 
      />
    </ProjectLayout>
  );
}
