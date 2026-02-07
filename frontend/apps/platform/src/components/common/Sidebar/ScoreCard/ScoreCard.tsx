/** @jsxImportSource @emotion/react */
'use client';

import GaugeChart from './GaugeChart/GaugeChart';
import DataCoverageIndicator from './DataCoverageIndicator/DataCoverageIndicator';
import { RiskMetricsList } from './RiskChangesCard/RiskMetricList';
import { Icon, SingleLineChart, Tooltip, formatDateLabel } from '@core3/ui-components';
import * as styles from './ScoreCard.styles';
import {
  transformToScoreCardProps,
  transformPolDynamicData,
  type ScoreData,
} from './scoreCard.utils';
import { useTranslation } from 'react-i18next';
import { ExampleLabel } from '../../ExampleLabel';

export interface ScoreCardProps {
  /**
   * API data for Probability of Loss or Security Score
   */
  data: ScoreData;
  /**
   * If true, treats score as Security Score (high = good, low = bad)
   * If false, treats score as PoL (high = bad, low = good)
   * @default false
   */
  isSecurityScore?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Custom CTA component
   */
  customCTA?: React.ReactNode;
}

export default function ScoreCard({ data, isSecurityScore = false, className, customCTA }: ScoreCardProps) {
  const { t } = useTranslation(['common']);
  // Transform API data to component props
  const props = transformToScoreCardProps(data);

  // Transform PoL dynamic data for chart
  const chartData = transformPolDynamicData(data);

  // Use 'preserveStartEnd' to automatically space labels while ensuring
  // first and last labels are always shown, preventing overlap
  const labelInterval: number | 'preserveStartEnd' =
    chartData?.data.length && chartData.data.length > 5 ? 'preserveStartEnd' : 0;

  return (
    <div css={styles.container} className={className} data-testid="-score-card">
      {/* Gauge Chart Section */}
      <div css={styles.gaugeSection}>
        <GaugeChart
          score={props.score}
          rating={props.rating}
          confidence={props.confidence}
          change24h={props.change24h}
          isSecurityScore={isSecurityScore}
        />
      </div>

      {customCTA ?? null}

      {/* Metrics Section */}
      <div css={styles.metricsSection}>
        {/* Data Coverage Indicator */}
        <div css={styles.dataCoverageWrapper}>
          <DataCoverageIndicator percentage={props.dataCoverage} />
        </div>

        {/* Risk Metrics List */}
        <div css={styles.riskMetricsWrapper}>
          <RiskMetricsList metrics={props.riskMetrics} />
        </div>
      </div>

      {/* Line Chart Section */}
      {chartData && (
        <div css={styles.chartSection}>
          <div css={styles.chartHeaderContainer}>
            <div css={styles.chartHeader}>
              <Icon name="activity" css={styles.chartHeaderIcon} />
              <p css={styles.chartHeaderTitle}>{t('scoreCard.polDynamic.label', 'PoL Dynamic')}</p>
              <Tooltip
                title={t(
                  'scoreCard.polDynamic.tooltip',
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
            data={chartData.data}
            height={140}
            yDomain={chartData.yDomain}
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
  );
}
