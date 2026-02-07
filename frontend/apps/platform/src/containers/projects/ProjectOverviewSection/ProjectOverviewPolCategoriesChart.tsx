/** @jsxImportSource @emotion/react */
'use client';
import { ExampleLabel } from '@/components/common/ExampleLabel';
import useTranslation from '@/hooks/useTranslation';
import { ProbabilityOfLossCategoriesDynamic } from '@/types/api/project';
import {
  MultiLineChart,
  MultiLineChartDataPoint,
  MultiLineChartLine,
  Toggle,
  ToggleOption,
} from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import { useMemo, useState } from 'react';
import * as styles from './ProjectOverviewPolCategoriesChart.styles';

interface ProjectOverviewPolCategoriesChartProps {
  data?: ProbabilityOfLossCategoriesDynamic;
}

const CHART_HEIGHT = 270;

/** Time range values in days */
type TimeRangeValue = 7 | 30 | 180 | 365 | 'all';

/** Default category lines configuration for PoL categories chart */
const categoryLines: MultiLineChartLine[] = [
  { key: 'security', name: 'Security', color: colors.chart.security, dataKey: 'security' },
  { key: 'financial', name: 'Financial', color: colors.chart.financial, dataKey: 'financial' },
  {
    key: 'operational',
    name: 'Operational',
    color: colors.chart.operational,
    dataKey: 'operational',
  },
  {
    key: 'reputational',
    name: 'Reputational',
    color: colors.chart.reputational,
    dataKey: 'reputational',
  },
  { key: 'regulatory', name: 'Regulatory', color: colors.chart.regulatory, dataKey: 'regulatory' },
  { key: 'dependency', name: 'Dependency', color: colors.chart.dependency, dataKey: 'dependency' },
];

/**
 * Filter data points by time range (days from today)
 */
const filterByTimeRange = (
  points: ProbabilityOfLossCategoriesDynamic['points'],
  days: number | 'all'
): ProbabilityOfLossCategoriesDynamic['points'] => {
  if (days === 'all') {
    return points;
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return points.filter((point) => new Date(point.date) >= cutoffDate);
};

/**
 * Transforms API data to chart-compatible format
 */
const transformToChartData = (
  points: ProbabilityOfLossCategoriesDynamic['points']
): MultiLineChartDataPoint[] => {
  return points.map((point) => {
    const chartPoint: MultiLineChartDataPoint = {
      x: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    point.categories.forEach((category) => {
      const key = category.name.toLowerCase();
      chartPoint[key] = category.score;
    });

    return chartPoint;
  });
};

const ProjectOverviewPolCategoriesChart: React.FC<ProjectOverviewPolCategoriesChartProps> = ({
  data: apiData,
}) => {
  const { t } = useTranslation(['projects', 'common']);

  const timeRangeOptions: ToggleOption<TimeRangeValue>[] = [
    { value: 7, label: t('common:timeRange.1W', '1W') },
    { value: 30, label: t('common:timeRange.1M', '1M') },
    { value: 180, label: t('common:timeRange.6M', '6M') },
    { value: 365, label: t('common:timeRange.1Y', '1Y') },
    { value: 'all', label: t('common:timeRange.all', 'All') },
  ];
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(180);

  const chartData = useMemo(() => {
    if (!apiData?.points?.length) {
      return [];
    }

    // Filter by time range then transform
    const filteredPoints = filterByTimeRange(apiData.points, timeRange);
    return transformToChartData(filteredPoints);
  }, [apiData, timeRange]);

  // Determine which lines to show based on available data
  const lines = useMemo(() => {
    if (!chartData.length) {
      return categoryLines;
    }
    const availableKeys = new Set(Object.keys(chartData[0]).filter((key) => key !== 'x'));
    return categoryLines.filter((line) => availableKeys.has(line.dataKey));
  }, [chartData]);

  return (
    <>
      <div css={styles.headerWrapper}>
        <div css={styles.titleRow}>
          <h3 css={styles.chartTitle}>{t('details.overview.polCategoriesDynamic', 'PoL Categories Dynamic')}</h3>
          <div css={styles.exampleLabelWrapper}>
            <ExampleLabel
              label={t('common:exampleData.label', 'Example')}
              tooltip={t('common:exampleData.tooltip', 'Example Tooltip')}
              tooltipTitle={t('common:exampleData.tooltipTitle', 'Data Example')}
            />
          </div>
        </div>
        <div css={styles.toggleWrapper}>
          <Toggle
            size="small"
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
          />
        </div>
      </div>
      <div css={styles.chartWrapper}>
        <MultiLineChart
          data={chartData}
          lines={lines}
          xDataKey="x"
          height={CHART_HEIGHT}
          invertYAxis={true}
          yDomain={[100, 0]}
          yTicks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />
      </div>
    </>
  );
};

export default ProjectOverviewPolCategoriesChart;
