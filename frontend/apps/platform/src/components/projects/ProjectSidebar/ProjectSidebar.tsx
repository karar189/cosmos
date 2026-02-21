/** @jsxImportSource @emotion/react */
'use client';

import { useTokenBasic, useTokenChart } from '@/data/api/coinGecko.queries';
import { ChartDataPoint } from '@/data/api/types/coin_gecko/coin_historical';
import useTranslation from '@/hooks/useTranslation';
import { ProjectApiResponse } from '@/types/api/project';
import { Sidebar, Card, Icon } from '@core3/ui-components';
import { useEffect, useState } from 'react';
import { BadgesRowCard, PricePerformanceCard } from '@/components/common/Sidebar';
import {
  aboutLabelsList,
  buildAboutProjectRows,
  buildDisclosuresRows,
  disclosureLabelsList,
} from './projectSidebar.utils';
import * as styles from './ProjectSidebar.styles';

export interface ProjectSidebarProps {
  data: ProjectApiResponse;
}

const LAUNCH_READINESS_ITEMS = [
  { key: 'contract', labelKey: 'sidebar.launchReadiness.contract', label: 'Smart contract deployed', done: true },
  { key: 'kyc', labelKey: 'sidebar.launchReadiness.kyc', label: 'KYC module active', done: true },
  { key: 'registration', labelKey: 'sidebar.launchReadiness.registration', label: 'Regulatory registration pending', done: false },
  { key: 'routing', labelKey: 'sidebar.launchReadiness.routing', label: 'Routing corridor configured', done: true },
];

export default function ProjectSidebar({ data }: ProjectSidebarProps) {
  const { t } = useTranslation(['sidebar', 'common']);
  const [period, setPeriod] = useState({ label: '7d', value: '7' });
  const [highLowData, setHighLowData] = useState<{ low: number; high: number }>({ low: 0, high: 0 });

  const { projectDetails } = data;
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
    { enabled: !!projectDetails?.coingeckoId }
  );
  const { data: priceHistoryData } = useTokenChart(
    { id: projectDetails?.coingeckoId || '', vs_currency: 'usd', days: period.value },
    { enabled: !!projectDetails?.coingeckoId }
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
  const aboutRows = buildAboutProjectRows(projectDetails, aboutLabels);
  const disclosuresRows = buildDisclosuresRows(projectDetails, disclosuresLabels);

  useEffect(() => {
    const getHighLow = (d: ChartDataPoint[]) => {
      if (!d?.length) return { low: 0, high: 0 };
      return { low: Math.min(...d.map((p) => p.price)), high: Math.max(...d.map((p) => p.price)) };
    };
    if (priceHistoryData?.data) setHighLowData(getHighLow(priceHistoryData.data));
  }, [priceHistoryData]);

  return (
    <Sidebar
      title={t('title.launchReadiness', 'Launch Readiness')}
      tooltip={t('title.launchReadinessTooltip', 'Operational status — not a risk score')}
    >
      <Card title={t('sections.launchReadinessTitle', 'Launch Readiness')}>
        <ul css={styles.launchReadinessList}>
          {LAUNCH_READINESS_ITEMS.map((item) => (
            <li key={item.key} css={styles.launchReadinessItem}>
              {item.done ? (
                <Icon name="check-circle" css={styles.launchReadinessIconDone} />
              ) : (
                <Icon name="negative-circle" css={styles.launchReadinessIconPending} />
              )}
              <span>{t(item.labelKey, item.label)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {!isTokenLoading && tokenData && (
        <PricePerformanceCard
          priceData={tokenData}
          highLowData={highLowData}
          period={period}
          setPeriod={setPeriod}
        />
      )}

      <BadgesRowCard
        title={`${t('sections.aboutTitle', 'About')} ${projectDetails.name}`}
        description={projectDetails.description}
        rows={aboutRows}
      />

      {disclosuresRows.length > 0 && (
        <BadgesRowCard title={t('sections.disclosuresTitle', 'Disclosures')} rows={disclosuresRows} />
      )}
    </Sidebar>
  );
}
