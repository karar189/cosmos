/** @jsxImportSource @emotion/react */
'use client';

import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { StackedBarChart, Toggle, type ToggleOption } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import useTranslation from '@/hooks/useTranslation';
import type {
  CommunitySentimentChartProps,
  CommunitySentimentTimeRange,
} from '@/types/charts/CommunitySentimentChart';
import { COMMUNITY_SENTIMENT_TIME_RANGES } from '../shared/chartConstants';
import { useChartDimensions } from '../shared/useChartDimensions';
import { filterCommunitySentimentDataByTimeRange } from '@/utils/charts';
import * as styles from './CommunitySentimentChart.styles';

const TIME_RANGE_OPTIONS: ToggleOption<CommunitySentimentTimeRange>[] = COMMUNITY_SENTIMENT_TIME_RANGES.map(
  (range) => ({ value: range, label: range })
);

export default function CommunitySentimentChart({
  data,
  title = 'Community Sentiment',
  initialTimeRange = '1Y',
  positiveColor = colors.chart.positive,
  negativeColor = colors.chart.negative,
  showTimeRange = true,
  showLegend = true,
}: CommunitySentimentChartProps) {
  const { t } = useTranslation(['common']);
  const [timeRange, setTimeRange] = useState<CommunitySentimentTimeRange>(initialTimeRange);
  const { communitySentimentChartHeight } = useChartDimensions();

  const filteredData = useMemo(
    () => filterCommunitySentimentDataByTimeRange(data, timeRange),
    [data, timeRange]
  );

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.title}>{title}</Box>
        {showTimeRange && (
          <Toggle
            value={timeRange}
            onChange={setTimeRange}
            options={TIME_RANGE_OPTIONS}
            useButtonStyle={true}
          />
        )}
      </Box>
      
      <StackedBarChart
        data={filteredData}
        height={communitySentimentChartHeight}
        positiveColor={positiveColor}
        negativeColor={negativeColor}
      />

      {showLegend && (
        <Box css={styles.legend}>
          <Box css={styles.legendItem}>
            <Box css={styles.legendDotNegative} />
            <Box css={styles.legendLabel}>{t('charts.sentiment.negative')}</Box>
          </Box>
          <Box css={styles.legendItem}>
            <Box css={styles.legendDotPositive} />
            <Box css={styles.legendLabel}>{t('charts.sentiment.positive')}</Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
