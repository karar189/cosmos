/** @jsxImportSource @emotion/react */
'use client';

import { Box } from '@mui/material';
import { ComboChart, Icon } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import useTranslation from '@/hooks/useTranslation';
import type { WashtradingChartProps } from '@/types/charts/WashtradingChart';
import {
  WASHTRADING_LINE_Y_DOMAIN,
  WASHTRADING_BAR_Y_DOMAIN,
  WASHTRADING_LINE_Y_TICKS,
  WASHTRADING_BAR_Y_TICKS,
} from '../shared/chartConstants';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './WashtradingChart.styles';

export default function WashtradingChart({
  data,
  title = 'Washtrading',
  subtitle = 'CEX Holdings vs Vol',
  showAverageBadge = true,
  lineYDomain = WASHTRADING_LINE_Y_DOMAIN,
  barYDomain = WASHTRADING_BAR_Y_DOMAIN,
  lineYTicks = [...WASHTRADING_LINE_Y_TICKS],
  barYTicks = [...WASHTRADING_BAR_Y_TICKS],
  lineColor = colors.text.primary,
  barColor = colors.neutral.gray300,
}: WashtradingChartProps) {
  const { t } = useTranslation(['common']);
  const { washtradingChartHeight, washtradingBarSize, washtradingMargin } = useChartDimensions();
  
  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.titleContainer}>
          <Box css={styles.title}>{title}</Box>
          <Icon name="info" css={styles.infoIcon} />
        </Box>
      </Box>
      <Box css={styles.subtitleContainer}>
        <Box css={styles.subtitle}>{subtitle}</Box>
        {showAverageBadge && <Box css={styles.averageBadge}>{t('charts.washtrading.average')}</Box>}
      </Box>
      <ComboChart
        data={data}
        xDataKey="x"
        lineDataKey="lineValue"
        barDataKey="barValue"
        height={washtradingChartHeight}
        lineColor={lineColor}
        barColor={barColor}
        lineYDomain={lineYDomain}
        barYDomain={barYDomain}
        lineYTicks={lineYTicks}
        barYTicks={barYTicks}
        hideYAxisLabels={false}
        lineYAxisLabelFormatter={(label) => `${label}M`}
        barSize={washtradingBarSize}
        margin={washtradingMargin}
        tooltipFormatter={(value, _name, dataKey) => {
          if (dataKey === 'lineValue') {
            return [`${value}M`, 'CEX Holdings'];
          }
          return [`${value}`, 'Volume'];
        }}
      />
    </Box>
  );
}

