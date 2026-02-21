/** @jsxImportSource @emotion/react */
'use client';

import { TokenPriceData } from '@/data/api/types/coin_gecko/coin_details';
import { ProjectDetails } from '@/types/api/project';
import { formatAmount, formatPercentage } from '@/utils/format';
import { Card, DataValue, DataValueProps, Section } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import { ProjectOverviewPriceChart } from '.';
import * as styles from './ProjectOverviewSection.styles';

interface ProjectOverviewSectionProps {
  id: string;
  projectDetails?: ProjectDetails;
  tokenData?: TokenPriceData;
  isTokenProject: boolean;
}

/** COSMOS: Asset Overview + operational data only. No scores, no PoL, no risk metrics. */
const ProjectOverviewSection: React.FC<ProjectOverviewSectionProps> = ({
  id,
  projectDetails,
  tokenData,
  isTokenProject,
}) => {
  const { t } = useTranslation(['projects', 'common']);
  const statusStyle = (value: number) =>
    value > 0 ? { positive: true } : value < 0 ? { negative: true } : undefined;

  const isTokenProjectWithTokenData = isTokenProject && !!tokenData;
  const priceFormatted = isTokenProjectWithTokenData
    ? formatAmount(tokenData?.current_price ?? 0, { prefix: '$', decimalPlaces: 2 })
    : t('common:nA', 'N/A');
  const priceChangeFormatted = formatPercentage(tokenData?.price_change_percentage_24h ?? 0);
  const priceSubvalue: DataValueProps['subvalue'] = isTokenProject
    ? tokenData
      ? { value: priceChangeFormatted, ...statusStyle(tokenData?.price_change_percentage_24h ?? 0) }
      : undefined
    : { value: t('projects:details.overview.noToken.description', 'No token yet'), type: 'secondary' };

  const marketCapFormatted = isTokenProjectWithTokenData
    ? formatAmount(tokenData?.market_cap ?? 0, { compact: true, prefix: '$', decimalPlaces: 2 })
    : t('common:nA', 'N/A');

  const getProjectAge = () => {
    if (!projectDetails?.launchedAt)
      return { value: t('common:nA', 'N/A'), unit: '' as string };
    const launchDate = new Date(projectDetails.launchedAt);
    const now = new Date();
    const yearsDiff = now.getFullYear() - launchDate.getFullYear();
    const monthsDiff =
      (now.getFullYear() - launchDate.getFullYear()) * 12 + (now.getMonth() - launchDate.getMonth());
    if (monthsDiff < 12) {
      const months = Math.max(monthsDiff, 1);
      return { value: months, unit: t('common:time.month', { count: months }) };
    }
    return { value: yearsDiff, unit: t('common:time.year', { count: yearsDiff }) };
  };
  const projectAge = getProjectAge();

  const assetOverviewItems = [
    { label: t('details.cosmos.assetOverview.assetType', 'Asset Type'), value: projectDetails?.category || t('common:nA', 'N/A') },
    { label: t('details.cosmos.assetOverview.jurisdiction', 'Jurisdiction'), value: 'UAE' },
    { label: t('details.cosmos.assetOverview.targetInvestor', 'Target Investor Class'), value: 'Accredited' },
    { label: t('details.cosmos.assetOverview.tokenStandard', 'Token Standard'), value: 'Soroban' },
    { label: t('details.cosmos.assetOverview.launchStage', 'Launch Stage'), value: 'Live' },
    { label: t('details.cosmos.assetOverview.regulatoryTier', 'Regulatory Tier'), value: 'Tier 2 (Informational)' },
  ];

  return (
    <>
      <div css={styles.desktopOverviewSection}>
        <Section id={id} showHeader={false} columns={6} areas={[['asset', 'asset', 'price', 'price', 'market', 'market'], ['chart', 'chart', 'chart', 'age', 'age', 'age']]}>
          <Card title={t('details.cosmos.assetOverview.title', 'Asset Overview')}>
            <div css={styles.assetOverviewList}>
              {assetOverviewItems.map((item) => (
                <div key={item.label} css={styles.assetOverviewRow}>
                  <span css={styles.assetOverviewLabel}>{item.label}</span>
                  <span css={styles.assetOverviewValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <DataValue label={t('details.overview.price', 'Price')} value={priceFormatted} subvalue={priceSubvalue} disabled={!isTokenProject} />
          </Card>
          <Card>
            <DataValue label={t('details.overview.marketCap', 'Market Cap')} value={marketCapFormatted} disabled={!isTokenProject} />
          </Card>
          <Card>
            <ProjectOverviewPriceChart hasToken={isTokenProject} symbol={tokenData?.symbol ?? ''} />
          </Card>
          <Card>
            <DataValue label={t('details.overview.projectAge', 'Project Age')} value={projectAge.value} subvalue={projectAge.unit ? { value: projectAge.unit } : undefined} />
          </Card>
        </Section>
      </div>
      <div css={styles.mobileChartsAndDataSection}>
        <Card title={t('details.cosmos.assetOverview.title', 'Asset Overview')}>
          <div css={styles.assetOverviewList}>
            {assetOverviewItems.map((item) => (
              <div key={item.label} css={styles.assetOverviewRow}>
                <span css={styles.assetOverviewLabel}>{item.label}</span>
                <span css={styles.assetOverviewValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <ProjectOverviewPriceChart hasToken={isTokenProject} symbol={tokenData?.symbol ?? ''} />
        </Card>
        <Card>
          <DataValue label={t('details.overview.price', 'Price')} value={priceFormatted} subvalue={priceSubvalue} disabled={!isTokenProject} />
        </Card>
        <Card>
          <DataValue label={t('details.overview.marketCap', 'Market Cap')} value={marketCapFormatted} disabled={!isTokenProject} />
        </Card>
        <Card>
          <DataValue label={t('details.overview.projectAge', 'Project Age')} value={projectAge.value} subvalue={projectAge.unit ? { value: projectAge.unit } : undefined} />
        </Card>
      </div>
    </>
  );
};

export default ProjectOverviewSection;
