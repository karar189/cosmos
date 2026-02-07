/** @jsxImportSource @emotion/react */
'use client';

import { Box } from '@mui/material';
import { GaugeChart } from '@core3/ui-components';
import type { SocialFraudChartProps } from '@/types/charts/SocialFraudChart';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './SocialFraudChart.styles';

export default function SocialFraudChart({
  title = 'Social Fraud',
  value,
  label,
  status,
  colorStops,
  indicatorColor,
}: SocialFraudChartProps) {
  const { socialFraudChartSize } = useChartDimensions();

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.titleContainer}>
          <Box css={styles.title}>{title}</Box>
        </Box>
      </Box>
      <Box css={styles.chartWrapper}>
        <GaugeChart
          value={value}
          label={label}
          status={status}
          size={socialFraudChartSize}
          colorStops={colorStops}
          indicatorColor={indicatorColor}
        />
      </Box>
    </Box>
  );
}

