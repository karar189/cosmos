/** @jsxImportSource @emotion/react */
'use client';

import { Box } from '@mui/material';
import { SingleLineChart } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import type { TVLChartProps } from '@/types/charts/TVLChart';
import { formatValue } from '@/utils/charts';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './TVLChart.styles';

export default function TVLChart({
  data,
  title = 'TVL',
  lastUpdate = 'Last Update: 04.03.2025 18:00',
  statusBadges = [],
  yDomain = [600, 1000],
  yTicks = [600, 700, 800, 900, 1000],
}: TVLChartProps) {
  const { singleLineChartHeight } = useChartDimensions();

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.titleRow}>
          <Box css={styles.title}>{title}</Box>
          <Box css={styles.lastUpdate}>{lastUpdate}</Box>
        </Box>
        {statusBadges.length > 0 && (
          <Box css={styles.statusContainer}>
            {statusBadges.map((badge, index) => (
              <Box key={index} css={styles.statusBadge}>
                {badge.label}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <SingleLineChart
        data={data}
        xDataKey="x"
        yDataKey="value"
        height={singleLineChartHeight}
        lineColor={colors.text.primary}
        yDomain={yDomain}
        yTicks={yTicks}
        yAxisLabelFormatter={(label) => {
          const num = Number(label);
          if (num >= 1000) return '1B';
          return `${num}M`;
        }}
        tooltipFormatter={(value) => [`$${formatValue(value, 'tvl')}`, 'TVL']}
      />
    </Box>
  );
}
