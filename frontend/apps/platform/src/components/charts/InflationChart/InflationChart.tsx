/** @jsxImportSource @emotion/react */
'use client';

import { Box } from '@mui/material';
import { SingleLineChart } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import type { InflationChartProps } from '@/types/charts/InflationChart';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './InflationChart.styles';

export default function InflationChart({
  data,
  title = 'Inflation',
  subtitle = 'Annual Inflation',
  rangeIndicator = '5-10%',
  yDomain = [5, 10],
  yTicks = [5, 6, 7, 8, 10],
}: InflationChartProps) {
  const { singleLineChartHeight } = useChartDimensions();

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.title}>{title}</Box>
        <Box css={styles.subtitleContainer}>
          <Box css={styles.subtitle}>{subtitle}</Box>
          <Box css={styles.rangeIndicator}>{rangeIndicator}</Box>
        </Box>
      </Box>
      <SingleLineChart
        data={data}
        xDataKey="x"
        yDataKey="value"
        height={singleLineChartHeight}
        lineColor={colors.text.primary}
        yDomain={yDomain}
        yTicks={yTicks}
        yAxisLabelFormatter={(label) => `${label}%`}
        tooltipFormatter={(value) => [`${value.toFixed(1)}%`, 'Annual Inflation']}
      />
    </Box>
  );
}
