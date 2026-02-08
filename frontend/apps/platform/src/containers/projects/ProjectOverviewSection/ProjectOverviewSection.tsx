/** @jsxImportSource @emotion/react */
'use client';

import { TokenPriceData } from '@/data/api/types/coin_gecko/coin_details';
import { ProbabilityOfLossCategoriesDynamic, ProjectDetails, ProbabilityOfLoss, NewsFeed } from '@/types/api/project';
import { formatAmount, formatPercentage } from '@/utils/format';
import { Card, DataValue, DataValueProps, Section, Icon, SingleLineChart, Tooltip, formatDateLabel } from '@core3/ui-components';
import { useTranslation } from 'react-i18next';
import { ProjectOverviewPolCategoriesChart, ProjectOverviewPriceChart } from '.';
import { useState, useEffect } from 'react';
import { useTokenChart } from '@/data/api/coinGecko.queries';
import { ChartDataPoint } from '@/data/api/types/coin_gecko/coin_historical';
import GaugeChart from '@/components/common/Sidebar/ScoreCard/GaugeChart/GaugeChart';
import DataCoverageIndicator from '@/components/common/Sidebar/ScoreCard/DataCoverageIndicator/DataCoverageIndicator';
import { RiskMetricsList } from '@/components/common/Sidebar/ScoreCard/RiskChangesCard/RiskMetricList';
import RiskChangesCard from '@/components/common/Sidebar/ScoreCard/RiskChangesCard/RiskChangesCard';
import PricePerformanceCard from '@/components/common/Sidebar/PricePerformanceCard/PricePerformanceCard';
import BadgesRowCard from '@/components/common/Sidebar/BadgesRowCard/BadgesRowCard';
import {
  transformToScoreCardProps,
  transformPolDynamicData,
} from '@/components/common/Sidebar/ScoreCard/scoreCard.utils';
import {
  aboutLabelsList,
  buildAboutProjectRows,
  buildDisclosuresRows,
  disclosureLabelsList,
} from '@/components/projects/ProjectSidebar/projectSidebar.utils';
import { ExampleLabel } from '@/components/common/ExampleLabel';
import * as styles from './ProjectOverviewSection.styles';
import * as scoreCardStyles from '@/components/common/Sidebar/ScoreCard/ScoreCard.styles';

interface ProjectOverviewSectionProps {
  id: string;
  projectDetails?: ProjectDetails;
  tokenData?: TokenPriceData;
  probabilityOfLossCategoriesDynamic?: ProbabilityOfLossCategoriesDynamic;
  isTokenProject: boolean;
  // Sidebar data for mobile layout
  probabilityOfLoss?: ProbabilityOfLoss;
  newsFeed?: NewsFeed;
}

