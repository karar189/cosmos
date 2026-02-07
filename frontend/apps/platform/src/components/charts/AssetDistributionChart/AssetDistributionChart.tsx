/** @jsxImportSource @emotion/react */
'use client';

import { Box } from '@mui/material';
import { DonutChart, Icon } from '@core3/ui-components';
import type { AssetDistributionChartProps } from '@/types/charts/AssetDistributionChart';
import {
  ASSET_DISTRIBUTION_INNER_RADIUS,
  ASSET_DISTRIBUTION_OUTER_RADIUS,
} from '../shared/chartConstants';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './AssetDistributionChart.styles';

export default function AssetDistributionChart({
  data,
  title = 'Asset Distribution',
  innerRadius = ASSET_DISTRIBUTION_INNER_RADIUS,
  outerRadius = ASSET_DISTRIBUTION_OUTER_RADIUS,
  showPercentage = true,
}: AssetDistributionChartProps) {
  const { assetDistributionChartSize } = useChartDimensions();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.titleContainer}>
          <Box css={styles.title}>{title}</Box>
          <Icon name="info" css={styles.infoIcon} />
        </Box>
      </Box>
      <Box css={styles.content}>
        <Box css={styles.chartWrapper}>
          <DonutChart
            data={data}
            size={assetDistributionChartSize}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            showPercentage={showPercentage}
          />
        </Box>
        <Box css={styles.legend}>
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(0);
            return (
              <Box key={index} css={styles.legendItem}>
                <Box css={styles.legendLabelGroup}>
                  <Box css={styles.legendDot} style={{ backgroundColor: item.color }} />
                  <Box css={styles.legendLabel}>{item.name}</Box>
                </Box>
                <Box css={styles.legendValue}>{percentage}%</Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

