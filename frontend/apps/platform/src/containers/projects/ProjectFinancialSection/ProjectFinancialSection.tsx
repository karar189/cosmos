/** @jsxImportSource @emotion/react */
'use client';

import {
  Badge,
  Card,
  CardHeader,
  DataList,
  DataListItemData,
  DataText,
  Divider,
  Icon,
  Section,
  SectionRank,
  SingleLineChart,
} from '@core3/ui-components';
import { useTranslation } from 'react-i18next';

import { Financial } from '@/types/api/project';
import { getColorBySeverity } from '@/utils/badge';
import { formatAmount, formatDate } from '@/utils/format';
import ProjectFinancialAssetsChart from './ProjectFinancialAssetsChart';
import * as styles from './ProjectFinancialSection.styles';

const SINGLE_LINE_CHART_HEIGHT = 200;

interface ProjectFinancialSectionProps {
  id: string;
  data?: Financial;
  isTokenProject: boolean;
}

const ProjectFinancialSection: React.FC<ProjectFinancialSectionProps> = ({
  id,
  data: financialData,
  isTokenProject,
}) => {
  const { t } = useTranslation(['projects', 'common']);

  const revenueSourcesList: DataListItemData[] =
    financialData?.revenueSources?.map((source) => ({
      value: source.label ?? '',
    })) || [];

  const circularSupplyAnalysisList: DataListItemData[] = [
    {
      label: t(
        'details.financial.circularSupplyAnalysis.matchesDeclared.label',
        'Matches Declared'
      ),
      value: financialData?.circularSupplyAnalysis?.matchesDeclared ?? t('common.unknown', 'N/A'),
      checked: true,
      tooltip: t(
        'details.financial.circularSupplyAnalysis.matchesDeclared.tooltip',
        'Matches Declared tooltip'
      ),
    },
    {
      label: t(
        'projects.details.financial.circularSupplyAnalysis.lessThanTotalSupply',
        'Less than Total Supply'
      ),
      value: financialData?.circularSupplyAnalysis?.isLessThanTotalSupply
        ? t('common:yes', 'Yes')
        : t('common:no', 'No'),
    },
    {
      label: t('details.financial.circularSupplyAnalysis.deviation.label', 'Deviation'),
      value: financialData?.circularSupplyAnalysis?.deviation ?? t('common.unknown', 'N/A'),
      tooltip: t('details.financial.circularSupplyAnalysis.deviation.tooltip', 'Deviation tooltip'),
    },
  ];

  const treasuryQualityList: DataListItemData[] = [
    {
      label: t('details.financial.treasuryQuality.topTierAssetsShare', 'Top-tier Assets Share'),
      value: financialData?.treasuryQuality?.topTierAssetsShare ?? t('common.unknown', 'N/A'),
    },
    {
      label: t('projects.details.financial.treasuryQuality.trend', 'Trend'),
      value: financialData?.treasuryQuality?.trend?.label && financialData?.treasuryQuality?.trend?.severity ? (
        <Badge
          size="small"
          color={getColorBySeverity(financialData.treasuryQuality.trend.severity)}
        >
          {financialData.treasuryQuality.trend.label}
        </Badge>
      ) : (
        t('common:nA', 'N/A')
      ),
    },
  ];

  const treasuryQualityTagsList: DataListItemData[] = [
    {
      checked: !financialData?.treasuryQuality?.isSpikesPresent,
      label: financialData?.treasuryQuality?.isSpikesPresent
        ? t('details.financial.treasuryQuality.spikesPresent', 'Spikes Present')
        : t('details.financial.treasuryQuality.noSpikes', 'No Spikes'),
    },
  ];

  // Check if asset distribution has percentage data
  const hasAssetDistributionPercentages =
    financialData?.treasuryQuality?.assetDistribution?.some(
      (item) => item.percentage !== undefined
    ) ?? false;

  const tvlLabelInterval: number | 'preserveStartEnd' =
    financialData?.totalValueLocked?.points?.length &&
    financialData?.totalValueLocked?.points?.length > 5
      ? 'preserveStartEnd'
      : 0;

  const sectionRank = {
    value: formatAmount(financialData?.score.current || 0, { decimalPlaces: 1 }),
    maxValue: financialData?.score.max,
    description: financialData?.score.label,
  };

  const tvlTicks = (() => {
    const points = financialData?.totalValueLocked?.points ?? [];
    if (points.length === 0) return [0, 25, 50, 75, 100];

    const values = points.map((p) => p.percentage);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const step = (maxValue - minValue) / 4;

    return [minValue, minValue + step, minValue + step * 2, minValue + step * 3, maxValue];
  })();

  return (
    <>
      {/* Desktop Layout */}
      <div css={styles.desktopLayout}>
        <Section
          id={id}
          iconName="dollar-circle"
          title={t('details.financial.title', 'Financial')}
          headerContent={
            <SectionRank
              value={formatAmount(sectionRank.value, { decimalPlaces: 1 })}
              maxValue={sectionRank.maxValue}
              description={sectionRank.description}
            />
          }
          areas={
            isTokenProject
              ? [
                  ['activeAddresses', 'inflation', 'totalValueLocked'],
                  ['revenueSources', 'treasuryQuality', 'circularSupplyAnalysis'],
                  ['revenueSources', 'treasuryQuality', 'lockersAnalysis'],
                ]
              : [['revenueSources', 'treasuryQuality']]
          }
        >
      {isTokenProject && (
        <Card
          title={t('details.financial.activeAddresses.label', 'Active Addresses')}
          tooltip={t('details.financial.activeAddresses.tooltip', 'Active Addresses tooltip')}
        >
          <SingleLineChart
            height={SINGLE_LINE_CHART_HEIGHT}
            xAxisInterval="preserveStartEnd"
            emptyDescription={t('common:comingSoon', 'This Data is Coming Soon')}
          />
        </Card>
      )}
      {isTokenProject && (
        <Card
          title={t('details.financial.inflation.label', 'Inflation')}
          tooltip={t(
            'details.financial.inflation.tooltip',
            'Token percentage issued / unlocked per year'
          )}
        >
          <SingleLineChart
            data={financialData?.inflation?.points ?? []}
            height={SINGLE_LINE_CHART_HEIGHT}
            yDomain={[0, 100]}
            xDataKey="date"
            yDataKey="percentage"
            yTicks={[0, 25, 50, 75, 100]}
            yAxisLabelFormatter={(label) => `${label}%`}
            xAxisLabelFormatter={(label) => formatDate(label, { month: 'short' })}
            xAxisInterval="preserveStartEnd"
            tooltipFormatter={(value) => [
              `${value.toFixed(1)}%`,
              t('details.financial.inflation.label', 'Inflation'),
            ]}
          />
        </Card>
      )}
      {isTokenProject && (
        <Card
          title={t('details.financial.totalValueLocked.label', 'TVL')}
          rightContent={
            financialData?.totalValueLocked?.lastUpdatedAt ? (
              <p css={styles.tvlLastUpdate}>
                {t('details.financial.totalValueLocked.lastUpdate', 'Last Update: {{date}}', {
                  date: formatDate(financialData.totalValueLocked.lastUpdatedAt, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                })}
              </p>
            ) : null
          }
        >
          {!!financialData?.totalValueLocked?.tags?.length && (
            <div css={styles.tvlTags}>
              {financialData?.totalValueLocked?.tags.map((tag, index) => (
                <Badge css={styles.tvlTag} color="green" size="small" key={`tag-${index}`}>
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
          <SingleLineChart
            data={financialData?.totalValueLocked?.points ?? []}
            height={SINGLE_LINE_CHART_HEIGHT}
            xDataKey="date"
            yDataKey="percentage"
            xAxisInterval={tvlLabelInterval}
            yTicks={tvlTicks}
            yDomain={[tvlTicks[0], tvlTicks[tvlTicks.length - 1]]}
            yAxisLabelFormatter={(label) =>
              formatAmount(label, { compact: true, decimalPlaces: 0 })
            }
            xAxisLabelFormatter={(label) => formatDate(label, { month: 'short', year: 'numeric' })}
            tooltipFormatter={(value) => [
              `${formatAmount(value)}`,
              t('details.financial.totalValueLocked.label', 'TVL'),
            ]}
          />
        </Card>
      )}
      <Card
        title={t('details.financial.revenueSources.label', 'Revenue Sources')}
        tooltip={t(
          'details.financial.revenueSources.tooltip',
          'Revenue generative streams of the project'
        )}
      >
        <DataList contentAlign="left" items={revenueSourcesList} bulletPoint />
      </Card>
      <Card
        title={t('details.financial.treasuryQuality.label', 'Treasury Quality')}
        tooltip={t('details.financial.treasuryQuality.tooltip', 'Treasury assets breakdown')}
      >
        <DataList items={treasuryQualityList} />
        <Divider insets={false} />
        <DataList items={treasuryQualityTagsList} />
        <Divider insets={false} />
        <CardHeader
          title={t(
            'details.financial.treasuryQuality.assetDistribution.label',
            'Asset Distribution'
          )}
          tooltip={t(
            'details.financial.treasuryQuality.assetDistribution.tooltip',
            'Asset Distribution tooltip'
          )}
        />
        <ProjectFinancialAssetsChart data={financialData?.treasuryQuality?.assetDistribution} hasToken={isTokenProject} />
      </Card>
      {isTokenProject && (
        <Card
          title={t('details.financial.circularSupplyAnalysis.label', 'Circulating Supply Analysis')}
        >
          <DataList items={circularSupplyAnalysisList} />
        </Card>
      )}
      {isTokenProject && (
        <Card
          title={t('details.financial.lockersAnalysis.label', 'Lockers Analysis')}
          tooltip={t('details.financial.lockersAnalysis.tooltip', 'Lockers type analysis')}
        >
          <DataText label={t('details.financial.lockersAnalysis.type', 'Type')}>
            {hasAssetDistributionPercentages
              ? (financialData?.lockersAnalysis?.type ?? t('common:nA', 'N/A'))
              : t('common:nA', 'N/A')}
          </DataText>
        </Card>
      )}
        </Section>
      </div>

      {/* Mobile Layout */}
      <div css={styles.mobileLayout}>
        {/* Section Header */}
        <div css={styles.mobileHeader}>
          <div css={styles.mobileHeaderLeft}>
            <Icon name="dollar-circle" css={styles.mobileHeaderIcon} />
            <h2 css={styles.mobileHeaderTitle}>{t('details.financial.title', 'Financial')}</h2>
            <div css={styles.scoreBadge}>{sectionRank.value}/{sectionRank.maxValue}</div>
          </div>
          <p css={styles.mobileHeaderDescription}>{sectionRank.description}</p>
        </div>

        {/* Active Addresses */}
        {isTokenProject && (
          <Card
            title={t('details.financial.activeAddresses.label', 'Active Addresses')}
            tooltip={t('details.financial.activeAddresses.tooltip', 'Active Addresses tooltip')}
          >
            <SingleLineChart
              height={SINGLE_LINE_CHART_HEIGHT}
              xAxisInterval="preserveStartEnd"
              emptyDescription={t('common:comingSoon', 'This Data is Coming Soon')}
            />
          </Card>
        )}

        {/* Inflation */}
        {isTokenProject && (
          <Card
            title={t('details.financial.inflation.label', 'Inflation')}
            tooltip={t(
              'details.financial.inflation.tooltip',
              'Token percentage issued / unlocked per year'
            )}
          >
            <SingleLineChart
              data={financialData?.inflation?.points ?? []}
              height={SINGLE_LINE_CHART_HEIGHT}
              yDomain={[0, 100]}
              xDataKey="date"
              yDataKey="percentage"
              yTicks={[0, 25, 50, 75, 100]}
              yAxisLabelFormatter={(label) => `${label}%`}
              xAxisLabelFormatter={(label) => formatDate(label, { month: 'short' })}
              xAxisInterval="preserveStartEnd"
              tooltipFormatter={(value) => [
                `${value.toFixed(1)}%`,
                t('details.financial.inflation.label', 'Inflation'),
              ]}
            />
          </Card>
        )}

        {/* TVL */}
        {isTokenProject && (
          <Card
            title={t('details.financial.totalValueLocked.label', 'TVL')}
            rightContent={
              financialData?.totalValueLocked?.lastUpdatedAt ? (
                <p css={styles.tvlLastUpdate}>
                  {t('details.financial.totalValueLocked.lastUpdate', 'Last Update: {{date}}', {
                    date: formatDate(financialData.totalValueLocked.lastUpdatedAt, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }),
                  })}
                </p>
              ) : null
            }
          >
            {!!financialData?.totalValueLocked?.tags?.length && (
              <div css={styles.tvlTags}>
                {financialData?.totalValueLocked?.tags.map((tag, index) => (
                  <Badge css={styles.tvlTag} color="green" size="small" key={`tag-${index}`}>
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}
            <SingleLineChart
              data={financialData?.totalValueLocked?.points ?? []}
              height={SINGLE_LINE_CHART_HEIGHT}
              xDataKey="date"
              yDataKey="percentage"
              xAxisInterval={tvlLabelInterval}
              yTicks={tvlTicks}
              yDomain={[tvlTicks[0], tvlTicks[tvlTicks.length - 1]]}
              yAxisLabelFormatter={(label) =>
                formatAmount(label, { compact: true, decimalPlaces: 0 })
              }
              xAxisLabelFormatter={(label) => formatDate(label, { month: 'short', year: 'numeric' })}
              tooltipFormatter={(value) => [
                `${formatAmount(value)}`,
                t('details.financial.totalValueLocked.label', 'TVL'),
              ]}
            />
          </Card>
        )}

        {/* Revenue Sources */}
        <Card
          title={t('details.financial.revenueSources.label', 'Revenue Sources')}
          tooltip={t(
            'details.financial.revenueSources.tooltip',
            'Revenue generative streams of the project'
          )}
        >
          <DataList contentAlign="left" items={revenueSourcesList} bulletPoint />
        </Card>

        {/* Treasury Quality */}
        <Card
          title={t('details.financial.treasuryQuality.label', 'Treasury Quality')}
          tooltip={t('details.financial.treasuryQuality.tooltip', 'Treasury assets breakdown')}
        >
          <DataList items={treasuryQualityList} />
          <Divider insets={false} />
          <DataList items={treasuryQualityTagsList} />
          <Divider insets={false} />
          <CardHeader
            title={t(
              'details.financial.treasuryQuality.assetDistribution.label',
              'Asset Distribution'
            )}
            tooltip={t(
              'details.financial.treasuryQuality.assetDistribution.tooltip',
              'Asset Distribution tooltip'
            )}
          />
          <ProjectFinancialAssetsChart data={financialData?.treasuryQuality?.assetDistribution} hasToken={isTokenProject} />
        </Card>

        {/* Circulating Supply Analysis */}
        {isTokenProject && (
          <Card
            title={t('details.financial.circularSupplyAnalysis.label', 'Circulating Supply Analysis')}
          >
            <DataList items={circularSupplyAnalysisList} />
          </Card>
        )}

        {/* Lockers Analysis */}
        {isTokenProject && (
          <Card
            title={t('details.financial.lockersAnalysis.label', 'Lockers Analysis')}
            tooltip={t('details.financial.lockersAnalysis.tooltip', 'Lockers type analysis')}
          >
            <DataText label={t('details.financial.lockersAnalysis.type', 'Type')}>
              {hasAssetDistributionPercentages
                ? (financialData?.lockersAnalysis?.type ?? t('common:nA', 'N/A'))
                : t('common:nA', 'N/A')}
            </DataText>
          </Card>
        )}
      </div>
    </>
  );
};

export default ProjectFinancialSection;