const ProjectOverviewSection: React.FC<ProjectOverviewSectionProps> = ({
  id,
  probabilityOfLossCategoriesDynamic,
  projectDetails,
  tokenData,
  isTokenProject,
  probabilityOfLoss,
  newsFeed,
}) => {
  const { t } = useTranslation(['projects', 'common', 'sidebar']);
  const [period, setPeriod] = useState({ label: '7d', value: '7' });
  const [highLowData, setHighLowData] = useState<{ low: number; high: number }>({
    low: 0,
    high: 0,
  });

  // Fetch token chart data for PricePerformanceCard
  const { data: priceHistoryData } = useTokenChart(
    {
      id: projectDetails?.coingeckoId || '',
      vs_currency: 'usd',
      days: period.value,
    },
    {
      enabled: !!projectDetails?.coingeckoId && !!tokenData,
    }
  );

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

  // Transform PoL data for mobile layout
  const polProps = probabilityOfLoss ? transformToScoreCardProps(probabilityOfLoss) : null;
  const polChartData = probabilityOfLoss ? transformPolDynamicData(probabilityOfLoss) : null;
  const labelInterval: number | 'preserveStartEnd' =
    polChartData?.data.length && polChartData.data.length > 5 ? 'preserveStartEnd' : 0;

  // Build rows for BadgesRowCard
  const aboutLabels: aboutLabelsList = {
    chains: t('sidebar:labels.chains', 'Chains'),
    category: t('sidebar:labels.category', 'Category'),
    tags: t('sidebar:labels.tags', 'Tags'),
    launchedAt: t('sidebar:labels.launchedAt', 'Launched At'),
    website: t('sidebar:labels.website', 'Website'),
    socials: t('sidebar:labels.socials', 'Socials'),
    ucid: t('sidebar:labels.ucid', 'UCID'),
  };
  const disclosuresLabels: disclosureLabelsList = {
    whitepaper: t('sidebar:labels.whitepaper', 'Whitepaper'),
    legal: t('sidebar:labels.legal', 'Legal'),
    audits: t('sidebar:labels.audits', 'Audits'),
  };
  const aboutRows = projectDetails ? buildAboutProjectRows(projectDetails, aboutLabels) : [];
  const disclosuresRows = projectDetails ? buildDisclosuresRows(projectDetails, disclosuresLabels) : [];

  const statusStyle = (value: number) => {
    if (value > 0) {
      return { positive: true };
    } else if (value < 0) {
      return { negative: true };
    }

    return;
  };
  const isTokenProjectWithTokenData = isTokenProject && !!tokenData;
  const priceFormatted = isTokenProjectWithTokenData
    ? formatAmount(tokenData?.current_price ?? 0, { prefix: '$', decimalPlaces: 2 })
    : t('common:nA', 'N/A');
  const priceChangeFormatted = formatPercentage(tokenData?.price_change_percentage_24h ?? 0);
  const priceSubvalue: DataValueProps['subvalue'] = (() => {
    if (isTokenProject) {
      return tokenData
        ? {
            value: priceChangeFormatted,
            ...statusStyle(tokenData?.price_change_percentage_24h ?? 0),
          }
        : undefined;
    }
    return {
      value: t('projects:details.overview.noToken.description', 'Project does not have token yet'),
      type: 'secondary',
    };
  })();

  const marketCapFormatted = isTokenProjectWithTokenData
    ? formatAmount(tokenData?.market_cap ?? 0, {
        compact: true,
        prefix: '$',
        decimalPlaces: 2,
      })
    : t('common:nA', 'N/A');
  const marketCapChangeFormatted = formatPercentage(
    tokenData?.market_cap_change_percentage_24h ?? 0
  );
  const marketCapChangeUsdFormatted = formatAmount(tokenData?.market_cap_change_24h ?? 0, {
    prefix: '$',
    decimalPlaces: 0,
  });

  const marketCapSubvalue: DataValueProps['subvalue'] = (() => {
    if (isTokenProject) {
      return tokenData
        ? [
            {
              value: marketCapChangeFormatted,
              ...statusStyle(tokenData?.market_cap_change_percentage_24h ?? 0),
            },
            {
              value: marketCapChangeUsdFormatted,
              type: 'secondary',
            },
          ]
        : undefined;
    }
    return {
      value: t('projects:details.overview.noToken.description', 'Project does not have token yet'),
      type: 'secondary',
    };
  })();

  const getProjectAge = () => {
    if (!projectDetails?.launchedAt) {
      return { value: t('common:nA', 'N/A'), unit: '' };
    }

    const launchDate = new Date(projectDetails.launchedAt);
    const now = new Date();

    const yearsDiff = now.getFullYear() - launchDate.getFullYear();
    const monthsDiff =
      (now.getFullYear() - launchDate.getFullYear()) * 12 +
      (now.getMonth() - launchDate.getMonth());

    if (monthsDiff < 12) {
      const months = Math.max(monthsDiff, 1); // At least 1 month
      return {
        value: months,
        unit: t('common:time.month', { count: months }),
      };
    }

    return {
      value: yearsDiff,
      unit: t('common:time.year', { count: yearsDiff }),
    };
  };

  const projectAge = getProjectAge();

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopOverviewSection}>
        <Section
          id={id}
          showHeader={false}
          columns={6}
          areas={[
            ['item1', 'item1', 'item1', 'item2', 'item2', 'item2'],
            ['item3', 'item3', 'item4', 'item4', 'item5', 'item5'],
          ]}
        >
          <Card>
            <ProjectOverviewPriceChart hasToken={isTokenProject} symbol={tokenData?.symbol ?? ''} />
          </Card>
          <Card>
            <ProjectOverviewPolCategoriesChart data={probabilityOfLossCategoriesDynamic} />
          </Card>
          <Card>
            <DataValue
              label={t('details.overview.price', 'Price')}
              value={priceFormatted}
              subvalue={priceSubvalue}
              disabled={!isTokenProject}
            />
          </Card>
          <Card>
            <DataValue
              label={t('details.overview.marketCap', 'Market Cap')}
              value={marketCapFormatted}
              disabled={!isTokenProject}
              subvalue={marketCapSubvalue}
            />
          </Card>
          <Card>
            <DataValue
              label={t('details.overview.projectAge', 'Project Age')}
              value={projectAge.value}
              subvalue={projectAge.unit ? { value: projectAge.unit } : undefined}
            />
          </Card>
        </Section>
      </div>

      {/* Mobile Layout */}
      {probabilityOfLoss && polProps && (
        <div css={styles.mobilePolSection}>
          {/* 1. Probability of Loss Section - Top */}
          {/* Heading with info icon */}
          <div css={styles.sectionHeader}>
            <h2 css={styles.sectionTitle}>
              {t('sidebar:title.project', 'Probability of Loss')}
            </h2>
            <Tooltip
              title={t(
                'sidebar:title.projectTooltip',
                'The probability that a project will experience an adverse event combined with the severity of the consequences if that event occurs'
              )}
            />
          </div>

          {/* Gauge Chart - no padding, bigger size */}
          <div css={styles.gaugeChartWrapper}>
            <div css={styles.gaugeChartMobile}>
              <GaugeChart
                score={polProps.score}
                rating={polProps.rating}
                confidence={polProps.confidence}
                change24h={polProps.change24h}
              />
            </div>
          </div>

          {/* Data Coverage - placed in middle */}
          <div css={styles.dataCoverageCard}>
            <DataCoverageIndicator percentage={polProps.dataCoverage} />
          </div>

          {/* Risk Metrics Bar Charts */}
          <div css={styles.riskMetricsCard}>
            <RiskMetricsList metrics={polProps.riskMetrics} />
          </div>

          {/* PoL Dynamic Chart */}
          {polChartData && (
            <div css={styles.polDynamicCard}>
              <div css={scoreCardStyles.chartHeaderContainer}>
                <div css={scoreCardStyles.chartHeader}>
                  <Icon name="activity" css={scoreCardStyles.chartHeaderIcon} />
                  <p css={scoreCardStyles.chartHeaderTitle}>{t('sidebar:scoreCard.polDynamic.label', 'PoL Dynamic')}</p>
                  <Tooltip
                    title={t(
                      'sidebar:scoreCard.polDynamic.tooltip',
                      'The Probability of Loss change with the time'
                    )}
                  />
                </div>
                <ExampleLabel
                  bordered
                  label={t('common:exampleData.label', 'Example')}
                  tooltip={t('common:exampleData.tooltip', 'Example Tooltip')}
                  tooltipTitle={t('common:exampleData.tooltipTitle', 'Data Example')}
                />
              </div>
              <SingleLineChart
                data={polChartData.data}
                height={140}
                yDomain={polChartData.yDomain}
                xAxisLabelFormatter={formatDateLabel}
                xAxisInterval={labelInterval}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 20,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 2 & 3 Combined: Charts and Data Cards in Same Container */}
      <div css={styles.mobileChartsAndDataSection}>
        <Card>
          <ProjectOverviewPriceChart hasToken={isTokenProject} symbol={tokenData?.symbol ?? ''} />
        </Card>
        <Card>
          <ProjectOverviewPolCategoriesChart data={probabilityOfLossCategoriesDynamic} />
        </Card>
        <Card>
          <DataValue
            label={t('details.overview.price', 'Price')}
            value={priceFormatted}
            subvalue={priceSubvalue}
            disabled={!isTokenProject}
          />
        </Card>
        <Card>
          <DataValue
            label={t('details.overview.marketCap', 'Market Cap')}
            value={marketCapFormatted}
            disabled={!isTokenProject}
            subvalue={marketCapSubvalue}
          />
        </Card>
        <Card>
          <DataValue
            label={t('details.overview.projectAge', 'Project Age')}
            value={projectAge.value}
            subvalue={projectAge.unit ? { value: projectAge.unit } : undefined}
          />
        </Card>
      </div>

      {/* 4. Rest of Probability of Loss Section */}
      {newsFeed && projectDetails && (
        <div css={styles.mobileSidebarContent}>
          {/* Risk Changes with Top Risks / Recent Changes tabs */}
          <RiskChangesCard data={newsFeed} />

          {/* Price Performance */}
          {tokenData && (
            <PricePerformanceCard
              priceData={tokenData}
              highLowData={highLowData}
              period={period}
              setPeriod={setPeriod}
            />
          )}

          {/* About Project */}
          <BadgesRowCard
            title={`${t('sidebar:sections.aboutTitle', 'About')} ${projectDetails.name}`}
            description={projectDetails.description}
            rows={aboutRows}
          />

          {/* Disclosures */}
          <BadgesRowCard title={t('sidebar:sections.disclosuresTitle', 'Disclosures')} rows={disclosuresRows} />
        </div>
      )}
    </>
  );
};

export default ProjectOverviewSection;
