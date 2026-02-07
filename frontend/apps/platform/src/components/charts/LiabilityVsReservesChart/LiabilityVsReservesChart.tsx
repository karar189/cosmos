/** @jsxImportSource @emotion/react */
'use client';

import { Box } from '@mui/material';
import { BarChart } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import type { LiabilityVsReservesChartProps } from '@/types/charts/LiabilityVsReservesChart';
import {
  LIABILITY_VS_RESERVES_Y_DOMAIN,
  LIABILITY_VS_RESERVES_Y_TICKS,
} from '../shared/chartConstants';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './LiabilityVsReservesChart.styles';

export default function LiabilityVsReservesChart({
  data,
  title = 'Liability vs Reserves',
  yDomain = LIABILITY_VS_RESERVES_Y_DOMAIN,
  yTicks = [...LIABILITY_VS_RESERVES_Y_TICKS],
  barColor = colors.neutral.gray650,
}: LiabilityVsReservesChartProps) {
  const { singleLineChartHeight, scale } = useChartDimensions();

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.title}>{title}</Box>
      </Box>
      <BarChart
        data={data}
        xDataKey="x"
        yDataKey="value"
        height={singleLineChartHeight}
        barColor={barColor}
        barSize={Math.round(36 * scale)}
        yDomain={yDomain}
        yTicks={yTicks}
        yAxisLabelFormatter={(label: string) => `${label}%`}
        tooltipFormatter={(value: number) => [`${value.toFixed(1)}%`, 'Ratio']}
      />
    </Box>
  );
}

