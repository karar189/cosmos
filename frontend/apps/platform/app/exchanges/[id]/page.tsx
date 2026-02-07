/** @jsxImportSource @emotion/react */
'use client';

import { TabsSection } from '@/components/common/TabsSection';
import { TabsSectionRef } from '@/components/common/TabsSection/TabsSection';
import { ExchangeLayout } from '@/components/layouts/ExchangeLayout';
import ExchangeListedAssetsSection from '@/containers/exchanges/ExchangeListedAssetsSection';
import { ExchangeOverviewSection } from '@/containers/exchanges/ExchangeOverviewSection';
import ExchangeSecuritySection from '@/containers/exchanges/ExchangeSecuritySection';
import ExchangeSolvencySection from '@/containers/exchanges/ExchangeSolvencySection';
import ExchangeTransparencySection from '@/containers/exchanges/ExchangeTransparencySection';
import { useExchangeData } from '@/hooks/useExchangeData';
import { useResponsiveTabView } from '@/hooks';
import { notFound } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './page.styles';

interface ExchangeDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ExchangeDetailsPage({ params }: ExchangeDetailsPageProps) {
  const { id } = use(params);
  const { t } = useTranslation(['exchanges']);
  const tabsSectionRef = useRef<TabsSectionRef>(null);
  // Get exchange data using shared hook (same query key as ExchangeLayout)
  const { data: exchangeData, isLoading, error, refetch } = useExchangeData(id);
  
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

  const tabs = [
    {
      label: t('exchanges.details.tabs.overview', 'Overview'),
      value: 'overview',
      component: (id: string) => (
        <ExchangeOverviewSection
          id={id}
          data={exchangeData}
          securityData={exchangeData?.exchangeDetails.security}
          newsFeed={exchangeData?.exchangeDetails.newsFeed}
        />
      ),
    },
    {
      label: t('exchanges.details.tabs.security', 'Security'),
      value: 'security',
      component: (id: string) => <ExchangeSecuritySection id={id} data={exchangeData?.security} />,
    },
    {
      label: t('exchanges.details.tabs.solvency', 'Solvency'),
      value: 'solvency',
      component: (id: string) => <ExchangeSolvencySection id={id} data={exchangeData?.solvency} />,
    },
    {
      label: t('exchanges.details.tabs.transparency', 'Transparency'),
      value: 'transparency',
      component: (id: string) => (
        <ExchangeTransparencySection id={id} data={exchangeData?.transparency} />
      ),
    },
    {
      label: t('exchanges.details.tabs.listedAssets', 'Listed Assets'),
      value: 'listedAssets',
      component: (id: string) => (
        <ExchangeListedAssetsSection id={id} data={exchangeData?.listedAssets} />
      ),
    },
  ];

  useEffect(() => {
    if (!isLoading && !isMobile) {
      tabsSectionRef.current?.scrollToCurrentSection();
    }
  }, [isLoading, isMobile]);

  if (!isLoading && !exchangeData) {
    return notFound();
  }

  return (
    <ExchangeLayout
      isLoading={isLoading}
      exchangeData={exchangeData}
      error={error}
      refetch={refetch}
    >
      <div css={styles.stickyTabsContainer}>
        <TabsSection ref={tabsSectionRef} data={tabs} />
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
    </ExchangeLayout>
  );
}
