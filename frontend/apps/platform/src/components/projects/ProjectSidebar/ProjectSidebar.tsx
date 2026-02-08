/** @jsxImportSource @emotion/react */
'use client';

import { useTokenBasic, useTokenChart } from '@/data/api/coinGecko.queries';
import { ChartDataPoint } from '@/data/api/types/coin_gecko/coin_historical';
import useTranslation from '@/hooks/useTranslation';
import { ProjectApiResponse } from '@/types/api/project';
import { Sidebar } from '@core3/ui-components';
import { useEffect, useState } from 'react';
import { BadgesRowCard, PricePerformanceCard, RiskChangesCard, ScoreCard } from '@/components/common/Sidebar';
import {
  aboutLabelsList,
  buildAboutProjectRows,
  buildDisclosuresRows,
  disclosureLabelsList,
} from './projectSidebar.utils';

export interface ProjectSidebarProps {
  /**
   * Complete API response data
   */
  data: ProjectApiResponse;
  /**
   * (Removed) Improve Score CTA flow
   */
}

export default function ProjectSidebar({ data }: ProjectSidebarProps) {
  const { t } = useTranslation(['sidebar', 'common']);
  const [period, setPeriod] = useState({ label: '7d', value: '7' });
  const [highLowData, setHighLowData] = useState<{ low: number; high: number }>({
    low: 0,
    high: 0,
  });

  const { projectDetails, probabilityOfLoss, newsFeed } = data;
  const { data: tokenData, isLoading: isTokenLoading } = useTokenBasic(
    projectDetails?.coingeckoId || '',
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
      enabled: !!projectDetails?.coingeckoId, // Only fetch when symbol exists
    }
  );
  const { data: priceHistoryData, isLoading: _isPriceHistoryLoading } = useTokenChart(
    {
      id: projectDetails?.coingeckoId || '',
      vs_currency: 'usd',
      days: period.value,
    },
    {
      enabled: !!projectDetails?.coingeckoId,
    }
  );

  const aboutLabels: aboutLabelsList = {
    chains: t('labels.chains', 'Chains'),
    category: t('labels.category', 'Category'),
    tags: t('labels.tags', 'Tags'),
    launchedAt: t('labels.launchedAt', 'Launched At'),
    website: t('labels.website', 'Website'),
    socials: t('labels.socials', 'Socials'),
    ucid: t('labels.ucid', 'UCID'),
  };
  const disclosuresLabels: disclosureLabelsList = {
    whitepaper: t('labels.whitepaper', 'Whitepaper'),
    legal: t('labels.legal', 'Legal'),
    audits: t('labels.audits', 'Audits'),
  };
  // Build rows for BadgesRowCard components
  const aboutRows = buildAboutProjectRows(projectDetails, aboutLabels);
  const disclosuresRows = buildDisclosuresRows(projectDetails, disclosuresLabels);

  useEffect(() => {
    const getHighLow = (data: ChartDataPoint[]) => {
      if (!data || data.length === 0) return { low: 0, high: 0 };
      const high = Math.max(...data.map((point) => point.price));
      const low = Math.min(...data.map((point) => point.price));
      return { low, high };
    };
    if (priceHistoryData && priceHistoryData.data) {
      const highLow = getHighLow(priceHistoryData.data);
      setHighLowData(highLow);
    }
  }, [priceHistoryData]);

  return (
    <Sidebar
      title={t('title.project', 'Probability of Loss')}
      tooltip={t('title.projectTooltip', 'Probability of Loss tooltip')}
    >
      {/* Project Score Card with Gauge, Data Coverage, Risk Metrics, and Chart */}
      <ScoreCard
        data={probabilityOfLoss}
      />

      {/* Risk Changes with Top Risks / Recent Changes tabs */}
      <RiskChangesCard data={newsFeed} />

      {/* Price Performance (optional) */}
      {!isTokenLoading && tokenData && (
        <PricePerformanceCard
          priceData={tokenData}
          highLowData={highLowData}
          period={period}
          setPeriod={setPeriod}
        />
      )}

      {/* About Project */}
      <BadgesRowCard
        title={`${t('sections.aboutTitle', 'About')} ${projectDetails.name}`}
        description={projectDetails.description}
        rows={aboutRows}
      />

      {/* Disclosures - only show if there are items */}
      {disclosuresRows.length > 0 && (
        <BadgesRowCard title={t('sections.disclosuresTitle', 'Disclosures')} rows={disclosuresRows} />
      )}
    </Sidebar>
  );
}
